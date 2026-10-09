import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { DailyGoalSettings } from "@/components/settings/DailyGoalSettings";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();
  const profileRes = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const profile = profileRes.data as
    | {
        username?: string | null;
        email?: string | null;
        role?: string | null;
        theme?: string | null;
        daily_goal_xp?: number | null;
        notification_prefs?: { email?: boolean; streak?: boolean } | null;
      }
    | null
    | undefined;
  const userName = getDisplayName(profile ?? {});

  // Today XP for DailyGoalSettings (best-effort, reuse progress queries)
  const todayStartIso = (() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
  })();
  let todayXp = 0;
  try {
    const [pRes, rRes] = await Promise.all([
      supabase
        .from("progress")
        .select("xp_earned")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null)
        .gte("completed_at", todayStartIso),
      supabase
        .from("reflection_completions")
        .select("xp_earned")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
        .gte("completed_at", todayStartIso),
    ]);
    const pXp = (pRes.data ?? []).reduce((s: number, r: { xp_earned?: number | null }) => s + (r.xp_earned ?? 0), 0);
    const rXp = (rRes.data ?? []).reduce((s: number, r: { xp_earned?: number | null }) => s + (r.xp_earned ?? 0), 0);
    todayXp = pXp + rXp;
  } catch {
    todayXp = 0;
  }

  return (
    <InVitroShell userName={userName} userRole={profile?.role} theme={profile?.theme}>
      <div className="p-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="font-display text-3xl font-bold text-ink">
            Configuración
          </h1>

          <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
            <SettingsForm
              theme={profile?.theme}
              notification_prefs={profile?.notification_prefs}
              onSave={async (data) => {
                "use server";
                const { userId: uid } = await auth();
                if (!uid) return;
                const sb = createAdminClient();
                await sb
                  .from("profiles")
                  .update({
                    theme: data.theme,
                    notification_prefs: data.notification_prefs,
                  })
                  .eq("id", uid);
              }}
            />
          </div>

          <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
            <DailyGoalSettings initialGoal={profile?.daily_goal_xp ?? 50} todayXp={todayXp} />
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}
