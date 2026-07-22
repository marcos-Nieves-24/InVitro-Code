import Link from "next/link";

const modules = [
  { slug: "ai", title: "Introducción a la IA", lessons: 10 },
  { slug: "python", title: "Python para Biotech", lessons: 10 },
  { slug: "statistics", title: "Estadística y Probabilidad", lessons: 12 },
  { slug: "machine-learning", title: "Machine Learning", lessons: 8 },
  { slug: "ethics", title: "Ética en IA Biomédica", lessons: 7 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-900">
          InVitro-Code
        </h1>
        <nav className="flex gap-4">
          <Link
            href="/learn/python/lesson01_introduction"
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
            href="/learn/python/lesson01_introduction"
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
            {modules.map((mod) => (
              <Link
                key={mod.slug}
                href={`/learn/${mod.slug}/lesson01_introduction`}
                className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  {mod.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {mod.lessons} lecciones
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
