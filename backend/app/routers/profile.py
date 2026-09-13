from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import UserContext, get_current_user, get_db
from app.models import ProfileResponse, ProfileUpdate
from db.rls import set_clerk_jwt

router = APIRouter(tags=["profile"])


@router.get("/api/v1/profile", response_model=ProfileResponse)
async def get_profile(
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Read the authenticated user's own profile.

    RLS is enforced via set_config — the query can only return
    rows belonging to the authenticated user.
    """
    await set_clerk_jwt(conn, user.user_id)

    row = await conn.fetchrow(
        "SELECT id, email, username, role, avatar_url, bio, theme, "
        "notification_prefs, created_at "
        "FROM profiles WHERE id = $1",
        user.user_id,
    )
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return ProfileResponse(**dict(row))


@router.put("/api/v1/profile")
async def update_profile(
    update: ProfileUpdate,
    user: UserContext = Depends(get_current_user),
    conn=Depends(get_db),
):
    """Update the authenticated user's profile.

    Only fields explicitly sent in the request body are updated (allowlist).
    Fields not included in ProfileUpdate are never written.
    """
    await set_clerk_jwt(conn, user.user_id)

    fields = update.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    # Build dynamic SET clause with positional parameters
    set_clauses: list[str] = []
    values: list = []
    for i, (key, value) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        values.append(value)

    # WHERE clause parameter comes last
    values.append(user.user_id)
    where_pos = len(values)

    query = (
        f"UPDATE profiles SET {', '.join(set_clauses)} "
        f"WHERE id = ${where_pos}"
    )
    await conn.execute(query, *values)

    return {"success": True}
