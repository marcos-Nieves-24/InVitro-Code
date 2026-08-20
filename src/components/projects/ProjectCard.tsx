import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import type { LessonFrontmatter } from "@/lib/content/modules";

interface ProjectCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
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
  return {
    color: "bg-surface-container text-outline border-outline-variant",
    label: difficulty ?? "—",
  };
}

/**
 * REQ-PROJ-03: Project card mirroring LabCard, linking to
 * /proyectos/{module}/{lesson}. Server component — display only. Shows
 * module chip, title, difficulty and prerequisites; no duration, no
 * completion badge (submission is out of scope).
 */
export function ProjectCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
}: ProjectCardProps) {
  const badge = difficultyBadge(lesson.difficulty);
  const href = `/proyectos/${moduleSlug}/${lessonSlug}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-2xl border border-surface-container bg-white p-5 transition-all hover:shadow-md"
    >
      {/* Module name chip */}
      <span className="w-fit rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-outline">
        {moduleName}
      </span>

      {/* Title */}
      <h3 className="text-sm font-bold leading-snug text-deep-navy transition-colors group-hover:text-primary">
        {lesson.title}
      </h3>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-outline">
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
            <span className="inline-flex max-w-[160px] items-center gap-1 truncate">
              <BookOpen className="h-3 w-3 shrink-0" />
              {lesson.prerequisites}
            </span>
          )}
      </div>
    </Link>
  );
}