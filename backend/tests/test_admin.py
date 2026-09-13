"""Admin route tests.

Tests for GET /api/v1/admin/users and GET /api/v1/admin/stats endpoints.
Covers admin guard, enriched user list, and aggregate stats.
"""

from datetime import datetime, timezone
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


def _override_admin(conn):
    """Set dependency overrides for an admin user."""
    app.dependency_overrides[get_current_user] = lambda: UserContext(
        user_id="admin_001", role="admin"
    )
    app.dependency_overrides[get_db] = lambda: conn


def _override_user(conn):
    """Set dependency overrides for a regular user."""
    app.dependency_overrides[get_current_user] = lambda: UserContext(
        user_id="user_001", role="user"
    )
    app.dependency_overrides[get_db] = lambda: conn


# ── Admin Guard Tests ──


@pytest.mark.asyncio
async def test_admin_users_requires_admin_role():
    """GET /api/v1/admin/users returns 403 for non-admin users."""
    conn = AsyncMock()
    # Role lookup returns "user" (not admin)
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(return_value="user")
    _override_user(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/users")

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin required"


@pytest.mark.asyncio
async def test_admin_stats_requires_admin_role():
    """GET /api/v1/admin/stats returns 403 for non-admin users."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(return_value="user")
    _override_user(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/stats")

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin required"


@pytest.mark.asyncio
async def test_admin_users_requires_authentication():
    """GET /api/v1/admin/users returns 401 without auth token."""
    app.state.db_pool = MagicMock()
    # No dependency overrides — default auth will fail

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/users")

    assert response.status_code in (401, 403)


# ── Admin Users Tests ──


@pytest.mark.asyncio
async def test_get_admin_users_success():
    """GET /api/v1/admin/users returns enriched user list for admin."""
    now = datetime(2025, 1, 15, 10, 0, 0, tzinfo=timezone.utc)
    profiles = [
        {"id": "user_001", "username": "alice", "role": "user", "created_at": now},
        {"id": "user_002", "username": "bob", "role": "user", "created_at": now},
    ]
    progress_rows = [
        {"user_id": "user_001", "total_xp": 150, "lessons": 3},
        {"user_id": "user_002", "total_xp": 50, "lessons": 1},
    ]
    streak_rows = [
        {"user_id": "user_001", "current_streak": 5, "longest_streak": 10, "last_active_date": now.date()},
        {"user_id": "user_002", "current_streak": 1, "longest_streak": 1, "last_active_date": now.date()},
    ]

    conn = AsyncMock()
    conn.execute = AsyncMock()
    # require_admin calls fetchval for role check, then get_admin_users calls fetch 3 times
    conn.fetchval = AsyncMock(return_value="admin")
    conn.fetch = AsyncMock(side_effect=[profiles, progress_rows, streak_rows])
    _override_admin(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/users")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "user_001"
    assert data[0]["total_xp"] == 150
    assert data[0]["lessons_completed"] == 3
    assert data[0]["current_streak"] == 5
    assert data[1]["id"] == "user_002"
    assert data[1]["total_xp"] == 50


@pytest.mark.asyncio
async def test_get_admin_users_empty():
    """GET /api/v1/admin/users returns empty list when no profiles exist."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(return_value="admin")
    conn.fetch = AsyncMock(return_value=[])
    _override_admin(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/users")

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_admin_users_sets_rls_context():
    """GET /api/v1/admin/users calls set_clerk_jwt before querying."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(return_value="admin")
    conn.fetch = AsyncMock(return_value=[])
    _override_admin(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.get("/api/v1/admin/users")

    # First execute call should be set_clerk_jwt
    first_call = conn.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql


# ── Admin Stats Tests ──


@pytest.mark.asyncio
async def test_get_admin_stats_success():
    """GET /api/v1/admin/stats returns aggregate statistics."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(side_effect=[
        "admin",  # role check
        100,      # total_users
        2,        # banned_users
        45,       # active_week
    ])
    _override_admin(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/admin/stats")

    assert response.status_code == 200
    data = response.json()
    assert data["total_users"] == 100
    assert data["banned_users"] == 2
    assert data["active_week"] == 45


@pytest.mark.asyncio
async def test_get_admin_stats_sets_rls_context():
    """GET /api/v1/admin/stats calls set_clerk_jwt before querying."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchval = AsyncMock(side_effect=["admin", 0, 0, 0])
    _override_admin(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.get("/api/v1/admin/stats")

    first_call = conn.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql
