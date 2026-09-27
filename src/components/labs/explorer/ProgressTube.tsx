"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface ProgressTubeProps {
  completed: number;
  total: number;
  size?: "sm" | "md" | "lg";
  accent?: string;
  showTicks?: boolean;
}

const sizeDimensions: Record<NonNullable<ProgressTubeProps["size"]>, { width: number; height: number }> = {
  sm: { width: 32, height: 80 },
  md: { width: 48, height: 112 },
  lg: { width: 64, height: 140 },
};

export function ProgressTube({
  completed,
  total,
  size = "md",
  accent,
  showTicks = true,
}: ProgressTubeProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `pt-clip-${uid}`;
  const gradId = `pt-grad-${uid}`;
  const shouldReduce = useReducedMotion();

  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.min(Math.max(0, completed), safeTotal || completed);
  const pct = safeTotal > 0 ? Math.min(100, Math.max(0, (safeCompleted / safeTotal) * 100)) : 0;

  // Tube geometry — inner fill area (consistent with TestTube proportions scaled to 48x96 viewBox)
  const innerTop = 10;
  const innerBottom = 86;
  const innerHeight = innerBottom - innerTop; // 76
  const innerX = 12;
  const innerW = 24;
  const fillH = (pct / 100) * innerHeight;
  const fillY = innerBottom - fillH;

  const dims = sizeDimensions[size];
  const accentColor = accent || "var(--color-mint)";
  // fallback hex for gradient when CSS var not resolved — mint #00B5C5
  const accentFallback = accent || "#00B5C5";
  const ticks = [25, 50, 75];

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      style={{ width: dims.width }}
      role="progressbar"
      aria-valuenow={safeCompleted}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      aria-label={`Progreso ${safeCompleted} de ${safeTotal} — ${Math.round(pct)}%`}
      aria-valuetext={`${safeCompleted}/${safeTotal}`}
    >
      <svg
        viewBox="0 0 48 96"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: dims.width, height: dims.height, overflow: "visible", display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={accentFallback} stopOpacity={0.95} />
            <stop offset="55%" stopColor={accentFallback} stopOpacity={0.85} />
            <stop offset="100%" stopColor={accentFallback} stopOpacity={0.75} />
            {/* CSS var override via style when accent is var */}
            <stop offset="0%" stopColor={accentColor} stopOpacity={0} style={{ stopColor: accentColor } as React.CSSProperties} />
          </linearGradient>
          {/* Actual gradient used — prefers CSS var accent, falls back to hex */}
          <linearGradient id={`${gradId}-v`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.65} />
          </linearGradient>
          <clipPath id={clipId}>
            <path
              d={`M${innerX},${innerTop} H${innerX + innerW} V${innerBottom - 4} C${innerX + innerW},${innerBottom + 2} ${innerX},${innerBottom + 2} ${innerX},${innerBottom - 4} Z`}
            />
          </clipPath>
        </defs>

        {/* Top lip */}
        <rect
          x="6"
          y="4"
          width="36"
          height="8"
          rx="2"
          fill="var(--color-surface-card)"
          stroke="var(--color-slate)"
          strokeWidth="1.2"
          opacity="0.95"
        />
        <rect x="6" y="4" width="36" height="3" rx="1.2" fill="var(--color-surface-raised)" opacity="0.9" />

        {/* Glass vessel outline */}
        <path
          d={`M${innerX},${innerTop} H${innerX + innerW} V${innerBottom - 4} C${innerX + innerW},${innerBottom + 2} ${innerX},${innerBottom + 2} ${innerX},${innerBottom - 4} Z`}
          fill="var(--color-surface-card)"
          fillOpacity="0.45"
          stroke="var(--color-slate)"
          strokeWidth="1.4"
        />
        {/* inner highlight reflection */}
        <path
          d={`M${innerX + 3},${innerTop + 2} V${innerBottom - 8} C${innerX + 3},${innerBottom} ${innerX},${innerBottom} ${innerX},${innerBottom - 8} Z`}
          fill="var(--color-surface-card)"
          opacity="0.3"
        />

        {/* Liquid fill — clipped */}
        <g clipPath={`url(#${clipId})`}>
          {shouldReduce ? (
            <rect
              x={innerX}
              y={fillY}
              width={innerW}
              height={fillH + 2}
              fill={accentColor}
              style={{ fill: accentColor }}
            />
          ) : (
            <motion.rect
              x={innerX}
              y={fillY}
              width={innerW}
              height={fillH + 2}
              fill={accentColor}
              style={{ fill: accentColor }}
              initial={false}
              animate={{ y: fillY, height: fillH + 2 }}
              transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.8 }}
            />
          )}
          {/* surface ellipse when fill visible */}
          {pct > 3 &&
            (shouldReduce ? (
              <ellipse cx={24} cy={fillY + 0.5} rx={11} ry={2.2} fill={accentColor} opacity={0.9} />
            ) : (
              <motion.ellipse
                cx={24}
                cy={fillY + 0.5}
                rx={11}
                ry={2.2}
                fill={accentColor}
                opacity={0.9}
                animate={{ scaleX: [1, 1.04, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "24px 0px" }}
              />
            ))}
        </g>

        {/* Tick marks at 25/50/75 */}
        {showTicks &&
          ticks.map((t) => {
            const y = innerBottom - (t / 100) * innerHeight;
            const reached = pct >= t;
            return (
              <g key={t} opacity={reached ? 0.6 : 0.3}>
                <line
                  x1={innerX + innerW - 10}
                  x2={innerX + innerW - 1}
                  y1={y}
                  y2={y}
                  stroke="var(--color-slate)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
                <line
                  x1={innerX + 1}
                  x2={innerX + 6}
                  y1={y}
                  y2={y}
                  stroke="var(--color-surface-raised)"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  opacity={0.7}
                />
              </g>
            );
          })}

        {/* Glass shine */}
        <path
          d={`M${innerX + 2},${innerTop + 6} Q${innerX + 6},${(innerTop + innerBottom) / 2} ${innerX + 4},${innerBottom - 10}`}
          stroke="var(--color-surface-card)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />
      </svg>

      {/* Label below tube */}
      <span className="font-mono text-[11px] font-semibold tracking-wide text-storm" aria-hidden="true">
        {safeCompleted}/{safeTotal}
      </span>
    </div>
  );
}
