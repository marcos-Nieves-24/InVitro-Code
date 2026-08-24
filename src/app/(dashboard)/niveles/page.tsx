import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import {
  Sprout,
  Search,
  FlaskConical,
  Brain,
  Layers,
  Server,
  Check,
  Lock,
  ArrowRight,
  Target,
  Trophy,
} from "lucide-react";

interface Rank {
  name: string;
  xp: number;
  description: string;
  icon: typeof Sprout;
  skills: string[];
}

const RANKS: Rank[] = [
  {
    name: "Novato",
    xp: 0,
    description: "Comienza tu viaje en los datos.",
    icon: Sprout,
    skills: ["Python básico", "Terminal", "Variables y tipos"],
  },
  {
    name: "Analista",
    xp: 200,
    description: "Explora y entiende patrones.",
    icon: Search,
    skills: ["Pandas", "Visualización", "Estadística descriptiva"],
  },
  {
    name: "Investigador Jr.",
    xp: 500,
    description: "Estadística y herramientas avanzadas.",
    icon: FlaskConical,
    skills: ["Matplotlib", "Seaborn", "Probabilidad"],
  },
  {
    name: "Investigador",
    xp: 1000,
    description: "Machine Learning y modelos predictivos reales.",
    icon: Brain,
    skills: [
      "Regresión Lineal",
      "Clasificación Binaria",
      "Árboles de Decisión",
      "Random Forest",
      "Métricas de Evaluación",
    ],
  },
  {
    name: "Especialista",
    xp: 2000,
    description: "Optimización y algoritmos avanzados.",
    icon: Layers,
    skills: ["Gradient Boosting", "Cross-validation", "Feature Engineering"],
  },
  {
    name: "ML Engineer",
    xp: 3500,
    description: "Sistemas inteligentes escalables.",
    icon: Server,
    skills: ["MLOps", "Despliegue", "Sistemas escalables"],
  },
];

