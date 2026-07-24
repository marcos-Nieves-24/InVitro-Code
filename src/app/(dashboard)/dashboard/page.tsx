import { auth } from "@clerk/nextjs/server";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";
import { createAdminClient } from "@/lib/supabase/admin";
import { getModulesInfo } from "@/lib/content/modules";
import { Card, PageShell, SiteHeader } from "@/components/ui";

export default async function DashboardPage() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? "dev-user";

  const supabase = createAdminClient();

  const [progressRes, reflectionRes, moduleProgressRes] = await Promise.all([
    supabase.from("progress").select("xp_earned").eq("user_id", userId),
    supabase
      .from("reflection_completions")
      .select("xp_earned")
      .eq("user_id", userId),
    supabase
      .from("progress")
      .select("module_slug, lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true),
  ]);

  const totalXp = [
    ...(progressRes.data ?? []),
    ...(reflectionRes.data ?? []),
  ].reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

  const completedByModule: Record<string, number> = {};
  for (const row of moduleProgressRes.data ?? []) {
    const slug = row.module_slug;
    completedByModule[slug] = (completedByModule[slug] ?? 0) + 1;
  }

  const modules = getModulesInfo();
  const python = modules.find((m) => m.slug === "python");
  const startHref = python
    ? `/learn/${python.slug}`
    : modules[0]
      ? `/learn/${modules[0].slug}`
      : "/";

  return (
    <PageShell width="marketing">
      <SiteHeader startHref={startHref} showDashboard={false} />

      <main className="mt-8 space-y-6 pb-12">
        <Card>
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-gray-900">
            Bienvenido, Estudiante
          </h1>
          <p className="mt-2 text-gray-600">
            Continuá tu aprendizaje y desbloqueá nuevas lecciones.
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-gray-900">
            Estadísticas de progreso
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-card border border-gray-100 bg-gray-50 p-4">
              <h3 className="eyebrow text-[10px]">Nivel actual</h3>
              <div className="mt-2">
                <LevelBadge userId={userId} totalXp={totalXp} />
              </div>
            </div>
            <div className="rounded-card border border-gray-100 bg-gray-50 p-4">
              <h3 className="eyebrow text-[10px]">Puntos totales</h3>
              <p className="mt-2 font-display text-2xl font-semibold text-gray-900">
                {totalXp} XP
              </p>
            </div>
            <div className="rounded-card border border-gray-100 bg-gray-50 p-4">
              <h3 className="eyebrow text-[10px]">Racha actual</h3>
              <div className="mt-2">
                <StreakBadge userId={userId} />
              </div>
            </div>
            <div className="rounded-card border border-gray-100 bg-gray-50 p-4">
              <h3 className="eyebrow text-[10px]">Siguiente nivel</h3>
              <div className="mt-2">
                <XPBar userId={userId} totalXp={totalXp} />
              </div>
            </div>
          </div>
        </Card>

        {modules.length > 0 && (
          <Card>
            <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-gray-900">
              Progreso de módulos
            </h2>
            <div className="space-y-6">
              {modules.map((mod) => (
                <ModuleProgress
                  key={mod.slug}
                  moduleSlug={mod.slug}
                  moduleName={mod.name}
                  userId={userId}
                  totalLessons={mod.totalLessons}
                  initialCompletedLessons={completedByModule[mod.slug] ?? 0}
                />
              ))}
            </div>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
