import { auth } from "@clerk/nextjs/server";
import { NexusShell } from "@/components/layout/NexusShell";
import { NexusTopBar } from "@/components/layout/NexusTopBar";
import { LabMission } from "@/components/laboratorio/LabMission";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel } from "@/lib/gamification/utils";
import { Lightbulb, Brain, Gem, CheckCircle2, Lock } from "lucide-react";

export default async function LaboratoriosPage() {
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
    <NexusShell userMeta={`Nivel ${levelInfo.level} · Laboratorios`}>
      <NexusTopBar
        totalXp={totalXp}
        currentStreak={currentStreak}
        trail="Niveles · Nivel 1 · Novato · Misión 2"
      />

      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-6 py-8 md:px-10">
        {/* Main content */}
        <div className="col-span-12 space-y-8 xl:col-span-9">
          <LabMission />
        </div>

        {/* Side panel */}
        <aside className="col-span-12 space-y-6 xl:col-span-3">
          <div className="overflow-hidden rounded-xl glass-card">
            <div className="border-b border-surface-container bg-surface-container-low/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-xp-gold" fill="currentColor" />
                <h4 className="text-sm font-bold">Sobre esta misión</h4>
              </div>
              <p className="text-xs leading-relaxed text-outline">
                Aprendé qué es un modelo de Machine Learning y cómo se entrena
                con datos reales de una bodega digital.
              </p>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-outline">
                  Objetivo
                </p>
                <p className="text-sm font-medium">
                  Entrenar un modelo de Regresión Lineal y evaluar su
                  rendimiento mediante el coeficiente R².
                </p>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-outline">
                  Recompensa
                </p>
                <div className="flex items-center gap-2 font-bold text-xp-blue">
                  <Gem className="h-4 w-4" fill="currentColor" />
                  <span>+40 XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl glass-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" fill="currentColor" />
              <h4 className="text-sm font-bold">Concepto clave</h4>
            </div>
            <p className="mb-3 text-xs font-bold">¿Qué es un modelo?</p>
            <p className="mb-6 text-xs text-outline">
              Un modelo aprende patrones de los datos para hacer predicciones
              sobre nuevos casos.
            </p>
          </div>

          <div className="rounded-xl glass-card p-6">
            <h4 className="mb-6 text-sm font-bold">Tu progreso</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success-green" />
                <span className="text-xs font-medium">Lección completada</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success-green" />
                <span className="text-xs font-medium">
                  Visualización explorada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success-green" />
                <span className="text-xs font-medium">Modelo entrenado</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-[18px] w-[18px] rounded-full border-2 border-surface-container" />
                <span className="text-xs font-medium text-outline">
                  Desafío final
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <Lock className="h-5 w-5 text-outline" />
                <span className="text-xs font-medium text-outline">
                  Misión completada
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </NexusShell>
  );
}
