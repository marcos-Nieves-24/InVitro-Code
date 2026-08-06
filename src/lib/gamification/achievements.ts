import type { SupabaseClient } from "@supabase/supabase-js";
import { getLessonCount } from "@/lib/content/modules";

/**
 * Achievement helpers (real-data-replace-mocks, REQ-ACH-04/06, REQ-UP-05).
 *
 * All unlocks are evaluated against REAL data (progress, streaks, reflections).
 * Never against mocked/invented numbers. Every calculation filters out rows
 * with `completed_at` NULL (legacy data) so stale rows neither break nor
 * inflate results (REQ-UP-05).
 */

export interface AchievementDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  conditionType: string;
  conditionValue: string;
}

export interface AchievementState {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface AchievementsSummary {
  total: number;
  unlocked: number;
  percent: number;
}

export interface WeeklyXp {
  /** 7 slots, Monday first (es-AR week). */
  days: number[];
  total: number;
}

function emptyState(): { achievements: AchievementState[]; summary: AchievementsSummary } {
  return { achievements: [], summary: { total: 0, unlocked: 0, percent: 0 } };
}

function startOfWeekMonday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday ... 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

/**
 * Evaluates achievement conditions against real user data and inserts any
 * newly unlocked achievements with `ON CONFLICT ... DO NOTHING`, preserving
 * the original `unlocked_at` (REQ-ACH-04).
 *
 * Never throws: internal try/catch returns an empty state on failure so the
 * caller can always render an honest (empty) result.
 */
export async function evaluateAchievements(
  userId: string,
  supabase: SupabaseClient,
): Promise<{ achievements: AchievementState[]; summary: AchievementsSummary }> {
  try {
    // Catalog (all achievements, ordered for stable display)
    const { data: catalog, error: catalogError } = await supabase
      .from("achievements")
      .select(
        "id, slug, title, description, icon, category, xp_reward, condition_type, condition_value",
      )
      .order("xp_reward", { ascending: true });

    if (catalogError || !catalog) {
      console.error("Achievement catalog fetch error:", catalogError);
      return emptyState();
    }

    // Real user metrics, in parallel. All timestamps filtered (REQ-UP-05).
    const [progressRes, reflectionsRes, streakRes, moduleRes] = await Promise.all([
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
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("progress")
        .select("module_slug")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null),
    ]);

    const lessonsCompleted = (progressRes.data ?? []).length;
    const reflectionsCompleted = (reflectionsRes.data ?? []).length;
    const currentStreak = streakRes.data?.current_streak ?? 0;
    const totalXp =
      (progressRes.data ?? []).reduce((sum, row) => sum + (row.xp_earned ?? 0), 0) +
      (reflectionsRes.data ?? []).reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

    // Modules fully completed (completed count >= real lesson count)
    const completedModules = new Set<string>();
    const byModule = new Map<string, number>();
    for (const row of moduleRes.data ?? []) {
      byModule.set(row.module_slug, (byModule.get(row.module_slug) ?? 0) + 1);
    }
    for (const [slug, count] of byModule) {
      if (count >= getLessonCount(slug)) {
        completedModules.add(slug);
      }
    }

    // Already unlocked achievements (source of truth for unlocked_at)
    const { data: unlocks, error: unlocksError } = await supabase
      .from("user_achievements")
      .select("achievement_id, unlocked_at")
      .eq("user_id", userId);

    if (unlocksError) {
      console.error("User achievements fetch error:", unlocksError);
      return emptyState();
    }

    const unlockedAtById = new Map<string, string>();
    for (const row of unlocks ?? []) {
      unlockedAtById.set(row.achievement_id, row.unlocked_at);
    }

    // Cross-check each condition against real data
    const newUnlockRows: { user_id: string; achievement_id: string }[] = [];

    for (const achievement of catalog) {
      let eligible = false;
      switch (achievement.condition_type) {
        case "lessons_completed":
          eligible = lessonsCompleted >= Number(achievement.condition_value);
          break;
        case "reflections_completed":
          eligible = reflectionsCompleted >= Number(achievement.condition_value);
          break;
        case "current_streak":
          eligible = currentStreak >= Number(achievement.condition_value);
          break;
        case "total_xp":
          eligible = totalXp >= Number(achievement.condition_value);
          break;
        case "module_completed":
          eligible = completedModules.has(achievement.condition_value);
          break;
        default:
          eligible = false;
      }

      if (eligible && !unlockedAtById.has(achievement.id)) {
        newUnlockRows.push({ user_id: userId, achievement_id: achievement.id });
      }
    }

    // Insert in one multi-row, idempotent operation (preserves unlocked_at)
    if (newUnlockRows.length > 0) {
      const { error: insertError } = await supabase
        .from("user_achievements")
        .upsert(newUnlockRows, {
          onConflict: "user_id,achievement_id",
          ignoreDuplicates: true,
        });
      if (insertError) {
        console.error("Achievement unlock insert error:", insertError);
      }
    }

    // Refresh unlock timestamps (new rows get the DB default NOW())
    const { data: freshUnlocks } = await supabase
      .from("user_achievements")
      .select("achievement_id, unlocked_at")
      .eq("user_id", userId);

    if (freshUnlocks) {
      for (const row of freshUnlocks) {
        unlockedAtById.set(row.achievement_id, row.unlocked_at);
      }
    }

    const achievements: AchievementState[] = catalog.map((achievement) => ({
      id: achievement.id,
      slug: achievement.slug,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      xpReward: achievement.xp_reward,
      unlocked: unlockedAtById.has(achievement.id),
      unlockedAt: unlockedAtById.get(achievement.id) ?? null,
    }));

    const unlocked = achievements.filter((achievement) => achievement.unlocked).length;
    const summary: AchievementsSummary = {
      total: achievements.length,
      unlocked,
      percent: achievements.length > 0 ? Math.round((unlocked / achievements.length) * 100) : 0,
    };

    return { achievements, summary };
  } catch (error) {
    console.error("evaluateAchievements error:", error);
    return emptyState();
  }
}

/**
 * Weekly XP from the current week (Monday start, es-AR): sum of
 * progress.xp_earned + reflection_completions.xp_earned with
 * completed_at NOT NULL and within the week (REQ-ACH-06, REQ-UP-05).
 */
export async function getWeeklyXp(
  userId: string,
  supabase: SupabaseClient,
): Promise<WeeklyXp> {
  const empty: WeeklyXp = { days: [0, 0, 0, 0, 0, 0, 0], total: 0 };
  try {
    const weekStart = startOfWeekMonday().toISOString();

    const [progressRes, reflectionsRes] = await Promise.all([
      supabase
        .from("progress")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null)
        .gte("completed_at", weekStart),
      supabase
        .from("reflection_completions")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
        .gte("completed_at", weekStart),
    ]);

    const days = [0, 0, 0, 0, 0, 0, 0];

    for (const row of progressRes.data ?? []) {
      const dayIndex = (new Date(row.completed_at).getDay() + 6) % 7; // Monday = 0
      days[dayIndex] += row.xp_earned ?? 0;
    }
    for (const row of reflectionsRes.data ?? []) {
      const dayIndex = (new Date(row.completed_at).getDay() + 6) % 7;
      days[dayIndex] += row.xp_earned ?? 0;
    }

    return { days, total: days.reduce((sum, value) => sum + value, 0) };
  } catch (error) {
    console.error("getWeeklyXp error:", error);
    return empty;
  }
}
