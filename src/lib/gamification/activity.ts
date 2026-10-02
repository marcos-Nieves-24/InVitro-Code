import type { SupabaseClient } from "@supabase/supabase-js";

export interface TimelinePoint {
  week: string;
  xp: number;
}

export interface DailyPoint {
  day: string;
  xp: number;
}

export interface ModuleCompletion {
  name: string;
  completed: number;
  total: number;
  value: number;
}

function startOfWeekMonday(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

function formatDayMonth(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/**
 * Últimas 8 semanas (lunes inicio) — agrega xp_earned de progress + reflection_completions
 * donde completed_at NOT NULL y gte(weekStart - 8 semanas). Patrón try/catch → empty
 * como achievements.ts. Recibe supabase y userId, no usa auth().
 */
export async function getProgressTimeline(
  userId: string,
  supabase: SupabaseClient,
): Promise<TimelinePoint[]> {
  try {
    const nowMonday = startOfWeekMonday();
    const earliest = new Date(nowMonday);
    earliest.setDate(earliest.getDate() - 7 * 7);
    const earliestIso = earliest.toISOString();

    const [progressRes, reflectionsRes] = await Promise.all([
      supabase
        .from("progress")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null)
        .gte("completed_at", earliestIso),
      supabase
        .from("reflection_completions")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
        .gte("completed_at", earliestIso),
    ]);

    // Inicializa 8 buckets
    const weeks: TimelinePoint[] = Array.from({ length: 8 }, (_, i) => {
      const monday = new Date(earliest);
      monday.setDate(monday.getDate() + i * 7);
      return { week: formatDayMonth(monday), xp: 0 };
    });

    const allRows = [...(progressRes.data ?? []), ...(reflectionsRes.data ?? [])];

    for (const row of allRows) {
      if (!row.completed_at) continue;
      const d = new Date(row.completed_at);
      // diferencia en días desde earliest (lunes 00:00)
      const diffDays = Math.floor((d.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 8) {
        weeks[weekIndex].xp += row.xp_earned ?? 0;
      }
    }

    return weeks;
  } catch (error) {
    console.error("getProgressTimeline error:", error);
    return [];
  }
}

/**
 * Últimos 30 días, por día — mismo filtro que timeline.
 * day label como "D/M" (ej: "5/10").
 */
export async function getDailyActivity(
  userId: string,
  supabase: SupabaseClient,
): Promise<DailyPoint[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    const startIso = start.toISOString();

    const [progressRes, reflectionsRes] = await Promise.all([
      supabase
        .from("progress")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null)
        .gte("completed_at", startIso),
      supabase
        .from("reflection_completions")
        .select("xp_earned, completed_at")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
        .gte("completed_at", startIso),
    ]);

    const days: DailyPoint[] = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { day: formatDayMonth(d), xp: 0 };
    });

    const allRows = [...(progressRes.data ?? []), ...(reflectionsRes.data ?? [])];

    for (const row of allRows) {
      if (!row.completed_at) continue;
      const d = new Date(row.completed_at);
      d.setHours(0, 0, 0, 0);
      const diffDays = Math.round((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 30) {
        days[diffDays].xp += row.xp_earned ?? 0;
      }
    }

    return days;
  } catch (error) {
    console.error("getDailyActivity error:", error);
    return [];
  }
}

/**
 * Helper puro/consultado: distribución por módulo (completed vs total).
 * Útil para donut de expediciones. No duplica lógica de DashboardContainer
 * si se prefiere calcular allí; se provee por completitud.
 */
export async function getModuleCompletion(
  userId: string,
  supabase: SupabaseClient,
): Promise<ModuleCompletion[]> {
  try {
    const [progressRes, modulesRes] = await Promise.all([
      supabase
        .from("progress")
        .select("module_slug")
        .eq("user_id", userId)
        .eq("completed", true)
        .not("completed_at", "is", null),
      supabase.from("modules").select("slug, name, lesson_count"),
    ]);

    const completedByModule = new Map<string, number>();
    for (const row of progressRes.data ?? []) {
      completedByModule.set(row.module_slug, (completedByModule.get(row.module_slug) ?? 0) + 1);
    }

    const modules = modulesRes.data ?? [];
    // Fallback a content filesystem si no hay datos en DB (no rompe)
    if (modules.length === 0) return [];

    return modules.map((m) => {
      const completed = completedByModule.get(m.slug) ?? 0;
      const total = m.lesson_count ?? 0;
      return {
        name: m.name ?? m.slug,
        completed,
        total,
        value: completed,
      };
    });
  } catch (error) {
    console.error("getModuleCompletion error:", error);
    return [];
  }
}
