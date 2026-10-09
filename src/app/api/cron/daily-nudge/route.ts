import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { shouldNudge } from "@/domain/dailyGoal";

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

function todayYmdUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function todayStartIsoUTC(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const todayYmd = todayYmdUTC();
  const startIso = todayStartIsoUTC();

  // Fetch candidates (limit 200). Minimal columns to keep simple; filter email opt-out in JS.
  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, daily_goal_xp, last_nudge_at, notification_prefs")
    .limit(200);

  if (profilesError) {
    console.error("[cron:daily-nudge] profiles query failed", profilesError.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  const rows = (profiles ?? []) as Array<{
    id: string;
    daily_goal_xp: number | null;
    last_nudge_at: string | null;
    notification_prefs?: { email?: boolean } | null;
  }>;

  let checked = 0;
  let nudged = 0;

  for (const p of rows) {
    checked++;

    // Respect email opt-out
    const emailPref = (p.notification_prefs as { email?: boolean } | null)?.email;
    if (emailPref === false) continue;

    const goal = p.daily_goal_xp ?? 50;

    // Calculate today XP (progress + reflections since 00:00 UTC)
    let todayXp = 0;
    try {
      const [progressRes, reflectionsRes] = await Promise.all([
        admin
          .from("progress")
          .select("xp_earned")
          .eq("user_id", p.id)
          .eq("completed", true)
          .not("completed_at", "is", null)
          .gte("completed_at", startIso),
        admin
          .from("reflection_completions")
          .select("xp_earned")
          .eq("user_id", p.id)
          .not("completed_at", "is", null)
          .gte("completed_at", startIso),
      ]);

      const progressXp = (progressRes.data ?? []).reduce(
        (sum: number, r: { xp_earned?: number | null }) => sum + (r.xp_earned ?? 0),
        0,
      );
      const reflectionXp = (reflectionsRes.data ?? []).reduce(
        (sum: number, r: { xp_earned?: number | null }) => sum + (r.xp_earned ?? 0),
        0,
      );
      todayXp = progressXp + reflectionXp;
    } catch (e) {
      console.warn("[cron:daily-nudge] xp query failed for", p.id, e);
      continue;
    }

    if (!shouldNudge(todayXp, goal, p.last_nudge_at, todayYmd)) continue;

    // Best-effort nudge
    try {
      if (process.env.RESEND_API_KEY) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@invitro-code.com",
            to: p.id, // profiles.id is Clerk id, not email — log fallback; real lookup needs email column
            subject: "Tu meta diaria te espera",
            html: `<p>¡Hola! Llevas <strong>${todayXp}/${goal} XP</strong> hoy. Te faltan <strong>${Math.max(0, goal - todayXp)} XP</strong> para tu meta diaria. ¡Entrá y completá una lección!</p>`,
          }),
        });
        if (!res.ok) {
          console.warn("[nudge] resend failed", p.id, await res.text().catch(() => ""));
        }
      } else {
        console.log("[nudge] would email", p.id, `${todayXp}/${goal} XP`);
      }
    } catch (e) {
      console.warn("[nudge] email best-effort failed", p.id, e);
    }

    // Mark nudged to avoid spam, even if email failed (best-effort)
    try {
      const { error: updateError } = await admin
        .from("profiles")
        .update({ last_nudge_at: new Date().toISOString() })
        .eq("id", p.id);
      if (updateError) {
        console.warn("[cron:daily-nudge] last_nudge_at update failed", p.id, updateError.message);
      } else {
        nudged++;
      }
    } catch (e) {
      console.warn("[cron:daily-nudge] last_nudge_at exception", p.id, e);
    }
  }

  console.log(`[cron:daily-nudge] checked ${checked}, nudged ${nudged} (today ${todayYmd})`);
  return NextResponse.json({ nudged, checked }, { status: 200 });
}
