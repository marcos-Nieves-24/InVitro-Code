import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface LeaderboardRow {
  user_id: string;
  username: string | null;
  total_xp: number | string;
}

/**
 * GET /api/leaderboard
 *
 * Requires a Clerk session (401 otherwise). Returns the top 50 real ranking
 * (progress.xp_earned + reflection_completions.xp_earned, joined to profiles,
 * 0 XP users included) plus the authenticated user's position in the full
 * ranking (REQ-LB-01/02/03).
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const [{ data: entries, error: entriesError }, { data: position, error: rankError }] =
      await Promise.all([
        supabase.rpc("get_leaderboard", { limit_n: 50 }),
        supabase.rpc("get_leaderboard_rank", { target_user_id: userId }),
      ]);

    if (entriesError) {
      console.error("Leaderboard fetch error:", entriesError);
      return NextResponse.json(
        { error: `Failed to load leaderboard: ${entriesError.message}` },
        { status: 500 },
      );
    }

    if (rankError) {
      console.error("Leaderboard rank fetch error:", rankError);
    }

    const leaderboard = (entries ?? []).map((entry: LeaderboardRow) => ({
      userId: entry.user_id,
      username: entry.username,
      totalXp: Number(entry.total_xp ?? 0),
    }));

    return NextResponse.json({
      entries: leaderboard,
      currentUser: typeof position === "number" ? { position } : null,
    });
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
