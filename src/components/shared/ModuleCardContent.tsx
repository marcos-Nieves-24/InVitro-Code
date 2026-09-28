"use client";

import { Zap, FlaskConical } from "lucide-react";
import type { SerializableLabCardTheme } from "@/components/labs/LabCardTheme";
import { LabCardArt } from "@/components/labs/LabCardArt";
import { BiotechGrowthTube } from "@/components/dashboard/BiotechGrowthTube";

export interface ModuleCardContentProps {
  theme: SerializableLabCardTheme;
  title: string;
  description?: string;
  lessonsCount: number;
  xpReward?: number;
  labCount?: number;
  completed?: number;
  total?: number;
  compact?: boolean;
  slugLabel?: string;
}

/**
 * Unified interior for module cards — used by both orbital and grid variants.
 * Reuses styles from ModuleExplorerCard and OrbitalModules.
 */
export function ModuleCardContent({
  theme,
  title,
  description,
  lessonsCount,
  xpReward,
  labCount,
  completed,
  total,
  compact = false,
  slugLabel,
}: ModuleCardContentProps) {
  const showProgress = !compact && typeof completed === "number" && typeof total === "number";
  const effectiveXp = xpReward ?? 0;
  const effectiveLabs = labCount ?? lessonsCount;
  const artSize = compact ? 48 : 88;

  return (
    <>
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
          {slugLabel ?? theme.label}
        </span>
        <span className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110">
          <LabCardArt theme={theme} size={artSize} />
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display mt-4 text-xl font-bold leading-tight text-ink transition-colors duration-[250ms] group-hover:text-mint">
        {title}
      </h3>

      {description ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">{description}</p>
      ) : null}

      {/* Meta row */}
      <div className="mt-3 flex items-center gap-3 font-mono text-sm text-storm">
        {effectiveXp > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5">
            <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {effectiveXp} XP
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5">
            <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {lessonsCount} lecciones
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5">
          <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {effectiveLabs} labs
        </span>
      </div>

      {/* Progress row — BiotechGrowthTube */}
      {showProgress ? (
        <div className="mt-6 flex items-center gap-4">
          <BiotechGrowthTube
            exp={completed!}
            maxExp={total!}
            size={96}
            label={`${completed}/${total}`}
            className="shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-sm font-semibold text-ink">
              {completed}/{total} completados
            </span>
            <span className="text-xs text-storm">
              {total! > 0 ? `${Math.round((completed! / total!) * 100)}%` : "0%"} progreso
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
