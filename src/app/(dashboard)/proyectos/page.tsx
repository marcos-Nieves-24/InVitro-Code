import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getDisplayName } from "@/lib/gamification/user";
import { getNextLesson, getModuleDisplayName } from "@/lib/content/modules";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import {
  Trophy,
  Lightbulb,
  Wine,
  Gem,
  Flame,
  BookOpen,
  ArrowRight,
  FlaskConical,
  BarChart3,
} from "lucide-react";

// 11 variables físico-químicas reales del dataset de vino (UCI Wine Quality).
const FEATURES = [
  "Acidez fija",
  "Acidez volátil",
  "Ácido cítrico",
  "Azúcar residual",
  "Cloruros",
  "Dióxido de azufre libre",
  "Dióxido de azufre total",
  "Densidad",
  "pH",
  "Sulfatos",
  "Alcohol",
];

export default async function ProyectosPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [progressRes, reflectionRes, streakRes, profileRes] = await Promise.all(
    [
      supabase
        .from("progress")
        .select("module_slug, lesson_slug, xp_earned")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null),
      supabase
        .from("reflection_completions")
        .select("xp_earned")
        .eq("user_id", userId)
        .not("completed_at", "is", null),
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("username, email")
        .eq("id", userId)
        .maybeSingle(),
    ],
  );

  const totalXp = [
    ...(progressRes.data ?? []),
    ...(reflectionRes.data ?? []),
  ].reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

  const currentStreak = streakRes.data?.current_streak ?? 0;
  const levelInfo = calcLevel(totalXp);
  const userName = getDisplayName(profileRes.data ?? {});

  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map(
      (row) => `${row.module_slug}/${row.lesson_slug}`,
    ),
  );
  const lessonsCompleted = completedLessonKeys.size;
  const nextLesson = getNextLesson(completedLessonKeys);
  const missionXp = nextLesson?.xp ?? 0;

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
    >
      <div className="mx-auto max-w-[1440px] p-6 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                <Trophy className="h-4 w-4" />
                Reto Final
              </div>
              <h2 className="font-display text-2xl font-bold text-deep-navy">
                Predicción de Calidad de Vino
              </h2>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left column */}
          <div className="col-span-12 space-y-8 xl:col-span-8">
            {/* Hero banner */}
            <section className="relative h-64 overflow-hidden rounded-[32px]">
              <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/90 to-primary/60" />
              <div className="absolute inset-0 flex flex-col justify-center bg-dot-grid p-10">
                <span className="mb-4 w-fit rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-bold text-primary-fixed backdrop-blur-md">
                  PROYECTO NIVEL EXPERTO
                </span>
                <h3 className="font-display text-4xl font-extrabold text-white">
                  Desafío Bio-Data 2026
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-surface-container">
                  Analizá 11 variables físico-químicas para predecir la calidad
                  sensorial. Superá el benchmark de R² &gt; 0.85 para reclamar
                  el título de &quot;Maestro de Modelado&quot;.
                </p>
              </div>
              <Wine className="absolute right-10 top-1/2 h-28 w-28 -translate-y-1/2 text-white/10" />
            </section>

            {/* Description */}
            <section className="rounded-[24px] glass-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-deep-navy">
                  <Wine className="h-5 w-5 text-primary" />
                  Descripción del Problema
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-on-surface-variant">
                    Dificultad:
                  </span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-2 w-2 rounded-full bg-outline-variant" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant">
                  <p>
                    Este conjunto de datos contiene información sobre variantes
                    tintas y blancas del vino &quot;Vinho Verde&quot;
                    portugués. Están disponibles variables físico-químicas
                    (entradas) y sensoriales (salida).
                  </p>
                  <ul className="grid grid-cols-1 gap-2">
                    {FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
                  <BarChart3 className="mb-3 h-10 w-10 text-primary" />
                  <p className="mb-1 text-sm font-bold text-deep-navy">
                    Tus métricas son reales
                  </p>
                  <p className="px-4 text-xs text-on-surface-variant">
                    Este desafío se resuelve en las lecciones del módulo de
                    Machine Learning: ahí entrenás tu modelo y ves tu R² real.
                  </p>
                </div>
              </div>
            </section>

            {/* Real progress HUD (real data, no invented metrics) */}
            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <div className="rounded-2xl border-l-4 border-l-xp-blue glass-card p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-xp-blue">
                  XP Total
                </p>
                <h5 className="text-2xl font-bold text-deep-navy">
                  {totalXp.toLocaleString("es-AR")}
                </h5>
              </div>
              <div className="rounded-2xl border-l-4 border-l-primary glass-card p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Nivel
                </p>
                <h5 className="text-2xl font-bold text-deep-navy">
                  {levelInfo.level} · {rankTitle(levelInfo.level)}
                </h5>
              </div>
              <div className="rounded-2xl border-l-4 border-l-error glass-card p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-error">
                  Racha
                </p>
                <h5 className="flex items-center gap-2 text-2xl font-bold text-deep-navy">
                  <Flame className="h-5 w-5 text-error" />
                  {currentStreak}
                </h5>
              </div>
              <div className="rounded-2xl border-l-4 border-l-tertiary glass-card p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Lecciones completadas
                </p>
                <h5 className="flex items-center gap-2 text-2xl font-bold text-deep-navy">
                  <BookOpen className="h-5 w-5 text-tertiary" />
                  {lessonsCompleted}
                </h5>
              </div>
            </section>

            {/* Model area — honest, no fake training (D1) */}
            <section className="rounded-[24px] bg-deep-navy p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 font-mono text-xs text-white/50">
                  Laboratorio de Machine Learning
                </span>
              </div>
              <EmptyState
                icon={FlaskConical}
                {...EMPTY_STATES.challengeLab}
                actionLabel="Ir a las lecciones"
                href="/learn"
              />
            </section>
          </div>

          {/* Right column */}
          <div className="col-span-12 space-y-8 xl:col-span-4">
            {/* Real mission reward */}
            <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-secondary p-1 shadow-xl shadow-primary/20">
              <div className="flex h-full w-full flex-col rounded-[30px] bg-white/10 p-8 text-center backdrop-blur-xl">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <Gem className="h-10 w-10 text-xp-gold" />
                </div>
                <h4 className="mb-2 text-xl font-bold tracking-tight text-white">
                  Recompensa de tu próxima misión
                </h4>
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                  {nextLesson
                    ? getModuleDisplayName(nextLesson.moduleSlug)
                    : "Expedición completa"}
                </p>
                <div className="mb-6 w-full space-y-3">
                  <div className="flex justify-between text-sm text-white">
                    <span className="opacity-70">XP reales</span>
                    <span className="font-bold">
                      +{missionXp.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="font-bold">Nivel actual</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                      NIVEL {levelInfo.level}
                    </span>
                  </div>
                </div>
                <a
                  href="/laboratorios"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-bold text-primary shadow-xl transition-transform hover:scale-[1.02]"
                >
                  Ir al laboratorio
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Real leaderboard link */}
            <section className="rounded-[24px] glass-card p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-deep-navy">
                <Trophy className="h-5 w-5 text-secondary" />
                Ranking global
              </h4>
              <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
                El ranking se calcula con el XP real de cada investigador.
                Miralo en el Centro de la Comunidad.
              </p>
              <a
                href="/comunidad"
                className="flex items-center justify-center gap-2 rounded-xl bg-surface-container px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Ir al ranking
                <ArrowRight className="h-4 w-4" />
              </a>
            </section>

            {/* InVitro-Code tips */}
            <section className="rounded-[24px] glass-card p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-deep-navy">
                <Lightbulb className="h-5 w-5 text-xp-blue" />
                InVitro-Code Tips
              </h4>
              <div className="rounded-xl border border-xp-blue/20 bg-xp-blue/10 p-4">
                <p className="mb-1 text-[11px] font-bold text-xp-blue">
                  CONSEJO DEL SISTEMA:
                </p>
                <p className="text-[11px] italic leading-relaxed text-on-surface-variant">
                  &quot;Intentá aplicar Random Forest con ajuste de
                  hiperparámetros Bayesianos para reducir el sobreajuste en los
                  datos de vinos tintos.&quot;
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}
