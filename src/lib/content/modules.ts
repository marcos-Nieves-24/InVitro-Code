import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  const lessonsDir = path.join(modulesRoot(), slug, "lessons");
  try {
    const lessons = fs
      .readdirSync(lessonsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    return lessons[0] || "";
  } catch {
    return "";
  }
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
