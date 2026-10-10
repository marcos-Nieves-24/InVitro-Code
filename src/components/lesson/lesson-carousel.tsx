"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LabProgress } from "./lab-progress";
import { CelebrationOverlay } from "./celebration-overlay";
import { Button } from "@/components/ui";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";

interface LessonCarouselProps {
  slides: React.ReactNode[];
  nextLessonHref?: string;
  lessonTitle?: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function LessonCarousel({
  slides,
  nextLessonHref,
  lessonTitle = "",
  moduleSlug,
  lessonSlug,
}: LessonCarouselProps) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const isLast = current === total - 1;
  const slideAreaRef = useRef<HTMLDivElement>(null);
  const { state, xp, streak, error, complete } = useLessonCompletion();

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  // Scroll slide area to top on slide change
  useEffect(() => {
    slideAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  // Reduced-motion: disable smooth scroll via CSS preference
  // JS scrollTo respects smooth; CSS handles transition animation elsewhere.

  const handleFinish = async () => {
    const r = await complete(moduleSlug, lessonSlug);
    if (r.ok) setShowCelebration(true);
  };

  // Click-anywhere on slide background advances (not on interactive children)
  const handleSlideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      // Do not advance when clicking interactive descendants
      if (
        target.closest(
          "button,input,textarea,select,iframe,a,[data-no-advance],[data-interactive]",
        )
      ) {
        return;
      }
      if (!isLast) {
        goNext();
      }
    },
    [isLast, goNext],
  );

  // Keyboard navigation: Space/Enter/Right -> next, Left -> prev, Home/End -> first/last, Esc -> noop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTypingTarget =
        active?.closest("input,textarea,select,[contenteditable='true']") != null;

      // When typing, only Escape would be relevant; but spec says ESC does nothing, so ignore typing context
      if (isTypingTarget) {
        // Allow Escape to remain noop; block slide navigation while typing except Esc
        if (e.key === "Escape") return;
        // Space/Enter inside input/textarea should not navigate
        if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
          return;
        }
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          if (!isLast) goNext();
          else {
            // on last slide, ArrowRight does not auto-finish; user must press Finalizar
          }
          break;
        case " ":
        case "Spacebar":
        case "Enter":
          // Do not intercept when focus is on a native button (it already handles click)
          if (active?.tagName === "BUTTON" && e.key === "Enter") return;
          if (active?.tagName === "BUTTON" && e.key === " ") return;
          e.preventDefault();
          if (!isLast) goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          setCurrent(0);
          break;
        case "End":
          e.preventDefault();
          setCurrent(total - 1);
          break;
        case "Escape":
          // Intentionally no-op: fullscreen is fixed overlay, not native Fullscreen API
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLast, goNext, goPrev, total]);

  if (total === 0) return null;

  return (
    <>
      {/* Fullscreen shell — fixed overlay, always fullscreen, no Fullscreen API required */}
      <div
        role="region"
        aria-label="Presentación de la lección"
        aria-roledescription="carousel"
        aria-live="polite"
        className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-surface"
      >
        {/* Top progress bar */}
        <div className="shrink-0 border-b border-outline-variant bg-surface-card px-4 py-3 md:px-6">
          <LabProgress total={total} current={current} />
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-storm">
            {lessonTitle ? `${lessonTitle} — ` : ""}Diapositiva {current + 1} de {total}
          </p>
        </div>

        {/* Slide area — click background to advance; interactive children are excluded via closest check */}
        <div
          ref={slideAreaRef}
          onClick={handleSlideClick}
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          // Provide hint for coarse pointers
          role="group"
          aria-label={`Diapositiva ${current + 1} de ${total}`}
          // Make area focusable so keyboard works even without explicit focus elsewhere
          tabIndex={0}
        >
          <div
            className="mx-auto w-full max-w-3xl motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
            key={current}
          >
            {slides[current]}
          </div>

          {/* Consent / error states rendered inside scroll area so they stay visible */}
          {state === "consent" && (
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="mb-2 text-sm font-medium text-amber-800">
                Completá tu autorización para guardar tu progreso.
              </p>
              <ConsentPendingCard />
            </div>
          )}

          {state === "error" && error && (
            <p role="alert" className="mx-auto mt-4 max-w-3xl text-sm text-error">
              {error}
            </p>
          )}
        </div>

        {/* Footer — Anterior / Siguiente + indicadores */}
        <div className="flex shrink-0 items-center justify-between border-t border-outline-variant bg-surface-card px-4 py-3 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={current === 0}
            aria-label="Diapositiva anterior"
            className="focus-ring"
          >
            ← Anterior
          </Button>

          {/* Indicadores centrales: dots + contador */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                    i === current
                      ? "w-6 bg-brand-500"
                      : i < current
                        ? "w-1.5 bg-success"
                        : "w-1.5 bg-surface-raised"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-storm">
              {current + 1} / {total}
            </span>
          </div>

          {isLast ? (
            <Button
              size="sm"
              className="bg-teal-600 shadow-teal-600/20 hover:bg-teal-700"
              onClick={handleFinish}
              disabled={state === "loading"}
              aria-label="Finalizar lección"
            >
              {state === "loading" ? "Guardando progreso…" : "Finalizar"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={goNext}
              aria-label="Siguiente diapositiva"
              className="focus-ring"
            >
              Siguiente →
            </Button>
          )}
        </div>

        {/* Hidden live region for screen readers on slide change */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Diapositiva {current + 1} de {total}
        </span>
      </div>

      {showCelebration && state === "done" && (
        <CelebrationOverlay
          lessonTitle={lessonTitle}
          nextLessonHref={nextLessonHref}
          xp={xp}
          streak={streak}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </>
  );
}
