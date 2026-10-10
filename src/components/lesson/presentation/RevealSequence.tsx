"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Children,
  isValidElement,
} from "react";
import type { ReactNode, MouseEvent } from "react";

// ---------------------------------------------------------------------------
// Context for ChoiceQuestion (T4) integration
// ---------------------------------------------------------------------------

interface RevealQuizContextValue {
  /** Register whether a quiz inside the sequence is currently blocking advancement. */
  setBlocked: (blocked: boolean) => void;
}

const RevealQuizContext = createContext<RevealQuizContextValue | null>(null);

/**
 * Hook for quiz children (e.g. ChoiceQuestion) to signal blocking state to
 * the parent RevealSequence. When `setBlocked(true)` is called the sequence
 * will disable advancement and show "Responde correctamente para continuar".
 *
 * Usage (inside ChoiceQuestion):
 * ```tsx
 * const quizBlock = useRevealQuizBlock();
 * useEffect(() => { quizBlock?.setBlocked(!answeredCorrectly); }, [answeredCorrectly]);
 * ```
 *
 * Safe to call outside a RevealSequence — returns null.
 */
export function useRevealQuizBlock(): RevealQuizContextValue | null {
  return useContext(RevealQuizContext);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RevealSequenceProps {
  children: ReactNode;
  /** When true, appearance of [data-quiz-blocked="true"] in the visible slice blocks advancement. */
  blockOnQuiz?: boolean;
  /** Direct controlled blocking flag. Parent may drive it without context. */
  blocked?: boolean;
  onComplete?: () => void;
  /** Number of children visible on mount. Defaults to 1 (first step visible). */
  startRevealed?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RevealSequence({
  children,
  blockOnQuiz = false,
  blocked: blockedProp = false,
  onComplete,
  startRevealed,
}: RevealSequenceProps) {
  const allChildren = useMemo(() => Children.toArray(children), [children]);
  const total = allChildren.length;

  // Clamp initial revealed count to [0, total]; default 1 when startRevealed unset.
  // 0 means nothing shown until first click; useful for quiz-first slides.
  const initialRevealed = useMemo(() => {
    if (startRevealed === undefined) return Math.min(1, total);
    return Math.max(0, Math.min(startRevealed, total));
  }, [startRevealed, total]);

  const [revealedCount, setRevealedCount] = useState(initialRevealed);
  const [isQuizBlocked, setIsQuizBlocked] = useState(false);

  // Keep revealedCount in sync if total shrinks (e.g. conditional children) –
  // never exceed total, never drop below 0.
  useEffect(() => {
    setRevealedCount((c) => Math.min(c, total));
  }, [total]);

  // Reset blocked state when blockOnQuiz toggles off or when all revealed.
  useEffect(() => {
    if (!blockOnQuiz) setIsQuizBlocked(false);
  }, [blockOnQuiz]);

  // Auto-detection fallback: if blockOnQuiz is true, scan visible slice for
  // [data-quiz-blocked="true"]. This covers ChoiceQuestion implementations that
  // set a data attribute instead of using context.
  // We use a ref + effect that inspects DOM after render.
  const [domBlocked, setDomBlocked] = useState(false);

  // We expose a callback ref on the visible container and re-evaluate when
  // revealedCount changes.
  const visibleChildren = useMemo(
    () => allChildren.slice(0, revealedCount),
    [allChildren, revealedCount]
  );

  // Check DOM for data-quiz-blocked after each render when blockOnQuiz is on.
  // Uses requestAnimationFrame-free sync check via useEffect, scanning rendered nodes.
  // For children that render [data-quiz-blocked], we also detect via React element props
  // without needing DOM — faster and SSR-safe.
  const reactTreeBlocked = useMemo(() => {
    if (!blockOnQuiz) return false;
    // Shallow scan visible children for data-quiz-blocked prop
    for (const child of visibleChildren) {
      if (isValidElement(child)) {
        const props = child.props as Record<string, unknown>;
        if (props["data-quiz-blocked"] === "true" || props["data-quiz-blocked"] === true) {
          return true;
        }
        // Also check nested: if child is a fragment or wrapper, its props may contain children
        // We do a one-level depth check for common wrapper patterns
        const nested = props.children;
        if (Array.isArray(nested)) {
          for (const n of nested) {
            if (isValidElement(n) && (n.props as Record<string, unknown>)["data-quiz-blocked"] === "true") {
              return true;
            }
          }
        } else if (isValidElement(nested as ReactNode)) {
          if ((nested as unknown as { props: Record<string, unknown> }).props["data-quiz-blocked"] === "true") {
            return true;
          }
        }
      }
    }
    return false;
  }, [blockOnQuiz, visibleChildren]);

  // Combine DOM check for deeply nested data attributes (fallback)
  // We set domBlocked by scanning the container element — but we can skip DOM scan
  // if reactTreeBlocked already blocked. Otherwise check via container ref effect.
  // To avoid needing a ref, we recompute domBlocked as false when not needed;
  // the container ref effect below will set it if a descendant carries the attribute.
  const setDomBlockedSafe = useCallback((value: boolean) => setDomBlocked(value), []);

  const effectiveBlocked = blockedProp || isQuizBlocked || reactTreeBlocked || domBlocked;

  const isComplete = revealedCount >= total && total > 0;
  const hasMore = revealedCount < total;

  const advance = useCallback(() => {
    if (effectiveBlocked) return;
    setRevealedCount((c) => {
      const next = Math.min(c + 1, total);
      return next;
    });
  }, [effectiveBlocked, total]);

  const goPrev = useCallback(() => {
    setRevealedCount((c) => Math.max(initialRevealed, c - 1));
  }, [initialRevealed]);

  // Fire onComplete once when completion is reached
  const prevCompleteRef = useRef(false);
  useEffect(() => {
    if (isComplete) {
      if (!prevCompleteRef.current) {
        prevCompleteRef.current = true;
        onComplete?.();
      }
    } else {
      if (prevCompleteRef.current) prevCompleteRef.current = false;
    }
  }, [isComplete, onComplete]);

  const handleContainerClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      // Don't advance when interacting with form/native interactive elements,
      // except the explicit continue/back buttons.
      const interactiveAncestor = target.closest(
        "button,input,textarea,select,iframe,a,[data-no-advance]"
      );
      if (interactiveAncestor) {
        const isContinue =
          target.closest("[data-reveal-continue]") != null ||
          interactiveAncestor.closest("[data-reveal-continue]") != null ||
          interactiveAncestor.matches("[data-reveal-continue]");
        const isBack =
          target.closest("[data-reveal-back]") != null ||
          interactiveAncestor.closest("[data-reveal-back]") != null ||
          interactiveAncestor.matches("[data-reveal-back]");
        if (!isContinue && !isBack) return;
        // Back button is handled by its own onClick; don't advance here
        if (isBack) return;
      }
      if (!hasMore) return;
      if (effectiveBlocked) return;
      advance();
    },
    [hasMore, effectiveBlocked, advance]
  );

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft" && revealedCount > initialRevealed) {
        e.preventDefault();
        e.stopPropagation();
        goPrev();
      }
    },
    [revealedCount, initialRevealed, goPrev]
  );

  // Context value — stable identity
  const contextValue = useMemo<RevealQuizContextValue>(
    () => ({
      setBlocked: (b: boolean) => setIsQuizBlocked(b),
    }),
    []
  );

  // DOM fallback scan effect: when blockOnQuiz is true, after visible slice renders,
  // look for [data-quiz-blocked="true"] in the container. Uses a callback ref pattern
  // without needing to expose ref to parent.
  const handleContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!blockOnQuiz || !node) {
        setDomBlockedSafe(false);
        return;
      }
      const found = node.querySelector('[data-quiz-blocked="true"]') != null;
      setDomBlockedSafe(found);
    },
    [blockOnQuiz, setDomBlockedSafe]
  );

  // Also re-evaluate domBlocked whenever revealedCount or blockOnQuiz changes,
  // by querying the container via document — we do this via an effect that
  // finds the nearest reveal-sequence container.
  useEffect(() => {
    if (!blockOnQuiz) {
      setDomBlocked(false);
      return;
    }
    // The container ref effect already covers the primary path. This is a
    // no-op fallback for cases where handleContainerRef hasn't fired yet.
    // We keep it cheap: no DOM query if reactTreeBlocked already true.
    if (reactTreeBlocked) {
      setDomBlocked(false);
    }
  }, [blockOnQuiz, reactTreeBlocked, revealedCount]);

  if (total === 0) return null;

  return (
    <RevealQuizContext.Provider value={contextValue}>
      <div
        ref={handleContainerRef}
        role="region"
        aria-live="polite"
        aria-label="Contenido progresivo"
        onClick={handleContainerClick}
        onKeyDown={handleContainerKeyDown}
        data-reveal-has-more={hasMore ? "true" : "false"}
        className="flex flex-col gap-4"
      >
        {allChildren.slice(0, revealedCount).map((child, index) => {
          const stableKey =
            (child as unknown as { key?: string | number | null })?.key ??
            `reveal-${index}`;
          return (
            <div
              key={stableKey}
              aria-hidden={false}
              className="reveal is-visible motion-safe:animate-[reveal-up_400ms_ease-out] motion-reduce:animate-none"
            >
              {child}
            </div>
          );
        })}

        {/* Hidden slice not rendered — keeps DOM minimal; a11y aria-hidden implied by absence */}

        {/* Controls / indicator area */}
        {hasMore ? (
          <div className="flex flex-col items-center gap-2 pt-2">
            {effectiveBlocked ? (
              <p
                role="status"
                aria-live="polite"
                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800"
              >
                Responde correctamente para continuar
              </p>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {revealedCount > initialRevealed && (
                    <button
                      type="button"
                      data-reveal-back
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      aria-label="Mostrar contenido anterior"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface-card px-5 py-2 text-sm font-semibold text-storm shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none"
                    >
                      <span aria-hidden="true">←</span> Atrás
                    </button>
                  )}
                  <button
                    type="button"
                    data-reveal-continue
                    onClick={(e) => {
                      e.stopPropagation();
                      advance();
                    }}
                    aria-label="Mostrar siguiente contenido"
                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none"
                  >
                    Continuar <span aria-hidden="true">→</span>
                  </button>
                </div>
                <span
                  aria-hidden="true"
                  className="text-xs font-medium text-storm motion-safe:animate-pulse motion-reduce:animate-none"
                >
                  ▸ Click para continuar
                </span>
              </>
            )}
          </div>
        ) : revealedCount > initialRevealed ? (
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              type="button"
              data-reveal-back
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Mostrar contenido anterior"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface-card px-5 py-2 text-sm font-semibold text-storm shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none"
            >
              <span aria-hidden="true">←</span> Atrás
            </button>
          </div>
        ) : null}

        {/* Screen-reader progress announcement */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Paso {revealedCount} de {total}
          {effectiveBlocked ? " — responde para continuar" : ""}
        </span>
      </div>
    </RevealQuizContext.Provider>
  );
}

export default RevealSequence;
