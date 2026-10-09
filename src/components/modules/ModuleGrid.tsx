"use client";

import { motion } from "motion/react";
import { FlaskConical } from "lucide-react";
import type { ModuleCardModel } from "@/domain/module-card";
import type { LabCardTheme, SerializableLabCardTheme } from "@/components/labs/LabCardTheme";
import { ModuleCard } from "./ModuleCard";

export interface ModuleGridItem {
  model: ModuleCardModel;
  href: string;
  theme: LabCardTheme | SerializableLabCardTheme;
}

export interface ModuleGridProps {
  items: ModuleGridItem[];
  variant?: "grid" | "compact";
  columns?: 3 | 4;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

export function ModuleGrid({ items, variant = "grid", columns }: ModuleGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-raised bg-surface-card px-6 py-16 text-center">
        <FlaskConical className="mb-3 h-10 w-10 text-storm/60" aria-hidden="true" />
        <p className="text-sm font-medium text-storm">No hay expediciones disponibles.</p>
        <p className="mt-1 max-w-sm text-xs text-storm/80">Vuelve pronto — estamos preparando nuevos módulos.</p>
      </div>
    );
  }

  const effectiveColumns = columns ?? (variant === "compact" ? 4 : 3);
  const lgCols = effectiveColumns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const gridClass = `grid grid-cols-1 gap-6 sm:grid-cols-2 ${lgCols}`;

  if (variant === "compact") {
    return (
      <div className={gridClass}>
        {items.map((item) => (
          <ModuleCard key={item.model.slug} model={item.model} href={item.href} theme={item.theme} variant={variant} />
        ))}
      </div>
    );
  }

  return (
    <motion.div className={gridClass} variants={containerVariants} initial="hidden" animate="show">
      {items.map((item) => (
        <motion.div key={item.model.slug} variants={itemVariants}>
          <ModuleCard model={item.model} href={item.href} theme={item.theme} variant={variant} />
        </motion.div>
      ))}
    </motion.div>
  );
}
