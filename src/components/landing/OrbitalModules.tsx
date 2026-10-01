"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLabCardTheme } from "@/components/labs/LabCardTheme";
import { ModuleCardContent } from "@/components/shared/ModuleCardContent";

interface ModuleData {
  slug: string;
  title: string;
  lessons: number;
  description: string;
}

const modules: ModuleData[] = [
  {
    slug: "MOD-01",
    title: "Introduccion a la IA",
    lessons: 4,
    description:
      "Fundamentos de inteligencia artificial aplicados a biotecnologia.",
  },
  {
    slug: "MOD-02",
    title: "Python para Biotecnologia",
    lessons: 17,
    description:
      "Programacion en Python aplicada al analisis de datos biologicos.",
  },
  {
    slug: "MOD-03",
    title: "Estadistica y Probabilidad",
    lessons: 10,
    description:
      "Fundamentos estadisticos para el analisis de datos en investigacion biomedica.",
  },
  {
    slug: "MOD-04",
    title: "Machine Learning",
    lessons: 10,
    description:
      "Algoritmos de aprendizaje automatico para aplicaciones biotecnologicas.",
  },
];

const slugToThemeKey: Record<string, string> = {
  "MOD-01": "ia",
  "MOD-02": "python",
  "MOD-03": "estadistica",
  "MOD-04": "machine-learning",
};

const CARD_W = 320;
const GAP = 20;

export function OrbitalModules() {
  const [activeIndex, setActiveIndex] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const len = modules.length;
  const trackOffset = isMobile ? 0 : activeIndex % 2 === 0 ? 0 : -8;
  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + len) % len);
  }, [len]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % len);
  }, [len]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  // Ventana rotada circular: activa queda segunda visible en desktop 4-visibles
  // active=3 => ordered indices [2,3,0,1] => [MOD-03, MOD-04, MOD-01, MOD-02]
  const ordered = isMobile
    ? [modules[activeIndex]!]
    : ([0, 1, 2, 3] as const)
        .map((k) => (activeIndex - 1 + k + len) % len)
        .map((i) => modules[i]!);

  return (
    <div
      className="relative mx-auto max-w-[1280px]"
      role="region"
      aria-label="Carrusel de expediciones"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Viewport — 4 visibles con peek lateral 16px; micro-slide translate para efecto carrusel premium */}
      <div className="overflow-visible px-4 pb-10 md:overflow-hidden md:px-6">
        <ul
          key={isMobile ? `m-${activeIndex}` : `d-${activeIndex}`}
          aria-label="Modulos del curso"
          className="flex gap-5"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: `translateX(${trackOffset}px)`,
                  transition:
                    "transform 380ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease-out",
                }
          }
        >
          {ordered.map((mod) => {
            const isActive = mod.slug === modules[activeIndex]!.slug;
            const theme = getLabCardTheme(slugToThemeKey[mod.slug] ?? mod.slug);
            const xp = mod.lessons * 20;

            return (
              <li
                key={mod.slug}
                className="list-none shrink-0 min-w-[320px] w-[320px] max-md:min-w-[calc(100%-32px)] max-md:w-[calc(100%-32px)]"
              >
                <a
                  href="/sign-in"
                  aria-label={`${mod.title} — ${mod.slug}`}
                  className={[
                    "group flex flex-col rounded-[18px] border bg-white p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] focus-visible:ring-offset-2",
                    isActive
                      ? "min-h-[320px] border-[#DCEAE8] border-l-[3px] border-l-[#0AAE9A] shadow-[0_16px_40px_rgba(16,27,61,0.10)] scale-[1.03]"
                      : "min-h-[280px] border-[#DCEAE8] opacity-60 saturate-[0.92] shadow-[0_8px_24px_rgba(16,27,61,0.06)]",
                  ].join(" ")}
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          transition:
                            "transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 300ms, box-shadow 300ms, filter 300ms",
                        }
                  }
                >
                  <ModuleCardContent
                    theme={theme}
                    title={mod.title}
                    description={mod.description}
                    lessonsCount={mod.lessons}
                    xpReward={xp}
                    labCount={mod.lessons}
                    completed={0}
                    total={mod.lessons}
                    compact
                    slugLabel={mod.slug}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={prev}
        className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCEAE8] bg-white text-[#0AAE9A] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] max-md:h-8 max-md:w-8"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={next}
        className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCEAE8] bg-white text-[#0AAE9A] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] max-md:h-8 max-md:w-8"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {modules.map((mod, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={mod.slug}
              type="button"
              aria-label={`Ir a ${mod.slug}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => setActiveIndex(i)}
              className={
                isActive
                  ? "h-2 w-2 rounded-full bg-[#0AAE9A] transition-colors"
                  : "h-1.5 w-1.5 rounded-full border border-[#DCEAE8] bg-[#DDF5EF] transition-colors hover:bg-[#DCEAE8]"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
