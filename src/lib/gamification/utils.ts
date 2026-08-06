export function calcXpForLesson(moduleSlug: string, lessonSlug: string): number {
  // Base XP per lesson
  const baseXp = 25;

  // Module difficulty multipliers (1.0 = standard)
  const moduleMultipliers: Record<string, number> = {
    "ia": 1.0,
    "python": 1.0,
    "estadistica": 1.0,
    "machine-learning": 1.2,
    "etica": 1.0,
  };
  const multiplier = moduleMultipliers[moduleSlug] || 1.0;

  // Dynamic factors based on lesson complexity
  let complexityFactor = 1.0;
  if (lessonSlug.includes("avanzado") || lessonSlug.includes("avanzada")) {
    complexityFactor = 1.5;
  }

  return Math.round(baseXp * multiplier * complexityFactor);
}

export function calcLevel(totalXp: number): { level: number; nextLevelXp: number; progressToNext: number } {
  const xpPerLevel = 100;
  const level = Math.floor(totalXp / xpPerLevel);
  const nextLevelXp = (level + 1) * xpPerLevel;
  const progressToNext = totalXp % xpPerLevel;

  return { level, nextLevelXp, progressToNext };
}

/** Rank name for a level (D10: shared between dashboard and labs). */
export function rankTitle(level: number): string {
  if (level < 2) return "Novato";
  if (level < 5) return "Analista";
  if (level < 8) return "Investigador Jr.";
  if (level < 12) return "Investigador";
  if (level < 20) return "Especialista";
  return "ML Engineer";
}
