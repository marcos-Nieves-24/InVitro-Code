export function calcXpForLesson(moduleSlug: string, lessonSlug: string): number {
  // Base XP per lesson
  const baseXp = 25;

  // Module difficulty multipliers (1.0 = standard)
  const moduleMultipliers: Record<string, number> = {
    "ia": 1.0,
    "python": 1.0,
    "estadistica": 1.0,
    "machine-learning": 1.2,
  };
  const multiplier = moduleMultipliers[moduleSlug] || 1.0;

  // Dynamic factors based on lesson complexity
  let complexityFactor = 1.0;
  if (lessonSlug.includes("avanzado") || lessonSlug.includes("avanzada")) {
    complexityFactor = 1.5;
  }

  return Math.round(baseXp * multiplier * complexityFactor);
}

/** XP required to advance one level. Single source of truth for level math. */
export const XP_PER_LEVEL = 100;

export function calcLevel(totalXp: number): { level: number; nextLevelXp: number; progressToNext: number } {
  const level = Math.floor(totalXp / XP_PER_LEVEL);
  const nextLevelXp = (level + 1) * XP_PER_LEVEL;
  const progressToNext = totalXp % XP_PER_LEVEL;

  return { level, nextLevelXp, progressToNext };
}

/**
 * Canonical rank ladder, keyed by lifetime XP and ordered ascending.
 * This is the single source of truth for rank names and thresholds.
 * `rankTitle` derives from it; the /niveles roadmap reads it directly, so
 * the HUD and the roadmap can never disagree on a rank name again.
 * Presentation data (icon, description, skills) stays in the consuming page.
 */
export const RANK_THRESHOLDS: readonly { name: string; xp: number }[] = [
  { name: "Novato", xp: 0 },
  { name: "Analista", xp: 200 },
  { name: "Investigador Jr.", xp: 500 },
  { name: "Investigador", xp: 1000 },
  { name: "Especialista", xp: 2000 },
  { name: "ML Engineer", xp: 3500 },
] as const;

/** Rank index for a lifetime XP total. */
export function rankIndexForXp(totalXp: number): number {
  const safeXp = Number.isFinite(totalXp) ? totalXp : 0;
  let index = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (safeXp >= RANK_THRESHOLDS[i].xp) index = i;
  }
  return index;
}

/** Rank name for a lifetime XP total. */
export function rankNameForXp(totalXp: number): string {
  return RANK_THRESHOLDS[rankIndexForXp(totalXp)].name;
}

export type ScientistVariant = 'f' | 'm' | 'x';

export function getScientistVariant(gender: string | null | undefined): ScientistVariant {
  if (gender === 'm') return 'm';
  if (gender === 'x') return 'f';
  if (gender === 'f') return 'f';
  return 'f';
}

/**
 * Rank name for a level (D10: shared between dashboard and labs).
 *
 * Kept as a level-based signature because every caller already holds a level,
 * but the thresholds are NOT duplicated: the level is converted back to its
 * XP equivalent and resolved through the canonical `RANK_THRESHOLDS` ladder.
 * That keeps `rankTitle(calcLevel(xp).level)` and `rankNameForXp(xp)` in
 * agreement by construction, instead of by two hand-maintained tables.
 */
export function rankTitle(level: number): string {
  const safeLevel = Number.isFinite(level) ? Math.max(0, level) : 0;
  return rankNameForXp(safeLevel * XP_PER_LEVEL);
}
