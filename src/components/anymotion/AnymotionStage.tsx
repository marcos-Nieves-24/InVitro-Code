"use client";

import { forwardRef } from "react";

interface AnymotionStageProps {
  /** Rendered inside the stage — the animation tree (SVG, divs, iframe…). */
  children: React.ReactNode;
  /** Optional semantic label, used as the iframe fallback title. */
  title?: string;
  className?: string;
}

/**
 * Responsive 16:9 stage that hosts an Anymotion animation.
 *
 * Anymotion output is authored against a 1920×1080 canvas and scales itself
 * through a `--stage-scale` transform. This wrapper guarantees a stable
 * 16:9 silhouette at any container width and clips overflow so the scaled
 * stage never bleeds into the lesson layout.
 */
export const AnymotionStage = forwardRef<HTMLDivElement, AnymotionStageProps>(
  function AnymotionStage({ children, title, className = "" }, ref) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={title}
        className={`relative aspect-video w-full overflow-hidden rounded-card border border-gray-200 bg-[#0a0a0a] ${className}`}
      >
        {children}
      </div>
    );
  },
);