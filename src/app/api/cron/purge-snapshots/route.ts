import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/purge-snapshots
 * Purges lab_progress.last_position.codeSnapshot older than 60 days
 * or with completion_status=completed → '{}' (minimization, P1 retention-policy.md).
 * Auth: CRON_SECRET Bearer or x-vercel-cron header (Vercel Cron).
 */
function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const vercelCronHeader = req.headers.get("x-vercel-cron");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (vercelCronHeader !== null) return true;
  if (!cronSecret && process.env.NODE_ENV !== "production") return true;
  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 60 * 24 * 3600000).toISOString();

  // Purge 1: completed → '{}'
  const { error: errCompleted, count: countCompleted } = await admin
    .from("lab_progress")
    .update({ last_position: {} } as never)
    .eq("completion_status", "completed")
    .neq("last_position", "{}" as never);

  if (errCompleted) {
    console.error("[cron:purge-snapshots] completed purge failed", errCompleted.message);
  }

  // Purge 2: stale >60d without update
  const { data: stale, error: errQuery } = await admin
    .from("lab_progress")
    .select("user_id, module_slug, lesson_slug")
    .lt("updated_at", cutoff)
    .limit(500);

  if (errQuery) {
    console.error("[cron:purge-snapshots] stale query failed", errQuery.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let purgedStale = 0;
  for (const row of (stale ?? []) as Array<{ user_id: string; module_slug: string; lesson_slug: string }>) {
    const { error } = await admin
      .from("lab_progress")
      .update({ last_position: {} } as never)
      .eq("user_id", row.user_id)
      .eq("module_slug", row.module_slug)
      .eq("lesson_slug", row.lesson_slug);
    if (!error) purgedStale++;
  }

  console.log(`[cron:purge-snapshots] completed=${countCompleted ?? "?"} stale=${purgedStale}/${(stale ?? []).length}`);

  return NextResponse.json(
    { purgedCompleted: countCompleted ?? 0, purgedStale, staleFound: (stale ?? []).length },
    { status: 200 },
  );
}
