"use client";

import { motion, useReducedMotion } from "motion/react";
import { Flame, Gem } from "lucide-react";

export interface GamingHUDProps {
  totalXp: number;
  levelInfo: { level: number; nextLevelXp: number; progressToNext: number };
  streak: { current_streak: number; longest_streak: number } | null;
}

export function GamingHUD({ totalXp, levelInfo, streak }: GamingHUDProps) {
  const shouldReduceMotion = useReducedMotion();
  const currentStreak = streak?.current_streak ?? 0;

  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.min(
    100,
    (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100,
  );
  const ringOffset =
    ringCircumference - (ringProgress / 100) * ringCircumference;

  const hoverProps = shouldReduceMotion
    ? {}
    : { whileHover: { scale: 1.05 }, transition: { duration: 0.15 } };

  return (
    <div
      className="flex items-center gap-4 px-4 py-2 md:gap-6 md:px-8"
      aria-label="Barra de progreso gaming"
    >
      {/* Nivel — mini anillo */}
      <motion.div
        {...hoverProps}
        className="flex items-center gap-2"
        aria-label={`Nivel ${levelInfo.level}`}
      >
        <div className="relative flex h-10 w-10 items-center justify-center">
          <svg
            className="h-10 w-10 -rotate-90"
            aria-hidden="true"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r={ringRadius}
              fill="transparent"
              stroke="var(--color-surface-raised)"
              strokeWidth="3"
            />
            <circle
              cx="22"
              cy="22"
              r={ringRadius}
              fill="transparent"
              stroke="var(--color-mint)"
              strokeWidth="3"
              strokeDasharray={ringCircumference}
              strokeDashoffset={shouldReduceMotion ? 0 : ringOffset}
              strokeLinecap="round"
              style={
                shouldReduceMotion
                  ? undefined
                  : { transition: "stroke-dashoffset 0.6s ease-out" }
              }
            />
          </svg>
          <span className="absolute text-xs font-black text-[var(--color-hud-text)]">
            {levelInfo.level}
          </span>
        </div>
        <span className="hidden text-xs font-bold text-[var(--color-hud-text)] sm:inline">
          Nivel {levelInfo.level}
        </span>
      </motion.div>

      {/* Racha — llama + contador */}
      <motion.div
        {...hoverProps}
        className="flex items-center gap-1.5"
        aria-label={`Racha: ${currentStreak} ${currentStreak === 1 ? "día" : "días"}`}
      >
        <Flame
          className="h-4 w-4 text-[var(--color-comic-accent)]"
          aria-hidden="true"
          fill={currentStreak > 0 ? "currentColor" : "none"}
        />
        <span className="text-sm font-bold text-[var(--color-hud-text)]">
          {currentStreak}
        </span>
        <span className="hidden text-xs text-[var(--color-hud-muted)] sm:inline">
          {currentStreak === 1 ? "día" : "días"}
        </span>
      </motion.div>

      {/* XP — gema + total */}
      <motion.div
        {...hoverProps}
        className="flex items-center gap-1.5"
        aria-label={`${totalXp.toLocaleString("es")} puntos de experiencia`}
      >
        <Gem
          className="h-4 w-4 text-[var(--color-comic-accent)]"
          aria-hidden="true"
          fill="currentColor"
        />
        <span className="text-sm font-bold text-[var(--color-hud-text)]">
          {totalXp.toLocaleString("es")} XP
        </span>
      </motion.div>
    </div>
  );
}
