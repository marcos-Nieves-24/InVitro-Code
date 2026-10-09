// Preview público de las cards canónicas — MISMOS componentes de producción
// (ModuleCard, ModuleGrid, LessonCard + dominio buildModuleCardModel/buildLessonCardModel).
// Sin auth. Usa getModules() real del filesystem + progreso mock para demostrar el diseño.
import { getModules, getLessonSlugs, getModuleShortDescription, getLessonFrontmatter } from "@/lib/content/modules";
import { getLabCardTheme, toSerializableTheme } from "@/components/labs/LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { buildModuleCardModel } from "@/domain/module-card";
import { buildLessonCardModel } from "@/domain/lesson-card";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { LessonCard } from "@/components/modules/LessonCard";

export default function PreviewCards() {
  const modules = getModules();

  const moduleItems = modules.map((mod) => {
    const slugs = getLessonSlugs(mod.slug);
    const xpReward = slugs.reduce((s, ls) => s + calcXpForLesson(mod.slug, ls), 0);
    const labCount = slugs.length;
    // Progreso mock (primer módulo 60%, resto 0) para mostrar ProgressFooter
    const completed = mod.slug === modules[0]?.slug ? Math.floor(labCount * 0.6) : 0;
    const model = buildModuleCardModel({
      slug: mod.slug,
      title: mod.title,
      description: getModuleShortDescription(mod.slug),
      lessonCount: labCount,
      labCount,
      xpReward,
      completed,
      total: labCount,
    });
    const theme = toSerializableTheme(getLabCardTheme(mod.slug));
    const href = mod.firstLesson ? `/learn/${mod.slug}/${mod.firstLesson}` : `/learn/${mod.slug}`;
    return { model, href, theme };
  });

  // LessonCards de muestra del primer módulo (primeras 3 lecciones)
  const firstMod = modules[0]?.slug ?? "python";
  const lessonItems = getLessonSlugs(firstMod)
    .slice(0, 3)
    .map((lessonSlug, i) => {
      const fm = getLessonFrontmatter(firstMod, lessonSlug);
      const model = buildLessonCardModel({
        moduleSlug: firstMod,
        lessonSlug,
        title: fm?.title ?? lessonSlug,
        difficulty: fm?.difficulty,
        estimatedDuration: fm?.estimatedDuration,
        prerequisites: fm?.prerequisites,
        completed: i === 0,
        blocked: false,
        xp: calcXpForLesson(firstMod, lessonSlug),
      });
      const theme = toSerializableTheme(getLabCardTheme(firstMod));
      const href = `/learn/${firstMod}/${lessonSlug}`;
      return { model, href, theme };
    });

  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-10">
      <div className="mx-auto max-w-[1360px] space-y-12">
        <header className="rounded-2xl border border-mint/30 bg-mint/5 p-4 text-sm text-storm">
          <strong className="text-ink">Preview público (sin auth)</strong> — mismas cards de
          producción: <code>ModuleCard</code>, <code>ModuleGrid</code>, <code>LessonCard</code> con{" "}
          <code>buildModuleCardModel</code>/<code>buildLessonCardModel</code>. Progreso mock.
        </header>

        <section>
          <h2 className="font-display mb-4 text-xl font-bold text-ink">ModuleCards (grid /learn)</h2>
          <ModuleGrid
            items={moduleItems}
            variant="grid"
            columns={3}
          />
        </section>

        <section>
          <h2 className="font-display mb-4 text-xl font-bold text-ink">LessonCards (lección)</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessonItems.map((item) => (
              <LessonCard
                key={item.model.lessonSlug}
                model={item.model}
                href={item.href}
                theme={item.theme}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
