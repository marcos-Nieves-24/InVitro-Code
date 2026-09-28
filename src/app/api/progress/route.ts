import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { evaluateAchievements } from "@/lib/gamification/achievements";

export const runtime = "nodejs";

/** UTC calendar day as YYYY-MM-DD. Streaks are day-granular, so UTC avoids DST drift. */
function utcDay(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

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

    const completed = input.completed === undefined ? true : input.completed === true;

    const supabase = createAdminClient();

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

    // Streak: only a completion counts as activity, and a replay on the same
    // day leaves current_streak untouched.
    const today = utcDay();
    const yesterday = utcDay(-1);
    const { data: existing } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date")
      .eq("user_id", userId)
      .maybeSingle();

    const previousStreak = existing?.current_streak ?? 0;
    const lastActive = existing?.last_active_date ?? null;

    let current = previousStreak;
    if (completed) {
      if (lastActive === today) current = Math.max(previousStreak, 1);
      else if (lastActive === yesterday) current = previousStreak + 1;
      else current = 1;
    }
    const longest = Math.max(existing?.longest_streak ?? 0, current);
    const activeDate = completed ? today : lastActive;

    const { data: streakRow, error: streakError } = await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: current,
          longest_streak: longest,
          last_active_date: activeDate,
        },
        { onConflict: "user_id" },
      )
      .select("current_streak, longest_streak, last_active_date")
      .single();

    if (streakError) {
      // Progress is already persisted; a streak failure must not fail the request.
      console.error("[api/progress] streak upsert failed", streakError.message);
    }

    const { achievements } = await evaluateAchievements(userId, supabase);

    const streak = streakRow ?? {
      current_streak: current,
      longest_streak: longest,
      last_active_date: activeDate,
    };

    return NextResponse.json({ progress, streak, achievements }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
