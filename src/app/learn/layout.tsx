import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Sidebar } from "@/components/learn/Sidebar";

interface Lesson {
  slug: string;
  title: string;
}

interface ModuleWithLessons {
  slug: string;
  name: string;
  lessons: Lesson[];
}

function getModuleOrder(slug: string): number {
  const metaPath = path.join(
    process.cwd(),
    "src/content/modules",
    slug,
    "module.json",
  );
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (typeof meta.order === "number") return meta.order;
  } catch { /* fallback below */ }
  return Infinity;
}

function getModuleDisplayName(slug: string): string {
  const metaPath = path.join(
    process.cwd(),
    "src/content/modules",
    slug,
    "module.json",
  );
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (meta.name) return meta.name;
  } catch { /* fallback below */ }

  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getModules(): ModuleWithLessons[] {
  const modulesDir = path.join(process.cwd(), "src/content/modules");

  try {
    if (!fs.existsSync(modulesDir)) return [];

    const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
    return entries
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

function getLessonTitle(moduleSlug: string, lessonSlug: string): string | null {
  const lessonPath = path.join(
    process.cwd(),
    "src/content/modules",
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
  } catch { /* fallback below */ }
  return null;
}

function getLessons(moduleSlug: string): Lesson[] {
  const lessonDir = path.join(
    process.cwd(),
    "src/content/modules",
    moduleSlug,
    "lessons",
  );

  try {
    if (!fs.existsSync(lessonDir)) return [];

    const entries = fs.readdirSync(lessonDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => ({
        slug: e.name,
        title: getLessonTitle(moduleSlug, e.name) ?? formatLessonName(e.name),
      }));
  } catch {
    return [];
  }
}

function formatLessonName(slug: string): string {
  return slug
    .replace(/^lesson\d+_/, "") // strip "lesson01_" prefix
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModules();

  return (
    <div className="flex min-h-screen">
      <Sidebar modules={modules} />

      {/* Main content */}
      <main className="min-h-0 flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  );
}
