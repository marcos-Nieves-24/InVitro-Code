import { auth } from "@clerk/nextjs/server";
import { NexusShell } from "@/components/layout/NexusShell";
import { Countdown } from "@/components/proyectos/Countdown";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel } from "@/lib/gamification/utils";
import {
  Trophy,
  ArrowLeft,
  Bell,
  Settings,
  UploadCloud,
  Crown,
  Lightbulb,
  Medal,
  Play,
  Wine,
} from "lucide-react";

const FEATURES = [
  "Acidez fija y volátil",
  "Ácido cítrico y azúcares residuales",
  "Cloruros y densidad de sulfatos",
  "pH, sulfatos y alcohol",
];

const METRICS = [
  { label: "Precisión (R²)", value: "0.782", color: "text-xp-blue", barColor: "bg-xp-blue", border: "border-l-xp-blue", percent: 78 },
  { label: "MAE", value: "0.42", color: "text-secondary", barColor: "bg-secondary", border: "border-l-secondary", percent: 42 },
  { label: "Validación", value: "94.5%", color: "text-tertiary", barColor: "bg-tertiary", border: "border-l-tertiary", percent: 94 },
  { label: "Epochs", value: "120/500", color: "text-error", barColor: "bg-error", border: "border-l-error", percent: 24 },
];

const LEADERBOARD = [
  { name: "Elena_AI_Dev", metric: "R²: 0.924", xp: "+40XP", highlight: true },
  { name: "Data_Scientist_X", metric: "R²: 0.911", highlight: false },
  { name: "BioCoder_99", metric: "R²: 0.898", highlight: false },
];

