import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { clampDailyGoal } from "@/domain/dailyGoal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/profile/daily-goal → { daily_goal_xp }
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("daily_goal_xp")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const daily_goal_xp = (data as { daily_goal_xp?: number | null } | null)?.daily_goal_xp ?? 50;
  return NextResponse.json({ daily_goal_xp }, { status: 200 });
}

// POST /api/profile/daily-goal { daily_goal_xp } → { daily_goal_xp: clamped }
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = checkRateLimit(`daily-goal:${userId}`, 20, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const raw = (body as Record<string, unknown> | null)?.daily_goal_xp;
  const clamped = clampDailyGoal(raw);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ daily_goal_xp: clamped })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ daily_goal_xp: clamped }, { status: 200 });
}
