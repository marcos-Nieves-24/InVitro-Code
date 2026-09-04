import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getModules, getResumeHref } from "@/lib/content/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ArrowRight,
  Boxes,
  FlaskConical,
  BrainCircuit,
  BarChart3,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const MODULE_ICONS: Record<string, LucideIcon> = {
  python: Boxes,
  "machine-learning": BrainCircuit,
  biotecnologia: FlaskConical,
  estadistica: BarChart3,
  logros: Trophy,
};

function moduleIcon(slug: string): LucideIcon {
  return MODULE_ICONS[slug] ?? FlaskConical;
}

/**
 * Landing page — redesigned with the Frontend Design skill:
 * dark bioluminescent hero with live terminal, horizontal module pathway,
 * Space Grotesk display + DM Sans body, signature terminal typing element.
 */
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
    <div className="min-h-screen bg-surface text-ink">
      {/* ── Header ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-surface-raised bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-graphite text-mint">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                InVitro-Code
              </span>
              <span className="text-xs font-medium text-storm">
                Biotecnología · IA · Python
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-lg border border-surface-raised px-4 py-2 text-sm font-bold text-storm transition-colors hover:bg-surface-raised md:block"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 rounded-lg bg-mint px-5 py-2 text-sm font-bold text-ink transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-glow"
            >
              Comenzar <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* ── Hero: Dark bioluminescent section ──────── */}
        <section className="relative overflow-hidden bg-ink px-6 py-20 md:px-10 md:py-32">
          <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center gap-12 md:flex-row md:items-center md:justify-between">
            {/* Left: copy */}
            <div className="max-w-xl">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-mint">
                Aprendizaje interactivo
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                Aprende{" "}
                <span className="text-mint">IA y Machine Learning</span>{" "}
                con Python
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                Un curso para estudiantes de biotecnología. Aprende haciendo — con
                terminales reales, labs interactivos y progreso gamificado.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 rounded-xl bg-mint px-8 py-4 font-bold text-ink shadow-lg shadow-glow transition-all hover:scale-105 hover:shadow-glow"
                >
                  Empezar ahora <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-8 py-4 font-bold text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>

            {/* Right: live terminal mockup */}
            <div className="w-full max-w-md">
              <div className="hero-terminal animate-terminal-enter">
                <div className="hero-terminal-bar">
                  <span className="hero-terminal-dot" style={{ background: "#ff5f57" }} />
                  <span className="hero-terminal-dot" style={{ background: "#febc2e" }} />
                  <span className="hero-terminal-dot" style={{ background: "#28c840" }} />
                  <span className="ml-3 text-[11px] text-white/30">python</span>
                </div>
                <div className="hero-terminal-body">
                  <div>
                    <span className="text-mint">$</span>{" "}
                    <span className="text-[#e6edf3]">python</span>
                  </div>
                  <div className="mt-1 text-white/40">
                    Python 3.12.0 — InVitro-Code Lab
                  </div>
                  <div className="mt-3">
                    <span className="text-[#c084fc]">&gt;&gt;&gt;</span>{" "}
                    <span className="text-[#facc15]">import</span>{" "}
                    <span className="text-[#67e8f9]">sklearn</span>
                  </div>
                  <div>
                    <span className="text-[#c084fc]">&gt;&gt;&gt;</span>{" "}
                    <span className="text-[#facc15]">from</span>{" "}
                    <span className="text-[#67e8f9]">sklearn.ensemble</span>{" "}
                    <span className="text-[#facc15]">import</span>{" "}
                    <span className="text-[#67e8f9]">RandomForestClassifier</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[#c084fc]">&gt;&gt;&gt;</span>{" "}
                    <span className="text-white/70">model = </span>
                    <span className="text-[#67e8f9]">RandomForestClassifier</span>
                    <span className="text-white/50">()</span>
                  </div>
                  <div>
                    <span className="text-[#c084fc]">&gt;&gt;&gt;</span>{" "}
                    <span className="text-white/70">print(</span>
                    <span className="text-[#86efac]">&quot;ML listo para biotecnología&quot;</span>
                    <span className="text-white/70">)</span>
                  </div>
                  <div className="mt-1 text-[#86efac]">ML listo para biotecnología</div>
                  <div className="mt-3">
                    <span className="text-[#c084fc]">&gt;&gt;&gt;</span>{" "}
                    <span className="inline-block w-2 animate-[cursor-blink_1.2s_step-end_infinite] bg-white/70" style={{ height: "14px" }}>&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Module Pathway: horizontal scrollable ─── */}
        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-10">
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-storm">
                Contenido
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
                Expediciones del curso
              </h2>
              <p className="mt-2 text-storm">
                Cada módulo es un paso en tu camino hacia el dominio de la IA.
              </p>
            </div>

            {/* Pathway: horizontal scroll on mobile, grid on desktop */}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-5">
              {modules.map((mod) => {
                const Icon = moduleIcon(mod.slug);
                return (
                  <Link
                    key={mod.slug}
                    href={
                      mod.firstLesson
                        ? `/learn/${mod.slug}/${mod.firstLesson}`
                        : `/learn/${mod.slug}`
                    }
                    data-reveal
                className="group relative flex flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 transition-all hover:border-mint/40 hover:shadow-lg hover:shadow-glow"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-graphite text-mint transition-colors group-hover:bg-mint group-hover:text-ink">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-storm">
                      {mod.slug}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-sm text-storm">
                      {mod.lessonCount} lecciones
                    </p>
                    <span className="mt-4 flex items-center gap-1 text-sm font-bold text-mint transition-colors group-hover:text-mint">
                      Explorar{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile: horizontal scroll pathway */}
            <div className="pathway-track md:hidden">
              {modules.map((mod, i) => {
                const Icon = moduleIcon(mod.slug);
                return (
                  <div key={mod.slug} className="flex items-center">
                    <Link
                      href={
                        mod.firstLesson
                          ? `/learn/${mod.slug}/${mod.firstLesson}`
                          : `/learn/${mod.slug}`
                      }
                      data-reveal
                  className="pathway-node flex w-[220px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-5 transition-all hover:border-mint/40"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-graphite text-mint">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mb-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-storm">
                        {mod.slug}
                      </p>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {mod.title}
                      </h3>
                      <p className="mt-1 text-xs text-storm">
                        {mod.lessonCount} lecciones
                      </p>
                    </Link>
                    {i < modules.length - 1 && (
                      <div className="pathway-connector" aria-hidden="true">
                        <div className="h-2 w-2 rounded-full border-2 border-mint bg-surface-card" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────── */}
        <footer className="border-t border-surface-raised px-6 py-8 md:px-10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between text-sm text-storm">
            <span>InVitro-Code — Biotecnología + IA</span>
            <span className="font-mono text-xs">v0.1.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
