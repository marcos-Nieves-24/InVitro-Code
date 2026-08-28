import Link from "next/link";
import { CheckCircle2, BookOpen, GraduationCap } from "lucide-react";
import type { LessonFrontmatter } from "@/lib/content/modules";

interface LabCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
  completed: boolean;
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
 * REQ-HUB-03/05: Lesson card showing frontmatter metadata, completion state,
 * and a link to the lab page. Server component — display only.
 */
export function LabCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
  completed,
}: LabCardProps) {
  const badge = difficultyBadge(lesson.difficulty);
  const href = `/laboratorios/${moduleSlug}/${lessonSlug}`;

  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:shadow-md ${
        completed
          ? "border-success-green/30 bg-success-green/[0.03]"
          : "border-surface-container bg-surface-card"
      }`}
    >
      {/* Completion badge */}
      {completed && (
        <div className="absolute right-4 top-4">
          <CheckCircle2 className="h-5 w-5 text-success-green" aria-label="Completado" />
        </div>
      )}

      {/* Module name chip */}
      <span className="w-fit rounded-full border border-surface-raised bg-surface-raised px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-storm">
        {moduleName}
      </span>

      {/* Title */}
      <h3
        className={`text-sm font-bold leading-snug ${
          completed ? "text-storm" : "text-ink"
        } group-hover:text-mint transition-colors`}
      >
        {lesson.title}
      </h3>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-storm">
        {/* Difficulty badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
        >
          <GraduationCap className="h-3 w-3" />
          {badge.label}
        </span>

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
    </Link>
  );
}
