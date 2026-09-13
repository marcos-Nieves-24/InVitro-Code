# JWT Auth Middleware Specification

## Purpose

Validate Clerk-issued JWTs via JWKS and inject authenticated user context into FastAPI route handlers.

## Requirements

### Requirement: JWKS Fetch and Cache

The system SHALL fetch JWKS from Clerk's `/.well-known/jwks.json` endpoint and cache keys with TTL.

#### Scenario: First JWT validation

- GIVEN no JWKS keys are cached
- WHEN a request with a JWT arrives
- THEN the system fetches JWKS from Clerk
- AND caches the keys for subsequent validations

#### Scenario: JWKS cache refresh

- GIVEN cached JWKS keys exist and TTL has expired
- WHEN a new JWT validation is attempted
- THEN the system re-fetches JWKS from Clerk

### Requirement: JWT Validation

The system SHALL validate JWT signature, `exp`, `iss`, and `sub` claims.

#### Scenario: Valid token

- GIVEN a Clerk JWT with valid signature, non-expired `exp`, correct `iss`, and `sub` claim
- WHEN the token is validated
- THEN validation succeeds and returns the `sub` claim as `user_id`

#### Scenario: Expired token

- GIVEN a JWT with `exp` in the past
- WHEN the token is validated
- THEN the system returns HTTP 401 with `{"detail": "Token expired"}`

#### Scenario: Invalid issuer

- GIVEN a JWT with `iss` not matching Clerk issuer URL
- WHEN the token is validated
- THEN the system returns HTTP 401 with `{"detail": "Invalid token"}`

### Requirement: UserContext Dependency

The system SHALL provide a `get_current_user` FastAPI dependency returning `UserContext(user_id, role)`.

#### Scenario: Admin role extraction

- GIVEN a validated JWT with admin role in claims
- WHEN `get_current_user` is called
- THEN the dependency returns `UserContext` with `role="admin"`

#### Scenario: Regular user

- GIVEN a validated JWT without admin role
- WHEN `get_current_user` is called
- THEN the dependency returns `UserContext` with `role="user"`

### Requirement: Missing Token

The system SHALL return HTTP 401 when no Authorization header is present.

#### Scenario: No Authorization header

- GIVEN a request without `Authorization` header
- WHEN the route requires authentication
- THEN the system returns HTTP 401 with `{"detail": "Not authenticated"}`
