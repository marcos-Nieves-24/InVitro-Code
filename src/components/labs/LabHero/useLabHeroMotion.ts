"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

try {
  gsap.registerPlugin(ScrollTrigger, SplitText);
} catch {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch {
    // gsap unavailable — hero visibility handled via fallback opacity
  }
}

interface UseHeroMotionOptions {
  heroRef: React.RefObject<HTMLElement | null>;
  h1Ref: React.RefObject<HTMLHeadingElement | null>;
  bubblesRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

export function useLabHeroMotion({
  heroRef,
  h1Ref,
  bubblesRef,
  canvasRef,
  prefersReducedMotion,
}: UseHeroMotionOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (heroRef.current) heroRef.current.style.opacity = "1";
      return;
    }

    const hero = heroRef.current;
    const h1 = h1Ref.current;
    const bubblesLayer = bubblesRef.current;
    const canvas = canvasRef.current;
    if (!hero || !h1) return;

    try {
      const ctx = gsap.context(() => {
        // ── Hero entrance timeline ──
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        tl.fromTo(
          hero,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
        );

        // ── SplitText h1 chars stagger (with fallback) ──
        try {
          const split = new SplitText(h1, { type: "chars" });
          tl.from(
            split.chars,
            {
              opacity: 0,
              y: 16,
              stagger: 0.035,
              duration: 0.4,
            },
            "-=0.3",
          );
        } catch {
          tl.from(
            h1,
            {
              opacity: 0,
              y: 16,
              duration: 0.4,
            },
            "-=0.3",
          );
        }

        // ── Bubble rise (GSAP-driven, per-bubble random) ──
        if (bubblesLayer) {
          const bubbleEls = bubblesLayer.querySelectorAll<HTMLElement>(".bubble");
          bubbleEls.forEach((el) => {
            gsap.set(el, {
              y: 0,
              x: 0,
              scale: 0.6,
              opacity: 0.65,
            });
            gsap.to(el, {
              y: -140,
              x: `random(-30, 30)`,
              scale: 1,
              opacity: 0,
              duration: `random(2.5, 4)`,
              repeat: -1,
              ease: "none",
              delay: `random(0, 2)`,
            });
          });
        }

        // ── Canvas parallax (subtle) ──
        if (canvas) {
          gsap.to(canvas, {
            y: -20,
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        timelineRef.current = tl;
      }, hero);

      return () => ctx.revert();
    } catch {
      if (hero) hero.style.opacity = "1";
    }
  }, [heroRef, h1Ref, bubblesRef, canvasRef, prefersReducedMotion]);

  return timelineRef;
}
