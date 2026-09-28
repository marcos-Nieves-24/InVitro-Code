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
import { BioreactorProgress } from "./BioreactorProgress";
import { BiotechGrowthTube } from "./BiotechGrowthTube";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Gem,
  Terminal,
} from "lucide-react";

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
  const missionFavicon = nextLesson ? MODULE_FAVICON[nextLesson.moduleSlug] ?? "/labs/modules/ia.svg" : null;
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

          {/* Tu Progreso + Misión Actual — video circuit a la destra */}
          <div className="relative overflow-hidden rounded-2xl">
            <video autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover rounded-2xl">
              <source src="/videos/circuit-growth-animation.mp4" type="video/mp4" />
            </video>
            <div aria-hidden="true" className="absolute inset-0 bg-white/10 dark:bg-black/10" />
            <div className="relative p-2">
              <section className="scroll-mt-20">
                <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card rounded-xl p-6 grid gap-6 md:grid-cols-[1.1fr_auto] items-center">
                <div className="order-1">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">Tu Progreso</h3>
                    <Link href="/niveles" className="text-xs font-bold text-mint hover:underline">
                      Ver roadmap
                    </Link>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="font-display text-lg font-bold">{rankTitle(levelInfo.level)}</p>
                    <p className="mt-1 text-sm text-storm">
                      <span className="font-bold text-mint">{totalXp}</span> / {levelInfo.nextLevelXp} XP
                    </p>
                    <div className="mx-auto mt-3 h-2 w-full max-w-[10rem] overflow-hidden rounded-full bg-surface-raised md:mx-0">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fog to-mint"
                        style={{
                          width: `${Math.min(100, (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-storm max-w-[32ch]">
                    {(() => {
                      const raw = getModuleProgressHint(nextLesson?.moduleSlug ?? modules[0]?.slug ?? "ia");
                      const idx = raw.indexOf("EXP");
                      if (idx === -1) return raw;
                      return (
                        <>
                          {raw.slice(0, idx)}
                          <span className="font-bold text-mint">EXP</span>
                          {raw.slice(idx + 3)}
                        </>
                      );
                    })()}
                  </p>
                </div>
                <div className="order-2 flex justify-center md:justify-end">
                  <BioreactorProgress
                    exp={totalXp}
                    expToNext={levelInfo.nextLevelXp}
                    level={levelInfo.level}
                    rank={rankTitle(levelInfo.level)}
                    progressToNext={levelInfo.progressToNext}
                    size="xl"
                  />
                </div>
              </div>

              <div className="glass-card relative flex min-h-0 flex-col self-start overflow-hidden rounded-xl p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-storm">Misión Actual</h3>
                {nextLesson ? (
                  <>
                    <div className="mb-4 flex gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint">
                        {missionFavicon ? <img src={missionFavicon} alt="" className="h-12 w-12 object-contain" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg font-semibold">{nextLesson.title}</h4>
                        <p className="text-sm text-storm">{getModuleDisplayName(nextLesson.moduleSlug)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate line-clamp-2">
                          {getModuleShortDescription(nextLesson.moduleSlug)}
                        </p>
                      </div>
                      <div className="hidden shrink-0 items-start pt-1 sm:flex">
                        <BiotechGrowthTube exp={completedCount} maxExp={totalLessons} size={320} label="Crecimiento in vitro" />
                      </div>
                    </div>
                    <div className="mb-3 flex justify-center sm:hidden">
                      <BiotechGrowthTube exp={completedCount} maxExp={totalLessons} size={320} label="Crecimiento in vitro" />
                    </div>
                    {nextLesson && currentModule && (
                      <div className="mb-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-storm">{currentModule.name}</span>
                          <span className="font-bold text-ink">
                            {currentModuleCompleted}/{currentModuleTotal} · {currentModulePct}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                          <div className="h-full rounded-full bg-gradient-to-r from-fog to-mint" style={{ width: `${currentModulePct}%` }} />
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-storm">
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
                      <Gem className="h-4 w-4" fill="currentColor" />
                      <span className="text-sm font-bold">+{nextLesson.xp} XP</span>
                    </div>
                    <SlideArrowButton
                      text="Continuar misión"
                      primaryColor="var(--color-brand-400)"
                      href={missionHref ?? "/learn"}
                      size="md"
                      className="mt-auto w-full text-sm"
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
            </div>
          </section>

          <footer className="relative mt-8 p-8 text-center text-sm text-storm" aria-hidden="true" />
        </div>
      </div>
        </div>
      </div>
    </InVitroShell>
  );
}
