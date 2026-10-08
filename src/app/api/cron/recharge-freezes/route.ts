import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const vercelCronHeader = req.headers.get("x-vercel-cron");

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  if (vercelCronHeader !== null) {
    return true;
  }
  if (!cronSecret && process.env.NODE_ENV !== "production") {
    return true;
  }
  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Recharge all depleted freezes. Cron runs Mondays 00:00 UTC via vercel.json,
  // so we don't need to check day-of-week here — idempotent UPDATE.
  const { data, error } = await admin
    .from("streaks")
    .update({ freezes_available: 1, last_freeze_used: null })
    .eq("freezes_available", 0)
    .select("user_id");

  if (error) {
    console.error("[cron:recharge-freezes] update failed", error.message);
    return NextResponse.json({ error: "Recharge failed" }, { status: 500 });
  }

  const recharged = data?.length ?? 0;
  console.log(`[cron:recharge-freezes] recharged ${recharged} users`);

  return NextResponse.json({ recharged }, { status: 200 });
}
