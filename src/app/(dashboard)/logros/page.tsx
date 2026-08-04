import { auth } from "@clerk/nextjs/server";
import { NexusShell } from "@/components/layout/NexusShell";
import { NexusTopBar } from "@/components/layout/NexusTopBar";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel } from "@/lib/gamification/utils";
import {
  GraduationCap,
  Terminal,
  Brain,
  Database,
  Shield,
  FlaskConical,
  CheckCircle2,
  Lock,
  Gift,
  Rocket,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Novato",
    icon: CheckCircle2,
    badge: "10 / 10 Completado",
    badgeClass: "bg-tertiary-container text-tertiary border border-tertiary/20",
    achievements: [
      {
        title: "Primeros Pasos",
        description: "Completa tu primera lección de ML.",
        icon: GraduationCap,
        xp: 50,
        completed: true,
      },
      {
        title: "Code Master I",
        description: "Limpia un dataset sin errores.",
        icon: Terminal,
        xp: 100,
        completed: true,
      },
    ],
  },
  {
    name: "Analista",
    icon: Database,
    badge: "6 / 15 En Progreso",
    badgeClass: "bg-primary-container text-primary border border-primary/20",
    achievements: [
      {
        title: "Arquitecto Neuronal",
        description: "Diseña 5 redes convolucionales.",
        icon: Brain,
        progressPercent: 75,
      },
      {
        title: "Big Data Voyager",
        description: "Procesa más de 1TB de datos.",
        icon: Database,
        progressPercent: 30,
      },
    ],
  },
  {
    name: "Investigador",
    icon: Lock,
    badge: "Nivel 50 Requerido",
    badgeClass: "text-on-surface-variant",
    achievements: [
      {
        title: "Nexus Pioneer",
        description: "Publica un paper en el Nexus Journal.",
        icon: Shield,
        locked: true,
      },
      {
        title: "Alquimista Cuántico",
        description: "Resuelve un problema de optimización NP-Hard.",
        icon: FlaskConical,
        locked: true,
      },
    ],
  },
];

const WEEKLY_XP = [8, 12, 6, 16, 10, 4, 4];

export default async function LogrosPage() {
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
    <NexusShell userMeta={`Nivel ${levelInfo.level} · Logros`}>
      <NexusTopBar totalXp={totalXp} currentStreak={currentStreak} trail="Mis Logros" />

      <div className="mx-auto max-w-[1440px] space-y-10 px-6 py-10 md:px-10">
        {/* Hero progress */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-deep-navy">
                Mis Logros
              </h2>
              <p className="text-on-surface-variant">
                Tu camino hacia la excelencia en Inteligencia Artificial y Nexus
                Engineering.
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="font-display text-2xl font-bold text-primary">
                38% Completado
              </span>
              <p className="text-sm text-on-surface-variant">
                24 de 64 Logros Desbloqueados
              </p>
            </div>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="progress-gradient relative h-full w-[38%]">
              <div className="absolute inset-0 animate-pulse bg-white/20" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {/* Achievements grid */}
          <div className="space-y-10 xl:col-span-2">
            {CATEGORIES.map((cat) => (
              <section key={cat.name} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="flex items-center gap-3 font-display text-xl font-semibold text-on-surface">
                    <cat.icon
                      className={`h-5 w-5 ${
                        cat.name === "Investigador"
                          ? "text-on-surface-variant"
                          : "text-primary"
                      }`}
                    />
                    {cat.name}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${cat.badgeClass}`}
                  >
                    {cat.badge}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {cat.achievements.map((a) => (
                    <AchievementCard key={a.title} {...a} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Side panel */}
          <aside className="space-y-6">
            <div className="glass-card space-y-6 rounded-2xl p-6">
              <h3 className="flex items-center justify-between font-display text-lg font-semibold text-on-surface">
                Recompensa Semanal
                <Gift className="h-5 w-5 text-xp-gold" />
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">
                    XP de esta semana
                  </span>
                  <span className="font-bold text-on-surface">
                    1,250 / 2,000
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div className="h-full bg-primary" style={{ width: "62.5%" }} />
                </div>
                <p className="text-center text-sm italic text-on-surface-variant">
                  &quot;Ganá 750 XP más para desbloquear el Cofre de
                  Analista&quot;
                </p>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div
                      className="w-2 rounded-full bg-primary"
                      style={{ height: `${WEEKLY_XP[i] * 4}px`, opacity: i > 4 ? 0.3 : 1 }}
                    />
                    <span className="text-[10px] uppercase text-on-surface-variant">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-secondary-container text-sm font-bold text-on-secondary">
                  IN
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    Investigador Principal
                  </p>
                  <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-primary">
                    Nivel {levelInfo.level}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-xl border border-primary/20 bg-white py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Ver perfil completo
              </button>
            </div>

            <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-lg shadow-primary/20">
              <div className="relative z-10 space-y-3">
                <h4 className="text-xl font-bold">
                  ¿Listo para el siguiente nivel?
                </h4>
                <p className="text-sm text-white/80">
                  Completá 5 logros más de Analista para desbloquear el Rango
                  de Investigador y acceso a laboratorios avanzados.
                </p>
                <button
                  type="button"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary-container"
                >
                  Explorar Desafíos
                </button>
              </div>
              <Rocket className="absolute -bottom-4 -right-4 h-36 w-36 rotate-12 opacity-10 transition-transform group-hover:rotate-0" />
            </div>
          </aside>
        </div>
      </div>
    </NexusShell>
  );
}
