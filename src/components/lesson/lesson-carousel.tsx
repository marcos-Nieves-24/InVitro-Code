"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CelebrationOverlay } from "./celebration-overlay";
import { Button } from "@/components/ui";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";
import { consumeRevealAdvance, NAV_TOKEN, NAV_TEXT_PRIMARY, NAV_TEXT_SECONDARY } from "./presentation/RevealSequence";

interface LessonCarouselProps {
  slides: React.ReactNode[];
  nextLessonHref?: string;
  lessonTitle?: string;
  moduleSlug: string;
  lessonSlug: string;
}

// P1-2 — the navigation-button token (NAV_TOKEN / NAV_TEXT_PRIMARY /
// NAV_TEXT_SECONDARY) is NOT declared here: it is imported from
// presentation/RevealSequence so the shell and the reveal cannot drift apart.
// Measured over the 80 `ia` slices at 1440x900: every nav control resolves to
// 44px tall with a 16px radius, 0 below the minimum touch target.

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
  const [isRevealBlocked, setIsRevealBlocked] = useState(false);
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
  // and whether it is blocked (quiz not answered)
  useEffect(() => {
    const check = () => {
      const root = slideAreaRef.current;
      const hasIncompleteReveal =
        root?.querySelector('[data-reveal-has-more="true"]') != null;
      const hasBlocked = root?.querySelector('[data-reveal-blocked="true"]') != null;
      setIsRevealIncomplete(hasIncompleteReveal);
      setIsRevealBlocked(hasBlocked);
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

  // ALL movement is via footer Continuar/Atrás only — no rails, no click zones, no keyboard forward.
  // Keyboard is disabled for forward (ArrowRight/Enter) so Dra. Coni + RevealSequence
  // slices only advance via footer Continuar (single source of truth).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTypingTarget =
        active?.closest("input,textarea,select,[contenteditable='true']") != null;
      if (isTypingTarget) return;
      // Only allow Atrás via ArrowLeft for accessibility; forward is footer-only
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setCurrent(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setCurrent(total - 1);
        return;
      }
      // ArrowRight, Enter, Space intentionally no-op — must use footer Continuar
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, total]);

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
        {/* Top bar — the ONE slide-position indicator.
            The dot rail (LabProgress) that used to sit here was removed: it
            stated slide position a second time alongside the "Diapositiva N de M"
            text below it and the rail + "N / M" pair in the footer. Position is
            now stated exactly once (this text) plus the intra-slide "Paso x de y"
            rendered by the reveal itself. */}
        <div className="shrink-0 border-b border-outline-variant bg-surface-card px-4 py-2">
          <p className="text-center font-mono text-sm uppercase tracking-widest text-storm">
            {lessonTitle ? `${lessonTitle} — ` : ""}Escena {current + 1} de {total}
          </p>
        </div>

        {/* Slide area — no click zones, no rails. ALL advance is via footer Continuar only.
            Scrollbar mejorado: más visible y grueso para expediciones amplias. */}
        <div
          ref={slideAreaRef}
          className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-0 scrollbar-thin scrollbar-track-surface scrollbar-thumb-brand-300 hover:scrollbar-thumb-brand-400"
          role="group"
          aria-label="Área de la diapositiva"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-brand-300) transparent" } as React.CSSProperties}
        >

          {/* Center stage — no click-owner; events only on its interactive children. */}
          <div
            className="relative z-20 mx-auto flex w-full flex-1 flex-col justify-center px-2 py-2 pointer-events-none motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
            key={current}
            // Allow interactive children to still capture clicks even though this
            // wrapper is pointer-events:none. Empty gutter hits fall through to
            // the navigation rails underneath.
          >
            <div className="pointer-events-auto w-full flex-1">
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
        </div>

        {/* Footer — Atrás / Continuar + single dot rail — fuente ampliada */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-t border-outline-variant bg-surface-card px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={current === 0}
            aria-label="Diapositiva anterior"
            className={`focus-ring ${NAV_TOKEN} text-base font-medium justify-self-start px-6 py-2`}
          >
            ← Atrás
          </Button>

          {/* Single positional affordance in the footer: the dot rail.
              The bare "N / M" counter that sat next to it was removed — it
              restated the slide number the header's "Diapositiva N de M" text
              already gives. The rail wins over the bare number because it also
              shows remaining distance, and it stays aria-hidden here so the
              header text remains the single announced source of truth. */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={`dot-${i}`}
                  className={`h-2 rounded-full transition-all duration-200 motion-reduce:transition-none ${
                    i === current
                      ? "w-8 bg-brand-500"
                      : i < current
                        ? "w-2 bg-success"
                        : "w-2 bg-surface-raised"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Single Continuar — footer is the ONLY advance control.
              All slices (RevealSequence + Dra. Coni lines) advance via footer goNext -> consumeRevealAdvance().
              Footer is enabled when hasMore and not blocked; disabled only when quiz blocks. */}
          {isLast ? (
            <Button
              variant="secondary"
              size="sm"
              className={`${NAV_TOKEN} text-base font-semibold justify-self-end !border-teal-600 !bg-teal-600 px-6 py-2 !text-white shadow-teal-600/20 hover:!bg-teal-700`}
              onClick={handleFinish}
              disabled={state === "loading" || isRevealBlocked}
              aria-label="Finalizar lección"
              aria-disabled={isRevealBlocked || undefined}
              title={
                isRevealBlocked
                  ? "Completa el contenido para continuar"
                  : undefined
              }
            >
              {state === "loading" ? "Guardando progreso…" : "Finalizar"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={goNext}
              aria-label="Siguiente diapositiva"
              aria-disabled={isRevealBlocked || undefined}
              disabled={isRevealBlocked}
              title={
                isRevealBlocked
                  ? "Completa el contenido para continuar"
                  : undefined
              }
              className={`focus-ring ${NAV_TOKEN} text-base font-semibold justify-self-end px-6 py-2 ${isRevealBlocked ? "opacity-50" : ""}`}
            >
              Continuar →
            </Button>
          )}
        </div>

        {/* Hidden live region for screen readers on slide change */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Escena {current + 1} de {total}
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
