// Domain — daily goal + nudge (retención PR-2)
// Pure domain, no infrastructure imports. Tested via vitest in node env.

export const DAILY_GOAL_DEFAULT = 50;
export const DAILY_GOAL_MIN = 10;
export const DAILY_GOAL_MAX = 200;
export const DAILY_GOAL_STEP = 10;

/**
 * Coerce unknown to number, clamp MIN..MAX, snap to STEP (round), fallback DEFAULT if NaN.
 */
export function clampDailyGoal(n: unknown): number {
  let num: number;
  if (typeof n === "number") {
    num = n;
  } else if (typeof n === "string") {
    // Allow numeric strings like "80" (trimmed)
    const trimmed = n.trim();
    if (trimmed === "") return DAILY_GOAL_DEFAULT;
    num = Number(trimmed);
  } else {
    num = Number(n);
  }

  if (!Number.isFinite(num)) return DAILY_GOAL_DEFAULT;

  // Clamp to MIN..MAX first
  const clamped = Math.min(DAILY_GOAL_MAX, Math.max(DAILY_GOAL_MIN, num));
  // Snap to nearest STEP
  const snapped = Math.round(clamped / DAILY_GOAL_STEP) * DAILY_GOAL_STEP;
  // Ensure still within bounds after rounding (e.g. 195 -> 200, 15 -> 20 etc.)
  return Math.min(DAILY_GOAL_MAX, Math.max(DAILY_GOAL_MIN, snapped));
}

export function dailyGoalProgress(
  todayXp: number,
  goal: number,
): { percent: number; remaining: number; achieved: boolean } {
  const safeGoal = goal > 0 ? goal : DAILY_GOAL_DEFAULT;
  const safeXp = Number.isFinite(todayXp) ? Math.max(0, todayXp) : 0;
  const percent = Math.min(100, Math.round((safeXp / safeGoal) * 100));
  const remaining = Math.max(0, safeGoal - safeXp);
  const achieved = safeXp >= safeGoal;
  return { percent, remaining, achieved };
}

/**
 * Pure nudge gate: true si xp < goal y (lastNudgeAt === null o lastNudgeAt.slice(0,10) !== todayYmd)
 * todayYmd es YYYY-MM-DD UTC inyectado para testabilidad.
 */
export function shouldNudge(
  todayXp: number,
  goal: number,
  lastNudgeAt: string | null,
  todayYmd: string,
): boolean {
  const safeXp = Number.isFinite(todayXp) ? todayXp : 0;
  const safeGoal = Number.isFinite(goal) && goal > 0 ? goal : DAILY_GOAL_DEFAULT;
  if (safeXp >= safeGoal) return false;
  if (lastNudgeAt === null || lastNudgeAt === undefined) return true;
  // Compare first 10 chars (YYYY-MM-DD) - works for both DATE and TIMESTAMPTZ ISO strings
  const lastYmd = String(lastNudgeAt).slice(0, 10);
  return lastYmd !== todayYmd;
}
