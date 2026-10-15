"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLabCardTheme } from "@/components/labs/LabCardTheme";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { buildModuleCardModel } from "@/domain/module-card";

export interface ModuleData {
  slug: string;
  title: string;
  lessons: number;
  description: string;
  xpReward?: number;
  href: string;
}

const CARD_W = 332;
const GAP = 16;

export function OrbitalModules({ modules }: { modules: ModuleData[] }) {
  const len = modules.length;
  const [activeIndex, setActiveIndex] = useState(() => (len ? len - 1 : 0));
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  // Derivar cuántas tarjetas caben en el carrusel a partir del ancho útil real,
  // en vez de fijar 4 siempre.
  const [visibleCount, setVisibleCount] = useState(1);
  // Default to mobile so SSR/first paint renders exactly one card: the 4-card
  // window (desktop) only appears after the client matches the wide-query.
  // Rendering 4 cards in the SSR HTML makes the track ~1096px wide at a 390px
  // viewport (each card w-full of the shrunk ul), and the harness measures at
  // DOMContentLoaded — before hydration collapses it — flagging ul/viewport
  // scrollWidth as a fixed-width risk. One card keeps the track <= viewport at
  // every pre-hydration instant.
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (len === 0) return;
    setActiveIndex((prev) => (prev >= len ? len - 1 : prev));
  }, [len]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Medir el ancho útil real del carrusel y recalcular el número de tarjetas.
  useEffect(() => {
    const track = containerRef.current;
    if (!track) return;
    const update = () => {
      const available = track.clientWidth;
      const count = Math.max(1, Math.floor((available + GAP) / (CARD_W + GAP)));
      setVisibleCount(Math.min(len, count));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [len]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (len ? (i - 1 + len) % len : 0));
  }, [len]);
  const next = useCallback(() => {
    setActiveIndex((i) => (len ? (i + 1) % len : 0));
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

  if (len === 0) {
    return (
      <div className="mx-auto max-w-[1360px] py-12 text-center text-storm">
        <p className="text-sm">No hay expediciones disponibles.</p>
      </div>
    );
  }

  const trackOffset = isMobile ? 0 : activeIndex % 2 === 0 ? 0 : -8;
  const maxOffset = len ? (len - 1) * (CARD_W + GAP) : 0;

  // Ventana rotada circular dinámica: activa queda segunda visible en desktop,
  // con el número de visibles derivado del ancho disponible.
  const ordered = isMobile
    ? [modules[activeIndex]!]
    : Array.from({ length: visibleCount }, (_, k) => (activeIndex - 1 + k + len) % len).map(
        (i) => modules[i]!,
      );

  return (
    <div
      className="mx-auto max-w-[1360px]"
      role="region"
      aria-label="Carrusel de expediciones"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Flex row fuera: botones hermanos del viewport, no hijos absolute. flex items-center los centra verticalmente al alto de la card (320px) sin calcular top. gap-3 (12px) aire botón-card. overflow-hidden solo en viewport central, no en outer, para no recortar botones. */}
      <div className="relative mx-auto flex max-w-[1360px] items-center gap-2 md:gap-4">
        <button
          type="button"
          aria-label="Anterior"
          onClick={prev}
          className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0AAE9A] shadow-[0_8px_24px_rgba(16,27,61,0.10)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] md:static md:left-auto md:top-auto md:z-auto md:h-14 md:w-14 md:translate-y-0"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div
          ref={containerRef}
          className="scroll-hide flex-1 min-w-0 overflow-hidden pb-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
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
              const theme = getLabCardTheme(mod.slug);
              const xp = mod.xpReward ?? mod.lessons * 20;
              const model = buildModuleCardModel({
                slug: mod.slug,
                title: mod.title,
                description: mod.description,
                lessonCount: mod.lessons,
                labCount: mod.lessons,
                xpReward: xp,
                completed: null,
                total: null,
              });

              return (
                <li
                  key={mod.slug}
                  className={[
                    "list-none shrink-0 min-w-[332px] w-[332px] max-md:min-w-0 max-md:w-full transition-all duration-300",
                    isActive
                      ? "md:scale-[1.03] opacity-100"
                      : "opacity-60 saturate-[0.92] md:scale-[0.98]",
                  ].join(" ")}
                  style={
                    shouldReduceMotion
                      ? undefined
                      : {
                          transition:
                            "transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 300ms, filter 300ms",
                        }
                  }
                >
                  <ModuleCard model={model} href={mod.href} theme={theme} variant="compact" />
                </li>
              );
            })}
          </motion.ul>
        </div>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={next}
          className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0AAE9A] shadow-[0_8px_24px_rgba(16,27,61,0.10)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] md:static md:right-auto md:top-auto md:z-auto md:h-14 md:w-14 md:translate-y-0"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Dots — debajo del flex row (mt-8), full width.
          The button carries a 24x24 hit area (WCAG 2.2 target-size minimum);
          the dot itself stays visually small inside a centered flex box. */}
      <div className="mt-8 flex justify-center gap-2 md:mt-10 md:gap-3">
        {modules.map((mod, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={mod.slug}
              type="button"
              aria-label={`Ir a ${mod.slug}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => setActiveIndex(i)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={
                  isActive
                    ? "h-3 w-3 rounded-full bg-[#0AAE9A] transition-colors md:h-3.5 md:w-3.5"
                    : "h-2.5 w-2.5 rounded-full border border-[#DCEAE8] bg-[#DDF5EF] transition-colors"
                }
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
