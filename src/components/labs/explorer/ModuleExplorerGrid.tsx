"use client";

import { motion, useReducedMotion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { ModuleExplorerCard } from "./ModuleExplorerCard";
import { getLabCardTheme } from "../LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import type { LabModuleGroup } from "../LabHub";

interface ModuleExplorerGridProps {
  modules: LabModuleGroup[];
}

export function ModuleExplorerGrid({ modules }: ModuleExplorerGridProps) {
  const shouldReduce = useReducedMotion();

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

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.map((mod, idx) => {
        const labCount = mod.lessons.length;
        const completedCount = mod.lessons.filter((l) => l.completed).length;
        const xpReward = mod.lessons.reduce(
          (sum, l) => sum + calcXpForLesson(mod.slug, l.slug),
          0,
        );
        const theme = getLabCardTheme(mod.slug);

        const motionProps = shouldReduce
          ? {}
          : {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.25, delay: idx * 0.05, ease: "easeOut" as const },
            };

        return (
          <motion.div key={mod.slug} {...motionProps}>
            <ModuleExplorerCard
              moduleSlug={mod.slug}
              title={mod.name}
              xpReward={xpReward}
              labCount={labCount}
              completed={completedCount}
              total={labCount}
              theme={theme}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
