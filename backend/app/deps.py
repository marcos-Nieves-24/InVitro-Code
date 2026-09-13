from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.security import validate_token

security_scheme = HTTPBearer()


@dataclass
class UserContext:
    user_id: str
    role: str = "user"


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
) -> UserContext:
    """Extract and validate user from JWT token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        claims = await validate_token(credentials.credentials)
    except ValueError as e:
        if "expired" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            ) from e
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from e

    # Extract role from claims (default to "user")
    role = claims.get("role", "user")
    if role not in ("user", "admin"):
        role = "user"

    return UserContext(user_id=claims["sub"], role=role)


async def get_db():
    """Get a database connection from the pool with RLS configured.

    This dependency yields a connection with the JWT claims set for RLS.
    The connection is returned to the pool after the request.
    """
    from app.main import app

    pool = app.state.db_pool
    if pool is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not available",
        )

    async with pool.acquire() as conn:
        yield conn
