"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

interface ReflectionCheckProps {
  prompt: string;
  answer: string;
  blockId: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function ReflectionCheck({
  prompt,
  answer,
  blockId,
  moduleSlug,
  lessonSlug,
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
        err instanceof Error ? err.message : "Error de conexión — intenta de nuevo",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-3 rounded-card border border-brand bg-brand-soft p-4">
      <p className="mb-3 text-sm font-semibold leading-relaxed text-gray-900">
        {prompt}
      </p>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={revealed}
        rows={3}
        className="block w-full resize-none rounded-btn border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        placeholder="Escribe tu respuesta aquí..."
      />

      <div className="mt-3 flex items-center gap-3">
        <Button
          size="sm"
          onClick={handleReveal}
          disabled={revealed || submitting}
        >
          {submitting
            ? "Guardando..."
            : revealed
              ? "Respuesta revelada"
              : "Revelar respuesta modelo"}
        </Button>

        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {revealed && (
        <div className="mt-4 rounded-btn border border-brand/20 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800">
          <p className="eyebrow mb-1 text-[10px] text-brand">Respuesta modelo</p>
          {answer}
        </div>
      )}
    </div>
  );
}
