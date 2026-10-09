import { Compass } from "lucide-react";
import { getModules, getModuleShortDescription, getLessonSlugs } from "@/lib/content/modules";
import { getLabCardTheme, toSerializableTheme } from "@/components/labs/LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { buildModuleCardModel } from "@/domain/module-card";
import { ModuleGrid } from "@/components/modules/ModuleGrid";

export default function LearnIndexPage() {
  const modules = getModules();

  const items = modules.map((mod) => {
    const slugs = getLessonSlugs(mod.slug);
    const xpReward = slugs.reduce((sum, ls) => sum + calcXpForLesson(mod.slug, ls), 0);
    const theme = toSerializableTheme(getLabCardTheme(mod.slug));
    const model = buildModuleCardModel({
      slug: mod.slug,
      title: mod.title,
      description: getModuleShortDescription(mod.slug),
      lessonCount: mod.lessonCount,
      labCount: mod.lessonCount,
      xpReward,
      completed: null,
      total: null,
    });
    const href = mod.firstLesson ? `/learn/${mod.slug}/${mod.firstLesson}` : `/learn/${mod.slug}`;
    return { model, href, theme };
  });

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-mint">Expediciones</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">Elige tu Expedición</h2>
          <p className="mt-1 text-storm">Cada módulo es una expedición hacia el dominio de la Inteligencia Artificial.</p>
        </div>
        <Compass className="hidden h-10 w-10 text-mint md:block" />
      </div>

      <ModuleGrid items={items} variant="grid" />
    </div>
  );
}
