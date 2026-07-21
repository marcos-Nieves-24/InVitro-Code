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
        body: JSON.stringify({
          userId: window.__clerk?.user?.id,
          moduleSlug: module,
          lessonSlug: lesson,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("done");
        setMessage(
          `✅ Lección completada! +${data.xpEarned} XP | Racha: ${data.streak.current_streak} días`,
        );
      } else {
        setStatus("error");
        setMessage(data.error ?? "Error al guardar progreso");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión — intentá de nuevo");
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
          : "✔ Marcar como Completado"}
      </button>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
