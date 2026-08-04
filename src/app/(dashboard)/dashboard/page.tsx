import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getModulesInfo, getResumeHref } from "@/lib/content/modules";
import { calcLevel } from "@/lib/gamification/utils";
import {
  Gem,
  Flame,
  Bell,
  Play,
  Map,
  ArrowRight,
  Wine,
  FlaskConical,
  Database,
  Terminal,
  Shield,
} from "lucide-react";

function rankTitle(level: number): string {
  if (level < 2) return "Novato";
  if (level < 5) return "Analista";
  if (level < 8) return "Investigador Jr.";
  if (level < 12) return "Investigador";
  if (level < 20) return "Especialista";
  return "ML Engineer";
}

const LEVEL_STEPS = [
  "Novato",
  "Analista",
  "Investigador Junior",
  "Investigador",
  "Especialista",
  "Machine Learning Eng.",
];

export default async function DashboardPage() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? "dev-user";

  const supabase = createAdminClient();

  const [progressRes, reflectionRes, moduleProgressRes, streakRes] =
    await Promise.all([
      supabase.from("progress").select("xp_earned").eq("user_id", userId),
      supabase
        .from("reflection_completions")
        .select("xp_earned")
        .eq("user_id", userId),
      supabase
        .from("progress")
        .select("module_slug, lesson_slug")
        .eq("user_id", userId)
        .eq("completed", true),
      supabase
        .from("streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

  const streakData = streakRes.data ?? { current_streak: 0, longest_streak: 0 };

  const totalXp = [
    ...(progressRes.data ?? []),
    ...(reflectionRes.data ?? []),
  ].reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

  const completedByModule: Record<string, number> = {};
  for (const row of moduleProgressRes.data ?? []) {
    const slug = row.module_slug;
    completedByModule[slug] = (completedByModule[slug] ?? 0) + 1;
  }

  const modules = getModulesInfo();

  const completedLessonKeys = new Set(
    (moduleProgressRes.data ?? []).map(
      (row) => `${row.module_slug}/${row.lesson_slug}`,
    ),
  );
  const startHref = getResumeHref(completedLessonKeys);

  const levelInfo = calcLevel(totalXp);
  const rankLevel = Math.min(levelInfo.level, LEVEL_STEPS.length - 1);
  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.min(
    100,
    (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100,
  );
  const ringOffset =
    ringCircumference - (ringProgress / 100) * ringCircumference;

  return (
    <InVitroShell
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/80 px-8 pl-16 backdrop-blur-md md:pl-8">
        <div className="hidden text-sm font-semibold text-on-surface md:block">
          Dashboard de Expedición
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1.5 text-sm font-bold text-primary">
            <Gem className="h-4 w-4" />
            <span>{totalXp.toLocaleString("es-AR")} XP</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 text-sm font-bold text-on-surface">
            <Flame className="h-4 w-4 text-error" />
            <span>
              {streakData.current_streak} día
              {streakData.current_streak !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            aria-label="Notificaciones"
            type="button"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-error" />
          </button>
        </div>
      </header>

      <div className="p-8">
        <div className="flex gap-8">
          {/* Central feed */}
          <div className="flex-grow space-y-8">
            {/* Hero banner */}
            <section className="relative overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
              <div className="flex items-center gap-8 p-10">
                <div className="flex-1">
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                    ¡Bienvenido de vuelta, Investigador! 👋
                  </h2>
                  <p className="mb-8 mt-4 max-w-lg text-on-surface-variant">
                    Estás construyendo tu camino en InVitro-Code.
                    Continúa tu investigación y descubrí nuevas formas de
                    aplicar la Inteligencia Artificial.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={startHref}
                      className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-transform hover:scale-105"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                      Continuar Misión
                    </Link>
                    <Link
                      href="/niveles"
                      className="glass-card flex items-center gap-2 rounded-xl border border-outline-variant px-8 py-4 font-bold text-on-surface transition-colors hover:bg-white"
                    >
                      <Map className="h-4 w-4" />
                      Explorar Mapa
                    </Link>
                  </div>
                </div>
                <div className="relative hidden h-64 w-64 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-primary to-secondary shadow-2xl lg:block">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-on-primary">
                    <Gem className="mb-2 h-14 w-14 opacity-80" fill="currentColor" />
                    <span className="text-3xl font-black">
                      {totalXp.toLocaleString("es-AR")}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                      XP totales
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats row */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Nivel actual
                </h3>
                <div className="mt-2">
                  <LevelBadge totalXp={totalXp} />
                </div>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Puntos totales
                </h3>
                <p className="mt-2 font-display text-2xl font-semibold text-on-surface">
                  {totalXp.toLocaleString("es-AR")} XP
                </p>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Racha actual
                </h3>
                <div className="mt-2">
                  <StreakBadge
                    currentStreak={streakData.current_streak}
                    longestStreak={streakData.longest_streak}
                  />
                </div>
              </div>
              <div className="glass-card flex flex-col rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Siguiente nivel
                </h3>
                <div className="mt-2">
                  <XPBar totalXp={totalXp} />
                </div>
              </div>
            </section>

            {/* Current work */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Proyecto Actual
                </h3>
                <div className="mb-6 flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-fixed-dim text-primary">
                    <Wine className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold">
                      Wine Quality
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Estás analizando las características químicas del vino
                      para predecir su calidad.
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-xs font-bold text-on-surface-variant">
                      Progreso
                    </span>
                    <span className="text-sm font-bold text-primary">68%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div className="xp-gradient h-full rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
                <Link
                  href="/proyectos"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-container py-3 text-sm font-bold text-primary transition-colors hover:bg-outline-variant"
                >
                  Ver proyecto <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="glass-card flex flex-col rounded-xl p-6">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Misión Actual
                </h3>
                <div className="mb-6 flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-tertiary-fixed-dim text-tertiary">
                    <FlaskConical className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold">
                      Correlación entre variables
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Descubrí cómo las variables químicas del vino se relacionan
                      entre sí.
                    </p>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary">
                    <Gem className="h-4 w-4" fill="currentColor" />
                    <span className="text-sm font-bold">+40 XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="mr-1 text-xs font-medium text-on-surface-variant">
                      Dificultad
                    </span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="h-2 w-2 rounded-full bg-surface-container-highest" />
                    </div>
                  </div>
                </div>
                <Link
                  href={startHref}
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90"
                >
                  Continuar misión <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Modules */}
            {modules.length > 0 && (
              <section className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      Progreso de módulos
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Tu avance real a través de las expediciones.
                    </p>
                  </div>
                  <Link
                    href="/learn"
                    className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    Ver expediciones <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {modules.map((mod) => (
                    <ModuleProgress
                      key={mod.slug}
                      moduleSlug={mod.slug}
                      moduleName={mod.name}
                      totalLessons={mod.totalLessons}
                      initialCompletedLessons={
                        completedByModule[mod.slug] ?? 0
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Side progress panel */}
          <aside className="hidden w-80 flex-col gap-6 lg:flex">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Tu Progreso</h3>
                <Link
                  href="/niveles"
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Ver roadmap <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mb-8 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={ringRadius}
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-surface-container-highest"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={ringRadius}
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-bold text-on-surface-variant">
                      Nivel
                    </span>
                    <span className="text-3xl font-black text-primary">
                      {levelInfo.level}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-bold">{rankTitle(levelInfo.level)}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    <span className="font-bold text-primary">
                      {totalXp.toLocaleString("es-AR")}
                    </span>{" "}
                    / {levelInfo.nextLevelXp.toLocaleString("es-AR")} XP
                  </p>
                  <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${ringProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {LEVEL_STEPS.map((step, i) => {
                  const completed = i < rankLevel;
                  const current = i === rankLevel;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold ${
                        current
                          ? "bg-primary-fixed text-primary ring-2 ring-primary/20"
                          : completed
                            ? "bg-tertiary-fixed text-on-surface-variant opacity-60"
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          current ? "border-2 border-primary" : ""
                        }`}
                      >
                        {current ? (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        ) : completed ? (
                          <span className="text-xs">✓</span>
                        ) : (
                          <span className="text-xs">○</span>
                        )}
                      </span>
                      {i + 1} {step}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">
                  Logros Recientes
                </h3>
                <Link
                  href="/logros"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary-fixed-dim text-tertiary">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h5 className="text-xs font-bold">Explorador de Datos</h5>
                      <span className="text-[10px] font-bold text-tertiary">
                        +20 XP
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      Completaste tu primer análisis exploratorio.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed-dim text-primary">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h5 className="text-xs font-bold">Maestro de Python</h5>
                      <span className="text-[10px] font-bold text-primary">
                        +30 XP
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      Completaste 20 ejercicios de Python.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed-dim text-secondary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h5 className="text-xs font-bold">Detective de Outliers</h5>
                      <span className="text-[10px] font-bold text-secondary">
                        +25 XP
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      Identificaste valores atípicos en tus datos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </InVitroShell>
  );
}
