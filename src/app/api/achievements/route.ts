import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { evaluateAchievements, getWeeklyXp } from "@/lib/gamification/achievements";

/**
 * GET /api/achievements
 *
 * Requires a Clerk session (401 otherwise). Evaluates achievements against
 * real data (idempotent unlocks) and returns the full catalog with per-user
 * state plus the current weekly XP (REQ-ACH-05/06).
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { achievements, summary } = await evaluateAchievements(userId, supabase);
    const weeklyXp = await getWeeklyXp(userId, supabase);

    return NextResponse.json({ achievements, summary, weeklyXp });
  } catch (error) {
    console.error("Error in achievements API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
