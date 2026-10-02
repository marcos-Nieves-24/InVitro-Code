import type { SupabaseClient } from "@supabase/supabase-js";

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
}

/**
 * Advance streak for a user. Shared by /api/progress and /api/lab-progress.
 * - Only a completion counts as activity (completed === true).
 * - Same UTC day replay is idempotent (no increment).
 * - Yesterday → +1, otherwise → 1.
 * Returns the computed streak values without writing to DB (caller persists).
 */
export function computeStreak(
  existing: StreakRow | null,
  completed: boolean,
): StreakRow {
  const previousStreak = existing?.current_streak ?? 0;
  const lastActive = existing?.last_active_date ?? null;
  if (!completed) {
    return {
      current_streak: previousStreak,
      longest_streak: existing?.longest_streak ?? 0,
      last_active_date: lastActive,
    };
  }
  const today = utcDay();
  const yesterday = utcDay(-1);
  let current = previousStreak;
  if (lastActive === today) current = Math.max(previousStreak, 1);
  else if (lastActive === yesterday) current = previousStreak + 1;
  else current = 1;

  const longest = Math.max(existing?.longest_streak ?? 0, current);
  return {
    current_streak: current,
    longest_streak: longest,
    last_active_date: today,
  };
}

/**
 * Persist streak advance. Best-effort, never throws.
 * Reads current row, computes next, upserts.
 */
export async function advanceStreak(
  userId: string,
  supabase: SupabaseClient,
  completed: boolean,
): Promise<StreakRow | null> {
  try {
    const { data: existing } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date")
      .eq("user_id", userId)
      .maybeSingle();

    const next = computeStreak((existing as StreakRow | null) ?? null, completed);

    const { data: row, error } = await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: next.current_streak,
          longest_streak: next.longest_streak,
          last_active_date: next.last_active_date,
        },
        { onConflict: "user_id" },
      )
      .select("current_streak, longest_streak, last_active_date")
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