export default async function ProyectosPage() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? "dev-user";

  const supabase = createAdminClient();

  const [progressRes, reflectionRes, streakRes] = await Promise.all([
    supabase.from("progress").select("xp_earned").eq("user_id", userId),
    supabase
      .from("reflection_completions")
      .select("xp_earned")
      .eq("user_id", userId),
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const totalXp = [
    ...(progressRes.data ?? []),
    ...(reflectionRes.data ?? []),
  ].reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

  const currentStreak = streakRes.data?.current_streak ?? 0;
  const levelInfo = calcLevel(totalXp);

  return (
    <NexusShell userMeta={`Nivel ${levelInfo.level} · Proyectos`}>
      <div className="mx-auto max-w-[1440px] p-6 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-outline-variant"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
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
          <div className="flex flex-wrap items-center gap-6">
            <Countdown days={2} hours={14} minutes={32} />
            <div className="h-8 w-px bg-outline-variant" />
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5 text-on-surface-variant" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"
                aria-label="Configuración"
              >
                <Settings className="h-5 w-5 text-on-surface-variant" />
              </button>
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
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant">
                  <p>
                    Este conjunto de datos contiene información sobre variantes
                    tintas y blancas del vino &quot;Vinho Verde&quot;
                    portugués. Están disponibles variables físico-químicas
                    (entradas) y sensoriales (salida).
                  </p>
                  <ul className="space-y-2">
                    {FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 transition-colors hover:border-primary">
                  <UploadCloud className="mb-3 h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                  <p className="mb-1 text-sm font-bold text-deep-navy">
                    Carga tu Dataset
                  </p>
                  <p className="px-4 text-center text-xs text-on-surface-variant">
                    Arrastrá archivos .csv o .parquet para iniciar el
                    pre-procesamiento
                  </p>
                </div>
              </div>
            </section>

            {/* Metrics HUD */}
            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-2xl border-l-4 glass-card p-6 ${metric.border}`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${metric.color}`}
                  >
                    {metric.label}
                  </p>
                  <h5 className="text-2xl font-bold text-deep-navy">
                    {metric.value}
                  </h5>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={`h-full ${metric.barColor}`}
                      style={{ width: `${metric.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Code / process area */}
            <section className="relative overflow-hidden rounded-[24px] bg-deep-navy shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-deep-navy px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-2 font-mono text-xs text-white/50">
                    nexus_model_training.py
                  </span>
                </div>
                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-lg bg-tertiary px-6 py-2 text-xs font-bold text-white transition-all hover:bg-tertiary-container"
                >
                  <Play className="h-4 w-4 text-tertiary-fixed transition-transform group-hover:rotate-12" fill="currentColor" />
                  ENTRENAR MODELO
                </button>
              </div>
              <div className="min-h-[240px] space-y-1 p-8 font-mono text-[13px] leading-relaxed text-blue-300">
                <p>
                  <span className="text-purple-400">import</span> pandas{" "}
                  <span className="text-purple-400">as</span> pd
                </p>
                <p>
                  <span className="text-purple-400">from</span> sklearn.ensemble{" "}
                  <span className="text-purple-400">import</span>{" "}
                  GradientBoostingRegressor
                </p>
                <p>
                  <span className="text-purple-400">from</span> nexus_toolkit{" "}
                  <span className="text-purple-400">import</span>{" "}
                  AdvancedPreprocessor
                </p>
                <br />
                <p className="text-white/40">
                  # Inicializando pipeline de entrenamiento Nexus
                </p>
                <p>data = pd.read_csv(<span className="text-green-400">&apos;wine_quality.csv&apos;</span>)</p>
                <p>X_train, X_test, y_train, y_test = prepare_nexus_data(data)</p>
                <br />
                <p>model = GradientBoostingRegressor(</p>
                <p className="pl-4">
                  learning_rate=<span className="text-orange-400">0.1</span>,
                </p>
                <p className="pl-4">
                  n_estimators=<span className="text-orange-400">100</span>,
                </p>
                <p className="pl-4">
                  max_depth=<span className="text-orange-400">3</span>
                </p>
                <p>)</p>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="col-span-12 space-y-8 xl:col-span-4">
            {/* Master reward */}
            <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-primary to-secondary p-1 shadow-xl shadow-primary/20">
              <div className="flex h-full w-full flex-col items-center rounded-[30px] bg-white/10 p-8 text-center backdrop-blur-xl">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <Crown className="h-10 w-10 text-xp-gold" />
                </div>
                <h4 className="mb-2 text-xl font-bold tracking-tight text-white">
                  Recompensa Maestra
                </h4>
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                  Insignia de Viticultor Digital
                </p>
                <div className="mb-6 w-full space-y-3">
                  <div className="flex justify-between text-sm text-white">
                    <span className="opacity-70">XP de Misión</span>
                    <span className="font-bold">+1,250</span>
                  </div>
                  <div className="flex justify-between text-sm text-white">
                    <span className="opacity-70">Nexus Credits</span>
                    <span className="font-bold">500</span>
                  </div>
                  <div className="h-px bg-white/20" />
                  <div className="flex justify-between text-white">
                    <span className="font-bold">Nivel Posterior</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                      NIVEL 5
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-2xl bg-white py-4 font-bold text-primary shadow-xl transition-transform hover:scale-[1.02]"
                >
                  CANJEAR PREMIOS
                </button>
              </div>
            </section>

            {/* Leaderboard */}
            <section className="rounded-[24px] glass-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-deep-navy">
                  <Medal className="h-5 w-5 text-secondary" />
                  Leaderboard Global
                </h4>
                <button
                  type="button"
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  VER TODOS
                </button>
              </div>
              <div className="space-y-4">
                {LEADERBOARD.map((row, i) => (
                  <div
                    key={row.name}
                    className={`flex items-center gap-3 rounded-xl p-3 ${
                      row.highlight
                        ? "border border-outline-variant bg-surface-container/50"
                        : "transition-colors hover:bg-surface-container"
                    }`}
                  >
                    <span
                      className={`w-6 text-center text-sm font-bold italic ${
                        i === 0 ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-outline-variant text-[10px] font-bold">
                      {row.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-deep-navy">
                        {row.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {row.metric}
                      </p>
                    </div>
                    {row.xp && (
                      <span className="text-[10px] font-bold text-tertiary">
                        {row.xp}
                      </span>
                    )}
                  </div>
                ))}
                <div className="mt-4 border-t border-outline-variant pt-4">
                  <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <span className="w-6 text-center text-sm font-bold italic text-primary">
                      #42
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary-container text-[10px] font-bold text-primary">
                      TÚ
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-deep-navy">
                        Tú (Investigador)
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        R²: 0.782
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-primary">
                      SIGUE ASÍ
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Nexus tips */}
            <section className="rounded-[24px] glass-card p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-deep-navy">
                <Lightbulb className="h-5 w-5 text-xp-blue" />
                Nexus Tips
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
    </NexusShell>
  );
}