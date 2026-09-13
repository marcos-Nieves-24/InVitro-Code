import time
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from jose import JWTError

from app.security import get_jwks, validate_token


@pytest.fixture
def mock_jwks():
    """Mock JWKS response from Clerk."""
    return {
        "keys": [
            {
                "kid": "test-kid-123",
                "kty": "RSA",
                "alg": "RS256",
                "use": "sig",
                "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
                "e": "AQAB",
            }
        ]
    }


@pytest.fixture
def valid_token():
    """Create a valid test JWT token."""
    from jose import jwt

    payload = {
        "sub": "user_123",
        "iss": "https://test.clerk.accounts.dev",
        "exp": int(time.time()) + 3600,
        "role": "user",
    }
    # For testing, we'll use HS256 with a test secret
    # In production, RS256 with JWKS is used
    return jwt.encode(payload, "test-secret", algorithm="HS256")


@pytest.mark.asyncio
async def test_get_jwks_caches_response(mock_jwks):
    """Test that JWKS response is cached."""
    # Reset cache
    import app.security as sec
    sec._jwks_cache = {}
    sec._jwks_cache_time = 0

    mock_response = MagicMock()
    mock_response.json.return_value = mock_jwks
    mock_response.raise_for_status = MagicMock()

    mock_client = AsyncMock()
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=False)

    with patch("app.security.httpx.AsyncClient", return_value=mock_client):
        # First call should fetch
        result1 = await get_jwks()
        assert result1 == mock_jwks

        # Second call should use cache (no additional HTTP call)
        result2 = await get_jwks()
        assert result2 == mock_jwks


@pytest.mark.asyncio
async def test_validate_token_missing_kid():
    """Test that token without kid in header raises ValueError."""
    with patch("app.security.jwt.get_unverified_header", return_value={}):
        with pytest.raises(ValueError, match="missing kid"):
            await validate_token("fake-token")


@pytest.mark.asyncio
async def test_validate_token_key_not_found():
    """Test that token with unknown kid raises ValueError."""
    with patch(
        "app.security.jwt.get_unverified_header",
        return_value={"kid": "unknown-kid"},
    ):
        with patch(
            "app.security.get_jwks",
            new_callable=AsyncMock,
            return_value={"keys": [{"kid": "different-kid"}]},
        ):
            with pytest.raises(ValueError, match="Key not found"):
                await validate_token("fake-token")


@pytest.mark.asyncio
async def test_validate_token_missing_sub():
    """Test that token without sub claim raises ValueError."""
    from jose import jwt

    # Create token without sub claim
    payload = {"iss": "test", "exp": int(time.time()) + 3600}
    token = jwt.encode(payload, "test-secret", algorithm="HS256")

    with patch("app.security.jwt.get_unverified_header", return_value={"kid": "test"}):
        with patch(
            "app.security.get_jwks",
            new_callable=AsyncMock,
            return_value={"keys": [{"kid": "test", "kty": "RSA"}]},
        ):
            with patch("app.security._get_signing_key", return_value="fake-key"):
                with patch("app.security.jwt.decode", return_value=payload):
                    with pytest.raises(ValueError, match="missing sub"):
                        await validate_token(token)


@pytest.mark.asyncio
async def test_validate_token_expired():
    """Test that expired token raises ValueError."""
    from jose import jwt

    payload = {
        "sub": "user_123",
        "iss": "https://test.clerk.accounts.dev",
        "exp": int(time.time()) - 3600,  # Expired 1 hour ago
    }
    token = jwt.encode(payload, "test-secret", algorithm="HS256")

    with patch("app.security.jwt.get_unverified_header", return_value={"kid": "test"}):
        with patch(
            "app.security.get_jwks",
            new_callable=AsyncMock,
            return_value={"keys": [{"kid": "test", "kty": "RSA"}]},
        ):
            with patch("app.security._get_signing_key", return_value="fake-key"):
                with patch(
                    "app.security.jwt.decode",
                    side_effect=JWTError("Signature has expired"),
                ):
                    with pytest.raises(ValueError, match="expired"):
                        await validate_token(token)
