import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { LabHeroLoader } from "@/components/labs/LabHero/LabHeroLoader";
import { ModuleExplorerGrid } from "@/components/labs/explorer/ModuleExplorerGrid";
import type { LabModuleGroup } from "@/components/labs/LabHub";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import {
  getModules,
  getLessonSlugs,
  getLessonFrontmatter,
  getModuleDisplayName,
  getModuleOrder,
} from "@/lib/content/modules";

/**
 * REQ-HUB-01/02/04/06: Content-driven lab hub replacing the hardcoded
 * LabMission placeholder. Server component — auth gate, real progress
 * data, all module + lesson frontmatter read at request time.
 */
export default async function LaboratoriosPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  // ── User state (same pattern as proyectos page) ──
  const [profileRes, progressRes, streakRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, email, role, theme")
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

  // ── Build completed lesson key set from real progress ──
  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  // ── Build module groups for LabHub ──
  const modules = getModules();
  const labModules: LabModuleGroup[] = modules.map((mod) => ({
    slug: mod.slug,
    name: getModuleDisplayName(mod.slug),
    order: getModuleOrder(mod.slug),
    lessons: getLessonSlugs(mod.slug).map((lessonSlug) => ({
      slug: lessonSlug,
      frontmatter: getLessonFrontmatter(mod.slug, lessonSlug),
      completed: completedLessonKeys.has(`${mod.slug}/${lessonSlug}`),
    })),
  }));

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
      userRole={profileRes.data?.role}
      theme={profileRes.data?.theme}
      currentStreak={currentStreak}
    >
      <LabHeroLoader
        totalXp={totalXp}
        currentStreak={currentStreak}
        levelInfo={levelInfo}
        rankTitle={rankTitle(levelInfo.level)}
      />

      <div id="hub" className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10">
        <ModuleExplorerGrid modules={labModules} />
      </div>
    </InVitroShell>
  );
}
