"use client";

import { useEffect, useState } from "react";

interface SpotlightOverlayProps {
  targetRect: DOMRect | null;
  padding?: number;
  onClick?: () => void;
}

/**
 * Fixed overlay with graphite/60 + backdrop-blur.
 * When targetRect exists, renders a highlighted hole (border-mint + shadow-glow).
 * Respects prefers-reduced-motion (no transition if reduce).
 */
export function SpotlightOverlay({
  targetRect,
  padding = 8,
  onClick,
}: SpotlightOverlayProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const holeStyle = targetRect
    ? {
        left: targetRect.left - padding,
        top: targetRect.top - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
      }
    : null;

  return (
    <div
      className="fixed inset-0 z-40 bg-graphite/60 backdrop-blur-sm"
      onClick={onClick}
      aria-hidden="true"
      role="presentation"
      style={
        prefersReducedMotion ? undefined : { transition: "background-color 200ms ease-out" }
      }
    >
      {holeStyle && (
        <div
          className="absolute rounded-lg border-2 border-mint bg-transparent shadow-glow"
          style={{
            ...holeStyle,
            boxShadow: "0 0 20px rgba(163,207,205,0.3), 0 0 0 9999px rgba(42,39,42,0.6)",
            transition: prefersReducedMotion ? "none" : "all 200ms ease-out",
          }}
        />
      )}
    </div>
  );
}
