"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { registerRevealAdvance } from "./RevealSequence";

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

  // Clamp lineIndex to a valid slot whenever lines shrinks at runtime so the
  // counter never shows a slot beyond the available line range (e.g. "16 / 6").
  const totalLines = hasLines ? (lines as string[]).length : 0;
  useEffect(() => {
    if (!hasLines || totalLines === 0) return;
    setLineIndex((prev) => (prev >= totalLines ? totalLines - 1 : prev < 0 ? 0 : prev));
  }, [hasLines, totalLines]);

  // Reset typing when the active line changes or while typing is disabled.
  useEffect(() => {
    setTypedLen(0);
  }, [lineIndex, activeText]);

  // Only reset to the first line when the lines identity actually changed AND
  // we haven't started a manual progression; honour a re-mounted/untouched block.
  const linesSigRef = useRef<string>("");
  useEffect(() => {
    const sig = hasLines ? JSON.stringify(lines) : "";
    if (sig === "" || sig === linesSigRef.current) return;
    linesSigRef.current = sig;
    setLineIndex(0);
    setTypedLen(0);
  }, [hasLines, lines]);

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

  // Clamp displayed text to the valid range of the active line.
  const displayedText =
    activeText !== null
      ? shouldAnimateTyping
        ? activeText.slice(0, Math.min(typedLen, activeText.length))
        : activeText
      : null;

  const isTypingInProgress =
    shouldAnimateTyping && activeText !== null && typedLen < activeText.length;

  const showContinueResolved = showContinue ?? Boolean(onNext);

  const handleAdvance = useCallback(() => {
    if (hasLines) {
      if (!isLastLine) {
        setLineIndex((i) => i + 1);
      } else {
        onNext?.();
      }
    } else {
      onNext?.();
    }
  }, [hasLines, isLastLine, onNext]);

  useEffect(() => {
    if (!hasLines || isLastLine) return;
    return registerRevealAdvance(() => {
      handleAdvance();
      return true;
    });
  }, [hasLines, isLastLine, handleAdvance]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't advance when user is selecting text
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) return;
      // Don't double-fire when clicking the explicit Continue button
      const target = e.target as HTMLElement;
      if (target.closest("[data-dialogue-continue]")) return;
      // Lines in play, not the last one: the bubble consumes the click so the
      // parent RevealSequence does not advance on the same event (double-advance).
      if (hasLines && !isLastLine) {
        e.stopPropagation();
        handleAdvance();
        return;
      }
      // Last line: the bubble does nothing further, the click bubbles up and
      // the parent RevealSequence advances the step.
      if (hasLines) return;
      // No-line fallback (children): unchanged behaviour, requires onNext.
      if (!onNext) return;
      handleAdvance();
    },
    [onNext, handleAdvance, hasLines, isLastLine],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Enter advances dialogue lines; Space is left alone so it never
      // triggers advancement by accident (it types in editors and activates
      // focused controls natively).
      if (e.key === "Enter") {
        e.preventDefault();
        // Keyboard mirrors the pointer rule: while lines remain, the bubble
        // consumes the keypress and advances its own line only.
        if (hasLines && !isLastLine) {
          e.stopPropagation();
          handleAdvance();
          return;
        }
        // Last line: let the parent advance, the bubble does nothing further.
        if (hasLines) return;
        if (!onNext) return;
        handleAdvance();
      }
    },
    [onNext, handleAdvance, hasLines, isLastLine],
  );

  // ALL advance is via footer Continuar only — bubble is not clickable.
  // Lines still advance when footer goNext consumes the registered advance.
  return (
    <div
      ref={containerRef}
      role="region"
      aria-live="polite"
      aria-label={`Diálogo de ${resolvedSpeaker}`}
      className="relative flex w-full max-w-[720px] items-start gap-3 md:gap-3.5"
    >
      {/* Avatar */}
      <div className="shrink-0 pt-1">
        {variant === "scientist" ? <ScientistAvatar mood={mood} /> : <ConiAvatar mood={mood} />}
      </div>

      {/* Bubble wrapper for tail positioning — recortado */}
      <div className="relative min-w-0 flex-1 max-w-[640px]">
        {/* Tail — 45deg square clipped as triangle */}
        <div
          aria-hidden="true"
          className="dialogue-tail pointer-events-none absolute left-[-6px] top-5 h-3 w-3 rotate-45 border-b border-l bg-surface-card"
          style={{ borderColor: "var(--color-outline-variant, #e8ecf0)" }}
        />

        {/* Bubble */}
        <div
          className="relative rounded-[14px] border bg-surface-card px-4 py-3 shadow-md md:px-5 md:py-4"
          style={{
            borderColor: "var(--color-outline-variant, #e8ecf0)",
            boxShadow: "0 4px 16px var(--color-bubble-glow, rgba(163,207,205,0.35)), 0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {/* Speaker label — unificado */}
          <p className="mb-1 font-mono text-[13px] font-semibold uppercase tracking-widest text-brand-600">
            {resolvedSpeaker}
          </p>

          {/* Content — unificado y agrandado */}
          <div className="text-lg leading-relaxed text-gray-700 md:text-[19px]">
            {hasLines && displayedText !== null && displayedText.length > 0 ? (
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
            ) : !hasLines && hasChildrenFallback ? (
              <div>{children}</div>
            ) : null}
          </div>

          {/* Progress + continue — unificado */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {hasLines && (lines as string[]).length > 1 && !isLastLine ? (
              <span className="font-mono text-[13px] tracking-wide text-storm">
                {Math.min(lineIndex + 1, (lines as string[]).length)} / {(lines as string[]).length}
              </span>
            ) : (
              <span />
            )}

            {null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogueBox;
