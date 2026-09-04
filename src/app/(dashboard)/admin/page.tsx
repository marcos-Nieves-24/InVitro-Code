import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const profileRes = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileRes.data?.role !== "admin") {
    redirect("/dashboard");
  }

  const fullProfileRes = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const userName = getDisplayName(fullProfileRes.data ?? {});

  const usersRes = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = usersRes.data ?? [];

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

  return (
    <InVitroShell userName={userName} userMeta="Administrador" theme={fullProfileRes.data?.theme}>
      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <h1 className="font-display text-3xl font-bold text-ink">
            Panel de Administración
          </h1>

          <AdminDashboard
            totalUsers={totalRes.count ?? 0}
            bannedUsers={bannedRes.count ?? 0}
            activeWeek={activeWeekRes.count ?? 0}
          />

          <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-storm">
              Usuarios
            </h2>
            <UsersTable
              users={users}
              onBanToggle={async (userId, isBanned) => {
                "use server";
                await fetch(
                  `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/users/${userId}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_banned: isBanned }),
                  }
                );
              }}
              onRoleChange={async (userId, role) => {
                "use server";
                await fetch(
                  `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/users/${userId}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role }),
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
