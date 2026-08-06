import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { LabMission } from "@/components/laboratorio/LabMission";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { getModulesInfo, getNextLesson, getModuleDisplayName } from "@/lib/content/modules";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import { Lightbulb, Brain, Gem, CheckCircle2 } from "lucide-react";

export default async function LaboratoriosPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [profileRes, progressRes, streakRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, email")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("progress")
      .select("module_slug, lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true)
      .not("completed_at", "is", null),
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});
  const currentStreak = streakRes.data?.current_streak ?? 0;

  const totalXp = await getTotalXp(userId, supabase);
  const levelInfo = calcLevel(totalXp);

  // Real current mission (REQ-UP-02): next incomplete lesson across modules.
  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );
  const nextLesson = getNextLesson(completedLessonKeys);
  const missionLabel = nextLesson?.title ?? "Laboratorio de Machine Learning";
  const missionXp = nextLesson?.xp ?? 0;

  // Real progress in the mission's module (REQ-UP-04).
  const totalLessons = nextLesson
    ? getModulesInfo().find((mod) => mod.slug === nextLesson.moduleSlug)
        ?.totalLessons ?? 0
    : 0;
  const completedLessonCount = nextLesson
    ? (progressRes.data ?? []).filter(
        (row) => row.module_slug === nextLesson.moduleSlug,
      ).length
    : 0;

  const trail = `Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)} · ${missionLabel}`;

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
    >
      <InVitroTopBar
        totalXp={totalXp}
        currentStreak={currentStreak}
        trail={trail}
      />

      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-6 py-8 md:px-10">
        {/* Main content */}
        <div className="col-span-12 space-y-8 xl:col-span-9">
          <LabMission
            level={levelInfo.level}
            rankName={rankTitle(levelInfo.level)}
            missionLabel={missionLabel}
            progressPercent={null}
            lessonTotal={totalLessons}
            completedLessonCount={completedLessonCount}
          />
        </div>

        {/* Side panel */}
        <aside className="col-span-12 space-y-6 xl:col-span-3">
          <div className="overflow-hidden rounded-xl glass-card">
            <div className="border-b border-surface-container bg-surface-container-low/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-xp-gold" fill="currentColor" />
                <h4 className="text-sm font-bold">Sobre esta misión</h4>
              </div>
              <p className="text-xs leading-relaxed text-outline">
                Aprendé qué es un modelo de Machine Learning y cómo se entrena
                con datos reales de una bodega digital.
              </p>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-outline">
                  Objetivo
                </p>
                <p className="text-sm font-medium">
                  Entrenar un modelo de Regresión Lineal y evaluar su
                  rendimiento mediante el coeficiente R².
                </p>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-outline">
                  Recompensa
                </p>
                {nextLesson ? (
                  <div className="flex items-center gap-2 font-bold text-xp-blue">
                    <Gem className="h-4 w-4" fill="currentColor" />
                    <span>+{missionXp} XP</span>
                  </div>
                ) : (
                  <p className="text-sm font-medium">
                    Todas las lecciones completadas.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl glass-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" fill="currentColor" />
              <h4 className="text-sm font-bold">Concepto clave</h4>
            </div>
            <p className="mb-3 text-xs font-bold">¿Qué es un modelo?</p>
            <p className="mb-6 text-xs text-outline">
              Un modelo aprende patrones de los datos para hacer predicciones
              sobre nuevos casos.
            </p>
          </div>

          <div className="rounded-xl glass-card p-6">
            <h4 className="mb-6 text-sm font-bold">Tu progreso</h4>
            {nextLesson && totalLessons > 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-outline">
                  Módulo: {getModuleDisplayName(nextLesson.moduleSlug)}
                </p>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-on-surface-variant">
                    {completedLessonCount} de {totalLessons} lecciones
                    completadas
                  </span>
                  <span className="text-primary">
                    {Math.round((completedLessonCount / totalLessons) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.round(
                        (completedLessonCount / totalLessons) * 100,
                      )}%`,
                    }}
                  />
                </div>
                <p className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success-green" />
                  Progreso real de tus lecciones del módulo.
                </p>
              </div>
            ) : (
              <EmptyState icon={CheckCircle2} {...EMPTY_STATES.labProgress} />
            )}
          </div>
        </aside>
      </div>
    </InVitroShell>
  );
}
