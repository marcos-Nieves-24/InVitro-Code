import Link from "next/link";
import { CheckCircle2, BookOpen, GraduationCap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { LessonFrontmatter } from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { getLabCardTheme } from "./LabCardTheme";
import { LabCardArt } from "./LabCardArt";

interface LabCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
  completed: boolean;
  blocked?: boolean;
}

/** Difficulty → color + label mapping for Spanish difficulty levels. */
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

function difficultyBadge(difficulty: string | undefined): {
  color: string;
  label: string;
} {
  if (difficulty && DIFFICULTY_MAP[difficulty]) {
    return DIFFICULTY_MAP[difficulty];
  }
  return { color: "bg-surface-raised text-storm border-surface-raised", label: difficulty ?? "—" };
}

/**
 * REQ-HUB-03/05: Theme-aware lesson card with module-specific tint, vector art,
 * XP badge, duration, and completion/blocked states.
 */
export function LabCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
  completed,
  blocked = false,
}: LabCardProps) {
  const badge = difficultyBadge(lesson.difficulty);
  const theme = getLabCardTheme(moduleSlug);
  const xp = calcXpForLesson(moduleSlug, lessonSlug);
  const href = `/laboratorios/${moduleSlug}/${lessonSlug}`;

  return (
    <Link
      href={blocked ? "#" : href}
      aria-label={`${theme.label}: ${lesson.title}${completed ? " (completado)" : blocked ? " (bloqueado)" : ""}`}
      aria-disabled={blocked}
      tabIndex={blocked ? -1 : undefined}
      className={`card-hover widget-hover stagger-item group relative flex flex-col gap-3 rounded-2xl border-t-[3px] p-5 transition-all ${
        blocked
          ? "cursor-not-allowed opacity-60 border-t-surface-raised bg-surface-card"
          : completed
            ? "border-t-success-green bg-success-green/[0.03]"
            : "bg-surface-card hover:shadow-md"
      }`}
      style={{
        borderTopColor: completed ? "#22c55e" : theme.accent,
        backgroundColor: completed ? undefined : `${theme.tint}99`,
      }}
    >
      {/* Art — top right */}
      <div className="absolute right-4 top-4">
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CheckCircle2
              className="h-5 w-5 text-success-green"
              aria-label="Completado"
            />
          </motion.div>
        ) : blocked ? (
          <Lock className="h-4 w-4 text-storm" aria-label="Bloqueado" />
        ) : (
          <LabCardArt theme={theme} size={48} />
        )}
      </div>

      {/* Module chip — themed accent */}
      <span
        className="w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
        style={{
          borderColor: `${theme.accent}33`,
          backgroundColor: `${theme.accent}0D`,
          color: theme.accent,
        }}
      >
        {theme.label}
      </span>

      {/* Title */}
      <h3
        className={`text-sm font-bold leading-snug pr-14 ${
          completed ? "text-storm" : "text-ink"
        } group-hover:text-mint transition-colors`}
      >
        {lesson.title}
      </h3>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-storm">
        {/* Difficulty badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
        >
          <GraduationCap className="h-3 w-3" />
          {badge.label}
        </span>

        {/* Duration (if available) */}
        {lesson.estimatedDuration && (
          <span className="inline-flex items-center gap-1 text-[10px] text-storm">
            {lesson.estimatedDuration}
          </span>
        )}

        {/* Prerequisites (only if meaningful) */}
        {lesson.prerequisites &&
          lesson.prerequisites !== "Ninguno" &&
          lesson.prerequisites !== "ninguno" && (
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
              <BookOpen className="h-3 w-3 shrink-0" />
              {lesson.prerequisites}
            </span>
          )}
      </div>

      {/* XP badge — bottom right */}
      <span
        className="absolute bottom-3 right-3 text-[10px] font-bold tabular-nums"
        style={{ color: theme.accent }}
      >
        +{xp} XP
      </span>
    </Link>
  );
}
