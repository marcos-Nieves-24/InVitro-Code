"use client";

import { useTypewriter } from "./useTypewriter";

export interface ComicBubbleProps {
  text: string;
  speed?: number;
  className?: string;
}

export function ComicBubble({ text, speed, className }: ComicBubbleProps) {
  const { displayed, done } = useTypewriter(text, { speed });

  return (
    <div
      className={`relative max-w-[320px] rounded-[var(--radius-bubble)] border border-[var(--color-comic-border)] bg-[var(--color-comic-bg)] px-5 py-4 shadow-lg ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{text}</span>
      <p
        className="text-sm font-medium leading-relaxed text-[var(--color-comic-text)]"
        aria-hidden="true"
      >
        {displayed}
        <span
          aria-hidden="true"
          className={`ml-0.5 inline-block font-bold text-[var(--color-comic-accent)] ${done ? "opacity-0" : "animate-pulse"}`}
        >
          |
        </span>
      </p>
      <svg
        className="absolute -bottom-3 left-6 h-4 w-6"
        viewBox="0 0 24 16"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0 0 L12 16 L24 0 Z"
          fill="var(--color-comic-bg)"
          stroke="var(--color-comic-border)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
