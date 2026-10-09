import type { LessonFrontmatter } from "@/lib/content/modules";
import { getLabCardTheme } from "@/components/labs/LabCardTheme";
import { LessonCard } from "@/components/modules/LessonCard";
import { buildLessonCardModel } from "@/domain/lesson-card";
import { calcXpForLesson } from "@/lib/gamification/utils";

interface ProjectCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
}

/**
 * REQ-PROJ-03: Thin wrapper over canonical LessonCard.
 * Keeps public API stable for ProjectHub callers.
 */
export function ProjectCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
}: ProjectCardProps) {
  const theme = getLabCardTheme(moduleSlug);
  const model = buildLessonCardModel({
    moduleSlug,
    lessonSlug,
    title: lesson.title,
    difficulty: lesson.difficulty,
    estimatedDuration: lesson.estimatedDuration,
    prerequisites: lesson.prerequisites,
    completed: false,
    blocked: false,
    xp: calcXpForLesson(moduleSlug, lessonSlug),
  });
  const href = `/proyectos/${moduleSlug}/${lessonSlug}`;
  return <LessonCard model={model} href={href} theme={theme} moduleName={moduleName} />;
}