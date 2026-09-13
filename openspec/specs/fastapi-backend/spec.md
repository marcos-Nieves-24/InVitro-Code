# FastAPI Backend Specification

## Purpose

FastAPI service providing Python-native API endpoints for the invitro-code platform, replacing Next.js API routes for data operations with per-user RLS enforcement.

## Requirements

### Requirement: Service Scaffolding

The system SHALL provide a FastAPI application with structured project layout under `backend/`.

#### Scenario: App initialization

- GIVEN the FastAPI app is configured with `lifespan` handler
- WHEN the service starts
- THEN it initializes the database connection pool
- AND registers all routers

#### Scenario: CORS configuration

- GIVEN CORS middleware is configured
- WHEN a cross-origin request arrives from `localhost:3000`
- THEN the response includes appropriate `Access-Control-Allow-*` headers

### Requirement: Health Check

The system SHALL expose a `GET /health` endpoint returning 200 when operational.

#### Scenario: Service is healthy

- GIVEN the database pool is connected
- WHEN `GET /health` is called
- THEN response is `{"status": "ok"}` with HTTP 200

#### Scenario: Service is degraded

- GIVEN the database pool is unreachable
- WHEN `GET /health` is called
- THEN response is `{"status": "degraded"}` with HTTP 503

### Requirement: Docker Setup

The system SHALL build from a multi-stage Dockerfile running as non-root with no exposed ports.

#### Scenario: Container runs as non-root

- GIVEN the Docker image is built
- WHEN the container starts
- THEN process runs as user `appuser` (non-root)
- AND no ports are exposed in `docker-compose.yml`

### Requirement: Environment Configuration

The system SHALL read all configuration from environment variables with no hardcoded secrets.

#### Scenario: Missing required env var

- GIVEN `DATABASE_URL` is not set
- WHEN the service starts
- THEN it exits with a clear error message naming the missing variable

### Requirement: Database Connection Pool

The system SHALL maintain an async connection pool using `asyncpg` with configurable size.

#### Scenario: Pool exhaustion

- GIVEN all pool connections are in use
- WHEN a new request arrives
- THEN it waits up to the configured timeout before returning 503