export default async function NivelesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [profileRes, streakRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, email")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});
  const currentStreak = streakRes.data?.current_streak ?? 0;

  const totalXp = await getTotalXp(userId, supabase);

  const levelInfo = calcLevel(totalXp);

  let currentRankIndex = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (totalXp >= RANKS[i].xp) currentRankIndex = i;
  }

  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1];
  const rankProgress = nextRank
    ? Math.min(
        100,
        ((totalXp - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100,
      )
    : 100;
  const xpToNext = nextRank ? nextRank.xp - totalXp : 0;

  const ringRadius = 88;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (rankProgress / 100) * ringCircumference;

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${currentRank.name}`}
    >
      <InVitroTopBar totalXp={totalXp} currentStreak={currentStreak} />

      <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-10">
        {/* Header */}
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-deep-navy">
              Mapa de Niveles
            </h2>
            <p className="mt-1 text-on-surface-variant">
              Tu trayectoria como investigador en InVitro-Code
            </p>
          </div>
        </header>

        {/* Horizontal timeline */}
        <section className="relative mb-16 overflow-x-auto px-4 scroll-hide">
          <div className="timeline-connector absolute left-0 top-1/2 z-0 h-[2px] w-full -translate-y-1/2" />
          <div
            className="absolute left-0 top-1/2 z-0 h-[2px] -translate-y-1/2 bg-primary transition-all"
            style={{ width: `${(currentRankIndex / (RANKS.length - 1)) * 100}%` }}
          />
          <div className="relative z-10 flex min-w-[1000px] items-start justify-between py-10">
            {RANKS.map((rank, i) => {
              const completed = i < currentRankIndex;
              const current = i === currentRankIndex;
              const locked = i > currentRankIndex;

              return (
                <div
                  key={rank.name}
                  className={`flex w-40 flex-col items-center gap-4 ${
                    locked ? "opacity-50 grayscale transition-all hover:grayscale-0" : ""
                  } ${current ? "w-48" : ""}`}
                >
                  {current && (
                    <div className="absolute -top-12 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-white animate-bounce">
                      NIVEL ACTUAL
                    </div>
                  )}
                  <div
                    className={`relative flex items-center justify-center rounded-2xl glass-card ${
                      current
                        ? "h-32 w-32 border border-primary bg-primary/5 shadow-[0_0_20px_rgba(53,37,205,0.2)]"
                        : "h-24 w-24"
                    }`}
                  >
                    <rank.icon
                      className={current ? "h-20 w-20 text-primary" : "h-16 w-16 text-primary/70"}
                    />
                    {completed && (
                      <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-success-green p-1 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-[2px]">
                        <Lock className="h-8 w-8 text-deep-navy/40" />
                      </div>
                    )}
                    {current && (
                      <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                        <div className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                          {totalXp.toLocaleString("es")} /{" "}
                          {(nextRank?.xp ?? totalXp).toLocaleString("es")} XP
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span
                      className={`mb-1 block text-xs font-bold uppercase tracking-widest ${
                        current ? "text-primary" : completed ? "text-success-green" : "text-outline"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <h4 className={`font-bold ${current ? "text-lg text-deep-navy" : "text-deep-navy"}`}>
                      {rank.name}
                    </h4>
                    <p className="mt-1 text-[11px] leading-tight text-outline">
                      {rank.description}
                    </p>
                  </div>
                  {current && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${rankProgress}%` }}
                      />
                    </div>
                  )}
                  {!current && (
                    <div
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                        completed
                          ? "border-success-green/20 bg-success-green/10 text-success-green"
                          : "border-outline-variant bg-surface-container text-outline"
                      }`}
                    >
                      {completed ? "COMPLETADO" : "BLOQUEADO"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Current level detail + rewards */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <div className="glass-card flex flex-col items-center gap-8 rounded-[2rem] p-6 md:flex-row">
              <div className="relative h-48 w-48 shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r={ringRadius}
                    stroke="#eceef0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r={ringRadius}
                    stroke="#3525cd"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-deep-navy">
                    {Math.round(rankProgress)}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                    del nivel
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-2xl font-extrabold text-deep-navy">
                  Nivel {levelInfo.level}: {currentRank.name}
                </h3>
                <p className="mt-2 text-on-surface-variant">
                  Estás desarrollando habilidades para crear modelos
                  predictivos, evaluar su rendimiento y aplicarlos a problemas
                  reales del mundo de los datos.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-3">
                    <p className="text-[10px] font-bold uppercase text-outline">
                      XP acumulada
                    </p>
                    <p className="text-lg font-bold text-deep-navy">
                      {totalXp.toLocaleString("es")} XP
                    </p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-3">
                    <p className="text-[10px] font-bold uppercase text-outline">
                      {nextRank ? "XP siguiente nivel" : "Nivel máximo"}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {nextRank
                        ? Math.max(0, xpToNext).toLocaleString("es") + " XP"
                        : <Trophy className="h-5 w-5" />}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <div className="mb-6 flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-deep-navy">
                  Habilidades en Desarrollo
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRank.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    {skill}
                  </span>
                ))}
                {RANKS.filter((_, i) => i > currentRankIndex)
                  .flatMap((r) => r.skills)
                  .slice(0, 2)
                  .map((skill) => (
                    <span
                      key={`locked-${skill}`}
                      className="rounded-full border border-outline-variant bg-surface-container px-4 py-2 text-sm font-semibold text-outline"
                    >
                      {skill} (Bloqueado)
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="glass-card flex h-full flex-col rounded-[2rem] p-6">
              <div className="mb-8 flex items-center justify-between">
                <h4 className="text-lg font-bold text-deep-navy">
                  Recompensas del Nivel
                </h4>
                <span className="rounded-lg bg-primary-fixed px-3 py-1 text-xs font-bold text-primary">
                  {currentRankIndex}/{RANKS.length - 1} Alcanzado
                </span>
              </div>
              <div className="space-y-6">
                {RANKS.slice(0, currentRankIndex + 1).map((rank, i) => (
                  <div key={rank.name} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-success-green/20 bg-success-green/10 text-success-green">
                      <rank.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-deep-navy">
                        Rango {rank.name}
                      </p>
                      <p className="text-xs text-outline">
                        Alcanzaste el rango {rank.name.toLowerCase()}.
                      </p>
                    </div>
                    <Check className="h-5 w-5 text-success-green" />
                  </div>
                ))}
                {nextRank && (
                  <div className="flex items-center gap-4 opacity-60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant bg-surface-container text-outline">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-deep-navy">
                        Rango {nextRank.name}
                      </p>
                      <p className="text-xs text-outline">
                        Reconocimiento del siguiente nivel.
                      </p>
                    </div>
                    <Lock className="h-5 w-5 text-outline" />
                  </div>
                )}
              </div>
              <Link
                href="/dashboard"
                className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Continuar Misión Actual <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}
