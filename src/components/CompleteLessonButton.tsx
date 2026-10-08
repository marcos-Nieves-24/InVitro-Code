"use client";

import { useState } from "react";

interface Props {
  module: string;
  lesson: string;
}

export default function CompleteLessonButton({ module, lesson }: Props) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleComplete = async () => {
    if (status !== "idle") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_slug: module, lesson_slug: lesson }),
      });
      const data = (await res.json()) as {
        progress?: unknown;
        streak?: { current_streak: number };
        achievements?: unknown[];
        error?: string;
        xp_earned?: number;
        xpEarned?: number;
      };
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/sign-in";
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
        if (res.status === 403 && (data.error ?? "").includes("Consent pending")) {
          setStatus("error");
          setMessage("Completa tu consentimiento en perfil");
          return;
        }
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const xp = (data as unknown as { xp_earned?: number; xpEarned?: number }).xp_earned ?? (data as unknown as { xpEarned?: number }).xpEarned ?? 0;
      // xp may also live inside progress (Next.js response shape)
      const progressXp = (data.progress as { xp_earned?: number } | undefined)?.xp_earned;
      const resolvedXp = progressXp ?? xp;
      const streakVal = data.streak?.current_streak ?? 0;
      setStatus("done");
      setMessage(`Leccion completada! +${resolvedXp} XP | Racha: ${streakVal} dias`);
    } catch {
      setStatus("error");
      setMessage("Error de conexión — intenta de nuevo");
    }
  };

  if (status === "done") {
    return (
      <div className="mt-8 rounded-lg bg-green-50 border border-green-200 p-4 text-center">
        <p className="text-green-800 font-semibold">{message}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6 text-center">
      <button
        onClick={handleComplete}
        disabled={status === "loading"}
        className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors ${
          status === "loading"
            ? "bg-gray-300 text-gray-500 cursor-wait"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {status === "loading"
          ? "Guardando progreso..."
          : "Marcar como Completado"}
      </button>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
