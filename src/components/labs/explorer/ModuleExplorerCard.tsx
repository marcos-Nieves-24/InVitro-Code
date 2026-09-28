"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { LabCardTheme } from "../LabCardTheme";
import { ModuleCardContent } from "@/components/shared/ModuleCardContent";

export interface ModuleExplorerCardProps {
  moduleSlug: string;
  title: string;
  xpReward: number;
  labCount: number;
  completed: number;
  total: number;
  theme: LabCardTheme;
}

export function ModuleExplorerCard({
  moduleSlug,
  title,
  xpReward,
  labCount,
  completed,
  total,
  theme,
}: ModuleExplorerCardProps) {
  return (
    <Link
      href={`/laboratorios/${moduleSlug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`${title} — ${completed} de ${total} completados`}
    >
      <motion.div
        className="relative flex min-h-[220px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 md:p-7 transition-colors duration-[250ms] ease-out hover:shadow-lg"
        style={
          {
            // expose accent for hover glow via CSS var
            ["--card-accent" as string]: theme.accent,
          } as React.CSSProperties
        }
        whileHover={{
          y: -4,
          borderColor: `${theme.accent}4D`,
          boxShadow: "var(--shadow-lg), 0 0 20px color-mix(in srgb, var(--card-accent) 14%, transparent)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <ModuleCardContent
          theme={theme}
          title={title}
          lessonsCount={labCount}
          xpReward={xpReward}
          labCount={labCount}
          completed={completed}
          total={total}
          compact={false}
        />
       </motion.div>
    </Link>
  );
}
