import type { SupabaseClient } from "@supabase/supabase-js";
import { calcLevel } from "./utils";

/**
 * User helpers (real-data-replace-mocks, REQ-UI-01, D9).
 * Single source of truth for total XP / level / display name across pages.
 */

export interface ProfileLike {
  username?: string | null;
  email?: string | null;
}

/**
 * Real total XP: progress.xp_earned (completed) + reflection_completions.xp_earned.
 * Rows with `completed_at` NULL are excluded (REQ-UP-05). Never throws.
 */
export async function getTotalXp(
  userId: string,
  supabase: SupabaseClient,
): Promise<number> {
  try {
    const [progressRes, reflectionsRes] = await Promise.all([
      supabase
        .from("progress")
        .select("xp_earned")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null),
      supabase
        .from("reflection_completions")
        .select("xp_earned")
        .eq("user_id", userId)
        .not("completed_at", "is", null),
    ]);

    const progressXp = (progressRes.data ?? []).reduce(
      (sum, row) => sum + (row.xp_earned ?? 0),
      0,
    );
    const reflectionXp = (reflectionsRes.data ?? []).reduce(
      (sum, row) => sum + (row.xp_earned ?? 0),
      0,
    );

    return progressXp + reflectionXp;
  } catch (error) {
    console.error("getTotalXp error:", error);
    return 0;
  }
}

/** Level info derived from real total XP (calcLevel). Never throws. */
export async function getLevelInfo(userId: string, supabase: SupabaseClient) {
  const totalXp = await getTotalXp(userId, supabase);
  return calcLevel(totalXp);
}

/**
 * Display name resolution (D9, REQ-UI-01): username → local part of email →
 * neutral fallback. Never "Investigador InVitro-Code".
 */
export function getDisplayName(profile: ProfileLike): string {
  const username = profile.username?.trim();
  if (username) return username;

  const email = profile.email?.trim();
  if (email) {
    const localPart = email.split("@")[0]?.trim();
    if (localPart) return localPart;
  }

  return "Investigador";
}
