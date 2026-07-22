import Link from "next/link";
import fs from "fs";
import path from "path";

interface ModuleMeta {
  slug: string;
  title: string;
  firstLesson: string;
}

function getModules(): ModuleMeta[] {
  const modulesDir = path.join(process.cwd(), "src/content/modules");
  try {
    if (!fs.existsSync(modulesDir)) return [];

    return fs.readdirSync(modulesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((entry) => {
        const slug = entry.name;
        const lessonsDir = path.join(modulesDir, slug, "lessons");
        let firstLesson = "";
        try {
          const lessons = fs.readdirSync(lessonsDir, { withFileTypes: true })
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .sort();
          firstLesson = lessons[0] || "";
        } catch { /* no lessons dir */ }

        const metaPath = path.join(modulesDir, slug, "module.json");
        let title = slug;
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
          title = meta.name || slug;
        } catch { /* no module.json */ }

        return { slug, title, firstLesson };
      });
  } catch {
    return [];
  }
}

export default function Home() {
  const modules = getModules();
  const pythonMod = modules.find((m) => m.slug === "python");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-900">
          InVitro-Code
        </h1>
        <nav className="flex gap-4">
          <Link
            href={pythonMod ? `/learn/${pythonMod.slug}/${pythonMod.firstLesson}` : "/learn"}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Comenzar a aprender
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero */}
        <section className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            Aprendé IA y Machine Learning
            <br />
            <span className="text-blue-600">con Python desde cero</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Un curso interactivo estilo Duolingo para estudiantes de biotecnología.
            Sin registro, sin vueltas — aprendé haciendo.
          </p>
          <Link
            href={pythonMod ? `/learn/${pythonMod.slug}/${pythonMod.firstLesson}` : "/learn"}
            className="inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
          >
            Empezar ahora
          </Link>
        </section>

        {/* Módulos */}
        <section className="mb-20">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Contenido del curso
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => {
              const lessonCount = getLessonCount(mod.slug);
              return (
                <Link
                  key={mod.slug}
                  href={mod.firstLesson ? `/learn/${mod.slug}/${mod.firstLesson}` : `/learn/${mod.slug}`}
                  className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    {mod.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {lessonCount} lecciones
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function getLessonCount(slug: string): number {
  const lessonsDir = path.join(process.cwd(), "src/content/modules", slug, "lessons");
  try {
    return fs.readdirSync(lessonsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).length;
  } catch {
    return 0;
  }
}
