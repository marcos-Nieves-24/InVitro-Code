"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Avatars — 40x40 SVG, evolution of ConiAvatar from mascot-message.tsx
// ---------------------------------------------------------------------------

function ConiAvatar({ mood }: { mood: "neutral" | "thinking" | "celebrating" }) {
  const pupilCy = mood === "thinking" ? "16" : "18";
  return (
    <svg
      viewBox="0 0 40 40"
      width={44}
      height={44}
      className="shrink-0"
      role="img"
      aria-label="Coni la conidia"
    >
      <ellipse cx="20" cy="22" rx="14" ry="16" fill="#3B82F6" opacity={0.08} />
      <circle cx="20" cy="20" r="10" fill="#3B82F6" />
      <circle cx="16" cy="18" r="2.5" fill="white" />
      <circle cx="24" cy="18" r="2.5" fill="white" />
      <circle cx="16" cy={pupilCy} r="1.2" fill="#1E3A5F" />
      <circle cx="24" cy={pupilCy} r="1.2" fill="#1E3A5F" />
      {mood === "celebrating" && (
        <path
          d="M 16 23 Q 20 26 24 23"
          fill="none"
          stroke="#1E3A5F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {mood === "thinking" && (
        <g opacity={0.6}>
          <circle cx="30" cy="10" r="1.2" fill="#3B82F6" />
          <circle cx="33" cy="7" r="1.8" fill="#3B82F6" />
          <circle cx="36" cy="4" r="1" fill="#3B82F6" />
        </g>
      )}
    </svg>
  );
}

