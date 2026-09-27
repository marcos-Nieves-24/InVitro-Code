"use client";

import { useEffect } from "react";

interface CoachMarksProps {
  step: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
  onPrev?: () => void;
  canPrev?: boolean;
}

/**
 * Step indicator + navigation for onboarding.
 * Shows "1/5" + progress dots, Omitir (ghost) and Siguiente/Finalizar (primary mint).
 * Handles ESC to skip.
 */
export function CoachMarks({
  step,
  total,
  onNext,
  onSkip,
  onPrev,
  canPrev = false,
}: CoachMarksProps) {
  const isLast = step === total;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSkip]);

  return (
    <div className="flex flex-col gap-3">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-semibold tracking-wide text-storm">
          {step}/{total}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === step
                  ? "w-6 bg-mint"
                  : i + 1 < step
                    ? "w-1.5 bg-mint/60"
                    : "w-1.5 bg-surface-raised"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {canPrev && onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="rounded-btn border border-surface-raised bg-surface-card px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          >
            Anterior
          </button>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="rounded-btn px-3 py-1.5 text-sm font-medium text-storm transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
        >
          Omitir
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-btn bg-mint px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint active:scale-[0.97]"
        >
          {isLast ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
