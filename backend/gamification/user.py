"""User XP helpers — port of src/lib/gamification/user.ts."""

import asyncpg

from gamification.level import LevelInfo, calc_level


async def get_total_xp(user_id: str, conn: asyncpg.Connection) -> int:
    """Real total XP: progress.xp_earned + reflection_completions.xp_earned.

    Rows with completed_at NULL are excluded (matches TypeScript REQ-UP-05).
    """
    progress_xp = await conn.fetchval(
        "SELECT COALESCE(SUM(xp_earned), 0) FROM progress "
        "WHERE user_id = $1 AND completed = true AND completed_at IS NOT NULL",
        user_id,
    )
    reflection_xp = await conn.fetchval(
        "SELECT COALESCE(SUM(xp_earned), 0) FROM reflection_completions "
        "WHERE user_id = $1 AND completed_at IS NOT NULL",
        user_id,
    )
    return (progress_xp or 0) + (reflection_xp or 0)


async def get_level_info(user_id: str, conn: asyncpg.Connection) -> LevelInfo:
    """Level info derived from real total XP."""
    total_xp = await get_total_xp(user_id, conn)
    return calc_level(total_xp)
