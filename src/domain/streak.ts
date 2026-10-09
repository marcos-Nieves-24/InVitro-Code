// Domain — streak freeze (retención automática)
// Pure domain, no infrastructure imports. Tested via vitest in node env.

export interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface FreezeState {
  freezes_available: number;
  last_freeze_used: string | null;
}

export type StreakWithFreeze = StreakRow & FreezeState;

/**
 * Returns UTC YYYY-MM-DD for a base date string plus offsetDays.
 * Pure helper — deterministic for tests. Base is ISO YYYY-MM-DD.
 */
export function dateMinusDays(baseYmd: string, days: number): string {
  const d = new Date(`${baseYmd}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * UTC calendar day as YYYY-MM-DD. Streaks are day-granular, so UTC avoids DST drift.
 * Re-exported here for domain convenience; infra may reexport from lib/gamification.
 */
export function utcDay(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Whether auto-freeze can trigger.
 * Pure: true only if gap is exactly 1 day (last_active === twoDaysAgo, not today/yesterday)
 * and a freeze is available.
 */
export function canAutoFreeze(
  row: StreakRow & FreezeState,
  today: string,
  yesterday: string,
  twoDaysAgo: string,
): boolean {
  if (row.freezes_available <= 0) return false;
  const last = row.last_active_date;
  if (last === null) return false;
  if (last === today) return false;
  if (last === yesterday) return false;
  return last === twoDaysAgo;
}

/**
 * Apply auto-freeze: preserves streak continuity and consumes one freeze.
 * Caller must have verified canAutoFreeze is true.
 * Returns new row with incremented streak, decremented freeze, and today as last_active.
 */
export function applyAutoFreeze(
  row: StreakRow & FreezeState,
  today: string,
): StreakWithFreeze {
  const prev = row.current_streak ?? 0;
  // Continuity: treat today as next day after twoDaysAgo → increment. Fallback to 1 if no streak yet.
  const current = prev > 0 ? prev + 1 : 1;
  const longest = Math.max(row.longest_streak ?? 0, current);
  return {
    current_streak: current,
    longest_streak: longest,
    last_active_date: today,
    freezes_available: Math.max(0, (row.freezes_available ?? 1) - 1),
    last_freeze_used: today,
  };
}

/**
 * Whether weekly recharge should run.
 * True only on Monday (JS getUTCDay === 1) and when freezes are depleted.
 */
export function shouldRechargeWeekly(
  freezesAvailable: number,
  todayDayOfWeek: number,
): boolean {
  return todayDayOfWeek === 1 && freezesAvailable === 0;
}
