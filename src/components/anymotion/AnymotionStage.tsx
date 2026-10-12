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
 *
 * The size is budgeted from the available viewport height, not from the
 * container width. A plain `aspect-video w-full` stage inside the full-bleed
 * presentation shell is taller than the shell itself, so its lower half falls
 * below the fold and becomes unreachable — the animation runs but nothing is
 * seen. `max-h` caps the height against the viewport and `max-w` derives the
 * matching width from the same budget, so the box keeps a true 16:9 silhouette
 * and simply shrinks on short viewports instead of overflowing.
 */
export const AnymotionStage = forwardRef<HTMLDivElement, AnymotionStageProps>(
  function AnymotionStage({ children, title, className = "" }, ref) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={title}
        className={`relative mx-auto aspect-video w-full max-h-[calc(100vh-22rem)] max-w-[calc((100vh-22rem)*16/9)] overflow-hidden rounded-card border border-white/10 bg-[#0a0a0a] shadow-lg ${className}`}
      >
        {children}
      </div>
    );
  },
);