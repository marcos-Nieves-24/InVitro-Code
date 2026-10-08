// Infrastructure adapter — streak persistence via Supabase.
// Thin adapter over createAdminClient; depends on application port and domain types.

import type { StreakRepository, StreakWithFreezeRow } from "@/application/ports/StreakRepository";
import { createAdminClient } from "@/lib/supabase/admin";

export class SupabaseStreakRepository implements StreakRepository {
  async get(userId: string): Promise<StreakWithFreezeRow | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date, freezes_available, last_freeze_used")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[SupabaseStreakRepository] get failed", error.message);
      return null;
    }
    if (!data) return null;
    return data as StreakWithFreezeRow;
  }

  async save(userId: string, row: StreakWithFreezeRow): Promise<StreakWithFreezeRow> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: row.current_streak,
          longest_streak: row.longest_streak,
          last_active_date: row.last_active_date,
          freezes_available: row.freezes_available,
          last_freeze_used: row.last_freeze_used,
        },
        { onConflict: "user_id" },
      )
      .select("current_streak, longest_streak, last_active_date, freezes_available, last_freeze_used")
      .single();

    if (error) {
      console.error("[SupabaseStreakRepository] save failed", error.message);
      return row;
    }
    return (data as StreakWithFreezeRow) ?? row;
  }
}
