import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { PENDING_TTL_HOURS } from "@/domain/consent";
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

async function purgeUser(
  id: string,
  admin: ReturnType<typeof createAdminClient>,
): Promise<void> {
  // Best-effort sequential cascade, identical to webhook user.deleted + account DELETE
  await admin.from("lab_progress").delete().eq("user_id", id);
  await admin.from("progress").delete().eq("user_id", id);
  await admin.from("reflection_completions").delete().eq("user_id", id);
  await admin.from("streaks").delete().eq("user_id", id);
  await admin.from("user_achievements").delete().eq("user_id", id);
  await admin.from("consent_logs").delete().eq("user_id", id);

  const { data: files } = await admin.storage.from("avatars").list("", { search: id });
  if (files?.length) {
    await admin.storage.from("avatars").remove(files.map((f) => f.name));
  }

  await admin.from("profiles").delete().eq("id", id);

  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
  } catch (err) {
    console.warn(
      "[cron:purge-pending] clerk delete best-effort failed",
      id,
      err instanceof Error ? err.message : String(err),
    );
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - PENDING_TTL_HOURS * 3600000).toISOString();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("consent_status", "pending")
    .lt("pending_since", cutoff)
    .limit(100);

  if (error) {
    console.error("[cron:purge-pending] query failed", error.message);
    return NextResponse.json({ error: "Query failed", details: error.message }, { status: 500 });
  }

  const ids: string[] = (data ?? []).map((r: { id: string }) => r.id);

  for (const id of ids) {
    try {
      await purgeUser(id, admin);
    } catch (err) {
      console.warn(
        "[cron:purge-pending] purge failed for",
        id,
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  console.log(`[cron:purge-pending] purged ${ids.length} pending users`, ids);

  return NextResponse.json({ purged: ids.length, ids }, { status: 200 });
}
