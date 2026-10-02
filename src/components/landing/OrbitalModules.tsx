"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
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

const CARD_W = 332;
const GAP = 16;

export function OrbitalModules() {
  const [activeIndex, setActiveIndex] = useState(3);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const len = modules.length;
  const trackOffset = isMobile ? 0 : activeIndex % 2 === 0 ? 0 : -8;
  const maxOffset = (len - 1) * (CARD_W + GAP);
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
      className="mx-auto max-w-[1360px]"
      role="region"
      aria-label="Carrusel de expediciones"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Flex row fuera: botones hermanos del viewport, no hijos absolute. flex items-center los centra verticalmente al alto de la card (320px) sin calcular top. gap-3 (12px) aire botón-card. overflow-hidden solo en viewport central, no en outer, para no recortar botones. */}
      <div className="relative mx-auto flex max-w-[1360px] items-center gap-3 md:gap-4">
        <button
          type="button"
          aria-label="Anterior"
          onClick={prev}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0AAE9A] shadow-[0_8px_24px_rgba(16,27,61,0.10)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] md:h-14 md:w-14"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div className="scroll-hide flex-1 overflow-x-auto overflow-y-hidden pb-12" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <motion.ul
            aria-label="Modulos del curso"
            className="flex gap-4 touch-pan-y"
            style={{ willChange: "transform" }}
            animate={{ x: shouldReduceMotion ? 0 : trackOffset }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
            }
            drag={isMobile && !shouldReduceMotion ? "x" : false}
            dragElastic={0.2}
            dragMomentum
            dragConstraints={
              isMobile && !shouldReduceMotion
                ? { left: -maxOffset, right: 0 }
                : undefined
            }
            onDragEnd={
              isMobile && !shouldReduceMotion
                ? (_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -500) next();
                    else if (info.offset.x > 60 || info.velocity.x > 500) prev();
                  }
                : undefined
            }
          >
            {ordered.map((mod) => {
              const isActive = mod.slug === modules[activeIndex]!.slug;
              const theme = getLabCardTheme(slugToThemeKey[mod.slug] ?? mod.slug);
              const xp = mod.lessons * 20;

              return (
                <li
                  key={mod.slug}
                  className="list-none shrink-0 min-w-[332px] w-[332px] max-md:min-w-[calc(100%-32px)] max-md:w-[calc(100%-32px)]"
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
                      shouldReduceMotion
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
          </motion.ul>
        </div>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={next}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0AAE9A] shadow-[0_8px_24px_rgba(16,27,61,0.10)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] md:h-14 md:w-14"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Dots — debajo del flex row (mt-8), full width */}
      <div className="mt-8 flex justify-center gap-3 md:mt-10 md:gap-4">
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
                  ? "h-3 w-3 rounded-full bg-[#0AAE9A] transition-colors md:h-3.5 md:w-3.5"
                  : "h-2.5 w-2.5 rounded-full border border-[#DCEAE8] bg-[#DDF5EF] transition-colors hover:bg-[#DCEAE8]"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
