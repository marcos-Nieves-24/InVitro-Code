"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApiClient } from "@/hooks/useApiClient";
import type { QuizOption } from "@/domain/slide";
import { useRevealQuizBlock } from "./RevealSequence";
import { QuizButton } from "./QuizButton";

export interface ChoiceQuestionProps {
  question: string;
  options: QuizOption[];
  explanation?: string;
  hint?: string;
  blockId?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  onCorrect?: () => void;
  mode?: "single";
  allowContinueOnIncorrect?: boolean;
}

export function ChoiceQuestion({
  question,
  options,
  explanation,
  hint,
  blockId,
  moduleSlug,
  lessonSlug,
  onCorrect,
  mode = "single",
  allowContinueOnIncorrect = false,
}: ChoiceQuestionProps) {
  // mode is reserved for future multiple-choice; currently only single is handled
  void mode;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const { apiClient } = useApiClient();
  const quizBlock = useRevealQuizBlock();

  const selectedOption: QuizOption | undefined = useMemo(
    () => options.find((o) => o.id === selectedId),
    [options, selectedId],
  );

  const isCorrect = selectedOption?.correct ?? false;

  // Derived hint text: explicit hint prop or first sentence of explanation
  const hintText = useMemo(() => {
    if (hint) return hint;
    if (explanation) {
      const first = explanation.split(".")[0].trim();
      return first ? `${first}.` : explanation;
    }
    return null;
  }, [hint, explanation]);

  const showHint = attemptCount >= 1 && !isCorrect && revealed && hintText !== null;
  const showHoverHint = attemptCount >= 1 && !isCorrect && revealed;

  // Block RevealSequence until answered correctly (unless allowContinueOnIncorrect)
  const blocked = useMemo(() => {
    if (!revealed) return true;
    if (allowContinueOnIncorrect) return false;
    return !isCorrect;
  }, [revealed, isCorrect, allowContinueOnIncorrect]);

  useEffect(() => {
    if (!quizBlock) return;
    quizBlock.setBlocked(blocked);
  }, [quizBlock, blocked]);

  // Cleanup on unmount: unblock
  useEffect(() => {
    return () => {
      quizBlock?.setBlocked(false);
    };
  }, [quizBlock]);

  const handleSelect = useCallback(
    async (id: string) => {
      const nextOption = options.find((o) => o.id === id);
      if (!nextOption) return;

      // If already correctly answered, lock selection
      if (revealed && isCorrect) return;

      // Retry case: revealed but incorrect -> allow changing selection
      // Same incorrect reselection -> no-op
      if (revealed && selectedId === id && !isCorrect) return;

      const nextIsCorrect = nextOption.correct;
      setSelectedId(id);
      // Reveal on first selection; keep revealed for retries
      if (!revealed) setRevealed(true);
      setError(null);

      if (!nextIsCorrect) {
        setAttemptCount((prev) => prev + 1);
      }

      // Fire progress persistence (fire-and-forget, don't block UI feedback)
      if (blockId && moduleSlug && lessonSlug) {
        // Don't await blocking; handle async with catch
        setSubmitting(true);
        void apiClient<{ success: boolean; error?: string }>(
          "/api/v1/progress/reflection",
          {
            method: "POST",
            body: JSON.stringify({
              moduleSlug,
              lessonSlug,
              blockId,
            }),
          },
        )
          .then((data) => {
            if (!data.success) {
              throw new Error(data.error ?? "Error al guardar progreso");
            }
          })
          .catch((err: unknown) => {
            setError(
              err instanceof Error
                ? err.message
                : "Error de conexión — intenta de nuevo",
            );
          })
          .finally(() => setSubmitting(false));
      }

      if (nextIsCorrect) {
        onCorrect?.();
      }
    },
    [
      options,
      revealed,
      isCorrect,
      selectedId,
      blockId,
      moduleSlug,
      lessonSlug,
      apiClient,
      onCorrect,
    ],
  );

  const showFeedback = revealed && selectedOption !== undefined;

  return (
    <div
      data-quiz-blocked={blocked ? "true" : "false"}
      className="my-3 rounded-card border border-gray-200 bg-surface-card p-4 shadow-sm"
    >
      <p className="mb-3 text-sm font-semibold leading-relaxed text-ink">
        {question}
      </p>

      <div
        role="radiogroup"
        aria-label={question}
        className="flex flex-col gap-2"
      >
        {options.map((opt) => (
          <QuizButton
            key={opt.id}
            option={opt}
            selected={selectedId === opt.id}
            revealed={revealed}
            onSelect={handleSelect}
            disabled={submitting}
            showHoverHint={showHoverHint}
          />
        ))}
      </div>

      {submitting && (
        <p className="mt-2 text-xs text-storm" aria-live="polite">
          Guardando progreso...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {showFeedback && (
        <div
          className={`mt-4 rounded-btn border-l-4 px-4 py-3 text-sm leading-relaxed ${
            isCorrect
              ? "border-green-500 bg-green-50 text-green-800"
              : "border-amber-400 bg-amber-50 text-amber-900"
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="mb-1 text-sm font-semibold">
            {isCorrect ? "¡Correcto!" : "No es correcto, intenta entender por qué"}
          </p>
          {selectedOption?.feedback && (
            <p className="mb-1 text-sm leading-relaxed">
              {selectedOption.feedback}
            </p>
          )}
          {explanation && (
            <p className="text-sm leading-relaxed opacity-90">{explanation}</p>
          )}
          {!isCorrect && !allowContinueOnIncorrect && (
            <p className="mt-2 text-xs font-medium opacity-80">
              Probá otra opción para continuar.
            </p>
          )}
        </div>
      )}

      {showHint && (
        <div
          className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-blue-900"
          role="note"
          aria-live="polite"
        >
          Pista: {hintText}
        </div>
      )}
    </div>
  );
}

export default ChoiceQuestion;
