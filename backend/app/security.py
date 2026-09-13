import time
from typing import Any

import httpx
from jose import JWTError, jwk, jwt

from app.config import settings

# JWKS cache
_jwks_cache: dict[str, Any] = {}
_jwks_cache_time: float = 0
JWKS_CACHE_TTL = 3600  # 1 hour


async def get_jwks() -> dict[str, Any]:
    """Fetch and cache JWKS from Clerk endpoint."""
    global _jwks_cache, _jwks_cache_time

    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache

    async with httpx.AsyncClient() as client:
        resp = await client.get(settings.CLERK_JWKS_URL)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        return _jwks_cache


def _get_signing_key(jwks: dict[str, Any], kid: str) -> Any:
    """Extract the signing key from JWKS for the given kid."""
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return jwk.construct(key, algorithm="RS256")
    raise ValueError(f"Key not found for kid: {kid}")


async def validate_token(token: str) -> dict[str, str]:
    """
    Validate a Clerk JWT and return the claims.

    Returns:
        dict with 'sub' (user_id) and other claims

    Raises:
        ValueError: If token is invalid or expired
    """
    try:
        # Decode header to get kid
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            raise ValueError("Token missing kid in header")

        # Get JWKS and signing key
        jwks = await get_jwks()
        signing_key = _get_signing_key(jwks, kid)

        # Validate and decode
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.CLERK_ISSUER,
            options={
                "verify_exp": True,
                "verify_iss": True,
            },
        )

        if "sub" not in payload:
            raise ValueError("Token missing sub claim")

        return payload

    except JWTError as e:
        if "expired" in str(e).lower():
            raise ValueError("Token expired") from e
        raise ValueError("Invalid token") from e
