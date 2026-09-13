import json

import asyncpg


async def set_clerk_jwt(conn: asyncpg.Connection, user_id: str) -> None:
    """Set the Clerk JWT claims on the connection for RLS enforcement.

    This calls set_config to set request.jwt.claims which is used by
    Supabase RLS policies that reference auth.jwt() ->> 'sub'.
    """
    claims = json.dumps({"sub": user_id})
    await conn.execute(
        "SELECT set_config('request.jwt.claims', $1, true)",
        claims,
    )
