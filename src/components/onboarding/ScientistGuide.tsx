"use client";

import { FlaskConical } from "lucide-react";

type ScientistVariant = "f" | "m" | "x";

interface ScientistGuideProps {
  variant?: ScientistVariant;
  size?: number;
  className?: string;
}

/**
 * Minimal scientific avatar — lab coat + flask accent.
 * No AI-themed decorations. Uses design tokens (mint, surface-card).
 */
export function ScientistGuide({
  variant = "f",
  size = 56,
  className = "",
}: ScientistGuideProps) {
  const initials: Record<ScientistVariant, string> = {
    f: "Dr",
    m: "Dr",
    x: "Dr",
  };

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border-2 border-mint bg-surface-card shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="flex flex-col items-center leading-none">
        <FlaskConical
          className="text-mint"
          style={{ width: size * 0.32, height: size * 0.32 }}
          strokeWidth={1.8}
        />
        <span
          className="font-display font-semibold text-ink"
          style={{ fontSize: size * 0.2 }}
        >
          {initials[variant]}
        </span>
      </span>
    </div>
  );
}
