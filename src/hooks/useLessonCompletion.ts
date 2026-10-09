"use client";
import { useState, useCallback } from "react";

export type CompletionState = "idle" | "loading" | "done" | "consent" | "error";

export function useLessonCompletion() {
  const [state, setState] = useState<CompletionState>("idle");
  const [xp, setXp] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(async (moduleSlug: string, lessonSlug: string) => {
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_slug: moduleSlug, lesson_slug: lessonSlug }),
      });
      const data = await res.json().catch(() => ({}) as Record<string, unknown>);
      if (res.ok) {
        // Next.js shape: { progress: {xp_earned}, streak: {current_streak} }
        const d = data as Record<string, unknown>;
        const progress = d.progress as { xp_earned?: number } | undefined;
        const streakObj = d.streak as { current_streak?: number } | undefined;
        const xpVal =
          progress?.xp_earned ??
          (d.xp_earned as number | undefined) ??
          (d.xpEarned as number | undefined) ??
          null;
        const streakVal = streakObj?.current_streak ?? null;
        setXp(xpVal);
        setStreak(streakVal);
        setState("done");
        return { ok: true as const, xp: xpVal, streak: streakVal };
      }
      if (res.status === 403 && String((data as Record<string, unknown>).error ?? "").includes("Consent pending")) {
        setState("consent");
        return { ok: false as const, consent: true as const };
      }
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return { ok: false as const };
      }
      setError(((data as Record<string, unknown>).error as string) ?? "Error al guardar progreso");
      setState("error");
      return { ok: false as const };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
      setState("error");
      return { ok: false as const };
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setXp(null);
    setStreak(null);
  }, []);

  return { state, xp, streak, error, complete, reset };
}
