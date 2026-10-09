import type { LessonFrontmatter } from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { getLabCardTheme } from "./LabCardTheme";
import { LessonCard } from "@/components/modules/LessonCard";
import { buildLessonCardModel } from "@/domain/lesson-card";

interface LabCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
  completed: boolean;
  blocked?: boolean;
}

/**
 * REQ-HUB-03/05: Thin wrapper over canonical LessonCard.
 * Keeps public API stable for LabHub callers.
 */
export function LabCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
  completed,
  blocked = false,
}: LabCardProps) {
  const theme = getLabCardTheme(moduleSlug);
  const model = buildLessonCardModel({
    moduleSlug,
    lessonSlug,
    title: lesson.title,
    difficulty: lesson.difficulty,
    estimatedDuration: lesson.estimatedDuration,
    prerequisites: lesson.prerequisites,
    completed,
    blocked,
    xp: calcXpForLesson(moduleSlug, lessonSlug),
  });
  const href = `/laboratorios/${moduleSlug}/${lessonSlug}`;
  return <LessonCard model={model} href={href} theme={theme} moduleName={moduleName} />;
}
