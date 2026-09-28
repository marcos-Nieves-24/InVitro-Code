import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { HeroWithConsole } from "@/components/shared/HeroWithConsole";
import { HubConsole } from "@/components/labs/consoles/HubConsole";
import { getProyectoHeroImage } from "@/lib/labs/heroImages";
import { getLabCardTheme, toSerializableTheme } from "@/components/labs/LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { ModuleCardContent } from "@/components/shared/ModuleCardContent";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import {
  getModules,
  getLessonSlugs,
  getLessonFrontmatter,
  getModuleDisplayName,
  getModuleOrder,
} from "@/lib/content/modules";

/**
 * REQ-PROJ-01/02/06: Content-driven projects hub. Server component — auth
 * gate, hero with console + grid of module cards (theme/tint/art/XP).
 * Mirrors /laboratorios hub structure with proyecto banners.
 */
export default async function ProyectosPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();
  const [profileRes, progressRes] = await Promise.all([
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
  ]);
  const userName = getDisplayName(profileRes.data ?? {});

  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  const modules = getModules();
  const sorted = [...modules].sort((a, b) => {
    const oa = getModuleOrder(a.slug);
    const ob = getModuleOrder(b.slug);
    if (oa !== ob) return oa - ob;
    return a.title.localeCompare(b.title);
  });

  return (
    <InVitroShell userName={userName} userRole={profileRes.data?.role} theme={profileRes.data?.theme}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10">
        <HeroWithConsole
          backgroundSrc={getProyectoHeroImage("hub")}
          eyebrow="Proyectos guiados"
          title="Proyectos"
          description="Cada módulo incluye proyectos guiados con consolas interactivas. Abre el notebook en Colab o descárgalo para trabajar en tu entorno."
          cta={{ href: "/proyectos/ia", label: "Explorar proyectos" }}
          console={<HubConsole />}
        />

        <div id="hub" className="mt-8">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-sm font-bold text-ink">No hay proyectos disponibles</p>
              <p className="text-xs text-storm">
                Agrega contenido en <code>src/content/modules/</code> para empezar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sorted.map((mod) => {
                const lessonSlugs = getLessonSlugs(mod.slug);
                const labCount = lessonSlugs.length;
                const xpReward = lessonSlugs.reduce((sum, slug) => sum + calcXpForLesson(mod.slug, slug), 0);
                const completedCount = lessonSlugs.filter((s) => completedLessonKeys.has(`${mod.slug}/${s}`)).length;
                const theme = toSerializableTheme(getLabCardTheme(mod.slug));
                const title = getModuleDisplayName(mod.slug);

                return (
                  <Link
                    key={mod.slug}
                    href={`/proyectos/${mod.slug}`}
                    className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
                    aria-label={`${title} — ${completedCount} de ${labCount} completados`}
                  >
                    <div
                      className="relative flex min-h-[220px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 transition-colors duration-[250ms] ease-out hover:shadow-lg md:p-7"
                      style={{ ["--card-accent" as string]: theme.accent } as React.CSSProperties}
                    >
                      <ModuleCardContent
                        theme={theme}
                        title={title}
                        lessonsCount={labCount}
                        xpReward={xpReward}
                        labCount={labCount}
                        completed={completedCount}
                        total={labCount}
                        compact={false}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </InVitroShell>
  );
}
