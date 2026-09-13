# Auth Middleware Specification (Modified)

## Purpose

Split authentication responsibilities: Next.js middleware protects page routes; FastAPI handles API authentication via Clerk JWT validation.

## MODIFIED Requirements

### Requirement: Page Protection

The system SHALL use Next.js middleware for page-level authentication (redirect to `/sign-in` for unauthenticated users).

(Previously: Next.js middleware handled ALL auth including API routes)

#### Scenario: Unauthenticated page access

- GIVEN a user is not signed in
- WHEN they navigate to `/learn/python/intro`
- THEN Next.js middleware redirects to `/sign-in`

#### Scenario: Authenticated page access

- GIVEN a user is signed in via Clerk
- WHEN they navigate to `/learn/python/intro`
- THEN the page renders normally

### Requirement: API Authentication

The system SHALL authenticate API requests via FastAPI JWT validation instead of Next.js middleware.

(Previously: API routes used Clerk middleware for auth)

#### Scenario: API request via FastAPI

- GIVEN a request with a valid Clerk JWT to `/api/progress`
- WHEN FastAPI validates the JWT
- THEN the request proceeds with `user_id` from the JWT claims

#### Scenario: API request without token

- GIVEN a request without Authorization header to `/api/progress`
- WHEN FastAPI checks for authentication
- THEN the response is HTTP 401

### Requirement: Admin Guard

The system SHALL enforce admin role checks in both Next.js middleware (pages) and FastAPI (API routes).

(Previously: Admin guard was only in Next.js middleware)

#### Scenario: Admin page access

- GIVEN a user with admin role
- WHEN they navigate to `/admin/achievements`
- THEN Next.js middleware allows access

#### Scenario: Admin API access

- GIVEN a user with admin role calling `/api/admin/achievements` via FastAPI
- WHEN FastAPI checks admin role from JWT
- THEN the request proceeds

#### Scenario: Non-admin API blocked

- GIVEN a user without admin role calling `/api/admin/achievements` via FastAPI
- WHEN FastAPI checks admin role from JWT
- THEN the response is HTTP 403
