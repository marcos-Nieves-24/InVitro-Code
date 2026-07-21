import Link from "next/link";
import fs from "fs";
import path from "path";

interface Lesson {
  slug: string;
  title: string;
}

interface ModuleEntry {
  slug: string;
  name: string;
}

function getModules(): ModuleEntry[] {
  const modulesDir = path.join(process.cwd(), "src/content/modules");

  try {
    if (!fs.existsSync(modulesDir)) return [];

    const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => ({
        slug: e.name,
        name: formatModuleName(e.name),
      }));
  } catch {
    return [];
  }
}

function formatModuleName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md shrink-0 overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-blue-600 text-sm hover:underline"
            >
              ← Dashboard
            </Link>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Módulos</h2>

          <nav>
            {getModules().length === 0 && (
              <p className="text-sm text-gray-500">
                No hay módulos disponibles aún.
              </p>
            )}

            {getModules().map((mod) => {
              const lessons = getLessons(mod.slug);
              return (
                <div key={mod.slug} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {mod.name}
                  </h3>
                  <ul className="space-y-1 ml-2">
                    {lessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/${mod.slug}/${lesson.slug}`}
                          className="block text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
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
        title: formatLessonName(e.name),
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