"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Horizontal level-map scroller. On mount it centers the user's current
 * rank card so mobile users land on their level instead of rank 01.
 * Respects reduced motion (instant jump) and keeps native swipe.
 */
export function LevelMapScroller({
  currentIndex,
  children,
}: {
  currentIndex: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = el.querySelector<HTMLElement>(`[data-rank-index="${currentIndex}"]`);
    const left = target
      ? target.offsetLeft - el.clientWidth / 2 + target.clientWidth / 2
      : el.scrollWidth;
    el.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [currentIndex]);

  return (
    <section
      ref={ref}
      aria-label="Mapa de niveles"
      className="relative mb-16 snap-x overflow-x-auto scroll-smooth px-4 scroll-hide"
    >
      {children}
    </section>
  );
}
