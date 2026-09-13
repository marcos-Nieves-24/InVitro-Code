"""Achievement evaluation — port of src/lib/gamification/achievements.ts.

All unlocks are evaluated against REAL data (progress, streaks, reflections).
Rows with completed_at NULL are excluded (REQ-UP-05).
"""

from datetime import datetime, timedelta, timezone

import asyncpg


async def evaluate_achievements(
    user_id: str,
    conn: asyncpg.Connection,
) -> dict:
    """Evaluate achievement conditions against real user data.

    Inserts newly unlocked achievements with ON CONFLICT DO NOTHING,
    preserving the original unlocked_at (REQ-ACH-04).

    Returns dict with 'achievements' list and 'summary' dict.
    Never raises — returns empty state on failure.
    """
    try:
        # Catalog (all achievements, ordered for stable display)
        catalog = await conn.fetch(
            "SELECT id, slug, title, description, icon, category, "
            "xp_reward, condition_type, condition_value "
            "FROM achievements ORDER BY xp_reward ASC"
        )
        if not catalog:
            return _empty_state()

        # Real user metrics, in parallel
        lessons_completed = await conn.fetchval(
            "SELECT COUNT(*) FROM progress "
            "WHERE user_id = $1 AND completed = true AND completed_at IS NOT NULL",
            user_id,
        ) or 0

        reflections_completed = await conn.fetchval(
            "SELECT COUNT(*) FROM reflection_completions "
            "WHERE user_id = $1 AND completed_at IS NOT NULL",
            user_id,
        ) or 0

        current_streak = await conn.fetchval(
            "SELECT current_streak FROM streaks WHERE user_id = $1",
            user_id,
        ) or 0

        total_xp = await conn.fetchval(
            "SELECT COALESCE(SUM(xp_earned), 0) FROM progress "
            "WHERE user_id = $1 AND completed = true AND completed_at IS NOT NULL",
            user_id,
        ) or 0
        total_xp += await conn.fetchval(
            "SELECT COALESCE(SUM(xp_earned), 0) FROM reflection_completions "
            "WHERE user_id = $1 AND completed_at IS NOT NULL",
            user_id,
        ) or 0

        # Modules fully completed
        completed_modules: set[str] = set()
        module_rows = await conn.fetch(
            "SELECT module_slug, COUNT(*) as cnt FROM progress "
            "WHERE user_id = $1 AND completed = true AND completed_at IS NOT NULL "
            "GROUP BY module_slug",
            user_id,
        )
        for row in module_rows:
            lesson_count = await conn.fetchval(
                "SELECT lesson_count FROM modules WHERE slug = $1",
                row["module_slug"],
            )
            if lesson_count and row["cnt"] >= lesson_count:
                completed_modules.add(row["module_slug"])

        # Already unlocked achievements
        unlocks = await conn.fetch(
            "SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = $1",
            user_id,
        )
        unlocked_at_by_id: dict[str, str] = {}
        for row in unlocks:
            unlocked_at_by_id[row["achievement_id"]] = row["unlocked_at"]

        # Cross-check each condition
        new_unlock_rows: list[tuple[str, str]] = []
        for achievement in catalog:
            eligible = _check_eligibility(
                achievement,
                lessons_completed,
                reflections_completed,
                current_streak,
                total_xp,
                completed_modules,
            )
            if eligible and achievement["id"] not in unlocked_at_by_id:
                new_unlock_rows.append((user_id, achievement["id"]))

        # Insert in one idempotent operation
        if new_unlock_rows:
            await conn.executemany(
                "INSERT INTO user_achievements (user_id, achievement_id) "
                "VALUES ($1, $2) ON CONFLICT (user_id, achievement_id) DO NOTHING",
                new_unlock_rows,
            )

        # Refresh unlock timestamps
        fresh_unlocks = await conn.fetch(
            "SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = $1",
            user_id,
        )
        for row in fresh_unlocks:
            unlocked_at_by_id[row["achievement_id"]] = row["unlocked_at"]

        # Build response
        achievements = [
            {
                "id": a["id"],
                "slug": a["slug"],
                "title": a["title"],
                "description": a["description"],
                "icon": a["icon"],
                "category": a["category"],
                "xp_reward": a["xp_reward"],
                "unlocked": a["id"] in unlocked_at_by_id,
                "unlocked_at": unlocked_at_by_id.get(a["id"]),
            }
            for a in catalog
        ]

        unlocked_count = sum(1 for a in achievements if a["unlocked"])
        summary = {
            "total": len(achievements),
            "unlocked": unlocked_count,
            "percent": round((unlocked_count / len(achievements)) * 100) if achievements else 0,
        }

        return {"achievements": achievements, "summary": summary}

    except Exception:
        return _empty_state()


async def get_weekly_xp(user_id: str, conn: asyncpg.Connection) -> dict:
    """Weekly XP from current week (Monday start).

    Returns dict with 'days' (7 slots, Monday=0) and 'total'.
    """
    empty: dict = {"days": [0, 0, 0, 0, 0, 0, 0], "total": 0}
    try:
        now = datetime.now(timezone.utc)
        # Monday of current week
        days_since_monday = now.weekday()
        week_start = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(
            days=days_since_monday
        )

        progress_rows = await conn.fetch(
            "SELECT xp_earned, completed_at FROM progress "
            "WHERE user_id = $1 AND completed = true "
            "AND completed_at IS NOT NULL AND completed_at >= $2",
            user_id,
            week_start,
        )
        reflection_rows = await conn.fetch(
            "SELECT xp_earned, completed_at FROM reflection_completions "
            "WHERE user_id = $1 "
            "AND completed_at IS NOT NULL AND completed_at >= $2",
            user_id,
            week_start,
        )

        days = [0, 0, 0, 0, 0, 0, 0]
        for row in progress_rows:
            day_index = (row["completed_at"].weekday()) % 7  # Monday = 0
            days[day_index] += row["xp_earned"] or 0
        for row in reflection_rows:
            day_index = (row["completed_at"].weekday()) % 7
            days[day_index] += row["xp_earned"] or 0

        return {"days": days, "total": sum(days)}

    except Exception:
        return empty


def _check_eligibility(
    achievement: asyncpg.Record,
    lessons_completed: int,
    reflections_completed: int,
    current_streak: int,
    total_xp: int,
    completed_modules: set[str],
) -> bool:
    """Check if a single achievement's condition is met."""
    condition_type = achievement["condition_type"]
    condition_value = achievement["condition_value"]

    if condition_type == "lessons_completed":
        return lessons_completed >= int(condition_value)
    if condition_type == "reflections_completed":
        return reflections_completed >= int(condition_value)
    if condition_type == "current_streak":
        return current_streak >= int(condition_value)
    if condition_type == "total_xp":
        return total_xp >= int(condition_value)
    if condition_type == "module_completed":
        return condition_value in completed_modules
    return False


def _empty_state() -> dict:
    return {"achievements": [], "summary": {"total": 0, "unlocked": 0, "percent": 0}}
