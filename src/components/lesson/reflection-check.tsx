"use client";

import { useState } from "react";

interface ReflectionCheckProps {
  prompt: string;
  answer: string;
  blockId: string;
  moduleSlug?: string;
  lessonSlug?: string;
}

export function ReflectionCheck({
  prompt,
  answer,
  blockId,
  moduleSlug = "ia",
  lessonSlug = "lesson02_how_ai_learns",
}: ReflectionCheckProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReveal = async () => {
    if (revealed || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/progress/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug,
          lessonSlug,
          blockId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Error al guardar progreso");
      }

      setRevealed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error de conexión — intentá de nuevo",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-6 rounded-[12px] border border-blue-600 bg-blue-50 p-6">
      <p className="mb-3 text-sm font-semibold leading-relaxed text-gray-900">
        {prompt}
      </p>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={revealed}
        rows={3}
        className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        placeholder="Escribí tu respuesta acá..."
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleReveal}
          disabled={revealed || submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {submitting
            ? "Guardando..."
            : revealed
              ? "✓ Respuesta revelada"
              : "Revelar respuesta modelo"}
        </button>

        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>

      {revealed && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-100 px-4 py-3 text-sm leading-relaxed text-gray-800">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Respuesta modelo
          </p>
          {answer}
        </div>
      )}
    </div>
  );
}
