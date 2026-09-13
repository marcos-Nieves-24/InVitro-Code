# InVitro Code — FastAPI Backend

Python backend for the InVitro Code learning platform. Provides REST API endpoints for user profiles, lesson progress, achievements, leaderboard, and admin operations. Uses PostgreSQL Row-Level Security (RLS) for multi-tenant data isolation.

## Prerequisites

- Python 3.12+
- PostgreSQL 15+ (or Supabase project)
- Docker & Docker Compose (optional, for containerized development)

## Environment Variables

Create a `.env` file in the project root (or use `.env.local` with Docker Compose):

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (`postgresql+asyncpg://user:pass@host:5432/db`) |
| `CLERK_JWKS_URL` | Yes | — | Clerk JWKS endpoint (`https://your-app.clerk.accounts.dev/.well-known/jwks.json`) |
| `CLERK_ISSUER` | Yes | — | Clerk issuer URL (`https://your-app.clerk.accounts.dev`) |
| `CORS_ORIGINS` | No | `["http://localhost:3000"]` | Allowed CORS origins (JSON array) |
| `ENVIRONMENT` | No | `development` | Runtime environment name |
| `DB_POOL_MIN` | No | `2` | Minimum database pool connections |
| `DB_POOL_MAX` | No | `10` | Maximum database pool connections |

## Local Development

### With Docker Compose (recommended)

From the project root:

```bash
# Start both frontend and backend
docker compose up

# Backend available at http://localhost:8000 (internal network)
# Frontend at http://localhost:3000
```

### Without Docker

```bash
# Create virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Running Tests

```bash
cd backend

# Activate virtual environment
source .venv/bin/activate

# Run all tests
python -m pytest -v

# Run specific test file
python -m pytest tests/test_profile.py -v

# Run with coverage
python -m pytest --cov=app --cov=gamification -v
```

## API Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health check (checks DB connectivity) |

### Profile

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/profile` | JWT | Get current user's profile (RLS-scoped) |
| `PUT` | `/api/v1/profile` | JWT | Update profile (allowlisted fields only) |

### Progress

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/progress` | JWT | Record lesson completion (XP + streak logic) |
| `POST` | `/api/v1/progress/reflection` | JWT | Record reflection completion |

### Achievements

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/achievements` | JWT | Get user's achievements + weekly XP |

### Leaderboard

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/leaderboard` | JWT | Top 50 users + current user's rank |

### Admin

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/users` | JWT + Admin | List all users with enriched data |
| `GET` | `/api/v1/admin/stats` | JWT + Admin | Aggregate platform statistics |

### WebSocket

| Protocol | Path | Auth | Description |
|---|---|---|---|
| `WS` | `/ws` | JWT (first message) | Real-time notifications |

**WebSocket connection flow:**

1. Connect to `ws://localhost:8000/ws`
2. Send JWT token as the first message: `{"token": "<clerk_jwt>"}`
3. Receive auth confirmation or `4001` close code on failure
4. Subsequent messages are broadcast/received via the connection manager

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app, lifespan, CORS, router registration
│   ├── config.py          # Settings via pydantic-settings
│   ├── security.py        # JWKS fetch/cache, JWT validation
│   ├── deps.py            # FastAPI dependencies (get_current_user, get_db)
│   ├── models.py          # Pydantic response/request models
│   ├── feature_flags.py   # Route migration feature flags
│   ├── ws.py              # WebSocket endpoint + ConnectionManager
│   └── routers/
│       ├── profile.py     # GET/PUT /api/v1/profile
│       ├── progress.py    # POST /api/v1/progress
│       ├── achievements.py # GET /api/v1/achievements
│       ├── leaderboard.py # GET /api/v1/leaderboard
│       └── admin.py       # GET /api/v1/admin/*
├── db/
│   ├── pool.py            # asyncpg connection pool lifecycle
│   └── rls.py             # RLS context helpers (set_clerk_jwt)
├── gamification/
│   ├── xp.py              # XP calculation logic
│   ├── level.py           # Level + rank title calculation
│   ├── achievements.py    # Achievement evaluation
│   └── user.py            # Total XP + level info queries
├── tests/
│   ├── conftest.py        # Shared fixtures (mock pool, auth, RLS)
│   ├── test_security.py   # JWT validation tests
│   ├── test_rls.py        # RLS enforcement tests
│   ├── test_profile.py    # Profile endpoint tests
│   ├── test_progress.py   # Progress endpoint tests
│   ├── test_achievements.py # Achievements + leaderboard tests
│   ├── test_admin.py      # Admin endpoint tests
│   └── test_ws.py         # WebSocket tests
├── Dockerfile             # Multi-stage production build
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## Security Model

- **Authentication**: Clerk JWT tokens validated against JWKS endpoint
- **Authorization**: PostgreSQL RLS policies enforce per-user data isolation
- **Admin guard**: Admin-only routes check `user_metadata.role === 'admin'`
- **RLS context**: `set_config('request.jwt_claims', ...)` set per transaction via `db/rls.py`

## Frontend Integration

The Next.js frontend communicates with this backend via the `apiFetch` helper in `src/lib/api-client.ts`:

```typescript
import { apiFetch } from "@/lib/api-client";

// Server Component or Server Action
const profile = await apiFetch("/api/v1/profile");
```

Set `NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000` in your frontend `.env.local`.
