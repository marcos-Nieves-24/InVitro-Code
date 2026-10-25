"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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
// Single owner of the forward advance
// ---------------------------------------------------------------------------

/**
 * Registry of mounted reveal sequences. The lesson carousel queries it on every
 * forward trigger (footer button, click zone, keyboard) so exactly one owner
 * decides what "forward" means: while a reveal still has steps, it consumes the
 * advance; once it is complete, the slide changes.
 *
 * Without this, the footer "Continuar" and the reveal "Continuar" both write
 * the forward direction, and navigation oscillates between two slides.
 */
const revealAdvanceOwners = new Map<string, () => boolean>();
let childAdvanceCounter = 0;

export function registerRevealAdvance(
  idOrOwner: string | (() => boolean),
  maybeOwner?: () => boolean,
): () => void {
  const id =
    typeof idOrOwner === "string"
      ? idOrOwner
      : `child-advance-${++childAdvanceCounter}`;
  const owner = typeof idOrOwner === "function" ? idOrOwner : maybeOwner!;
  revealAdvanceOwners.set(id, owner);
  return () => {
    revealAdvanceOwners.delete(id);
  };
}

function consumeChildRevealAdvance(excludeId: string): boolean {
  const entries = Array.from(revealAdvanceOwners.entries()).reverse();
  for (const [id, owner] of entries) {
    if (id === excludeId) continue;
    if (owner()) return true;
  }
  return false;
}

/**
 * Offer a forward advance to the mounted reveal sequences.
 * Returns true when a reveal consumed it (i.e. the slide must NOT change).
 */
