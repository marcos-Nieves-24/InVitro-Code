"""Leaderboard route — port of src/app/api/leaderboard/route.ts.

GET /api/v1/leaderboard — top 50 + user rank via DB RPCs
"""

from fastapi import APIRouter, Depends

from app.deps import UserContext, get_current_user, get_db
from db.rls import set_clerk_jwt

router = APIRouter(tags=["leaderboard"])


@router.get("/api/v1/leaderboard")
async def get_leaderboard(
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Return top 50 leaderboard entries and the current user's rank position."""
    await set_clerk_jwt(conn, user.user_id)

    entries = await conn.fetch("SELECT * FROM get_leaderboard(50)")
    rank = await conn.fetchval("SELECT * FROM get_leaderboard_rank($1)", user.user_id)

    leaderboard = [
        {
            "userId": entry["user_id"],
            "username": entry["username"],
            "totalXp": entry["total_xp"] or 0,
        }
        for entry in entries
    ]

    return {
        "entries": leaderboard,
        "currentUser": {"position": rank} if rank is not None else None,
    }
