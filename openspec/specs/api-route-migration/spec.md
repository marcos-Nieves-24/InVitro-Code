# API Route Migration Specification

## Purpose

Migrate Next.js API routes to FastAPI endpoints incrementally, one route at a time, with feature flags and rollback capability.

## Requirements

### Requirement: Route Mapping

The system SHALL define a mapping table from Next.js API paths to FastAPI router paths.

#### Scenario: Progress routes

- GIVEN Next.js route `src/app/api/progress/route.ts`
- WHEN migration is active
- THEN requests to `/api/progress` are forwarded to FastAPI endpoint `/api/progress`

### Requirement: Response Format Compatibility

The system SHALL return identical JSON response shapes from FastAPI as the original Next.js routes.

#### Scenario: Response shape match

- GIVEN a migrated `GET /api/progress` route
- WHEN the same request is sent to FastAPI
- THEN the response JSON structure matches the original exactly

### Requirement: Feature Flags

The system SHALL use feature flags (env vars) to control per-route migration.

#### Scenario: Route not yet migrated

- GIVEN `MIGRATE_PROGRESS=false`
- WHEN a request to `/api/progress` arrives
- THEN the Next.js route handles it (no FastAPI involvement)

#### Scenario: Route migrated

- GIVEN `MIGRATE_PROGRESS=true`
- WHEN a request to `/api/progress` arrives
- THEN the Next.js proxy forwards to FastAPI

### Requirement: Rollback Per Route

The system SHALL support disabling a single route's migration without affecting others.

#### Scenario: Rollback single route

- GIVEN `MIGRATE_PROGRESS=true` and `MIGRATE_PROFILE=true`
- WHEN `MIGRATE_PROGRESS` is set to `false`
- THEN progress routes revert to Next.js, profile routes remain on FastAPI

### Requirement: Admin Route Guard

The system SHALL verify admin role from JWT claims for admin-only routes.

#### Scenario: Admin access

- GIVEN a request with admin JWT to `/api/admin/achievements`
- WHEN the route is handled by FastAPI
- THEN the response returns admin data with HTTP 200

#### Scenario: Non-admin blocked

- GIVEN a request with non-admin JWT to `/api/admin/achievements`
- WHEN the route is handled by FastAPI
- THEN the response is HTTP 403