export function consumeRevealAdvance(): boolean {
  const owners = Array.from(revealAdvanceOwners.values()).reverse();
  for (const owner of owners) {
    if (owner()) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type RevealMode = "stack" | "appear";

// P1-2 — ONE navigation-button token, exported so the presentation shell in
// lesson-carousel.tsx imports it instead of redeclaring its own copy (a second
// copy is a drift bug waiting to happen). 44px clears the minimum touch target;
// rounded-lg resolves to --radius-lg (16px). It is `min-h-` rather than `h-`
// because the reveal controls wrap to two lines on narrow viewports and must not
// clip their label; measured at 1440x900 every nav control resolves to 44px.
// Primary (forward) and secondary (back) are told apart by weight/fill, never by
// a different size: before this token the shell had three heights (32/34/44) and
// three radii (pill / 10px / 16px) for the same role.
export const NAV_TOKEN = "min-h-11 rounded-lg!";
export const NAV_TEXT_PRIMARY = "text-sm font-semibold";
export const NAV_TEXT_SECONDARY = "text-sm font-medium";

// P1-1 — the intra-slide indicator is a DIFFERENT fact from the slide counter
// (position within the slide, not which slide), so it stays — but it is
// deliberately rendered quieter: 10px, no uppercase, no letter-spacing, and a
// lighter weight than the 12px uppercase "Diapositiva N de M" in the shell
// header, so the eye reads slide position first and step position second.
const STEP_LABEL = "font-mono text-xs font-medium tracking-tight text-storm";

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

  // Auto-detection fallback: if blockOnQuiz is true, scan visible slice for
  // [data-quiz-blocked="true"]. This covers ChoiceQuestion implementations that
  // set a data attribute instead of using context.
  // We use a ref + effect that inspects DOM after render.
  const [domBlocked, setDomBlocked] = useState(false);

  // Element rendered for the currently revealed step, used to keep it in view.
  const revealedStepRef = useRef<HTMLDivElement>(null);

  function prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

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

  const advanceOwnerId = useId();

  const advance = useCallback(() => {
    if (effectiveBlocked) return;
    if (showHint) dismissHint();
    if (consumeChildRevealAdvance(advanceOwnerId)) return;
    setRevealedCount((c) => {
      const next = Math.min(c + 1, total);
      return next;
    });
  }, [effectiveBlocked, total, showHint, dismissHint, advanceOwnerId]);

  // Single owner of the forward advance.
  //
  // Both the footer "Continuar" and the reveal "Continuar" sit on the same
  // forward direction, so they must not write the slide state independently:
  // when the reveal still has steps, IT consumes the advance; only when it is
  // complete does the slide change. The carousel calls this on every forward
  // trigger instead of advancing the slide itself.
  //
  // NOTE: `advance` must be declared above `handleAdvance` — referencing it in
  // the dependency array before its `const` initialization throws a TDZ
  // ReferenceError on every render and crashes the whole lesson page.
  const handleAdvance = useCallback(() => {
    if (hasMore && !effectiveBlocked) {
      advance();
      return true;
    }
    return false;
  }, [hasMore, effectiveBlocked, advance]);

  const goPrev = useCallback(() => {
    if (showHint) dismissHint();
    setRevealedCount((c) => Math.max(initialRevealed, c - 1));
  }, [initialRevealed, showHint, dismissHint]);

  // Register this sequence as the single owner of the forward advance. The id is
  // per-instance so several sequences can coexist without clobbering each other;
  // the registry is consulted by the lesson carousel on every forward trigger.
  const handleAdvanceRef = useRef(handleAdvance);
  handleAdvanceRef.current = handleAdvance;

  useEffect(() => {
    return registerRevealAdvance(advanceOwnerId, () => handleAdvanceRef.current());
  }, [advanceOwnerId]);

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

  // ALL advance is via footer Continuar only — no container click, no keyboard, no hover.
  // RevealSequence still exposes advance via registerRevealAdvance so footer goNext can consume it.

  // Keep the revealed step inside the slide's visible band.
  //
  // The presentation shell gives the slide area a fixed band between the header
  // and the footer, and content can be taller than that band. Without this, a
  // step revealed low in a tall slide (an animation stage after a glossary and a
  // table) renders below the fold and stays unreachable. Scrolling the step into
  // view — rather than resizing it — preserves the content and the 16:9 stage
  // silhouette, and it is the only place that knows which step just appeared.
  const needsScrollIntoView = revealedCount > 0 && hasMore;
  useEffect(() => {
    if (!needsScrollIntoView) return;
    const node = revealedStepRef.current;
    if (!node) return;
    const raf = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const visibleBottom = window.innerHeight;
      const visibleTop = rect.height > window.innerHeight ? 0 : rect.top;
      // Only act when the step is actually cut off; otherwise a harmless nudge
      // would move content the user is already reading.
      if (rect.top < 0 || rect.bottom > visibleBottom) {
        node.scrollIntoView({
          block: rect.height > window.innerHeight ? "start" : "center",
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [needsScrollIntoView, revealedCount]);

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

  // Appear mode fits its own content.
  //
  // The container used to be sized against the VIEWPORT
  // (`min-h-[min(45vh,calc(100vh-180px))]`). A short step then sat centred in
  // that cage and pushed the next block hundreds of pixels below: the measured
  // worst case was a 968px void between two content blocks, and 694px of empty
  // stage underneath. The vertical anchoring now lives in the carousel, which
  // centres the whole slide inside the stage band (see lesson-carousel.tsx), so
  // the reveal only has to lay out its own children without a fake height.
  //
  // The bottom padding is dropped while the controls bar is rendered: that bar
  // already carries `pb-3`, and the extra padding only deepens the empty space
  // measured under the last content block.
  const containerClass = isAppear
    ? showHistory
      ? "flex w-full flex-col items-center gap-4 px-2 pt-2 pb-0 md:px-4 md:pt-3 md:pb-0 relative overflow-x-visible"
      : "grid w-full place-items-center gap-4 px-2 pt-2 pb-0 md:px-4 md:pt-3 md:pb-0 relative overflow-x-visible"
    : "flex w-full flex-col gap-4 px-2 pt-2 pb-0 md:px-4 md:pt-3 md:pb-0 relative overflow-x-visible";

  // Appear mode: show only current step centered (no vertical push).
  // Stack mode: show all revealed steps stacked vertically.
  const renderChildren = useMemo(() => {
    if (!isAppear) return allChildren.slice(0, revealedCount);
    if (showHistory) return allChildren.slice(0, revealedCount);
    if (revealedCount === 0) return [];
    const current = allChildren[revealedCount - 1];
    return current ? [current] : [];
  }, [allChildren, revealedCount, isAppear, showHistory]);

  if (total === 0) return null;

  return (
    <RevealQuizContext.Provider value={contextValue}>
      <div
        ref={handleContainerRef}
        role="region"
        aria-live="polite"
        aria-label="Contenido progresivo"
        data-reveal-has-more={hasMore ? "true" : "false"}
        data-reveal-blocked={effectiveBlocked ? "true" : "false"}
        data-reveal-mode={mode}
        className={containerClass}
      >
        {isAppear && showHistory
          ? // Stack with faint history: previous steps stay visible, current animates in
            renderChildren.map((child, index) => {
              const isCurrent = index === renderChildren.length - 1;
              const stableKey =
                (child as unknown as { key?: string | number | null })?.key ??
                `reveal-${index}`;
              return (
                <div
                  key={stableKey}
                  aria-hidden={!isCurrent}
                  ref={isCurrent ? revealedStepRef : undefined}
                  className={
                    isCurrent
                      ? "w-full reveal is-visible motion-safe:animate-[reveal-up_250ms_ease-out] motion-reduce:animate-none"
                      : "w-full opacity-60"
                  }
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
                    ref={absoluteIndex === 0 ? revealedStepRef : undefined}
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
                    ref={index === 0 ? revealedStepRef : undefined}
                    className="reveal is-visible motion-safe:animate-[reveal-up_400ms_ease-out] motion-reduce:animate-none"
                  >
                    {child}
                  </div>
                );
              })}

        {/* Hidden slice not rendered — keeps DOM minimal; a11y aria-hidden implied by absence */}

        {/* Indicator area — single Continuar lives in the footer. This block only
            shows Paso x de y + blocked hint + helper text; no buttons. */}
        {hasMore ? (
          <div className="mt-4 flex flex-col items-center gap-2 pt-2 pb-1">
            {showHint && revealedCount === initialRevealed && (
              <div
                role="status"
                className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-brand-200 bg-white/90 px-4 py-2 text-xs font-medium text-storm shadow-sm backdrop-blur"
              >
                <span>Tip: avanza paso a paso</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissHint();
                  }}
                  className={`inline-flex ${NAV_TOKEN} items-center gap-2 ${NAV_TEXT_SECONDARY} bg-brand-500 px-4 text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2`}
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
            ) : null}
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
