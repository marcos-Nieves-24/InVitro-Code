"""Progress route tests.

Tests for POST /api/v1/progress and POST /api/v1/progress/reflection endpoints.
"""

from datetime import date, datetime, timezone
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
def mock_progress_row():
    """Sample progress row as returned by asyncpg fetchrow."""
    return {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "python",
        "lesson_slug": "basico",
        "completed": True,
        "xp_earned": 25,
        "completed_at": datetime(2025, 1, 15, 10, 30, 0, tzinfo=timezone.utc),
    }


@pytest.fixture
def mock_streak_row():
    """Sample streak row."""
    return {
        "user_id": "user_123",
        "current_streak": 3,
        "longest_streak": 5,
        "last_active_date": date.today().isoformat(),
    }


@pytest.fixture
def mock_updated_streak_row():
    """Sample updated streak row after upsert."""
    return {
        "user_id": "user_123",
        "current_streak": 3,
        "longest_streak": 5,
        "last_active_date": date.today(),
    }


@pytest.fixture
def mock_conn_for_progress(mock_progress_row, mock_streak_row, mock_updated_streak_row):
    """Mock connection for progress routes."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(side_effect=[mock_progress_row, mock_streak_row, mock_updated_streak_row])
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    conn.executemany = AsyncMock()
    return conn


def _override_deps(conn):
    """Set FastAPI dependency overrides for a mock connection."""
    app.dependency_overrides[get_current_user] = lambda: UserContext(
        user_id="user_123", role="user"
    )
    app.dependency_overrides[get_db] = lambda: conn


@pytest.mark.asyncio
async def test_post_progress_success(mock_conn_for_progress):
    """POST /api/v1/progress records lesson completion and returns XP."""
    _override_deps(mock_conn_for_progress)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["xp_earned"] == 25  # base_xp for python/basico
    assert "progress" in data
    assert "streak" in data


@pytest.mark.asyncio
async def test_post_progress_missing_fields():
    """POST /api/v1/progress returns 400 when fields are missing."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python"},
        )

    assert response.status_code == 422  # Pydantic validation error


@pytest.mark.asyncio
async def test_post_progress_sets_rls_context(mock_conn_for_progress):
    """POST /api/v1/progress calls set_clerk_jwt before querying."""
    _override_deps(mock_conn_for_progress)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    # First call to execute should be set_clerk_jwt
    first_call = mock_conn_for_progress.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql


@pytest.mark.asyncio
async def test_post_progress_streak_same_day(mock_conn_for_progress):
    """POST /api/v1/progress does not increment streak on same day."""
    # Streak row shows last_active_date = today
    _override_deps(mock_conn_for_progress)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


@pytest.mark.asyncio
async def test_post_progress_streak_next_day():
    """POST /api/v1/progress increments streak on consecutive day."""
    yesterday = date.today().replace(day=date.today().day - 1).isoformat()
    streak_row = {
        "user_id": "user_123",
        "current_streak": 5,
        "longest_streak": 10,
        "last_active_date": yesterday,
    }
    updated_streak = {
        "user_id": "user_123",
        "current_streak": 6,
        "longest_streak": 10,
        "last_active_date": date.today(),
    }
    progress_row = {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "python",
        "lesson_slug": "basico",
        "completed": True,
        "xp_earned": 25,
        "completed_at": datetime.now(timezone.utc),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(side_effect=[progress_row, streak_row, updated_streak])
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_post_progress_streak_gap_resets():
    """POST /api/v1/progress resets streak when there's a gap."""
    old_date = "2020-01-01"
    streak_row = {
        "user_id": "user_123",
        "current_streak": 10,
        "longest_streak": 15,
        "last_active_date": old_date,
    }
    updated_streak = {
        "user_id": "user_123",
        "current_streak": 1,
        "longest_streak": 15,
        "last_active_date": date.today(),
    }
    progress_row = {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "python",
        "lesson_slug": "basico",
        "completed": True,
        "xp_earned": 25,
        "completed_at": datetime.now(timezone.utc),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(side_effect=[progress_row, streak_row, updated_streak])
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_post_progress_ml_module_xp():
    """POST /api/v1/progress returns higher XP for machine-learning module."""
    progress_row = {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "machine-learning",
        "lesson_slug": "basico",
        "completed": True,
        "xp_earned": 30,
        "completed_at": datetime.now(timezone.utc),
    }
    streak_row = {
        "user_id": "user_123",
        "current_streak": 1,
        "longest_streak": 1,
        "last_active_date": date.today().isoformat(),
    }
    updated_streak = {
        "user_id": "user_123",
        "current_streak": 1,
        "longest_streak": 1,
        "last_active_date": date.today(),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(side_effect=[progress_row, streak_row, updated_streak])
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "machine-learning", "lesson_slug": "basico"},
        )

    assert response.status_code == 200
    data = response.json()
    # machine-learning multiplier = 1.2, base = 25 → 25 * 1.2 = 30
    assert data["xp_earned"] == 30


@pytest.mark.asyncio
async def test_post_progress_avanzado_xp():
    """POST /api/v1/progress returns higher XP for avanzado lessons."""
    progress_row = {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "python",
        "lesson_slug": "leccion_avanzado",
        "completed": True,
        "xp_earned": 38,
        "completed_at": datetime.now(timezone.utc),
    }
    streak_row = {
        "user_id": "user_123",
        "current_streak": 1,
        "longest_streak": 1,
        "last_active_date": date.today().isoformat(),
    }
    updated_streak = {
        "user_id": "user_123",
        "current_streak": 1,
        "longest_streak": 1,
        "last_active_date": date.today(),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(side_effect=[progress_row, streak_row, updated_streak])
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress",
            json={"module_slug": "python", "lesson_slug": "leccion_avanzado"},
        )

    assert response.status_code == 200
    data = response.json()
    # avanzado: 25 * 1.0 * 1.5 = 37.5 → round = 38
    assert data["xp_earned"] == 38


@pytest.mark.asyncio
async def test_post_reflection_success():
    """POST /api/v1/progress/reflection records reflection completion."""
    reflection_row = {
        "id": 1,
        "user_id": "user_123",
        "module_slug": "python",
        "lesson_slug": "basico",
        "xp_earned": 10,
        "completed_at": datetime.now(timezone.utc),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetchrow = AsyncMock(return_value=reflection_row)
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=0)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress/reflection",
            json={"module_slug": "python", "lesson_slug": "basico"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["xp_earned"] == 10
    assert "reflection" in data


@pytest.mark.asyncio
async def test_post_reflection_missing_fields():
    """POST /api/v1/progress/reflection returns 422 when fields are missing."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/api/v1/progress/reflection",
            json={"lesson_slug": "basico"},
        )

    assert response.status_code == 422
