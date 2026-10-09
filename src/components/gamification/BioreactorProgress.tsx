// CANONICAL: vessel (src/components/dashboard/BioreactorProgress/BioreactorProgress.tsx) is canonical —
// this simple bubble-layer variant is kept for ModuleProgress linear integration.
// Do not delete without migrating ModuleProgress variant prop to vessel re-export.
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface BioreactorProgressProps {
  progressPercentage: number;
}

function poolSize(progressPercentage: number): number {
  const clamped = Math.max(0, Math.min(100, progressPercentage));
  const size = 12 + Math.round((clamped / 20) * 4);
  return Math.min(16, Math.max(12, size));
}

function durationFor(progressPercentage: number): number {
  const clamped = Math.max(0, Math.min(100, progressPercentage));
  // lerp 4s at 0% → 2s at 100%
  return 4 - (clamped / 100) * 2;
}

export function BioreactorProgress({ progressPercentage }: BioreactorProgressProps) {
  const size = poolSize(progressPercentage);
  const shouldReduceMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<{ pause: () => void; resume: () => void; kill: () => void }[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const layer = layerRef.current;
    if (!layer) return;
    const bubbles = Array.from(layer.querySelectorAll<HTMLElement>("[data-bubble]"));
    if (bubbles.length === 0) return;

    let cancelled = false;
    let gsapInstance: typeof import("gsap").gsap | null = null;

    const run = async () => {
      try {
        const mod = await import("gsap");
        const gsap =
          (mod as unknown as { gsap: typeof import("gsap").gsap }).gsap ??
          (mod as unknown as { default: typeof import("gsap").gsap }).default ??
          (mod as unknown as typeof import("gsap")).gsap;
        if (cancelled || !gsap) return;
        gsapInstance = gsap;
        const dur = durationFor(progressPercentage);

        // Clean previous tweens
        tweensRef.current.forEach((t) => {
          try { t.kill(); } catch { /* ignore */ }
        });
        tweensRef.current = [];

        bubbles.forEach((el, i) => {
          const delay = (i * 0.18) % 2;
          const x = (Math.random() - 0.5) * 40;
          const scale = 0.6 + Math.random() * 0.7;
          const tween = gsap.to(el, {
            y: -120 - Math.random() * 20,
            x,
            opacity: 0,
            scale,
            duration: dur + Math.random() * 0.6,
            delay,
            repeat: -1,
            repeatDelay: Math.random() * 0.4,
            ease: "sine.inOut",
            overwrite: "auto",
          });
          // GSAP tween has pause/resume/kill
          tweensRef.current.push(tween as unknown as { pause: () => void; resume: () => void; kill: () => void });
          // Initialize from visible state
          gsap.set(el, { y: 0, opacity: 0.65, scale: 0.8 });
        });

        const handleVisibility = () => {
          if (document.hidden) {
            tweensRef.current.forEach((t) => t.pause());
            if (gsapInstance) gsapInstance.globalTimeline.pause();
          } else {
            if (gsapInstance) gsapInstance.globalTimeline.resume();
            tweensRef.current.forEach((t) => t.resume());
          }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        // Store cleanup on layer
        (layer as unknown as { __visHandler?: () => void }).__visHandler = handleVisibility;
      } catch {
        // fallback: no animation, static bubbles remain visible
      }
    };

    run();

    return () => {
      cancelled = true;
      const layerEl = layerRef.current as unknown as { __visHandler?: () => void } | null;
      if (layerEl?.__visHandler) {
        document.removeEventListener("visibilitychange", layerEl.__visHandler);
      }
      tweensRef.current.forEach((t) => {
        try { t.kill(); } catch { /* ignore */ }
      });
      tweensRef.current = [];
      if (gsapInstance) {
        try { gsapInstance.globalTimeline.resume(); } catch { /* ignore */ }
      }
    };
  }, [progressPercentage, shouldReduceMotion, size]);

  // Reduced motion: render static bubbles without GSAP, or hidden? spec says static visible without animation
  if (shouldReduceMotion) {
    return (
      <div
        ref={layerRef}
        aria-hidden="true"
        className="bubble-layer pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        {Array.from({ length: size }).map((_, i) => (
          <span
            key={i}
            data-bubble
            aria-hidden="true"
            className="bubble-static absolute bottom-0 rounded-full"
            style={{
              left: `${8 + (i * 73) % 84}%`,
              width: `${6 + (i % 3) * 3}px`,
              height: `${6 + (i % 3) * 3}px`,
              background: "var(--color-bubble)",
              opacity: 0.35,
              boxShadow: "0 0 6px var(--color-bubble-glow)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="bubble-layer pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      {Array.from({ length: size }).map((_, i) => (
        <span
          key={i}
          data-bubble
          aria-hidden="true"
          className="bubble absolute bottom-0 rounded-full"
          style={{
            left: `${6 + (i * 71) % 88}%`,
            width: `${7 + (i % 3) * 4}px`,
            height: `${7 + (i % 3) * 4}px`,
            background: "var(--color-bubble)",
            border: "1px solid var(--color-bubble-highlight)",
            boxShadow: "0 0 8px var(--color-bubble-glow)",
            opacity: 0.65,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 10 10"
            aria-hidden="true"
            focusable="false"
            className="h-full w-full"
          >
            <circle cx="5" cy="5" r="4.2" fill="var(--color-bubble)" opacity="0.9" />
            <circle cx="3.5" cy="3.5" r="1.2" fill="var(--color-bubble-highlight)" opacity="0.9" />
          </svg>
        </span>
      ))}
    </div>
  );
}
