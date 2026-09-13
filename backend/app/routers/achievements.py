"""Achievements route — port of src/app/api/achievements/route.ts.

GET /api/v1/achievements — evaluate achievements + weekly XP
"""

from fastapi import APIRouter, Depends

from app.deps import UserContext, get_current_user, get_db
from db.rls import set_clerk_jwt
from gamification.achievements import evaluate_achievements, get_weekly_xp

router = APIRouter(tags=["achievements"])


@router.get("/api/v1/achievements")
async def get_achievements(
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Evaluate achievements against real data and return full catalog with state + weekly XP."""
    await set_clerk_jwt(conn, user.user_id)

    result = await evaluate_achievements(user.user_id, conn)
    weekly_xp = await get_weekly_xp(user.user_id, conn)

    return {
        "achievements": result["achievements"],
        "summary": result["summary"],
        "weeklyXp": weekly_xp,
    }
