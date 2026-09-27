"use client";

import type { ReactNode } from "react";

type TailPosition = "left" | "right" | "bottom";

interface MangaSpeechBubbleProps {
  children: ReactNode;
  tail?: TailPosition;
  className?: string;
}

/**
 * Comic manga-style speech bubble.
 * White bg, border-ink, radius-lg, shadow-md.
 * Tail rendered as SVG triangle to avoid pseudo-element complexity.
 */
export function MangaSpeechBubble({
  children,
  tail = "left",
  className = "",
}: MangaSpeechBubbleProps) {
  return (
    <div
      className={`relative max-w-[360px] rounded-lg border-2 border-ink bg-surface-card px-4 py-3 shadow-md ${className}`}
      role="note"
    >
      <div className="font-body text-sm leading-relaxed text-ink">
        {children}
      </div>

      {/* Tail — only one visible at a time */}
      {tail === "left" && (
        <span
          aria-hidden="true"
          className="absolute top-4 -left-2.5 flex h-5 w-3 items-center justify-center"
        >
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <path
              d="M10 0 L0 8 L10 16 Z"
              fill="white"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {tail === "right" && (
        <span
          aria-hidden="true"
          className="absolute top-4 -right-2.5 flex h-5 w-3 items-center justify-center"
        >
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <path
              d="M0 0 L10 8 L0 16 Z"
              fill="white"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {tail === "bottom" && (
        <span
          aria-hidden="true"
          className="absolute -bottom-2.5 left-1/2 flex h-3 w-5 -translate-x-1/2 items-center justify-center"
        >
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <path
              d="M0 0 L8 10 L16 0 Z"
              fill="white"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
