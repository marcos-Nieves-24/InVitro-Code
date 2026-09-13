"""Admin routes — port of src/app/api/admin/users and admin/stats.

GET /api/v1/admin/users — enriched user list (admin only)
GET /api/v1/admin/stats — aggregate platform stats (admin only)
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import UserContext, get_current_user, get_db
from db.rls import set_clerk_jwt

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


async def require_admin(
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
) -> UserContext:
    """Dependency that verifies the authenticated user has admin role."""
    await set_clerk_jwt(conn, user.user_id)

    role = await conn.fetchval(
        "SELECT role FROM profiles WHERE id = $1", user.user_id
    )
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin required",
        )
    return user


@router.get("/users")
async def get_admin_users(
    admin: UserContext = Depends(require_admin),
    conn=Depends(get_db),
):
    """Return enriched user list with XP, lesson counts, and streaks.

    Mirrors the Next.js admin/users route: profiles + aggregated progress + streaks.
    """
    await set_clerk_jwt(conn, admin.user_id)

    profiles = await conn.fetch(
        "SELECT * FROM profiles ORDER BY created_at DESC"
    )

    if not profiles:
        return []

    user_ids = [p["id"] for p in profiles]

    # Fetch progress aggregates (completed lessons only)
    progress_rows = await conn.fetch(
        "SELECT user_id, SUM(xp_earned) AS total_xp, COUNT(*) AS lessons "
        "FROM progress WHERE completed = true AND user_id = ANY($1) "
        "GROUP BY user_id",
        user_ids,
    )

    # Fetch streak data
    streak_rows = await conn.fetch(
        "SELECT user_id, current_streak, longest_streak, last_active_date "
        "FROM streaks WHERE user_id = ANY($1)",
        user_ids,
    )

    progress_by_user: dict[str, dict] = {}
    for row in progress_rows:
        progress_by_user[row["user_id"]] = {
            "total_xp": row["total_xp"] or 0,
            "lessons": row["lessons"] or 0,
        }

    streaks_by_user: dict[str, dict] = {}
    for row in streak_rows:
        streaks_by_user[row["user_id"]] = {
            "current_streak": row["current_streak"] or 0,
            "longest_streak": row["longest_streak"] or 0,
            "last_active_date": (
                row["last_active_date"].isoformat()
                if row["last_active_date"]
                else None
            ),
        }

    enriched = []
    for profile in profiles:
        pid = profile["id"]
        enriched.append({
            **dict(profile),
            "total_xp": progress_by_user.get(pid, {}).get("total_xp", 0),
            "lessons_completed": progress_by_user.get(pid, {}).get("lessons", 0),
            "current_streak": streaks_by_user.get(pid, {}).get("current_streak", 0),
            "longest_streak": streaks_by_user.get(pid, {}).get("longest_streak", 0),
            "last_active_date": streaks_by_user.get(pid, {}).get("last_active_date"),
        })

    return enriched


@router.get("/stats")
async def get_admin_stats(
    admin: UserContext = Depends(require_admin),
    conn=Depends(get_db),
):
    """Return aggregate platform statistics.

    Mirrors the Next.js admin/stats route: total users, banned, active this week.
    """
    await set_clerk_jwt(conn, admin.user_id)

    total_users = await conn.fetchval(
        "SELECT COUNT(*) FROM profiles"
    )

    banned_users = await conn.fetchval(
        "SELECT COUNT(*) FROM profiles WHERE is_banned = true"
    )

    active_week = await conn.fetchval(
        "SELECT COUNT(*) FROM profiles "
        "WHERE last_active_at >= NOW() - INTERVAL '7 days'"
    )

    return {
        "total_users": total_users or 0,
        "banned_users": banned_users or 0,
        "active_week": active_week or 0,
    }
