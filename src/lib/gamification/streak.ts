import type { SupabaseClient } from "@supabase/supabase-js";
import {
  canAutoFreeze as domainCanAutoFreeze,
  applyAutoFreeze as domainApplyAutoFreeze,
  dateMinusDays,
} from "@/domain/streak";

/** UTC calendar day as YYYY-MM-DD. Streaks are day-granular, so UTC avoids DST drift. */
export function utcDay(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  freezes_available: number;
  last_freeze_used: string | null;
}

// Re-export helpers for callers that need freeze logic without importing domain directly
export { canAutoFreeze, applyAutoFreeze } from "@/domain/streak";

function normalizeFreeze(existing: StreakRow | null): StreakRow & { freezes_available: number; last_freeze_used: string | null } {
  return {
    current_streak: existing?.current_streak ?? 0,
    longest_streak: existing?.longest_streak ?? 0,
    last_active_date: existing?.last_active_date ?? null,
    freezes_available: (existing as unknown as { freezes_available?: number })?.freezes_available ?? 1,
    last_freeze_used: (existing as unknown as { last_freeze_used?: string | null })?.last_freeze_used ?? null,
  };
}

/**
 * Advance streak for a user. Shared by /api/progress and /api/lab-progress.
 * - Only a completion counts as activity (completed === true).
 * - Same UTC day replay is idempotent (no increment, no freeze consume).
 * - Yesterday → +1, otherwise → 1, except gap exactly 1 with freeze → auto-freeze preserves streak.
 * Returns the computed streak values without writing to DB (caller persists).
 */
export function computeStreak(
  existing: StreakRow | null,
  completed: boolean,
  todayOverride?: string,
): StreakRow {
  const normalized = normalizeFreeze(existing);
  const previousStreak = normalized.current_streak;
  const lastActive = normalized.last_active_date;

  if (!completed) {
    return {
      current_streak: previousStreak,
      longest_streak: normalized.longest_streak,
      last_active_date: lastActive,
      freezes_available: normalized.freezes_available,
      last_freeze_used: normalized.last_freeze_used,
    };
  }

  const today = todayOverride ?? utcDay();
  const yesterday = dateMinusDays(today, 1);
  const twoDaysAgo = dateMinusDays(today, 2);

  let next: StreakRow;

  if (lastActive === today) {
    // Idempotent — same day, keep streak, no freeze change
    next = {
      current_streak: Math.max(previousStreak, 1),
      longest_streak: Math.max(normalized.longest_streak, Math.max(previousStreak, 1)),
      last_active_date: today,
      freezes_available: normalized.freezes_available,
      last_freeze_used: normalized.last_freeze_used,
    };
  } else if (lastActive === yesterday) {
    const current = previousStreak + 1;
    const longest = Math.max(normalized.longest_streak, current);
    next = {
      current_streak: current,
      longest_streak: longest,
      last_active_date: today,
      freezes_available: normalized.freezes_available,
      last_freeze_used: normalized.last_freeze_used,
    };
  } else if (domainCanAutoFreeze(normalized, today, yesterday, twoDaysAgo)) {
    next = domainApplyAutoFreeze(normalized, today);
  } else if (existing === null && lastActive === null) {
    // New user — first completion
    const current = 1;
    next = {
      current_streak: current,
      longest_streak: Math.max(normalized.longest_streak, current),
      last_active_date: today,
      freezes_available: normalized.freezes_available,
      last_freeze_used: normalized.last_freeze_used,
    };
  } else {
    // Gap 2+ or first day after no freeze — reset
    const current = 1;
    next = {
      current_streak: current,
      longest_streak: Math.max(normalized.longest_streak, current),
      last_active_date: today,
      freezes_available: normalized.freezes_available,
      last_freeze_used: normalized.last_freeze_used,
    };
  }

  return next;
}

/**
 * Persist streak advance. Best-effort, never throws.
 * Reads current row, computes next, upserts.
 */
export async function advanceStreak(
  userId: string,
  supabase: SupabaseClient,
  completed: boolean,
  todayOverride?: string,
): Promise<StreakRow | null> {
  try {
    const { data: existing } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date, freezes_available, last_freeze_used")
      .eq("user_id", userId)
      .maybeSingle();

    const next = computeStreak((existing as StreakRow | null) ?? null, completed, todayOverride);

    const { data: row, error } = await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: next.current_streak,
          longest_streak: next.longest_streak,
          last_active_date: next.last_active_date,
          freezes_available: next.freezes_available,
          last_freeze_used: next.last_freeze_used,
        },
        { onConflict: "user_id" },
      )
      .select("current_streak, longest_streak, last_active_date, freezes_available, last_freeze_used")
      .single();

    if (error) {
      console.error("[streak] upsert failed", error.message);
      return next;
    }
    return (row as StreakRow) ?? next;
  } catch (e) {
    console.error("[streak] advance exception", e);
    return null;
  }
}
