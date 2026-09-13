"""Achievement and leaderboard route tests.

Tests for GET /api/v1/achievements and GET /api/v1/leaderboard endpoints.
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


@pytest.fixture
def mock_achievement_catalog():
    """Sample achievement catalog rows."""
    return [
        {
            "id": "ach_001",
            "slug": "first-lesson",
            "title": "Primera Lección",
            "description": "Completa tu primera lección",
            "icon": "🎯",
            "category": "milestones",
            "xp_reward": 10,
            "condition_type": "lessons_completed",
            "condition_value": "1",
        },
        {
            "id": "ach_002",
            "slug": "five-lessons",
            "title": "Estudioso",
            "description": "Completa 5 lecciones",
            "icon": "📚",
            "category": "milestones",
            "xp_reward": 50,
            "condition_type": "lessons_completed",
            "condition_value": "5",
        },
    ]


@pytest.fixture
def mock_conn_for_achievements(mock_achievement_catalog):
    """Mock connection for achievement evaluation."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetch = AsyncMock(side_effect=[
        mock_achievement_catalog,  # catalog
        [],  # module_rows
        [],  # unlocks
        [],  # fresh_unlocks
        [],  # progress_rows for weekly XP
        [],  # reflection_rows for weekly XP
    ])
    conn.fetchrow = AsyncMock(return_value=None)
    conn.fetchval = AsyncMock(return_value=2)  # 2 lessons completed
    conn.executemany = AsyncMock()
    return conn


def _override_deps(conn):
    """Set FastAPI dependency overrides for a mock connection."""
    app.dependency_overrides[get_current_user] = lambda: UserContext(
        user_id="user_123", role="user"
    )
    app.dependency_overrides[get_db] = lambda: conn


@pytest.mark.asyncio
async def test_get_achievements_success(mock_conn_for_achievements):
    """GET /api/v1/achievements returns achievement catalog with state."""
    _override_deps(mock_conn_for_achievements)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/achievements")

    assert response.status_code == 200
    data = response.json()
    assert "achievements" in data
    assert "summary" in data
    assert "weeklyXp" in data
    assert len(data["achievements"]) == 2
    assert data["summary"]["total"] == 2


@pytest.mark.asyncio
async def test_get_achievements_sets_rls_context(mock_conn_for_achievements):
    """GET /api/v1/achievements calls set_clerk_jwt before querying."""
    _override_deps(mock_conn_for_achievements)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.get("/api/v1/achievements")

    # First call to execute should be set_clerk_jwt
    first_call = mock_conn_for_achievements.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql


@pytest.mark.asyncio
async def test_get_achievements_weekly_xp(mock_conn_for_achievements):
    """GET /api/v1/achievements includes weekly XP breakdown."""
    _override_deps(mock_conn_for_achievements)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/achievements")

    assert response.status_code == 200
    data = response.json()
    weekly_xp = data["weeklyXp"]
    assert "days" in weekly_xp
    assert "total" in weekly_xp
    assert len(weekly_xp["days"]) == 7


@pytest.mark.asyncio
async def test_get_achievements_unlocked(mock_achievement_catalog):
    """GET /api/v1/achievements marks achievements as unlocked when conditions met."""
    unlocked_row = {
        "achievement_id": "ach_001",
        "unlocked_at": datetime(2025, 1, 15, 10, 0, 0, tzinfo=timezone.utc),
    }
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetch = AsyncMock(side_effect=[
        mock_achievement_catalog,  # catalog
        [],  # module_rows
        [unlocked_row],  # unlocks (user has ach_001)
        [unlocked_row],  # fresh_unlocks
        [],  # progress_rows for weekly XP
        [],  # reflection_rows for weekly XP
    ])
    conn.fetchrow = AsyncMock(return_value=None)
    conn.fetchval = AsyncMock(return_value=2)
    conn.executemany = AsyncMock()
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/achievements")

    assert response.status_code == 200
    data = response.json()
    # ach_001 should be unlocked
    ach_001 = next(a for a in data["achievements"] if a["id"] == "ach_001")
    assert ach_001["unlocked"] is True
    assert ach_001["unlocked_at"] is not None


@pytest.mark.asyncio
async def test_get_leaderboard_success():
    """GET /api/v1/leaderboard returns entries and user rank."""
    leaderboard_entries = [
        {"user_id": "user_001", "username": "alice", "total_xp": 500},
        {"user_id": "user_002", "username": "bob", "total_xp": 350},
    ]
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetch = AsyncMock(return_value=leaderboard_entries)
    conn.fetchval = AsyncMock(return_value=5)  # user rank = 5
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/leaderboard")

    assert response.status_code == 200
    data = response.json()
    assert "entries" in data
    assert "currentUser" in data
    assert len(data["entries"]) == 2
    assert data["entries"][0]["userId"] == "user_001"
    assert data["entries"][0]["totalXp"] == 500
    assert data["currentUser"]["position"] == 5


@pytest.mark.asyncio
async def test_get_leaderboard_user_not_ranked():
    """GET /api/v1/leaderboard returns null currentUser when not ranked."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=None)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/leaderboard")

    assert response.status_code == 200
    data = response.json()
    assert data["currentUser"] is None


@pytest.mark.asyncio
async def test_get_leaderboard_sets_rls_context():
    """GET /api/v1/leaderboard calls set_clerk_jwt before querying."""
    conn = AsyncMock()
    conn.execute = AsyncMock()
    conn.fetch = AsyncMock(return_value=[])
    conn.fetchval = AsyncMock(return_value=None)
    _override_deps(conn)
    app.state.db_pool = MagicMock()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        await client.get("/api/v1/leaderboard")

    # First call to execute should be set_clerk_jwt
    first_call = conn.execute.call_args_list[0]
    sql = first_call[0][0]
    assert "set_config" in sql
