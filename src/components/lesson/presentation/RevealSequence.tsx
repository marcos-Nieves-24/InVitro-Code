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

export type RevealMode = "stack" | "appear";

export interface RevealSequenceProps {
  children: ReactNode;
  /** When true, appearance of [data-quiz-blocked="true"] in the visible slice blocks advancement. */
  blockOnQuiz?: boolean;
  /** Direct controlled blocking flag. Parent may drive it without context. */
  blocked?: boolean;
  onComplete?: () => void;
  /** Number of children visible on mount. Defaults to 1 (first step visible). */
  startRevealed?: number;
  /** Presentation mode: "appear" (single centered overlay, default) or "stack" (vertical stacking). */
  mode?: RevealMode;
  /** When mode="appear", keep faint history of previous steps. Default false (only current visible). */
  showHistory?: boolean;
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
  mode = "appear",
  showHistory = false,
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
  const [showHint, setShowHint] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  // Keep revealedCount in sync if total shrinks (e.g. conditional children) –
  // never exceed total, never drop below 0.
  useEffect(() => {
    setRevealedCount((c) => Math.min(c, total));
  }, [total]);

  // Reset blocked state when blockOnQuiz toggles off or when all revealed.
  useEffect(() => {
    if (!blockOnQuiz) setIsQuizBlocked(false);
  }, [blockOnQuiz]);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem("reveal-hint-dismissed", "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("reveal-hint-dismissed") !== "true") {
        setShowHint(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => dismissHint(), 5000);
    return () => clearTimeout(timer);
  }, [showHint, dismissHint]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const leftThreshold = rect.left + rect.width * 0.3;
    const rightThreshold = rect.left + rect.width * 0.7;
    if (e.clientX < leftThreshold) setHoverSide("left");
    else if (e.clientX > rightThreshold) setHoverSide("right");
    else setHoverSide(null);
  }, []);

  const handleMouseLeave = useCallback(() => setHoverSide(null), []);

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
    if (showHint) dismissHint();
    setRevealedCount((c) => {
      const next = Math.min(c + 1, total);
      return next;
    });
  }, [effectiveBlocked, total, showHint, dismissHint]);

  const goPrev = useCallback(() => {
    if (showHint) dismissHint();
    setRevealedCount((c) => Math.max(initialRevealed, c - 1));
  }, [initialRevealed, showHint, dismissHint]);

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
      if (showHint) dismissHint();
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
        // Back / Continue buttons handle their own onClick with stopPropagation
        if (isBack) return;
        // Continue button click is handled by its own onClick; avoid double advance via container
        if (isContinue) return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const x = e.clientX;
      if (x < midX) {
        if (revealedCount > initialRevealed) goPrev();
        return;
      }
      if (!hasMore) return;
      if (effectiveBlocked) return;
      advance();
    },
    [hasMore, effectiveBlocked, advance, goPrev, revealedCount, initialRevealed, showHint, dismissHint]
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

  const isAppear = mode === "appear";

  // Appear mode: show only current step centered (no vertical push).
  // Stack mode: show all revealed steps stacked vertically.
  const renderChildren = useMemo(() => {
    if (!isAppear) return allChildren.slice(0, revealedCount);
    if (showHistory) return allChildren.slice(0, revealedCount);
    if (revealedCount === 0) return [];
    const current = allChildren[revealedCount - 1];
    return current ? [current] : [];
  }, [allChildren, revealedCount, isAppear, showHistory]);

  const containerClass = isAppear
    ? "grid min-h-[calc(100vh-160px)] w-full place-items-center gap-4 p-4 md:p-6 lg:p-8 relative overflow-x-hidden"
    : "flex w-full flex-col gap-4 p-4 md:p-6 lg:p-8 relative overflow-x-hidden";

  if (total === 0) return null;

  return (
    <RevealQuizContext.Provider value={contextValue}>
      <div
        ref={handleContainerRef}
        role="region"
        aria-live="polite"
        aria-label="Contenido progresivo"
        onClick={handleContainerClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleContainerKeyDown}
        data-reveal-has-more={hasMore ? "true" : "false"}
        data-reveal-mode={mode}
        className={containerClass}
      >
        {/* Ghost arrow hints on hover — faint left/right indicators */}
        {hoverSide === "left" && revealedCount > initialRevealed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-3xl font-bold text-storm opacity-20"
          >
            ←
          </span>
        )}
        {hoverSide === "right" && hasMore && !effectiveBlocked && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-3xl font-bold text-storm opacity-20"
          >
            →
          </span>
        )}
        {isAppear && showHistory
          ? // Grid overlay: all children share same cell, only current is visible (for showHistory=true)
            renderChildren.map((child, index) => {
              const isCurrent = index === renderChildren.length - 1;
              const stableKey =
                (child as unknown as { key?: string | number | null })?.key ??
                `reveal-${index}`;
              return (
                <div
                  key={stableKey}
                  aria-hidden={!isCurrent}
                  className={
                    isCurrent
                      ? "col-start-1 row-start-1 w-full reveal is-visible motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
                      : "col-start-1 row-start-1 w-full pointer-events-none opacity-30 hidden"
                  }
                  style={{ gridArea: "1 / 1" }}
                >
                  {child}
                </div>
              );
            })
          : isAppear
            ? // Default appear: single centered current child
              renderChildren.map((child) => {
                const absoluteIndex = revealedCount - 1;
                const stableKey =
                  (child as unknown as { key?: string | number | null })?.key ??
                  `reveal-${absoluteIndex}`;
                return (
                  <div
                    key={stableKey}
                    aria-hidden={false}
                    className="w-full max-w-full reveal is-visible motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
                  >
                    {child}
                  </div>
                );
              })
            : // Stack mode: vertical list
              (renderChildren as ReactNode[]).map((child, index) => {
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
            {total > 1 && (
              <span className="font-mono text-[10px] tracking-widest text-storm">
                Paso {revealedCount} de {total}
              </span>
            )}
            {showHint && revealedCount === initialRevealed && (
              <div
                role="status"
                className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-brand-200 bg-white/90 px-4 py-2 text-xs font-medium text-storm shadow-sm backdrop-blur"
              >
                <span>Tip: click a la derecha → Continuar, a la izquierda ← Atrás (o usa flechas)</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissHint();
                  }}
                  className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                >
                  Entendido
                </button>
              </div>
            )}
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
            {total > 1 && (
              <span className="font-mono text-[10px] tracking-widest text-storm">
                Paso {revealedCount} de {total}
              </span>
            )}
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
        ) : total > 1 ? (
          <div className="flex flex-col items-center gap-2 pt-2">
            <span className="font-mono text-[10px] tracking-widest text-storm">
              Paso {revealedCount} de {total}
            </span>
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
