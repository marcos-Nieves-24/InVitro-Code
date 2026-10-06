import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { getLessonSlugs } from "@/lib/content/modules";
import { advanceStreak } from "@/lib/gamification/streak";

export const runtime = "nodejs";

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readNonNegativeInt(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.floor(value));
}

/**
 * POST /api/progress
 *
 * Records lesson progress and advances the daily streak. Identity comes
 * exclusively from `auth()`; a client-sent `user_id` is never read.
 *
 * Body: { module_slug, lesson_slug, completed?, xp_earned? }
 * 401 no session | 400 bad body or blank module/lesson | 500 unexpected or
 * `progress` write error
 * 200 { progress, streak: { current_streak, longest_streak, last_active_date }, achievements }
 *
 * Idempotent: `progress` upserts on (user_id, module_slug, lesson_slug) and the
 * streak only advances when `last_active_date` is yesterday, so replaying the
 * same request on the same UTC day is a no-op.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;

    const module_slug = readNonEmptyString(input.module_slug);
    const lesson_slug = readNonEmptyString(input.lesson_slug);
    if (!module_slug || !lesson_slug) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }

    // Validate against content catalog — prevents bogus progress rows
    try {
      const validSlugs = getLessonSlugs(module_slug);
      if (validSlugs.length === 0 || !validSlugs.includes(lesson_slug)) {
        return NextResponse.json({ error: "Unknown module/lesson" }, { status: 400 });
      }
    } catch {
      // If catalog read fails, fall through — XP calc will still cap, and DB will store
    }

    const completed = input.completed === undefined ? true : input.completed === true;

    const supabase = createAdminClient();

    // Consent gate art.9 — pending blocks progress writes (POST only)
    const { data: consentProfile } = await supabase
      .from("profiles")
      .select("consent_status")
      .eq("id", userId)
      .maybeSingle();
    if ((consentProfile as { consent_status?: string | null } | null)?.consent_status === "pending") {
      return NextResponse.json({ error: "Consent pending art.9" }, { status: 403 });
    }

    // XP is server-authoritative: a client may request less, never more.
    const serverXp = calcXpForLesson(module_slug, lesson_slug);
    const requestedXp = readNonNegativeInt(input.xp_earned);
    const xp = requestedXp === null ? serverXp : Math.min(requestedXp, serverXp);

    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .upsert(
        {
          user_id: userId,
          module_slug,
          lesson_slug,
          completed,
          xp_earned: xp,
          completed_at: completed ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,module_slug,lesson_slug" },
      )
      .select("module_slug, lesson_slug, completed, xp_earned, completed_at")
      .single();

    if (progressError) {
      return NextResponse.json({ error: progressError.message }, { status: 500 });
    }

    // Streak: shared helper (also used by lab-progress). Only completions count.
    const streakRow = await advanceStreak(userId, supabase, completed);

    let achievements: Awaited<ReturnType<typeof evaluateAchievements>>["achievements"] = [];
    try {
      const result = await evaluateAchievements(userId, supabase);
      achievements = result.achievements;
    } catch (err) {
      console.error("[api/progress] evaluateAchievements failed", err instanceof Error ? err.message : String(err));
    }

    const streak = streakRow ?? {
      current_streak: 0,
      longest_streak: 0,
      last_active_date: null,
    };

    return NextResponse.json({ progress, streak, achievements }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
