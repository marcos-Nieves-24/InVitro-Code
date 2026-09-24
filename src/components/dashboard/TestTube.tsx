"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface TestTubeProps {
  progress: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}

const sizeMap: Record<NonNullable<TestTubeProps["size"]>, string> = {
  sm: "w-[52px] h-[88px]",
  md: "w-[78px] h-[132px]",
  lg: "w-[104px] h-[176px]",
  xl: "w-[156px] h-[264px]",
};

export function TestTube({ progress, size = "md", label }: TestTubeProps) {
  const clamped = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;
  const uid = useId();
  const clipId = `testtube-clip-${uid.replace(/:/g, "")}`;
  const gradId = `testtube-grad-${uid.replace(/:/g, "")}`;
  const shouldReduce = useReducedMotion();

  // Tube geometry: inner height 82 (y 8 -> 90), width 24 (x12-36)
  const innerTop = 10;
  const innerBottom = 86;
  const innerHeight = innerBottom - innerTop; // 76
  const innerX = 12;
  const innerW = 24;
  const fillH = (clamped / 100) * innerHeight;
  const fillY = innerBottom - fillH;

  const ticks = [25, 50, 75];

  return (
    <div
      className={["flex flex-col items-center gap-1.5", sizeMap[size]].join(" ")}
      role="img"
      aria-label={label ? `${label} — ${clamped}%` : `Progreso ${clamped}%`}
    >
      <svg
        viewBox="0 0 48 96"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-brand-600)" />
            <stop offset="55%" stopColor="var(--color-brand-400)" />
            <stop offset="100%" stopColor="var(--color-brand-300)" />
          </linearGradient>
          <clipPath id={clipId}>
            {/* rounded bottom: rect + half-circle bottom */}
            <path d={`M${innerX},${innerTop} H${innerX + innerW} V${innerBottom - 4} C${innerX + innerW},${innerBottom + 2} ${innerX},${innerBottom + 2} ${innerX},${innerBottom - 4} Z`} />
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
          opacity="0.35"
        />

        {/* Liquid fill — clipped */}
        <g clipPath={`url(#${clipId})`}>
          {shouldReduce ? (
            <rect x={innerX} y={fillY} width={innerW} height={fillH + 2} fill={`url(#${gradId})`} />
          ) : (
            <motion.rect
              x={innerX}
              y={fillY}
              width={innerW}
              height={fillH + 2}
              fill={`url(#${gradId})`}
              initial={{ y: innerBottom, height: 0 }}
              animate={{ y: fillY, height: fillH + 2 }}
              transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.8 }}
            />
          )}
          {/* surface ellipse when fill visible */}
          {clamped > 3 &&
            (shouldReduce ? (
              <ellipse cx={24} cy={fillY + 0.5} rx={11} ry={2.2} fill="var(--color-brand-300)" opacity={0.9} />
            ) : (
              <motion.ellipse
                cx={24}
                cy={fillY + 0.5}
                rx={11}
                ry={2.2}
                fill="var(--color-brand-300)"
                opacity={0.9}
                animate={{ scaleX: [1, 1.04, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "24px 0px" }}
              />
            ))}
        </g>

        {/* Tick marks at 25/50/75 */}
        {ticks.map((t) => {
          const y = innerBottom - (t / 100) * innerHeight;
          return (
            <g key={t} opacity={clamped >= t ? 0.9 : 0.35}>
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
      {label ? <span className="font-mono text-[10px] font-bold tracking-widest text-storm">{label}</span> : null}
      {/* a11y progressbar */}
      <span
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={label ?? `${Math.round(clamped)}%`}
        className="sr-only"
      />
    </div>
  );
}
