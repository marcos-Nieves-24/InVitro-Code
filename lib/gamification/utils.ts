export function calcXpForLesson(moduleSlug: string, lessonSlug: string): number {
  // Base XP per lesson
  const baseXp = 25;

  // Module modifiers (can be expanded later)
  const moduleMultipliers: Record<string, number> = {
    "hola-mundo": 1.0,
    "variables": 1.0,
    "bucles": 1.5,
    "condicionales": 1.0,
    "funciones": 1.5,
  }
  const multiplier = moduleMultipliers[moduleSlug] || 1.0;

  // Dynamic factors based on lesson complexity
  let complexityFactor = 1.0;
  if (lessonSlug.includes("avanzado") || lessonSlug.includes("complicado")) {
    complexityFactor = 1.5;
  } else if (lessonSlug.includes("basico") || lessonSlug.includes("simple")) {
    complexityFactor = 0.8;
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
