"""Feature flags for incremental route migration.

Controls which backend handles each route group during the
Next.js → FastAPI migration. Set to NEXTJS to keep the original
Next.js route, or FASTAPI to proxy through the FastAPI backend.

Usage:
    from app.feature_flags import ROUTE_FLAGS, RouteBackend
    if ROUTE_FLAGS["profile"] == RouteBackend.FASTAPI:
        # proxy to FastAPI
"""

from enum import Enum


class RouteBackend(str, Enum):
    NEXTJS = "nextjs"
    FASTAPI = "fastapi"


# Feature flags for incremental migration.
# Flip individual entries to switch route groups between backends.
ROUTE_FLAGS: dict[str, RouteBackend] = {
    # Already migrated to FastAPI
    "profile": RouteBackend.FASTAPI,
    "progress": RouteBackend.FASTAPI,
    "achievements": RouteBackend.FASTAPI,
    "leaderboard": RouteBackend.FASTAPI,
    "admin": RouteBackend.FASTAPI,
    # Still on Next.js
    "webhooks": RouteBackend.NEXTJS,
    "notebook": RouteBackend.NEXTJS,
    "rscript": RouteBackend.NEXTJS,
}


def is_migrated(route: str) -> bool:
    """Check if a route group is currently served by FastAPI."""
    return ROUTE_FLAGS.get(route, RouteBackend.NEXTJS) == RouteBackend.FASTAPI
