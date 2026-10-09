import { FlaskConical } from "lucide-react";
import { ModuleGrid, type ModuleGridItem } from "@/components/modules/ModuleGrid";
import { buildModuleCardModel } from "@/domain/module-card";
import { getLabCardTheme, toSerializableTheme } from "../LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { getModuleShortDescription } from "@/lib/content/modules";
import type { LabModuleGroup } from "../LabHub";

interface ModuleExplorerGridProps {
  modules: LabModuleGroup[];
}

export function ModuleExplorerGrid({ modules }: ModuleExplorerGridProps) {
  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fog/20 text-mint">
          <FlaskConical className="h-7 w-7" />
        </div>
        <p className="text-sm font-bold text-ink">No hay modulos disponibles</p>
        <p className="text-xs text-storm">
          Agrega contenido en <code>src/content/modules/</code> para empezar.
        </p>
      </div>
    );
  }

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  const items: ModuleGridItem[] = sorted.map((mod) => {
    const labCount = mod.lessons.length;
    const completedCount = mod.lessons.filter((l) => l.completed).length;
    const xpReward = mod.lessons.reduce((sum, l) => sum + calcXpForLesson(mod.slug, l.slug), 0);
    const title = mod.name;
    const description = getModuleShortDescription(mod.slug);
    const theme = toSerializableTheme(getLabCardTheme(mod.slug));
    const model = buildModuleCardModel({
      slug: mod.slug,
      title,
      description,
      lessonCount: labCount,
      labCount,
      xpReward,
      completed: completedCount,
      total: labCount,
    });
    const href = `/laboratorios/${mod.slug}`;

    return { model, href, theme };
  });

  return <ModuleGrid items={items} variant="grid" columns={4} />;
}
