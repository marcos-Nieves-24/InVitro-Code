import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { GamingHUD } from "./GamingHUD";
import { HeroSection } from "./HeroSection";
import { ProgressSection } from "./ProgressSection";
import { AchievementsSection } from "./AchievementsSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getModulesInfo,
  getNextLesson,
  getResumeHref,
  getLessonSlugs,
  getModuleDisplayName,
} from "@/lib/content/modules";
import { calcLevel } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Gem,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const MODULE_ICONS: Record<string, LucideIcon> = {
  python: Terminal,
  ia: Brain,
  estadistica: BarChart3,
  "machine-learning": Cpu,
};

function moduleIcon(slug: string): LucideIcon {
  return MODULE_ICONS[slug] ?? FlaskConical;
}

export async function DashboardContainer() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [profileRes, progressRes, streakRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, email, role, theme, gender")
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

  const nextLesson = getNextLesson(completedLessonKeys);
  const missionHref = nextLesson
    ? `/learn/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`
    : null;

  const { achievements } = await evaluateAchievements(userId, supabase);
  const recentAchievements = achievements
    .filter((achievement) => achievement.unlocked)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 3);

  const startHref = getResumeHref(completedLessonKeys);

  const ProjectIcon = projectModule ? moduleIcon(projectModule.slug) : null;
  const MissionIcon = nextLesson ? moduleIcon(nextLesson.moduleSlug) : null;
  const gender = (profileRes.data as { gender?: string | null } | null)?.gender ?? null;

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level}`}
      userRole={profileRes.data?.role}
      theme={profileRes.data?.theme}
      hud={<GamingHUD totalXp={totalXp} levelInfo={levelInfo} streak={streakData} />}
    >
      <div className="px-6 py-8 md:px-10">
        <div className="space-y-12">
          <HeroSection userName={userName} startHref={startHref} gender={gender} />

          {/* Misión Actual */}
          <section id="mission" className="scroll-mt-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Misión Actual</h2>
              <a href="#modules" className="flex items-center gap-1 text-sm text-mint hover:underline">
                Ver módulos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Proyecto Actual */}
              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-storm">Proyecto Actual</h3>
                {projectModule ? (
                  <>
                    <div className="mb-6 flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-fog/20 text-mint">
                        {ProjectIcon ? <ProjectIcon className="h-8 w-8" /> : null}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">{projectModule.name}</h4>
                        <p className="text-sm text-storm">
                          {projectCompleted} de {projectModule.totalLessons} lecciones completadas
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-2 flex items-end justify-between">
                        <span className="text-xs font-bold text-storm">Progreso</span>
                        <span className="text-sm font-bold text-mint">{projectPercent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                        <div className="xp-gradient h-full rounded-full" style={{ width: `${projectPercent}%` }} />
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
                  <EmptyState icon={FlaskConical} {...EMPTY_STATES.currentProject} />
                )}
              </div>

              {/* Misión Actual */}
              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-storm">Misión Actual</h3>
                {nextLesson ? (
                  <>
                    <div className="mb-6 flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint">
                        {MissionIcon ? <MissionIcon className="h-8 w-8" /> : null}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">{nextLesson.title}</h4>
                        <p className="text-sm text-storm">{getModuleDisplayName(nextLesson.moduleSlug)}</p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-mint">
                      <Gem className="h-4 w-4" fill="currentColor" />
                      <span className="text-sm font-bold">+{nextLesson.xp} XP</span>
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
            </div>

            <div className="mt-12 flex justify-center">
              <a href="#modules" className="flex flex-col items-center gap-2 text-storm/60 transition-colors hover:text-mint">
                <span className="text-xs font-medium">Siguiente</span>
                <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </section>

          <ProgressSection modules={modules} completedByModule={completedByModule} />

          <AchievementsSection levelInfo={levelInfo} totalXp={totalXp} recentAchievements={recentAchievements} />
        </div>
      </div>
    </InVitroShell>
  );
}
