"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { LessonFrontmatter } from "@/lib/content/modules";
import { getLabCardTheme } from "@/components/labs/LabCardTheme";
import { ModuleCardContent } from "@/components/shared/ModuleCardContent";
import { calcXpForLesson } from "@/lib/gamification/utils";

interface ProjectCardProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: LessonFrontmatter;
  moduleName: string;
}

/**
 * REQ-PROJ-03: Theme-driven project card delegating to ModuleCardContent.
 * Links to /proyectos/{module}/{lesson} with XP badge via theme accent.
 */
export function ProjectCard({
  moduleSlug,
  lessonSlug,
  lesson,
  moduleName,
}: ProjectCardProps) {
  const theme = getLabCardTheme(moduleSlug);
  const xp = calcXpForLesson(moduleSlug, lessonSlug);
  const href = `/proyectos/${moduleSlug}/${lessonSlug}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
      aria-label={`${theme.label}: ${lesson.title}`}
    >
      <motion.div
        className="relative flex min-h-[200px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 transition-colors duration-[250ms] ease-out hover:shadow-lg"
        style={{ ["--card-accent" as string]: theme.accent } as React.CSSProperties}
        whileHover={{
          y: -4,
          borderColor: `${theme.accent}4D`,
          boxShadow: "var(--shadow-lg), 0 0 20px color-mix(in srgb, var(--card-accent) 14%, transparent)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <ModuleCardContent
          theme={theme}
          title={lesson.title}
          lessonsCount={1}
          xpReward={xp}
          labCount={1}
          compact={false}
          slugLabel={moduleName}
        />
        <span
          className="absolute bottom-3 right-3 text-[10px] font-bold tabular-nums"
          style={{ color: theme.accent }}
        >
          +{xp} XP
        </span>
      </motion.div>
    </Link>
  );
}