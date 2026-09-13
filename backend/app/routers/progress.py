"""Progress route — port of src/app/api/progress/route.ts.

POST /api/v1/progress — complete a lesson (XP calc, streak logic)
POST /api/v1/progress/reflection — complete a reflection
"""

from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import UserContext, get_current_user, get_db
from app.models import ProgressRequest
from db.rls import set_clerk_jwt
from gamification.achievements import evaluate_achievements
from gamification.xp import calc_xp_for_lesson

router = APIRouter(tags=["progress"])


def _is_same_day(a: str, b: str) -> bool:
    return a == b


def _is_next_day(a: str, b: str) -> bool:
    """Check if b is exactly one day after a (YYYY-MM-DD strings)."""
    date_a = datetime.strptime(a, "%Y-%m-%d").date()
    date_b = datetime.strptime(b, "%Y-%m-%d").date()
    return (date_b - date_a).days == 1


@router.post("/api/v1/progress")
async def record_progress(
    request: ProgressRequest,
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Complete a lesson — upsert progress, update streak, trigger achievements."""
    await set_clerk_jwt(conn, user.user_id)

    module_slug = request.module_slug
    lesson_slug = request.lesson_slug

    if not module_slug or not lesson_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required fields: module_slug, lesson_slug",
        )

    # Calculate XP
    xp_earned = calc_xp_for_lesson(module_slug, lesson_slug)
    now = datetime.now(timezone.utc)

    # Upsert progress record
    progress_row = await conn.fetchrow(
        "INSERT INTO progress (user_id, module_slug, lesson_slug, completed, xp_earned, completed_at) "
        "VALUES ($1, $2, $3, true, $4, $5) "
        "ON CONFLICT (user_id, module_slug, lesson_slug) "
        "DO UPDATE SET completed = true, xp_earned = $4, completed_at = $5 "
        "RETURNING *",
        user.user_id,
        module_slug,
        lesson_slug,
        xp_earned,
        now,
    )

    # ── Streak logic ──
    today = date.today().isoformat()

    existing_streak = await conn.fetchrow(
        "SELECT current_streak, longest_streak, last_active_date FROM streaks WHERE user_id = $1",
        user.user_id,
    )

    new_current_streak = 1
    new_longest_streak = 0

    if existing_streak:
        last_active = existing_streak["last_active_date"]
        new_longest_streak = existing_streak["longest_streak"] or 0

        if last_active:
            last_active_str = last_active.isoformat() if isinstance(last_active, date) else str(last_active)
            if _is_same_day(today, last_active_str):
                new_current_streak = existing_streak["current_streak"]
            elif _is_next_day(last_active_str, today):
                new_current_streak = existing_streak["current_streak"] + 1
            else:
                new_current_streak = 1

    if new_current_streak > new_longest_streak:
        new_longest_streak = new_current_streak

    updated_streak = await conn.fetchrow(
        "INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) "
        "VALUES ($1, $2, $3, $4) "
        "ON CONFLICT (user_id) "
        "DO UPDATE SET current_streak = $2, longest_streak = $3, last_active_date = $4 "
        "RETURNING *",
        user.user_id,
        new_current_streak,
        new_longest_streak,
        today,
    )

    # Achievement evaluation (non-fatal — REQ-ACH-04)
    try:
        await evaluate_achievements(user.user_id, conn)
    except Exception:
        pass

    return {
        "success": True,
        "progress": dict(progress_row) if progress_row else {},
        "streak": dict(updated_streak) if updated_streak else {},
        "xp_earned": xp_earned,
    }


@router.post("/api/v1/progress/reflection")
async def record_reflection(
    request: ProgressRequest,
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Complete a reflection — upsert reflection_completions."""
    await set_clerk_jwt(conn, user.user_id)

    module_slug = request.module_slug
    lesson_slug = request.lesson_slug

    if not module_slug or not lesson_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required fields: module_slug, lesson_slug",
        )

    xp_earned = 10  # Fixed XP for reflections
    now = datetime.now(timezone.utc)

    row = await conn.fetchrow(
        "INSERT INTO reflection_completions (user_id, module_slug, lesson_slug, xp_earned, completed_at) "
        "VALUES ($1, $2, $3, $4, $5) "
        "ON CONFLICT (user_id, module_slug, lesson_slug) "
        "DO UPDATE SET xp_earned = $4, completed_at = $5 "
        "RETURNING *",
        user.user_id,
        module_slug,
        lesson_slug,
        xp_earned,
        now,
    )

    return {
        "success": True,
        "reflection": dict(row) if row else {},
        "xp_earned": xp_earned,
    }
