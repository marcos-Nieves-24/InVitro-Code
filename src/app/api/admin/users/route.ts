import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const userIds = (profiles ?? []).map((p) => p.id);

  const [progressRes, streaksRes] = await Promise.all([
    supabase
      .from("progress")
      .select("user_id, xp_earned, completed")
      .in("user_id", userIds)
      .eq("completed", true),
    supabase
      .from("streaks")
      .select("user_id, current_streak, longest_streak, last_active_date")
      .in("user_id", userIds),
  ]);

  const progressByUser: Record<string, { total_xp: number; lessons: number }> = {};
  for (const row of progressRes.data ?? []) {
    if (!progressByUser[row.user_id]) {
      progressByUser[row.user_id] = { total_xp: 0, lessons: 0 };
    }
    progressByUser[row.user_id].total_xp += row.xp_earned ?? 0;
    progressByUser[row.user_id].lessons += 1;
  }

  const streaksByUser: Record<string, { current_streak: number; longest_streak: number; last_active_date: string | null }> = {};
  for (const row of streaksRes.data ?? []) {
    streaksByUser[row.user_id] = {
      current_streak: row.current_streak ?? 0,
      longest_streak: row.longest_streak ?? 0,
      last_active_date: row.last_active_date ?? null,
    };
  }

  const enriched = (profiles ?? []).map((profile) => ({
    ...profile,
    total_xp: progressByUser[profile.id]?.total_xp ?? 0,
    lessons_completed: progressByUser[profile.id]?.lessons ?? 0,
    current_streak: streaksByUser[profile.id]?.current_streak ?? 0,
    longest_streak: streaksByUser[profile.id]?.longest_streak ?? 0,
    last_active_date: streaksByUser[profile.id]?.last_active_date ?? null,
  }));

  return NextResponse.json(enriched);
}
