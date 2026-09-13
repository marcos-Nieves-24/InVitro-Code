"""Profile route tests.

Tests for GET /api/v1/profile and PUT /api/v1/profile endpoints.
"""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from app.deps import UserContext, get_current_user, get_db
from app.main import app


@pytest.fixture(autouse=True)
def clear_overrides():
    """Clear dependency overrides after each test."""
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def mock_profile_row():
    """Sample profile row as returned by asyncpg fetchrow."""
    return {
        "id": "user_123",
        "email": "test@example.com",
        "username": "testuser",
        "role": "user",
        "avatar_url": "https://example.com/avatar.png",
        "bio": "Biotech student",
        "theme": "dark",
        "notification_prefs": {"email": True, "streak": True},
        "created_at": datetime(2025, 1, 15, 10, 30, 0),
    }


@pytest.fixture
def mock_conn_with_profile(mock_profile_row):
    """Mock connection that returns a profile on fetchrow."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(return_value=mock_profile_row)
    conn.fetch = AsyncMock(return_value=[mock_profile_row])
    return conn


def _override_deps(conn):
    """Set FastAPI dependency overrides for a mock connection."""
    app.dependency_overrides[get_current_user] = lambda: UserContext(
        user_id="user_123", role="user"
    )
    app.dependency_overrides[get_db] = lambda: conn


@pytest.mark.asyncio
async def test_get_profile_returns_own_profile(mock_conn_with_profile, mock_profile_row):
    """GET /api/v1/profile returns the authenticated user's profile."""
    _override_deps(mock_conn_with_profile)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/profile")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "user_123"
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["theme"] == "dark"


@pytest.mark.asyncio
async def test_get_profile_404_when_not_found():
    """GET /api/v1/profile returns 404 when profile doesn't exist."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(return_value=None)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/profile")

    assert response.status_code == 404
    assert response.json()["detail"] == "Profile not found"


@pytest.mark.asyncio
async def test_update_profile_updates_allowed_fields(mock_conn_with_profile):
    """PUT /api/v1/profile updates only the fields sent in the body."""
    _override_deps(mock_conn_with_profile)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.put(
            "/api/v1/profile",
            json={"username": "newname", "bio": "Updated bio"},
        )

    assert response.status_code == 200
    assert response.json()["success"] is True

    # Verify the execute was called with correct fields
    call_args = mock_conn_with_profile.execute.call_args
    sql = call_args[0][0]
    values = call_args[0][1:]

    assert "username" in sql
    assert "bio" in sql
    assert "newname" in values
    assert "Updated bio" in values


@pytest.mark.asyncio
async def test_update_profile_rejects_empty_body(mock_conn_with_profile):
    """PUT /api/v1/profile returns 400 when no fields are provided."""
    _override_deps(mock_conn_with_profile)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.put(
            "/api/v1/profile",
            json={},
        )

    assert response.status_code == 400
    assert "No fields" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_profile_ignores_non_allowed_fields(mock_conn_with_profile):
    """PUT /api/v1/profile only updates fields defined in ProfileUpdate.

    Extra fields in the request body are ignored by Pydantic validation.
    """
    _override_deps(mock_conn_with_profile)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.put(
            "/api/v1/profile",
            json={"username": "newname", "role": "admin"},
        )

    assert response.status_code == 200

    # Verify 'role' is NOT in the SQL update
    call_args = mock_conn_with_profile.execute.call_args
    sql = call_args[0][0]
    assert "role" not in sql, "role should not be updatable via profile endpoint"


@pytest.mark.asyncio
async def test_update_profile_sets_rls_context(mock_conn_with_profile):
    """PUT /api/v1/profile calls set_clerk_jwt before querying."""
    _override_deps(mock_conn_with_profile)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.put(
            "/api/v1/profile",
            json={"theme": "light"},
        )

    # First call to execute should be set_clerk_jwt
    first_call = mock_conn_with_profile.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql
