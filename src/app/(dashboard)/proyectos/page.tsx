import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { ProjectHub } from "@/components/projects/ProjectHub";
import type { ProjectModuleGroup } from "@/components/projects/ProjectHub";
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
 * gate, all module + lesson frontmatter read at request time, grouped by
 * module. Supersedes the hardcoded Wine-Quality demo page.
 */
export default async function ProyectosPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();
  const profileRes = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", userId)
    .maybeSingle();
  const userName = getDisplayName(profileRes.data ?? {});

  // ── Build module groups for ProjectHub ──
  const modules = getModules();
  const projectModules: ProjectModuleGroup[] = modules.map((mod) => ({
    slug: mod.slug,
    name: getModuleDisplayName(mod.slug),
    order: getModuleOrder(mod.slug),
    lessons: getLessonSlugs(mod.slug).map((lessonSlug) => ({
      slug: lessonSlug,
      frontmatter: getLessonFrontmatter(mod.slug, lessonSlug),
    })),
  }));

  return (
    <InVitroShell userName={userName}>
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-deep-navy">
            Proyectos
          </h1>
          <p className="mt-1 text-sm text-outline">
            Cada módulo incluye proyectos guiados con consolas interactivas.
            Abre el notebook en Colab o descárgalo para trabajar en tu entorno.
          </p>
        </div>

        <ProjectHub modules={projectModules} />
      </div>
    </InVitroShell>
  );
}