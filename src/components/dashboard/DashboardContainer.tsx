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
} from "@/lib/content/modules";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { BioreactorProgress } from "./BioreactorProgress";
import { TestTube } from "./TestTube";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";
import {
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

  const modules = getModulesInfo();

  const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
  const completedCount = completedLessonKeys.size;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const nextLesson = getNextLesson(completedLessonKeys);
  const missionHref = nextLesson
    ? `/learn/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`
    : null;

  const startHref = getResumeHref(completedLessonKeys);

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

          {/* Tu Progreso + Misión Actual — paired grid (T3) */}
          <section className="scroll-mt-20">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">Tu Progreso</h3>
                  <Link href="/niveles" className="text-xs font-bold text-mint hover:underline">
                    Ver roadmap
                  </Link>
                </div>
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                  <BioreactorProgress
                    exp={totalXp}
                    expToNext={levelInfo.nextLevelXp}
                    level={levelInfo.level}
                    rank={rankTitle(levelInfo.level)}
                    progressToNext={levelInfo.progressToNext}
                    size="md"
                  />
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
                </div>
              </div>

              <div className="glass-card relative flex flex-col overflow-hidden rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-storm">Misión Actual</h3>
                {nextLesson ? (
                  <>
                    <div className="mb-6 flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-mint/30 text-mint">
                        {MissionIcon ? <MissionIcon className="h-8 w-8" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg font-semibold">{nextLesson.title}</h4>
                        <p className="text-sm text-storm">{getModuleDisplayName(nextLesson.moduleSlug)}</p>
                      </div>
                      <div className="hidden shrink-0 items-start pt-1 sm:flex">
                        <TestTube progress={overallProgress} size="lg" label={`${overallProgress}%`} />
                      </div>
                    </div>
                    <div className="mb-4 flex justify-center sm:hidden">
                      <TestTube progress={overallProgress} size="md" label={`${overallProgress}%`} />
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-mint">
                      <Gem className="h-4 w-4" fill="currentColor" />
                      <span className="text-sm font-bold">+{nextLesson.xp} XP</span>
                    </div>
                    <SlideArrowButton
                      text="Continuar misión"
                      primaryColor="var(--color-brand-400)"
                      href={missionHref ?? "/learn"}
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
        </div>
      </div>
    </InVitroShell>
  );
}
