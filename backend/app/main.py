from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from db.pool import init_pool, close_pool, get_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle - initialize and cleanup resources."""
    # Startup: initialize database pool
    pool = await init_pool()
    app.state.db_pool = pool
    yield
    # Shutdown: close database pool
    await close_pool()
    app.state.db_pool = None


app = FastAPI(
    title="InVitro Code API",
    description="FastAPI backend for InVitro Code learning platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint.

    Returns 200 if the service is operational, 503 if degraded.
    """
    pool = get_pool()
    if pool is None:
        return {"status": "degraded"}

    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ok"}
    except Exception:
        return {"status": "degraded"}


# Register routers
from app.routers import profile, progress, achievements, leaderboard, admin

app.include_router(profile.router)
app.include_router(progress.router)
app.include_router(achievements.router)
app.include_router(leaderboard.router)
app.include_router(admin.router)
