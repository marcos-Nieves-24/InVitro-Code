import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { SettingsForm } from "@/components/settings/SettingsForm";

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

  const profile = profileRes.data;
  const userName = getDisplayName(profile ?? {});

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
                await fetch(
                  `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/profile`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  }
                );
              }}
            />
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}
