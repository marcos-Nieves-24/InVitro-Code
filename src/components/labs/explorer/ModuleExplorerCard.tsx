"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Zap, FlaskConical } from "lucide-react";
import type { LabCardTheme } from "../LabCardTheme";
import { LabCardArt } from "../LabCardArt";
import { ProgressTube } from "./ProgressTube";

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
        {/* Top row: chip + art */}
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide"
            style={{
              backgroundColor: `${theme.accent}14`,
              borderColor: `${theme.accent}30`,
              color: theme.accent,
            }}
          >
            {theme.label}
          </span>
          <span className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110">
            <LabCardArt theme={theme} size={44} />
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display mt-4 text-xl font-bold leading-tight text-ink transition-colors duration-[250ms] group-hover:text-mint">
          {title}
        </h3>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3 font-mono text-sm text-storm">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5">
            <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5">
            <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {labCount} labs
          </span>
        </div>

        {/* Progress row */}
        <div className="mt-6 flex items-center gap-4">
          <ProgressTube completed={completed} total={total} size="lg" accent={theme.accent} />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-sm font-semibold text-ink">
              {completed}/{total} completados
            </span>
            <span className="text-xs text-storm">
              {total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%"} progreso
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
