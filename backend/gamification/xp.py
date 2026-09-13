"""XP calculation — port of src/lib/gamification/utils.ts."""


def calc_xp_for_lesson(module_slug: str, lesson_slug: str) -> int:
    """Calculate XP earned for completing a lesson.

    Formula matches the TypeScript implementation exactly:
    - Base XP: 25
    - Module multiplier: machine-learning=1.2, others=1.0
    - Complexity factor: 1.5 if lesson contains 'avanzado'/'avanzada', else 1.0
    """
    base_xp = 25

    module_multipliers = {
        "ia": 1.0,
        "python": 1.0,
        "estadistica": 1.0,
        "machine-learning": 1.2,
    }
    multiplier = module_multipliers.get(module_slug, 1.0)

    complexity_factor = 1.5 if ("avanzado" in lesson_slug or "avanzada" in lesson_slug) else 1.0

    return round(base_xp * multiplier * complexity_factor)
