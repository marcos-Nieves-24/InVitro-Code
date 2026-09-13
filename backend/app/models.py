from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserContext(BaseModel):
    """Authenticated user context extracted from JWT."""

    user_id: str
    role: str = "user"


class ProfileResponse(BaseModel):
    """Response model for user profile data."""

    id: str
    email: Optional[str] = None
    username: Optional[str] = None
    role: str = "user"
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    theme: str = "system"
    notification_prefs: dict = {"email": True, "streak": True}
    created_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    """Request model for profile update — only mutable fields."""

    username: Optional[str] = None
    bio: Optional[str] = None
    theme: Optional[str] = None
    notification_prefs: Optional[dict] = None


class ProgressRequest(BaseModel):
    """Request model for recording lesson progress."""

    module_slug: str
    lesson_slug: str


class ProgressResponse(BaseModel):
    """Response model after recording progress."""

    success: bool
    progress: dict
    streak: dict
    xp_earned: int


class AchievementState(BaseModel):
    """Single achievement with unlock status."""

    id: str
    slug: str
    title: str
    description: str
    icon: str
    category: str
    xp_reward: int
    unlocked: bool
    unlocked_at: Optional[str] = None


class LeaderboardEntry(BaseModel):
    """Single leaderboard row."""

    user_id: str
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    weekly_xp: int = 0
    total_xp: int = 0
    rank: int = 0
