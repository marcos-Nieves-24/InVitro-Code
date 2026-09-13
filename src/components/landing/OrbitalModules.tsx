"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Brain,
  Code,
  BarChart3,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

interface ModuleData {
  icon: typeof Brain;
  slug: string;
  title: string;
  lessons: number;
  description: string;
}

const modules: ModuleData[] = [
  {
    icon: Brain,
    slug: "MOD-01",
    title: "Introduccion a la IA",
    lessons: 4,
    description:
      "Fundamentos de inteligencia artificial aplicados a biotecnologia.",
  },
  {
    icon: Code,
    slug: "MOD-02",
    title: "Python para Biotecnologia",
    lessons: 17,
    description:
      "Programacion en Python aplicada al analisis de datos biologicos.",
  },
  {
    icon: BarChart3,
    slug: "MOD-03",
    title: "Estadistica y Probabilidad",
    lessons: 10,
    description:
      "Fundamentos estadisticos para el analisis de datos en investigacion biomedica.",
  },
  {
    icon: FlaskConical,
    slug: "MOD-04",
    title: "Machine Learning",
    lessons: 10,
    description:
      "Algoritmos de aprendizaje automatico para aplicaciones biotecnologicas.",
  },
];

const ROTATION_SPEED = 15; // degrees per second
const CARD_COUNT = modules.length;
const ANGLE_PER_CARD = 360 / CARD_COUNT;

const CARD_WIDTH = 280;
// A longer perspective distance reduces the magnification of the front card
// (which is what made it overlap its neighbours and clip their text).
const PERSPECTIVE = 1600;
// Ring radius large enough that the perspective-magnified front card never
// overlaps the card at 90°: solve radius >= (CARD_WIDTH/2) * (1 + P/(P - radius)).
// At P=1600, CARD_WIDTH=280 the bound is ~305px; 340 leaves margin.
const RING_RADIUS = 340;
// Angular fade: fully opaque within ±FADE_START of the front, fully hidden past
// ±FADE_END. For a 4-card ring at RING_RADIUS/PERSPECTIVE, a card starts being
// occluded by the front card at ~105°, so the fade completes just before that.
const FADE_START = 90;
const FADE_END = 105;

export function OrbitalModules() {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [radius, setRadius] = useState(280);
  const [fitScale, setFitScale] = useState(1);

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Ring radius + uniform fit scale so the 3D ring never escapes its container.
  // The fit scale shrinks the whole scene (and, in the container style, the
  // perspective by the same factor) so the projection stays proportional.
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const nextRadius = vw < 768 ? 0 : RING_RADIUS;
      setRadius(nextRadius);

      // The carousel container mirrors the section layout: min(vw - 2*24px, 1280px).
      const containerWidth = Math.min(vw - 48, 1280);
      // Projected horizontal half-extent of the ring at scale 1 (measured
      // empirically): about 2.05 * radius, e.g. ~697px at radius 340.
      const extentHalf = 2.05 * nextRadius;
      const availableHalf = containerWidth / 2 - 16;
      const scale = availableHalf > 0 ? availableHalf / extentHalf : 0;

      setFitScale(Math.max(0.3, Math.min(1, scale)));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // IntersectionObserver: pause when off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // rAF rotation loop
  useEffect(() => {
    if (reducedMotion) return;

    const tick = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPausedRef.current && isVisibleRef.current) {
        setCurrentAngle((prev) => (prev + ROTATION_SPEED * delta) % 360);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  const handleMouseEnter = useCallback((index: number) => {
    isPausedRef.current = true;
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    setHoveredIndex(null);
  }, []);

  // Static grid for reduced motion or mobile
  if (reducedMotion || radius === 0) {
    return (
      <ul
        aria-label="Modulos del curso"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <li key={mod.slug}>
              <a
                href="/sign-in"
                className="card-hover flex h-full flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface">
                  <Icon size={24} className="text-mint" />
                </div>
                <p className="eyebrow text-storm mb-2">{mod.slug}</p>
                <h3 className="font-display text-lg font-bold text-ink mb-2">
                  {mod.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate mb-4 flex-1">
                  {mod.description}
                </p>
                <div className="flex items-center justify-between border-t border-surface-raised pt-4">
                  <span className="font-mono text-xs text-storm">
                    {mod.lessons} lecciones
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-ink">
                    Explorar
                    <ArrowRight size={16} />
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{
        // Scaling the perspective by the same factor as the scene keeps the
        // projection exactly proportional, so the look is preserved while the
        // whole ring shrinks to fit the container.
        perspective: `${PERSPECTIVE * fitScale}px`,
        height: "460px",
        overflowX: "clip",
        overflowY: "visible",
      }}
    >
      <ul
        aria-label="Modulos del curso"
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          // scale3d (not 2D scale) so the ring radius/translateZ shrinks with the
          // cards; a 2D scale would leave translateZ untouched and overlap cards.
          transform: `translate(-50%, -50%) scale3d(${fitScale}, ${fitScale}, ${fitScale}) rotateY(${currentAngle}deg)`,
          willChange: "transform",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          const isHovered = hoveredIndex === i;
          const angle = i * ANGLE_PER_CARD;

          // Angular distance of this card from the front of the ring (0..180°).
          const worldAngle = (((angle + currentAngle) % 360) + 360) % 360;
          const absAngle = Math.abs(((worldAngle + 180) % 360) - 180);
          // Fade a card out before it rotates behind the front card, so no card is
          // ever visible while partially occluded (which clipped its text).
          const opacity = isHovered
            ? 1
            : Math.max(
                0,
                Math.min(1, (FADE_END - absAngle) / (FADE_END - FADE_START)),
              );

          return (
            <li
              key={mod.slug}
              className="absolute"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                left: "0",
                top: "0",
                width: `${CARD_WIDTH}px`,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Billboard wrapper: cancels the ring rotation every frame. It is
                  kept separate from the hover transform so the hover transition
                  never lags behind the per-frame billboard rotation. */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${-(currentAngle + angle)}deg)`,
                  opacity,
                }}
              >
                <a
                  href="/sign-in"
                  className="block rounded-2xl border border-surface-raised bg-surface-card p-6 shadow-md transition-[transform,box-shadow] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
                  style={{
                    transform: isHovered
                      ? "scale(1.05) translateZ(30px)"
                      : undefined,
                    boxShadow: isHovered
                      ? "0 0 30px rgba(0,178,178,0.3)"
                      : undefined,
                  }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface">
                    <Icon size={24} className="text-mint" />
                  </div>
                  <p className="eyebrow text-storm mb-2">{mod.slug}</p>
                  <h3 className="font-display text-lg font-bold text-ink mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate mb-4">
                    {mod.description}
                  </p>
                  {isHovered && (
                    <p className="text-xs leading-relaxed text-storm mb-4">
                      {mod.lessons} lecciones interactivas con labs y desafios de
                      codigo.
                    </p>
                  )}
                  <div className="flex items-center justify-between border-t border-surface-raised pt-4">
                    <span className="font-mono text-xs text-storm">
                      {mod.lessons} lecciones
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-ink">
                      Explorar
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
