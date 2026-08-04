import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel } from "@/lib/gamification/utils";
import {
  Network,
  Cpu,
  FlaskConical,
  Medal,
  ArrowRight,
  Zap,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const FEATURED_PROJECTS = [
  {
    title: "NeuralSync Engine",
    icon: Network,
    tag: "AI Engineering",
    description:
      "Plataforma de orquestación de modelos distribuidos para inferencia en tiempo real a escala global.",
    progress: 78,
  },
  {
    title: "FPGA-Accelerated Vision",
    icon: Cpu,
    tag: "Hardware Tech",
    description:
      "Optimización de redes neuronales convolucionales para procesamiento de video en latencia sub-milisegundo.",
    investigators: 42,
  },
  {
    title: "Bio-Data Challenge",
    icon: FlaskConical,
    tag: "Ciencia de Datos",
    description:
      "Análisis de 11 variables físico-químicas para predecir la calidad sensorial del vino.",
    progress: 65,
  },
];

const ACTIVE_RESEARCHERS = [
  { name: "Dra. Sofía Meyer", specialty: "Quantum ML Expert", level: 42 },
  { name: "Alex Rivera", specialty: "CV Architect", level: 38 },
  { name: "Li Wei", specialty: "RL Specialist", level: 35 },
  { name: "Elena Vega", specialty: "MLOps Engineer", level: 31 },
  { name: "Dr. Marco Pérez", specialty: "Estadística Avanzada", level: 28 },
];

const LEADERBOARD = [
  { name: "Marcus.K", xp: "24.1k XP", rank: 1 },
  { name: "Elena.V", xp: "22.8k XP", rank: 2 },
  { name: "Sato.ML", xp: "21.4k XP", rank: 3 },
  { name: "Dr. Sarah Chen", xp: "12.4k XP", rank: 4 },
  { name: "Project Phoenix", xp: "11.9k XP", rank: 5 },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function ComunidadPage() {
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
    <InVitroShell userMeta={`Nivel ${levelInfo.level} · Comunidad`}>
      <InVitroTopBar totalXp={totalXp} currentStreak={currentStreak} trail="Centro de la Comunidad" />

      <div className="mx-auto max-w-[1440px] space-y-10 px-6 py-10 md:px-10">
        {/* Featured projects + leaderboard */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Proyectos Destacados
              </h2>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {FEATURED_PROJECTS.map((project) => (
                <div
                  key={project.title}
                  className="glass-card flex h-full cursor-pointer flex-col rounded-2xl p-6 transition-all duration-300 hover:border-primary/50"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      <project.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded border border-primary/20 bg-primary-container px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {project.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-on-surface">
                    {project.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-on-surface-variant">
                    {project.description}
                  </p>
                  {project.progress !== undefined ? (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="uppercase tracking-tight text-on-surface-variant">
                          Progreso de Investigación
                        </span>
                        <span className="text-tertiary">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 flex items-center justify-between text-[11px] font-bold">
                      <span className="uppercase tracking-tight text-on-surface-variant">
                        Investigadores Activos
                      </span>
                      <span className="text-on-surface">
                        {project.investigators}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active researchers */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Investigadores Activos
              </h2>
              <div className="glass-card divide-y divide-outline-variant/30 rounded-2xl">
                {ACTIVE_RESEARCHERS.map((researcher) => (
                  <div
                    key={researcher.name}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-container-low"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-secondary-container text-xs font-bold text-on-secondary">
                      {initials(researcher.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-on-surface">
                        {researcher.name}
                      </p>
                      <p className="truncate text-xs text-on-surface-variant">
                        {researcher.specialty}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      Nivel {researcher.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6 lg:col-span-4">
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Global Leaderboard
            </h2>
            <div className="glass-card space-y-6 rounded-2xl p-6">
              <div className="mb-4 flex items-end justify-center gap-4 border-b border-outline-variant/50 pb-6">
                {[
                  { rank: 2, name: "@Elena.V", height: "h-20", color: "text-on-surface-variant" },
                  { rank: 1, name: "@Marcus.K", height: "h-28", color: "text-primary", gold: true },
                  { rank: 3, name: "@Sato.ML", height: "h-16", color: "text-streak-orange" },
                ].map((entry) => (
                  <div key={entry.rank} className="flex flex-col items-center gap-2">
                    {entry.gold && (
                      <Medal className="mb-[-8px] h-6 w-6 text-xp-gold" fill="currentColor" />
                    )}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container font-bold">
                      {entry.name.charAt(2)}
                    </div>
                    <div
                      className={`flex w-12 flex-col items-center justify-end rounded-t-lg pb-2 ${entry.height} ${
                        entry.gold ? "border-t-2 border-primary bg-primary/10" : "bg-surface-container-high"
                      }`}
                    >
                      <span className={`text-xl font-bold ${entry.color}`}>
                        {entry.rank}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {LEADERBOARD.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-surface-container-low"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-sm font-bold text-on-surface-variant">
                        {row.rank}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-[10px] font-bold">
                        {initials(row.name)}
                      </div>
                      <span className="text-sm font-bold text-on-surface">
                        {row.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {row.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network pulse */}
            <div className="relative overflow-hidden rounded-2xl border-t-4 border-t-tertiary glass-card space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-tertiary" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                    En Línea
                  </span>
                </div>
                <span className="text-2xl font-bold text-tertiary">1,248</span>
              </div>
              <div>
                <p className="mb-3 border-b border-outline-variant/50 pb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Nuevos Labs
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary-container/30 p-2 text-primary">
                      <FlaskConical className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">
                        Transformers 2.0
                      </span>
                      <span className="text-[10px] font-medium text-on-surface-variant">
                        Hace 2 horas • 12 vacantes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-streak-orange/10 p-2 text-streak-orange">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">
                        Neural Architecture
                      </span>
                      <span className="text-[10px] font-medium text-on-surface-variant">
                        Hace 5 horas • 5 vacantes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2 text-xs font-bold text-on-surface transition-all hover:bg-surface-container-high"
              >
                Sincronizar Feed
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-primary p-5 text-white shadow-lg shadow-primary/20">
              <MessageSquare className="h-6 w-6 shrink-0" />
              <p className="text-sm font-semibold">
                Foros de Discusión — participá y aprendé con la comunidad.
              </p>
              <Sparkles className="ml-auto h-5 w-5 shrink-0 opacity-60" />
            </div>
          </div>
        </section>
      </div>
    </InVitroShell>
  );
}
