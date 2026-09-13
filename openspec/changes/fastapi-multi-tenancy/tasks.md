# Tasks: FastAPI Multi-Tenancy

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1500-1900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 → PR 5 → PR 6 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | FastAPI scaffolding + Docker + JWT auth | PR 1 | `cd backend && python -m pytest tests/test_auth.py` | `GET /health` returns 200 | Remove `backend/` directory |
| 2 | RLS enforcement + Profile route | PR 2 | `cd backend && python -m pytest tests/test_rls.py` | `GET /api/profile` with valid JWT | Remove `rls.py`, `profile.py` |
| 3 | Progress + Achievements + Leaderboard | PR 3 | `cd backend && python -m pytest tests/test_routes.py` | `POST /api/progress` with valid JWT | Remove route files |
| 4 | Admin routes + Gamification port | PR 4 | `cd backend && python -m pytest tests/test_admin.py` | `GET /api/admin/users` with admin JWT | Remove `admin.py`, `gamification.py` |
| 5 | Frontend adaptation + WebSocket | PR 5 | `npm run build && npm run type-check` | Proxy request through Next.js | Restore original Next.js API routes |
| 6 | Testing + Cleanup | PR 6 | `cd backend && python -m pytest` | Full test suite passes | N/A |

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Create `backend/app/__init__.py` with empty package init
- [x] 1.2 Create `backend/app/config.py` with `Settings` class using pydantic-settings for DATABASE_URL, CLERK_ISSUER, JWKS_URL, pool settings
- [x] 1.3 Create `backend/app/db.py` with asyncpg `create_pool(min=2, max=10)`, `set_config` helper, connection lifecycle
- [x] 1.4 Create `backend/app/auth.py` with JWKS fetch/cache (10-min TTL), JWT validation, `get_current_user` dependency
- [x] 1.5 Create `backend/app/models.py` with Pydantic models: UserContext, ProgressRequest, ProgressResponse, AchievementState
- [x] 1.6 Create `backend/app/main.py` with FastAPI app, lifespan, CORS, router registration, `/health` endpoint
- [x] 1.7 Create `backend/requirements.txt` with fastapi, uvicorn, asyncpg, pyjwt, httpx, pydantic-settings
- [x] 1.8 Create `backend/Dockerfile` with multi-stage build, non-root user, no exposed ports
- [x] 1.9 Modify `docker-compose.yml` to add fastapi service with internal network and health check

## Phase 2: Core Implementation

- [x] 2.1 Create `backend/app/routers/__init__.py`
- [x] 2.2 Create `backend/app/routers/profile.py` with GET `/api/v1/profile` reading profile via RLS
- [x] 2.3 Create `backend/app/routers/profile.py` with PUT `/api/v1/profile` updating profile
- [x] 2.4 Create `backend/app/routers/progress.py` with POST `/api/progress` — port of `src/app/api/progress/route.ts`
- [x] 2.5 Create `backend/app/routers/achievements.py` with GET `/api/achievements` evaluating and returning state
- [x] 2.6 Create `backend/app/routers/leaderboard.py` with GET `/api/leaderboard` calling DB functions

## Phase 3: Integration / Wiring

- [x] 3.1 Create `backend/app/routers/admin.py` with GET `/api/admin/users` and admin role guard
- [x] 3.2 Create `backend/app/gamification.py` with Python ports: `calc_xp_for_lesson`, `calc_level`, `rank_title`
- [x] 3.3 Add to `backend/app/gamification.py`: `evaluate_achievements`, `get_weekly_xp`, `get_total_xp`
- [ ] 3.4 Create `src/lib/api-client.ts` fetch wrapper forwarding Clerk JWT to FastAPI
- [ ] 3.5 Modify `src/app/api/progress/route.ts` with `MIGRATE_PROGRESS` feature-flag proxy
- [x] 3.6 Modify `supabase-migration.sql` to add `modules` table
- [ ] 3.7 Modify `src/lib/gamification/achievements.ts` to query `modules` table instead of filesystem

## Phase 4: WebSocket

- [ ] 4.1 Create `backend/app/routers/ws.py` with WebSocket endpoint and first-message JWT validation
- [ ] 4.2 Create connection manager class for tracking active WebSocket connections

## Phase 5: Testing

- [x] 5.1 Create `backend/tests/__init__.py` and `backend/tests/conftest.py` with async test fixtures
- [x] 5.2 Create `backend/tests/test_auth.py` — JWT validation: valid, expired, invalid issuer, missing token
- [x] 5.3 Create `backend/tests/test_rls.py` — RLS isolation: cross-user data access returns empty
- [x] 5.3b Create `backend/tests/test_profile.py` — Profile route tests: GET returns own profile, PUT updates allowed fields only
- [x] 5.4 Create `backend/tests/test_progress.py` — Progress route tests (10 tests: success, missing fields, RLS context, streak same day/next day/gap reset, ML module XP, avanzado XP, reflection success/missing fields)
- [x] 5.5 Create `backend/tests/test_achievements.py` — Achievement + Leaderboard route tests (7 tests: achievements success/RLS/weekly XP/unlocked, leaderboard success/not ranked/RLS)

## Phase 6: Cleanup / Documentation

- [x] 6.1 Update `docker-compose.yml` with production-ready health check config
- [ ] 6.2 Verify `npm run build` and `npm run type-check` pass after frontend changes
- [ ] 6.3 Run full backend test suite: `cd backend && python -m pytest`
