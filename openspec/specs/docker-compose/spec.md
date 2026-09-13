# Docker Compose Specification (Modified)

## Purpose

Add FastAPI service to Docker Compose with internal-only networking, health checks, and resource limits.

## MODIFIED Requirements

### Requirement: FastAPI Service

The system SHALL add a `fastapi` service to `docker-compose.yml` built from `backend/Dockerfile`.

(Previously: docker-compose only contained Supabase-related services)

#### Scenario: Service starts

- GIVEN `docker-compose.yml` includes the FastAPI service
- WHEN `docker compose up fastapi` is run
- THEN the FastAPI service starts and passes health check

#### Scenario: Service depends on database

- GIVEN the FastAPI service has a `depends_on` for the database
- WHEN `docker compose up` is run
- THEN FastAPI starts after the database is healthy

### Requirement: Internal Network

The system SHALL place FastAPI on an internal network with no exposed ports.

(Previously: no internal network configuration existed)

#### Scenario: No external port exposure

- GIVEN the FastAPI service is configured
- WHEN `docker-compose.yml` is inspected
- THEN no `ports` mapping exists for the FastAPI service

#### Scenario: Internal DNS resolution

- GIVEN both Next.js and FastAPI are on the internal network
- WHEN Next.js calls FastAPI by service name
- THEN the DNS resolves and the connection succeeds

### Requirement: Resource Limits

The system SHALL set CPU and memory limits for the FastAPI container.

#### Scenario: Memory limit enforced

- GIVEN FastAPI has `mem_limit: 512m`
- WHEN the container exceeds 512MB memory
- THEN the container is OOM-killed by Docker

#### Scenario: CPU limit enforced

- GIVEN FastAPI has `cpus: 1.0`
- WHEN the container attempts to use more than 1 CPU
- THEN CPU usage is throttled

### Requirement: Health Check Configuration

The system SHALL configure Docker health check using the `/health` endpoint.

#### Scenario: Healthy service

- GIVEN FastAPI is running and `/health` returns 200
- WHEN Docker health check runs
- THEN container status is `healthy`

#### Scenario: Unhealthy service

- GIVEN FastAPI is running but `/health` returns 503
- WHEN Docker health check fails 3 consecutive times
- THEN container status is `unhealthy`
