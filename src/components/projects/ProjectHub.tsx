"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FolderKanban } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { LessonFrontmatter } from "@/lib/content/modules";

export interface ProjectModuleGroup {
  slug: string;
  name: string;
  order: number;
  lessons: {
    slug: string;
    frontmatter: LessonFrontmatter | null;
  }[];
}

interface ProjectHubProps {
  modules: ProjectModuleGroup[];
}

/**
 * REQ-PROJ-02/06: Collapsible module sections with ProjectCard grid.
 * Client component — collapse state is local. Data (modules, lessons)
 * comes from the server page. No completion counter (submission is out of
 * scope).
 */
export function ProjectHub({ modules }: ProjectHubProps) {
  // All modules start expanded.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const mod of modules) initial.add(mod.slug);
    return initial;
  });

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <FolderKanban className="h-7 w-7" />
        </div>
        <p className="text-sm font-bold text-on-surface">
          No hay proyectos disponibles
        </p>
        <p className="text-xs text-on-surface-variant">
          Agrega contenido en <code>src/content/modules/</code> para empezar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {modules.map((mod) => {
        const isOpen = expanded.has(mod.slug);

        return (
          <section key={mod.slug}>
            {/* Module header — collapsible */}
            <button
              type="button"
              onClick={() => toggle(mod.slug)}
              className="mb-4 flex w-full items-center gap-3 rounded-xl px-2 py-1 text-left transition-colors hover:bg-surface-container-low"
            >
              <span className="text-outline">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
              <h2 className="font-display text-xl font-bold text-deep-navy">
                {mod.name}
              </h2>
            </button>

            {/* Project card grid (collapsed when !isOpen) */}
            {isOpen && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mod.lessons.map((lesson) => (
                  <ProjectCard
                    key={`${mod.slug}/${lesson.slug}`}
                    moduleSlug={mod.slug}
                    lessonSlug={lesson.slug}
                    lesson={
                      lesson.frontmatter ?? {
                        title: lesson.slug
                          .replace(/^lesson\d+_/, "")
                          .split(/[-_]/)
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" "),
                      }
                    }
                    moduleName={mod.name}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}