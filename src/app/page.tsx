import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getModules, getResumeHref } from "@/lib/content/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArrowRight, Boxes, BookOpen } from "lucide-react";

export default async function Home() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? null;

  const modules = getModules();
  const pythonMod = modules.find((m) => m.slug === "python");

  let startHref = pythonMod?.firstLesson
    ? `/learn/${pythonMod.slug}/${pythonMod.firstLesson}`
    : "/dashboard";

  if (userId) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("progress")
      .select("module_slug, lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true);
    const completedLessonKeys = new Set(
      (data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
    );
    startHref = getResumeHref(completedLessonKeys);
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Public header */}
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold tracking-tight text-on-surface">
                InVitro-Code
              </span>
              <span className="text-xs font-medium text-on-surface-variant">
                Biotecnología · IA · Python
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container md:block"
            >
              Dashboard
            </Link>
            <Link
              href={startHref}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-on-primary transition-all hover:scale-[1.02]"
            >
              Comenzar <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-16 px-6 py-14 md:px-10">
        {/* Hero */}
        <section className="glass-card relative overflow-hidden rounded-[2rem] p-10 md:p-16">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Curso interactivo
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-deep-navy md:text-6xl">
              Aprende IA y Machine Learning con Python desde cero
            </h1>
            <p className="mt-6 max-w-xl text-lg text-on-surface-variant">
              Un curso interactivo para estudiantes de biotecnología. Aprende
              haciendo — con terminales, labs y progreso gamificado.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={startHref}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-transform hover:scale-105"
              >
                Empezar ahora <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="glass-card flex items-center gap-2 rounded-xl border border-outline-variant px-8 py-4 font-bold text-on-surface transition-colors hover:bg-white"
              >
                Ver progreso
              </Link>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section>
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
              Contenido
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-deep-navy">
              Expediciones del curso
            </h2>
            <p className="mt-2 text-on-surface-variant">
              Cada módulo es una expedición hacia el dominio de la Inteligencia
              Artificial.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((mod) => (
              <Link
                key={mod.slug}
                href={
                  mod.firstLesson
                    ? `/learn/${mod.slug}/${mod.firstLesson}`
                    : `/learn/${mod.slug}`
                }
                className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-all hover:border-primary/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="eyebrow mb-1 text-[10px]">{mod.slug}</p>
                <h3 className="font-display text-lg font-semibold text-on-surface">
                  {mod.title}
                </h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {mod.lessonCount} lecciones
                </p>
                <span className="mt-4 flex items-center gap-1 text-sm font-bold text-primary">
                  Explorar{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
