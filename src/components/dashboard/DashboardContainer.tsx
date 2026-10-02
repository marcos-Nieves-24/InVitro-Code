import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { GamingHUD } from "./GamingHUD";
import { HeroSection } from "./HeroSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getModulesInfo,
  getNextLesson,
  getResumeHref,
  getModuleDisplayName,
  getModuleShortDescription,
  getModuleProgressHint,
  getModuleGrowthHint,
} from "@/lib/content/modules";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { getDailyActivity, getProgressTimeline } from "@/lib/gamification/activity";
import { BioreactorProgress } from "./BioreactorProgress";
import { BiotechGrowthTube } from "./BiotechGrowthTube";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";
import { ProgressCharts } from "./ProgressCharts";
import { CheckCircle2, Gem } from "lucide-react";

const MODULE_FAVICON: Record<string, string> = {
  ia: "/labs/modules/ia.svg",
  python: "/labs/modules/python.svg",
  estadistica: "/labs/modules/estadistica.svg",
  "machine-learning": "/labs/modules/ml.svg",
};

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

  const modules = getModulesInfo();

  const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
  const completedCount = completedLessonKeys.size;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const nextLesson = getNextLesson(completedLessonKeys);
  const missionHref = nextLesson
    ? `/learn/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`
    : null;

  const startHref = getResumeHref(completedLessonKeys);

  const completedByModule = new Map<string, number>();
  for (const row of completedRows) completedByModule.set(row.module_slug, (completedByModule.get(row.module_slug) ?? 0) + 1);
  const currentModule = nextLesson ? modules.find((m) => m.slug === nextLesson.moduleSlug) ?? null : null;
  const currentModuleCompleted = nextLesson ? completedByModule.get(nextLesson.moduleSlug) ?? 0 : 0;
  const currentModuleTotal = currentModule?.totalLessons ?? 0;
  const currentModulePct = currentModuleTotal > 0 ? Math.round((currentModuleCompleted / currentModuleTotal) * 100) : 0;
  // Single source for "progress toward the next level" in this view: the level
  // bar, its progressbar semantics, and the bioreactor bubble layer all read
  // this one value. `nextLevelXp` is always > 0, so the division is safe.
  const levelProgressPct = Math.min(100, (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100);
  const missionFavicon = nextLesson ? MODULE_FAVICON[nextLesson.moduleSlug] ?? "/labs/modules/ia.svg" : null;
  const gender = (profileRes.data as { gender?: string | null } | null)?.gender ?? null;

  const [timeline, daily] = await Promise.all([
    getProgressTimeline(userId, supabase),
    getDailyActivity(userId, supabase),
  ]);

  const modulesData = modules.map((m) => {
    const completed = completedByModule.get(m.slug) ?? 0;
    return { name: m.name, completed, total: m.totalLessons, value: completed };
  });

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level}`}
      userRole={profileRes.data?.role}
      theme={profileRes.data?.theme}
      hud={<GamingHUD totalXp={totalXp} levelInfo={levelInfo} streak={streakData} />}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-10">
        <div className="space-y-12">
          <HeroSection userName={userName} startHref={startHref} gender={gender} />

          {/* Tu Progreso + Misión Actual — video circuit a la destra */}
          <div className="relative overflow-hidden rounded-2xl">
            <video autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover rounded-2xl">
              <source src="/videos/circuit-growth-animation.mp4" type="video/mp4" />
            </video>
            <div aria-hidden="true" className="absolute inset-0 bg-white/10 dark:bg-black/10" />
            <div className="relative p-0">
              <section className="scroll-mt-20">
                <div className="grid gap-6 md:grid-cols-2 items-stretch">
              <div className="glass-card flex h-full min-h-[360px] flex-col p-6 md:p-8">
                <div className="flex flex-row items-center justify-between gap-6">
                  <div>
                    <div className="mb-4 flex items-center">
                      <h3 className="font-display text-2xl font-bold">Tu Progreso</h3>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="font-display text-2xl font-bold">{rankTitle(levelInfo.level)}</p>
                      <p className="mt-1 text-lg text-storm">
                        <span className="font-bold text-mint">{totalXp}</span> / {levelInfo.nextLevelXp} XP
                      </p>
                      <div
                        className="mx-auto mt-3 h-4 w-full max-w-[14rem] overflow-hidden rounded-full bg-surface-raised md:mx-0"
                        role="progressbar"
                        aria-valuenow={Math.round(levelProgressPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${totalXp} de ${levelInfo.nextLevelXp} XP, Nivel ${levelInfo.level}`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fog to-mint"
                          style={{ width: `${levelProgressPct}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-3 max-w-[28ch] text-base leading-relaxed text-storm">{getModuleProgressHint(nextLesson?.moduleSlug ?? modules[0]?.slug ?? "ia")}</p>
                    <div className="mt-4 text-center md:text-left">
                      <Link href="/niveles" className="text-sm font-bold text-mint hover:underline">
                        Ver roadmap
                      </Link>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-center">
                    {/* True bioreactor (b36670f): horizontal Rushton impeller,
                        clipped tank bubbles, waves — restored per 9bcd678. */}
                    <BioreactorProgress
                      exp={totalXp}
                      expToNext={levelInfo.nextLevelXp}
                      level={levelInfo.level}
                      rank={rankTitle(levelInfo.level)}
                      progressToNext={levelInfo.progressToNext}
                      size="lg"
                      hideMeta
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card flex h-full min-h-[360px] flex-col p-6 md:p-8">
                <h3 className="mb-2 text-lg font-bold uppercase tracking-wider text-storm">Misión Actual</h3>
                {nextLesson ? (
                  <>
                    <div className="mb-2 flex gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint">
                        {missionFavicon ? <img src={missionFavicon} alt="" className="h-12 w-12 object-contain" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-xl font-semibold leading-tight">{nextLesson.title}</h4>
                        <p className="text-sm text-storm">{getModuleDisplayName(nextLesson.moduleSlug)}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate line-clamp-2">
                          {getModuleShortDescription(nextLesson.moduleSlug)}
                        </p>
                      </div>
                      <div className="hidden shrink-0 items-start pt-1 sm:flex">
                        <BiotechGrowthTube exp={completedCount} maxExp={totalLessons} size={300} label="Crecimiento in vitro" />
                      </div>
                    </div>
                    <div className="mb-2 flex justify-center sm:hidden">
                      <BiotechGrowthTube exp={completedCount} maxExp={totalLessons} size={220} label="Crecimiento in vitro" />
                    </div>
                    {nextLesson && currentModule && (
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-storm">{currentModule.name}</span>
                          <span className="font-bold text-ink">
                            {currentModuleCompleted}/{currentModuleTotal} · {currentModulePct}%
                          </span>
                        </div>
                        <div className="h-4 w-full overflow-hidden rounded-full bg-surface-raised">
                          <div className="h-full rounded-full bg-gradient-to-r from-fog to-mint" style={{ width: `${currentModulePct}%` }} />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-storm">
                          La planta crece con cada módulo:{" "}
                          <span className="font-bold text-ink">
                            {completedCount}/{totalLessons}
                          </span>{" "}
                          lecciones → <span className="font-bold">{overallProgress}%</span> crecimiento.{" "}
                          {getModuleGrowthHint(nextLesson.moduleSlug)}
                        </p>
                      </div>
                    )}
                    <div className="mb-2 flex items-center gap-1 text-mint">
                      <Gem className="h-5 w-5" fill="currentColor" />
                      <span className="text-base font-bold">+{nextLesson.xp} XP</span>
                    </div>
                    <SlideArrowButton
                      text="Continuar misión"
                      primaryColor="var(--color-brand-400)"
                      href={missionHref ?? "/learn"}
                      size="lg"
                      className="mt-auto w-full text-base"
                    />
                  </>
                ) : (
                  <EmptyState
                    icon={CheckCircle2}
                    title="¡Completaste todas las lecciones!"
                    description="No quedan misiones pendientes en ninguna expedición."
                  />
                )}
              </div>

              <ProgressCharts timeline={timeline} modules={modulesData} daily={daily} overallProgress={overallProgress} />
            </div>
          </section>
        </div>
      </div>
        </div>
      </div>
    </InVitroShell>
  );
}
