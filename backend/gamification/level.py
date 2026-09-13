"""Level and rank calculation — port of src/lib/gamification/utils.ts."""

from dataclasses import dataclass


@dataclass
class LevelInfo:
    level: int
    next_level_xp: int
    progress_to_next: int


def calc_level(total_xp: int) -> LevelInfo:
    """Calculate level from total XP.

    100 XP per level. Level = floor(total_xp / 100).
    """
    xp_per_level = 100
    level = total_xp // xp_per_level
    next_level_xp = (level + 1) * xp_per_level
    progress_to_next = total_xp % xp_per_level
    return LevelInfo(level=level, next_level_xp=next_level_xp, progress_to_next=progress_to_next)


def rank_title(level: int) -> str:
    """Rank name for a level — matches TypeScript rankTitle() exactly."""
    if level < 2:
        return "Novato"
    if level < 5:
        return "Analista"
    if level < 8:
        return "Investigador Jr."
    if level < 12:
        return "Investigador"
    if level < 20:
        return "Especialista"
    return "ML Engineer"