function ScientistAvatar({ mood }: { mood: "neutral" | "thinking" | "celebrating" }) {
  const pupilCy = mood === "thinking" ? "16.5" : "18";
  return (
    <svg
      viewBox="0 0 44 44"
      width={44}
      height={44}
      className="shrink-0"
      role="img"
      aria-label="Dra. Coni, científica"
    >
      {/* halo */}
      <ellipse cx="22" cy="24" rx="14" ry="16" fill="#00B5C5" opacity={0.1} />
      {/* ponytail */}
      <ellipse cx="30" cy="16" rx="6" ry="9" fill="#3B2314" />
      <ellipse cx="31" cy="14" rx="2.5" ry="3.5" fill="#5C3310" opacity={0.5} />
      {/* head */}
      <circle cx="22" cy="18" r="9.5" fill="#F9CBA5" />
      {/* lab coat collar */}
      <path d="M 12 28 L 22 36 L 32 28 L 28 26 L 22 30 L 16 26 Z" fill="white" stroke="#E2E8F0" strokeWidth="0.8" />
      <path d="M 10 28 Q 10 38 22 40 Q 34 38 34 28 L 32 28 L 28 26 L 22 30 L 16 26 L 12 28 Z" fill="white" stroke="#CBD5E1" strokeWidth="0.8" />
      {/* coat buttons */}
      <circle cx="22" cy="33" r="1" fill="#94A3B8" />
      <circle cx="22" cy="37" r="1" fill="#94A3B8" />
      {/* glasses */}
      <g fill="none" stroke="#1E3A5F" strokeWidth="1.1">
        <circle cx="18.5" cy="18" r="4.2" />
        <circle cx="25.5" cy="18" r="4.2" />
        <line x1="22.7" y1="18" x2="21.3" y2="18" strokeWidth="0.9" />
        <line x1="14.3" y1="17.2" x2="12.5" y2="16.5" strokeWidth="0.9" />
        <line x1="29.7" y1="17.2" x2="31.5" y2="16.5" strokeWidth="0.9" />
      </g>
      {/* glasses glare */}
      <ellipse cx="17" cy="16.5" rx="1" ry="0.7" fill="white" opacity={0.7} />
      <ellipse cx="24" cy="16.5" rx="1" ry="0.7" fill="white" opacity={0.7} />
      {/* eyes behind glasses */}
      <circle cx="18.5" cy="18.3" r="1.3" fill="#1E3A5F" />
      <circle cx="25.5" cy={pupilCy} r="1.3" fill="#1E3A5F" />
      <circle cx="18.9" cy="17.9" r="0.4" fill="white" />
      <circle cx="25.9" cy="17.9" r="0.4" fill="white" />
      {/* mouth */}
      {mood === "celebrating" ? (
        <path d="M 19 22.5 Q 22 25 25 22.5" fill="none" stroke="#7B3A2E" strokeWidth="1.2" strokeLinecap="round" />
      ) : mood === "thinking" ? (
        <ellipse cx="22" cy="22.8" rx="1.2" ry="0.9" fill="#7B3A2E" opacity={0.9} />
      ) : (
        <path d="M 19.5 22.2 Q 22 23.2 24.5 22.2" fill="none" stroke="#7B3A2E" strokeWidth="1" strokeLinecap="round" />
      )}
      {/* thinking bubbles */}
      {mood === "thinking" && (
        <g opacity={0.55}>
          <circle cx="34" cy="9" r="1.3" fill="#00B5C5" />
          <circle cx="37" cy="6" r="1.9" fill="#00B5C5" />
        </g>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DialogueBoxProps {
  speaker?: string;
  variant?: "scientist" | "coni";
  mood?: "neutral" | "thinking" | "celebrating";
  lines?: string[];
  children?: React.ReactNode;
  onNext?: () => void;
  typing?: boolean;
  typingSpeed?: number;
  showContinue?: boolean;
}

export function DialogueBox({
  speaker,
  variant = "scientist",
  mood = "neutral",
  lines,
  children,
  onNext,
  typing = false,
  typingSpeed = 35,
  showContinue,
}: DialogueBoxProps) {
  const resolvedSpeaker = speaker ?? (variant === "scientist" ? "Dra. Coni" : "Coni");
  const hasLines = Array.isArray(lines) && lines.length > 0;
  const [lineIndex, setLineIndex] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Current text to display
  const activeText: string | null = hasLines ? (lines as string[])[lineIndex] ?? null : null;
  const isLastLine = hasLines ? lineIndex === (lines as string[]).length - 1 : true;
  const hasChildrenFallback = !hasLines && children !== undefined;

  // Reset typing when line changes
  useEffect(() => {
    setTypedLen(0);
  }, [lineIndex, activeText]);

  // Also reset lineIndex if lines identity changes externally
  useEffect(() => {
    setLineIndex(0);
  }, [lines]);

  // Typing effect
  const shouldAnimateTyping = typing && !prefersReduced && activeText !== null;
  useEffect(() => {
    if (!shouldAnimateTyping || activeText === null) {
      if (activeText !== null) setTypedLen(activeText.length);
      return;
    }
    if (typedLen >= activeText.length) return;
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + 1, activeText.length));
    }, typingSpeed);
    return () => window.clearTimeout(id);
  }, [shouldAnimateTyping, activeText, typedLen, typingSpeed]);

  const displayedText =
    activeText !== null
      ? shouldAnimateTyping
        ? activeText.slice(0, typedLen)
        : activeText
      : null;

  const isTypingInProgress =
    shouldAnimateTyping && activeText !== null && typedLen < activeText.length;

  const showContinueResolved = showContinue ?? Boolean(onNext);

  const handleAdvance = useCallback(() => {
    if (isTypingInProgress) {
      // Complete typing instantly on click
      if (activeText !== null) setTypedLen(activeText.length);
      return;
    }
    if (hasLines) {
      if (!isLastLine) {
        setLineIndex((i) => i + 1);
      } else {
        onNext?.();
      }
    } else {
      onNext?.();
    }
  }, [isTypingInProgress, activeText, hasLines, isLastLine, onNext]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onNext) return;
      // Don't advance when user is selecting text
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) return;
      // Don't double-fire when clicking the explicit Continue button
      const target = e.target as HTMLElement;
      if (target.closest("[data-dialogue-continue]")) return;
      handleAdvance();
    },
    [onNext, handleAdvance],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onNext) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleAdvance();
      }
    },
    [onNext, handleAdvance],
  );

  const canInteract = Boolean(onNext);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-live="polite"
      aria-label={`Diálogo de ${resolvedSpeaker}`}
      tabIndex={canInteract ? 0 : undefined}
      onClick={canInteract ? handleContainerClick : undefined}
      onKeyDown={canInteract ? handleKeyDown : undefined}
      className={`relative flex w-full items-start gap-3 md:gap-4 ${canInteract ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface" : ""}`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-1">
        {variant === "scientist" ? <ScientistAvatar mood={mood} /> : <ConiAvatar mood={mood} />}
      </div>

      {/* Bubble wrapper for tail positioning */}
      <div className="relative min-w-0 flex-1">
        {/* Tail — 45deg square clipped as triangle */}
        <div
          aria-hidden="true"
          className="dialogue-tail pointer-events-none absolute left-[-6px] top-5 h-3 w-3 rotate-45 border-b border-l bg-surface-card"
          style={{ borderColor: "var(--color-outline-variant, #e8ecf0)" }}
        />

        {/* Bubble */}
        <div
          className="relative rounded-[16px] border bg-surface-card px-5 py-4 shadow-md md:px-6 md:py-5"
          style={{
            borderColor: "var(--color-outline-variant, #e8ecf0)",
            boxShadow: "0 4px 16px var(--color-bubble-glow, rgba(163,207,205,0.35)), 0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {/* Speaker label */}
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-600">
            {resolvedSpeaker}
          </p>

          {/* Content */}
          <div className="text-base leading-relaxed text-gray-700 md:text-lg">
            {hasLines ? (
              <p className="m-0">
                {displayedText}
                {isTypingInProgress && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-brand-500 motion-reduce:hidden"
                    style={{ animation: "dialogue-caret 1s step-end infinite" }}
                  />
                )}
              </p>
            ) : hasChildrenFallback ? (
              <div>{children}</div>
            ) : null}
          </div>

          {/* Progress + continue */}
          <div className="mt-2 flex items-center justify-between gap-2">
            {hasLines && (lines as string[]).length > 1 ? (
              <span className="font-mono text-[10px] tracking-wide text-storm">
                {lineIndex + 1} / {(lines as string[]).length}
              </span>
            ) : (
              <span />
            )}

            {showContinueResolved && onNext && (
              <>
                {isLastLine || !hasLines ? (
                  <button
                    type="button"
                    data-dialogue-continue
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdvance();
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    Continuar <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 motion-safe:animate-[dialogue-continue-pulse_1.6s_ease-in-out_infinite] motion-reduce:animate-none"
                  >
                    <span className="inline-block translate-y-[-1px]">▸</span> Click para continuar
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogueBox;
