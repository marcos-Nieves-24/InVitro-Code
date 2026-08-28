import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";
import { EmptyState } from "@/components/ui/EmptyState";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getModulesInfo,
  getNextLesson,
  getResumeHref,
  getLessonSlugs,
  getModuleDisplayName,
} from "@/lib/content/modules";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { achievementIcon } from "@/lib/gamification/icons";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Cpu,
  Flame,
  Check,
  FlaskConical,
  Gem,
  Map,
  Play,
  Terminal,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const LEVEL_STEPS = [
  "Novato",
  "Analista",
  "Investigador Junior",
  "Investigador",
  "Especialista",
  "Machine Learning Eng.",
];

const MODULE_ICONS: Record<string, LucideIcon> = {
  python: Terminal,
  ia: Brain,
  estadistica: BarChart3,
  "machine-learning": Cpu,
};

function moduleIcon(slug: string): LucideIcon {
  return MODULE_ICONS[slug] ?? FlaskConical;
}

export default async function DashboardPage() {
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
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});
  const streakData = streakRes.data ?? { current_streak: 0, longest_streak: 0 };

  const totalXp = await getTotalXp(userId, supabase);
  const levelInfo = calcLevel(totalXp);

  const completedRows = progressRes.data ?? [];
  const completedLessonKeys = new Set(
    completedRows.map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  const completedByModule: Record<string, number> = {};
  for (const row of completedRows) {
    const slug = row.module_slug;
    completedByModule[slug] = (completedByModule[slug] ?? 0) + 1;
  }

  const modules = getModulesInfo();

  // "Proyecto Actual" (REQ-UP-01): first module in order with real progress (<100%).
  const projectModule = modules.find((mod) => {
    const completed = completedByModule[mod.slug] ?? 0;
    return completed > 0 && completed < mod.totalLessons;
  });

  const projectCompleted = projectModule
    ? completedByModule[projectModule.slug] ?? 0
    : 0;
  const projectPercent = projectModule
    ? Math.round((projectCompleted / projectModule.totalLessons) * 100)
    : 0;

  let projectHref = "/learn";
  if (projectModule) {
    const nextInModule = getLessonSlugs(projectModule.slug).find(
      (lessonSlug) => !completedLessonKeys.has(`${projectModule.slug}/${lessonSlug}`),
    );
    if (nextInModule) {
      projectHref = `/learn/${projectModule.slug}/${nextInModule}`;
    }
  }

  // "Misión Actual" (REQ-UP-02): next incomplete lesson with real XP.
  const nextLesson = getNextLesson(completedLessonKeys);
  const missionHref = nextLesson
    ? `/learn/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`
    : null;

  // "Logros Recientes" (REQ-ACH-08): real unlocks, most recent first.
  const { achievements } = await evaluateAchievements(userId, supabase);
  const recentAchievements = achievements
    .filter((achievement) => achievement.unlocked)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 3);

  const startHref = getResumeHref(completedLessonKeys);

  const ProjectIcon = projectModule ? moduleIcon(projectModule.slug) : null;
  const MissionIcon = nextLesson ? moduleIcon(nextLesson.moduleSlug) : null;

  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.min(
    100,
    (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100,
  );
  const ringOffset =
    ringCircumference - (ringProgress / 100) * ringCircumference;
  const rankLevel = Math.min(levelInfo.level, LEVEL_STEPS.length - 1);

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
      topBar={
        <InVitroTopBar
          totalXp={totalXp}
          currentStreak={streakData.current_streak}
          trail="Dashboard de Expedición"
        />
      }
    >
      <div className="p-8">
        <div className="flex gap-8">
          {/* Central feed */}
          <div className="flex-grow space-y-8">
            {/* Hero banner */}
            <section className="relative overflow-hidden rounded-2xl border border-surface-raised bg-surface-card shadow-sm">
              <div className="flex items-center gap-8 p-10">
                <div className="flex-1">
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
                    ¡Bienvenido de vuelta, {userName}!
                  </h2>
                  <p className="mb-8 mt-4 max-w-lg text-storm">
                    Estás construyendo tu camino en InVitro-Code.
                    Continúa tu investigación y descubre nuevas formas de
                    aplicar la Inteligencia Artificial.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={startHref}
                      className="flex items-center gap-2 rounded-xl bg-mint px-8 py-4 font-bold text-ink shadow-lg shadow-glow transition-transform hover:scale-105"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                      Continuar Misión
                    </Link>
                    <Link
                      href="/niveles"
                      className="glass-card flex items-center gap-2 rounded-xl border border-surface-raised px-8 py-4 font-bold text-ink transition-colors hover:bg-surface-card"
                    >
                      <Map className="h-4 w-4" />
                      Explorar Mapa
                    </Link>
                  </div>
                </div>
                <div className="relative hidden h-64 w-64 shrink-0 overflow-hidden rounded-2xl border-4 border-surface-card bg-gradient-to-br from-mint to-fog shadow-2xl lg:block">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-ink">
                    <Gem className="mb-2 h-14 w-14 opacity-80" fill="currentColor" />
                    <span className="text-3xl font-black">
                      {totalXp.toLocaleString("es")}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                      XP totales
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats row */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
                  Nivel actual
                </h3>
                <div className="mt-2">
                  <LevelBadge totalXp={totalXp} />
                </div>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
                  Puntos totales
                </h3>
                <p className="mt-2 font-display text-2xl font-semibold text-ink">
                  {totalXp.toLocaleString("es")} XP
                </p>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
                  Racha actual
                </h3>
                <div className="mt-2">
                  <StreakBadge
                    currentStreak={streakData.current_streak}
                    longestStreak={streakData.longest_streak}
                  />
                </div>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
                  Siguiente nivel
                </h3>
                <div className="mt-2">
                  <XPBar totalXp={totalXp} />
                </div>
              </div>
            </section>

            {/* Current work */}
            <section className="grid gap-6 md:grid-cols-2">
              {/* Proyecto Actual (REQ-UP-01) */}
              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-storm">
                  Proyecto Actual
                </h3>
                {projectModule ? (
                  <>
                    <div className="mb-6 flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-fog/20 text-mint">
                        {ProjectIcon ? <ProjectIcon className="h-8 w-8" /> : null}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">
                          {projectModule.name}
                        </h4>
                        <p className="text-sm text-storm">
                          {projectCompleted} de {projectModule.totalLessons}{" "}
                          lecciones completadas
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-2 flex items-end justify-between">
                        <span className="text-xs font-bold text-storm">
                          Progreso
                        </span>
                        <span className="text-sm font-bold text-mint">
                          {projectPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                        <div
                          className="xp-gradient h-full rounded-full"
                          style={{ width: `${projectPercent}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={projectHref}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-raised py-3 text-sm font-bold text-mint transition-colors hover:bg-surface-card"
                    >
                      Continuar módulo <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    icon={FlaskConical}
                    {...EMPTY_STATES.currentProject}
                  />
                )}
              </div>

              {/* Misión Actual (REQ-UP-02) */}
              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-storm">
                  Misión Actual
                </h3>
                {nextLesson ? (
                  <>
                    <div className="mb-6 flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint">
                        {MissionIcon ? <MissionIcon className="h-8 w-8" /> : null}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">
                          {nextLesson.title}
                        </h4>
                        <p className="text-sm text-storm">
                          {getModuleDisplayName(nextLesson.moduleSlug)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-mint">
                      <Gem className="h-4 w-4" fill="currentColor" />
                      <span className="text-sm font-bold">
                        +{nextLesson.xp} XP
                      </span>
                    </div>
                    <Link
                      href={missionHref ?? "/learn"}
                      className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-mint py-3 text-sm font-bold text-ink transition-all hover:opacity-90"
                    >
                      Continuar misión <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <EmptyState
                    icon={CheckCircle2}
                    title="¡Completaste todas las lecciones!"
                    description="No quedan misiones pendientes en ninguna expedición."
                  />
                )}
              </div>
            </section>

            {/* Modules */}
            {modules.length > 0 && (
              <section className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      Progreso de módulos
                    </h2>
                    <p className="text-sm text-storm">
                      Tu avance real a través de las expediciones.
                    </p>
                  </div>
                  <Link
                    href="/learn"
                    className="flex items-center gap-1 text-sm font-bold text-mint hover:underline"
                  >
                    Ver expediciones <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {modules.map((mod) => (
                    <ModuleProgress
                      key={mod.slug}
                      moduleSlug={mod.slug}
                      moduleName={mod.name}
                      totalLessons={mod.totalLessons}
                      initialCompletedLessons={
                        completedByModule[mod.slug] ?? 0
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Side progress panel */}
          <aside className="hidden w-80 flex-col gap-6 lg:flex">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Tu Progreso</h3>
                <Link
                  href="/niveles"
                  className="flex items-center gap-1 text-xs font-bold text-mint hover:underline"
                >
                  Ver roadmap <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mb-8 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={ringRadius}
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-surface-raised"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={ringRadius}
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                      className="text-mint"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-bold text-storm">
                      Nivel
                    </span>
                    <span className="text-3xl font-black text-mint">
                      {levelInfo.level}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-bold">{rankTitle(levelInfo.level)}</p>
                  <p className="mt-1 text-xs text-storm">
                    <span className="font-bold text-mint">
                      {totalXp.toLocaleString("es")}
                    </span>{" "}
                    / {levelInfo.nextLevelXp.toLocaleString("es")} XP
                  </p>
                  <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-surface-raised">
                    <div
                      className="h-full rounded-full bg-mint"
                      style={{ width: `${ringProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {LEVEL_STEPS.map((step, i) => {
                  const completed = i < rankLevel;
                  const current = i === rankLevel;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold ${
                        current
                          ? "bg-fog/20 text-mint ring-2 ring-mint/20"
                          : completed
                            ? "bg-mint/30 text-storm opacity-60"
                            : "bg-surface-raised text-storm"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          current ? "border-2 border-mint" : ""
                        }`}
                      >
                        {current ? (
                          <span className="h-2 w-2 rounded-full bg-mint" />
                        ) : completed ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">○</span>
                        )}
                      </span>
                      {i + 1} {step}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logros Recientes (REQ-ACH-08) */}
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">
                  Logros Recientes
                </h3>
                <Link
                  href="/logros"
                  className="text-xs font-bold text-mint hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              {recentAchievements.length > 0 ? (
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => {
                    const Icon = achievementIcon(achievement.icon);
                    return (
                      <div key={achievement.id} className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fog/20 text-mint">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h5 className="text-xs font-bold">
                              {achievement.title}
                            </h5>
                            <span className="text-[10px] font-bold text-mint">
                              +{achievement.xpReward} XP
                            </span>
                          </div>
                          <p className="text-[10px] text-storm">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={Trophy} {...EMPTY_STATES.achievements} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </InVitroShell>
  );
}
