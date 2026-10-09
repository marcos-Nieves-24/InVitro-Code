"use client";

import Link from "next/link";
import { CheckCircle2, BookOpen, GraduationCap, Lock } from "lucide-react";
import { motion } from "motion/react";
import type { LessonCardModel } from "@/domain/lesson-card";
import { normalizeDifficulty } from "@/domain/lesson-card";
import type { LabCardTheme, SerializableLabCardTheme } from "@/components/labs/LabCardTheme";
import { LabCardArt } from "@/components/labs/LabCardArt";

const DIFFICULTY_MAP: Record<string, { color: string; label: string }> = {
  Principiante: {
    color: "bg-success-green/10 text-success-green border-success-green/20",
    label: "Principiante",
  },
  Intermedio: {
    color: "bg-xp-gold/10 text-xp-gold border-xp-gold/20",
    label: "Intermedio",
  },
  Avanzado: {
    color: "bg-error/10 text-error border-error/20",
    label: "Avanzado",
  },
};

function difficultyBadge(difficultyLabel: string): { color: string; label: string } {
  const normalized = normalizeDifficulty(difficultyLabel === "—" ? undefined : difficultyLabel);
  // normalizeDifficulty returns the canonical label or "—"; use DIFFICULTY_MAP when available
  const key = normalized !== "—" ? normalized : difficultyLabel;
  if (key && DIFFICULTY_MAP[key]) return DIFFICULTY_MAP[key];
  // Fallback: if label is "—" or unknown, show neutral
  if (difficultyLabel === "—" || !difficultyLabel) {
    return { color: "bg-surface-raised text-storm border-surface-raised", label: "—" };
  }
  // For safety, if caller passed raw difficulty string already normalized
  if (DIFFICULTY_MAP[difficultyLabel]) return DIFFICULTY_MAP[difficultyLabel];
  return { color: "bg-surface-raised text-storm border-surface-raised", label: difficultyLabel };
}

export interface LessonCardProps {
  model: LessonCardModel;
  href: string;
  theme: LabCardTheme | SerializableLabCardTheme;
  moduleName?: string;
  variant?: "default" | "compact";
}

export function LessonCard({ model, href, theme, moduleName, variant = "default" }: LessonCardProps) {
  const isBlocked = model.state === "blocked";
  const isCompleted = model.state === "completed";
  const badge = difficultyBadge(model.difficultyLabel);
  const effectiveHref = isBlocked ? "#" : href;
  const chipLabel = moduleName ?? theme.label;

  return (
    <Link
      href={effectiveHref}
      aria-label={`${theme.label}: ${model.title}${isCompleted ? " (completado)" : isBlocked ? " (bloqueado)" : ""}`}
      aria-disabled={isBlocked}
      tabIndex={isBlocked ? -1 : undefined}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
    >
      <motion.div
        className={`relative flex flex-col gap-3 rounded-2xl border-t-[3px] p-5 transition-all ${
          isBlocked
            ? "cursor-not-allowed opacity-60 border-t-surface-raised bg-surface-card"
            : isCompleted
              ? "border-t-success-green bg-success-green/[0.03]"
              : "bg-surface-card hover:shadow-md"
        }`}
        style={
          {
            "--card-accent": theme.accent,
            borderTopColor: isCompleted ? "#22c55e" : theme.accent,
            backgroundColor: isCompleted ? undefined : `${theme.tint}99`,
          } as React.CSSProperties
        }
        whileHover={
          isBlocked
            ? undefined
            : {
                y: -4,
                borderColor: `${theme.accent}4D`,
                boxShadow:
                  "var(--shadow-lg, 0 8px 30px rgba(0,0,0,0.08)), 0 0 20px color-mix(in srgb, var(--card-accent) 14%, transparent)",
              }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Art — top right */}
        <div className="absolute right-4 top-4">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="h-5 w-5 text-success-green" aria-label="Completado" />
            </motion.div>
          ) : isBlocked ? (
            <Lock className="h-4 w-4 text-storm" aria-label="Bloqueado" />
          ) : (
            <LabCardArt theme={theme} size={48} />
          )}
        </div>

        {/* Module chip — themed accent */}
        <span
          className="w-fit whitespace-nowrap shrink-0 max-w-none rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide"
          style={{
            borderColor: `${theme.accent}33`,
            backgroundColor: `${theme.accent}0D`,
            color: theme.accent,
          }}
        >
          {chipLabel}
        </span>

        {/* Title */}
        <h3
          className={`text-sm font-bold leading-snug pr-14 transition-colors ${
            isCompleted ? "text-storm" : "text-ink"
          } group-hover:text-mint`}
        >
          {model.title}
        </h3>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-storm">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
          >
            <GraduationCap className="h-3 w-3" />
            {badge.label}
          </span>

          {model.estimatedDuration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-storm">{model.estimatedDuration}</span>
          )}

          {model.prerequisites && (
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
              <BookOpen className="h-3 w-3 shrink-0" />
              {model.prerequisites}
            </span>
          )}
        </div>

        {/* XP badge — bottom right */}
        <span
          className="absolute bottom-3 right-3 text-[10px] font-bold tabular-nums"
          style={{ color: theme.accent }}
        >
          +{model.xp} XP
        </span>
      </motion.div>
    </Link>
  );
}
