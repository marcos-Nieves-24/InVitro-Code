// CANONICAL: vessel is canonical Bioreactor implementation — simple bubble variant lives in
// src/components/gamification/BioreactorProgress.tsx for ModuleProgress linear mode.
"use client";

import { motion, useReducedMotion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { BioreactorVessel } from "./BioreactorVessel";
import { useBioreactorMotion, type BioreactorState } from "./useBioreactorMotion";

export type BioreactorSize = "sm" | "md" | "lg" | "xl";

export interface BioreactorProgressProps {
  exp: number;
  expToNext: number;
  level: number;
  rank: string;
  progressToNext: number;
  size?: BioreactorSize;
  state?: BioreactorState;
  className?: string;
  hideMeta?: boolean;
  onLevelUpComplete?: () => void;
}

const sizeMap: Record<BioreactorSize, string> = {
  sm: "w-[96px] h-[132px]",
  md: "w-[160px] h-[220px]",
  lg: "w-[220px] h-[300px]",
  xl: "w-[320px] h-[440px]",
};

export function BioreactorProgress({
  exp,
  expToNext,
  level,
  rank,
  progressToNext,
  size = "md",
  state,
  className,
  hideMeta = false,
}: BioreactorProgressProps) {
  const expSafe = Number.isFinite(expToNext) && expToNext > 0 ? expToNext : 1;
  const raw = Number.isFinite(progressToNext) ? progressToNext : 0;
  const percent = Math.min(100, Math.max(0, (raw / expSafe) * 100));
  const derivedState: BioreactorState = state ?? (percent >= 100 ? "levelUp" : percent > 80 ? "filling" : "idle");
  const shouldReduce = useReducedMotion();
  const { vesselVariants: rawVariants } = useBioreactorMotion(derivedState, percent);
  const vesselVariants = Object.keys(rawVariants ?? {}).length ? (rawVariants as import("motion/react").Variants) : undefined;

  const a11yLabel = `Progreso de nivel: ${exp.toLocaleString("es")} de ${expToNext.toLocaleString("es")} puntos, ${Math.round(percent)} por ciento al siguiente nivel, Nivel ${level} ${rank}`;

  return (
    <div
      className={["relative flex flex-col items-center", className ?? ""].join(" ")}
      role="img"
      aria-label={a11yLabel}
    >
      <span className="eyebrow mb-2 text-[10px] tracking-[0.08em] text-storm">Cultivo en progreso</span>

      <motion.div
        className={["relative", sizeMap[size]].join(" ")}
        variants={shouldReduce ? undefined : vesselVariants}
        animate={shouldReduce ? undefined : derivedState}
        style={{ willChange: shouldReduce ? "auto" : "transform" }}
      >
        <BioreactorVessel
          percent={percent}
          fast={derivedState === "levelUp" || percent > 80}
          shouldReduce={!!shouldReduce}
        />
        {/* Bubbles now rendered inside BioreactorSvg clipped liquid for correct tank containment */}
      </motion.div>

      {!hideMeta && (
        <div className="mt-3 flex flex-col items-center">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-storm">
            <FlaskConical className="h-3 w-3" /> Nivel
          </span>
          <span className="font-display text-4xl font-black text-ink leading-none">{level}</span>
          <span className="text-xs font-bold text-storm">{rank}</span>
          {derivedState === "levelUp" && !shouldReduce && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-ink"
            >
              ¡Subiste de nivel!
            </motion.span>
          )}
        </div>
      )}

      {/* Semántica progressbar para AT */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${exp} de ${expToNext} EXP`}
        className="sr-only"
      />

      {derivedState === "levelUp" && (
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          ¡Subiste a Nivel {level}: {rank}!
        </span>
      )}

      {!hideMeta && (
        <>
          <p className="mt-2 font-mono text-[11px] font-bold tracking-[0.06em] text-storm">
            <span className="font-bold text-mint">{exp.toLocaleString("es")}</span> / {expToNext.toLocaleString("es")} EXP
          </p>
          <p className="text-xs font-medium text-storm">{Math.round(percent)}% al siguiente nivel</p>
        </>
      )}
    </div>
  );
}
