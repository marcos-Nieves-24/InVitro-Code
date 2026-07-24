import Link from "next/link";
import { getModules } from "@/lib/content/modules";
import { Button, Card, PageShell, SiteHeader } from "@/components/ui";

export default function Home() {
  const modules = getModules();
  const pythonMod = modules.find((m) => m.slug === "python");
  const startHref = pythonMod?.firstLesson
    ? `/learn/${pythonMod.slug}/${pythonMod.firstLesson}`
    : "/dashboard";

  return (
    <PageShell width="marketing">
      <SiteHeader startHref={startHref} showSignIn />

      <main className="mt-8 space-y-16 pb-16">
        <section className="rounded-card border border-gray-200 bg-white px-6 py-14 text-center shadow-sm md:px-12 md:py-16">
          <p className="eyebrow mb-4 text-brand">Curso interactivo</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            InVitro-Code
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-display text-xl font-semibold tracking-tight text-gray-700 md:text-2xl">
            Aprendé IA y Machine Learning con Python desde cero
          </p>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-600">
            Un curso interactivo para estudiantes de biotecnología. Aprendé
            haciendo — con terminales, labs y progreso gamificado.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={startHref} size="lg">
              Empezar ahora
            </Button>
            <Button href="/dashboard" variant="secondary" size="lg">
              Ver progreso
            </Button>
          </div>
        </section>

        <section>
          <div className="mb-6 text-center">
            <p className="eyebrow mb-2">Contenido</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900">
              Módulos del curso
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Link
                key={mod.slug}
                href={
                  mod.firstLesson
                    ? `/learn/${mod.slug}/${mod.firstLesson}`
                    : `/learn/${mod.slug}`
                }
                className="group block transition-transform hover:-translate-y-0.5"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <p className="eyebrow mb-2 text-[10px]">{mod.slug}</p>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-gray-900 group-hover:text-brand">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {mod.lessonCount} lecciones
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
