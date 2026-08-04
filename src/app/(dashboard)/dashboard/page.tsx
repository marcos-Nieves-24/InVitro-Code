import { auth } from "@clerk/nextjs/server";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";
import { createAdminClient } from "@/lib/supabase/admin";
import { getModulesInfo, getResumeHref } from "@/lib/content/modules";
import { Card, PageShell, SiteHeader } from "@/components/ui";

export default async function DashboardPage() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? "dev-user";

  const supabase = createAdminClient();

  const [progressRes, reflectionRes, moduleProgressRes, streakRes] = await Promise.all([
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
    supabase
      .from("streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const streakData = streakRes.data ?? { current_streak: 0, longest_streak: 0 };

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

  const completedLessonKeys = new Set(
    (moduleProgressRes.data ?? []).map(
      (row) => `${row.module_slug}/${row.lesson_slug}`,
    ),
  );
  const startHref = getResumeHref(completedLessonKeys);

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
                <LevelBadge totalXp={totalXp} />
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
                <StreakBadge
                  currentStreak={streakData.current_streak}
                  longestStreak={streakData.longest_streak}
                />
              </div>
            </div>
            <div className="rounded-card border border-gray-100 bg-gray-50 p-4">
              <h3 className="eyebrow text-[10px]">Siguiente nivel</h3>
              <div className="mt-2">
                <XPBar totalXp={totalXp} />
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
