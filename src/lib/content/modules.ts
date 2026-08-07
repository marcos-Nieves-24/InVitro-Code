import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calcXpForLesson } from "@/lib/gamification/utils";

export interface ModuleMeta {
  slug: string;
  title: string;
  firstLesson: string;
  lessonCount: number;
  order: number;
}

export interface LessonNavItem {
  slug: string;
  title: string;
}

export interface ModuleWithLessons {
  slug: string;
  name: string;
  lessons: LessonNavItem[];
}

export interface ModuleInfo {
  slug: string;
  name: string;
  totalLessons: number;
}

function modulesRoot(): string {
  return path.join(process.cwd(), "src/content/modules");
}

function readModuleJson(slug: string): { name?: string; order?: number } {
  const metaPath = path.join(modulesRoot(), slug, "module.json");
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return {};
  }
}

function titleCaseSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getModuleDisplayName(slug: string): string {
  const meta = readModuleJson(slug);
  if (meta.name) return meta.name;
  return titleCaseSlug(slug);
}

export function getModuleOrder(slug: string): number {
  const meta = readModuleJson(slug);
  if (typeof meta.order === "number") return meta.order;
  return Infinity;
}

export function getLessonCount(slug: string): number {
  const lessonDir = path.join(modulesRoot(), slug, "lessons");
  try {
    if (!fs.existsSync(lessonDir)) return 0;
    return fs
      .readdirSync(lessonDir, { withFileTypes: true })
      .filter((e) => e.isDirectory()).length;
  } catch {
    return 0;
  }
}

export function getFirstLesson(slug: string): string {
  const lessons = getLessonSlugs(slug);
  return lessons[0] || "";
}

/** Ordered lesson slugs for a module (deterministic sort, same as lesson pages). */
export function getLessonSlugs(moduleSlug: string): string[] {
  const lessonsDir = path.join(modulesRoot(), moduleSlug, "lessons");
  try {
    return fs
      .readdirSync(lessonsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

/** First lesson the user has NOT completed, across modules in order. */
export function getResumeHref(completedLessonKeys: Set<string>): string {
  for (const mod of getModules()) {
    for (const lessonSlug of getLessonSlugs(mod.slug)) {
      if (!completedLessonKeys.has(`${mod.slug}/${lessonSlug}`)) {
        return `/learn/${mod.slug}/${lessonSlug}`;
      }
    }
  }
  return "/dashboard";
}

function formatLessonName(slug: string): string {
  return slug
    .replace(/^lesson\d+_/, "")
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getLessonTitle(
  moduleSlug: string,
  lessonSlug: string,
): string | null {
  const lessonPath = path.join(
    modulesRoot(),
    moduleSlug,
    "lessons",
    lessonSlug,
    "lesson.md",
  );
  try {
    const source = fs.readFileSync(lessonPath, "utf8");
    const { data } = matter(source);
    const title = data["Lesson Title"] ?? data["title"];
    if (typeof title === "string" && title.length > 0) return title;
  } catch {
    /* fallback */
  }
  return null;
}

export function getLessons(moduleSlug: string): LessonNavItem[] {
  const lessonDir = path.join(modulesRoot(), moduleSlug, "lessons");
  try {
    if (!fs.existsSync(lessonDir)) return [];
    return fs
      .readdirSync(lessonDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({
        slug: e.name,
        title: getLessonTitle(moduleSlug, e.name) ?? formatLessonName(e.name),
      }));
  } catch {
    return [];
  }
}

/** Landing: modules with title + first lesson + count. */
export function getModules(): ModuleMeta[] {
  const dir = modulesRoot();
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((entry) => {
        const slug = entry.name;
        return {
          slug,
          title: getModuleDisplayName(slug),
          firstLesson: getFirstLesson(slug),
          lessonCount: getLessonCount(slug),
          order: getModuleOrder(slug),
        };
      })
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });
  } catch {
    return [];
  }
}

/** Learn sidebar: modules with lesson nav items. */
export function getModulesWithLessons(): ModuleWithLessons[] {
  const dir = modulesRoot();
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({
        slug: e.name,
        name: getModuleDisplayName(e.name),
        lessons: getLessons(e.name),
      }))
      .sort((a, b) => {
        const oa = getModuleOrder(a.slug);
        const ob = getModuleOrder(b.slug);
        if (oa !== ob) return oa - ob;
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}

/** Dashboard: modules with total lesson counts. */
export function getModulesInfo(): ModuleInfo[] {
  return getModules().map((m) => ({
    slug: m.slug,
    name: m.title,
    totalLessons: m.lessonCount,
  }));
}

export interface NextLesson {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  xp: number;
}

/**
 * Next incomplete lesson across modules in order (REQ-UP-02).
 * Returns `null` when every lesson is completed so the caller can show a
 * completion state instead of inventing a mission.
 */
// ── Lab helpers (used by subject pages and hub) ──

/** True when lab.md exists for the lesson (D8). */
export function hasLab(modSlug: string, lessonSlug: string): boolean {
  const labPath = path.join(
    modulesRoot(),
    modSlug,
    "lessons",
    lessonSlug,
    "lab.md",
  );
  return fs.existsSync(labPath);
}

/** True when quiz.md exists for the lesson (D8). */
export function hasQuiz(modSlug: string, lessonSlug: string): boolean {
  const quizPath = path.join(
    modulesRoot(),
    modSlug,
    "lessons",
    lessonSlug,
    "quiz.md",
  );
  return fs.existsSync(quizPath);
}

/** True when notebook.ipynb exists for the lesson (D12). */
export function hasNotebook(modSlug: string, lessonSlug: string): boolean {
  const nbPath = path.join(
    modulesRoot(),
    modSlug,
    "lessons",
    lessonSlug,
    "notebook.ipynb",
  );
  return fs.existsSync(nbPath);
}

export function getNextLesson(completedKeys: Set<string>): NextLesson | null {
  for (const mod of getModules()) {
    for (const lessonSlug of getLessonSlugs(mod.slug)) {
      if (!completedKeys.has(`${mod.slug}/${lessonSlug}`)) {
        return {
          moduleSlug: mod.slug,
          lessonSlug,
          title: getLessonTitle(mod.slug, lessonSlug) ?? formatLessonName(lessonSlug),
          xp: calcXpForLesson(mod.slug, lessonSlug),
        };
      }
    }
  }
  return null;
}
