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

  const [totalRes, bannedRes, activeWeekRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_banned", true),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte(
        "last_active_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  return NextResponse.json({
    total_users: totalRes.count ?? 0,
    banned_users: bannedRes.count ?? 0,
    active_week: activeWeekRes.count ?? 0,
  });
}
