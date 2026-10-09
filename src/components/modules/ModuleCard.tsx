"use client";

import Link from "next/link";
import type { ModuleCardModel } from "@/domain/module-card";
import type { LabCardTheme, SerializableLabCardTheme } from "@/components/labs/LabCardTheme";
import { CardArt, CardChip, CardShell, LabBadge, ProgressFooter, XpBadge } from "./CardPrimitives";

export interface ModuleCardProps {
  model: ModuleCardModel;
  href: string;
  variant?: "grid" | "compact";
  theme: LabCardTheme | SerializableLabCardTheme;
}

export function ModuleCard({ model, href, variant = "grid", theme }: ModuleCardProps) {
  const showProgress = variant === "grid" && model.progressPct !== null && model.completed !== null && model.total !== null;

  const artSize = variant === "compact" ? 56 : 88;

  return (
    <Link
      href={href}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
      aria-label={`${model.title} — ${model.lessonCount} lecciones`}
    >
      <CardShell accent={theme.accent} tint={theme.tint}>
        {/* Top row: chip + art */}
        <div className="flex items-start justify-between gap-3">
          <CardChip label={theme.label} accent={theme.accent} />
          <CardArt theme={theme} size={artSize} />
        </div>

        {/* Title */}
        <h3 className="font-display mt-4 text-xl font-bold leading-tight text-ink transition-colors duration-[250ms] group-hover:text-mint">
          {model.title}
        </h3>

        {/* Description */}
        {model.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-storm">{model.description}</p>
        ) : null}

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3">
          <XpBadge xp={model.xpReward} />
          <LabBadge count={model.labCount} />
        </div>

        {/* Progress — only grid + when progressPct available */}
        {showProgress ? (
          <ProgressFooter completed={model.completed!} total={model.total!} progressPct={model.progressPct!} />
        ) : null}
      </CardShell>
    </Link>
  );
}
