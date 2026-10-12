"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LabProgress } from "./lab-progress";
import { CelebrationOverlay } from "./celebration-overlay";
import { Button } from "@/components/ui";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";
import { consumeRevealAdvance } from "./presentation/RevealSequence";

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
  const [isRevealIncomplete, setIsRevealIncomplete] = useState(false);
  // True while the current slide's RevealSequence still has unblocked steps.
  // While it is true the reveal owns the visible advance control and the footer
  // renders none, so a screen never shows two "Continuar" buttons.
  const [revealOwnsAdvance, setRevealOwnsAdvance] = useState(false);
  const isLast = current === total - 1;
  const slideAreaRef = useRef<HTMLDivElement>(null);
  const { state, xp, streak, error, complete } = useLessonCompletion();

  // Single owner of the forward advance: while the current slide has a
  // RevealSequence with steps remaining, IT consumes the advance; only when it is
  // complete does the slide change. Every forward trigger (footer button, click
  // zone on the right half, ArrowRight/Space/Enter) funnels through here, so the
  // footer and the reveal never both write the forward direction.
  const goNext = useCallback(() => {
    if (consumeRevealAdvance()) return;
    setCurrent((c) => Math.min(c + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  // Scroll slide area to top on slide change
  useEffect(() => {
    slideAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  // Detect whether current slide has incomplete RevealSequence (data-reveal-has-more="true")
  useEffect(() => {
    const check = () => {
      const root = slideAreaRef.current;
      const hasIncompleteReveal =
        root?.querySelector('[data-reveal-has-more="true"]') != null;
      // A blocked reveal (quiz not answered yet) renders no advance button of its
      // own — it renders "Responde correctamente para continuar" — so the footer
      // keeps its (disabled) control in that state and only steps aside while the
      // reveal can actually advance.
      const isRevealBlocked =
        root?.querySelector('[data-reveal-blocked="true"]') != null;
      setIsRevealIncomplete(hasIncompleteReveal);
      setRevealOwnsAdvance(hasIncompleteReveal && !isRevealBlocked);
    };
    // Initial check after render
    const raf = requestAnimationFrame(check);
    const t = setTimeout(check, 60);
    const node = slideAreaRef.current;
    if (!node) {
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
  // Observe also the reveal's blocked flag so "Completa el contenido para
  // continuar" stays accurate while the reveal still has steps.
  const obs = new MutationObserver(check);
  obs.observe(node, {
    attributes: true,
    subtree: true,
    childList: true,
    attributeFilter: ["data-reveal-has-more", "data-reveal-blocked"],
  });
    // Also observe childList + subtree without filter for newly mounted RevealSequences
    // (attributeFilter already covers data-reveal-has-more; childList catches DOM additions)
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      obs.disconnect();
    };
  }, [current]);

  // Reduced-motion: disable smooth scroll via CSS preference
  // JS scrollTo respects smooth; CSS handles transition animation elsewhere.

  const handleFinish = async () => {
    const r = await complete(moduleSlug, lessonSlug);
    if (r.ok) setShowCelebration(true);
  };

  // Click zones: left half -> Atrás, right half -> Continuar.
  // Both zones call the same single-owner goNext/goPrev, so a coordinate click and
  // the footer/RevealSequence buttons can never double-advance the same direction.
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
      const rect = slideAreaRef.current?.getBoundingClientRect();
      const midX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const x = e.clientX;
      if (x < midX) {
        goPrev();
        return;
      }
      // Right zone: goNext delegates to the reveal owner when it still has steps.
      if (!isLast) {
        goNext();
      }
    },
    [isLast, goNext, goPrev],
  );

  // Keyboard navigation: Space/Enter/Right -> next (blocked while reveal incomplete), Left -> prev, Home/End -> first/last, Esc -> noop
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

      // All forward keys below funnel through goNext, which delegates to the
      // single reveal owner while it still has steps and only changes the slide
      // once the reveal is complete.
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
          // Intra-slide back is handled by RevealSequence's own keydown, which
          // stops propagation, so this fallback only runs for inter-slide back.
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
      {/* Fullscreen shell — respects sidebar offset via --sidebar-offset (256px or 0px on desktop, 0 on mobile) */}
      <div
        role="region"
        aria-label="Presentación de la lección"
        aria-roledescription="carousel"
        aria-live="polite"
        className="fixed inset-y-0 left-0 right-0 z-30 flex flex-col overflow-hidden bg-surface lg:left-[var(--sidebar-offset)]"
      >
        {/* Top progress bar — compact */}
        <div className="shrink-0 border-b border-outline-variant bg-surface-card px-3 py-1.5">
          <LabProgress total={total} current={current} />
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-storm">
            {lessonTitle ? `${lessonTitle} — ` : ""}Diapositiva {current + 1} de {total}
          </p>
        </div>

        {/* Slide area — full bleed; click zones: left=Atrás right=Continuar.
            Flex column so the inner wrapper owns the whole stage band and can
            centre the slide inside it: a short slide used to hang from the top of
            the band and dump every pixel of void at the bottom (measured 694px). */}
        <div
          ref={slideAreaRef}
          onClick={handleSlideClick}
          className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-0"
          // Provide hint for coarse pointers
          role="group"
          aria-label={`Diapositiva ${current + 1} de ${total}`}
          // Make area focusable so keyboard works even without explicit focus elsewhere
          tabIndex={0}
        >
          <div
            className="flex w-full flex-1 flex-col justify-center motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
            key={current}
          >
            {slides[current]}

            {/* Consent / error states live in the same flex column so they stay
                visible right under the centred slide. */}
            {state === "consent" && (
              <div className="mx-auto mt-6 w-full max-w-3xl shrink-0">
                <p className="mb-2 text-sm font-medium text-amber-800">
                  Completá tu autorización para guardar tu progreso.
                </p>
                <ConsentPendingCard />
              </div>
            )}

            {state === "error" && error && (
              <p role="alert" className="mx-auto mt-4 w-full max-w-3xl shrink-0 text-sm text-error">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer — Atrás / Continuar + indicadores (compact).
            Grid instead of justify-between so the centre indicators stay centred
            when the advance slot renders nothing. */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-t border-outline-variant bg-surface-card px-3 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={current === 0}
            aria-label="Diapositiva anterior"
            className="focus-ring justify-self-start"
          >
            ← Atrás
          </Button>

          {/* Indicadores centrales: dots + contador */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={`dot-${i}`}
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

          {/* One advance control per screen. While the current slide's reveal
              still has unblocked steps, IT renders the "Continuar" next to the
              step it advances and this slot renders nothing — no hidden-but-
              focusable duplicate left in the DOM. When the reveal is blocked by a
              quiz it renders no advance button, so the footer keeps its own
              (disabled) control there. */}
          {isLast ? (
            <Button
              size="sm"
              className="justify-self-end bg-teal-600 shadow-teal-600/20 hover:bg-teal-700"
              onClick={handleFinish}
              disabled={state === "loading" || isRevealIncomplete}
              aria-label="Finalizar lección"
              aria-disabled={isRevealIncomplete || undefined}
              title={
                isRevealIncomplete
                  ? "Completa el contenido para continuar"
                  : undefined
              }
            >
              {state === "loading" ? "Guardando progreso…" : "Finalizar"}
            </Button>
          ) : revealOwnsAdvance ? null : (
            <Button
              variant="secondary"
              size="sm"
              onClick={goNext}
              aria-label="Siguiente diapositiva"
              aria-disabled={isRevealIncomplete || undefined}
              title={
                isRevealIncomplete
                  ? "Completa el contenido para continuar"
                  : undefined
              }
              className={`focus-ring justify-self-end ${isRevealIncomplete ? "opacity-50" : ""}`}
            >
              Continuar →
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
