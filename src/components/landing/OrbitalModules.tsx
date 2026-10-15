"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLabCardTheme } from "@/components/labs/LabCardTheme";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { buildModuleCardModel } from "@/domain/module-card";

export interface ModuleData {
  slug: string;
  title: string;
  lessons: number;
  labCount: number;
  description: string;
  xpReward?: number;
  href: string;
}

const CARD_W = 332;
const GAP = 16;
const SLOT = CARD_W + GAP;

// How many whole cards fit in the track. NEVER hardcode 4: the two arrows live
// inside the same max-w row, so the real budget is the width the viewport
// element actually gets (measured with a ResizeObserver), not the page width.
// Hardcoding 4 clipped the 4th card 181px at 1440 and the ACTIVE card at 768.
function cardsFor(width: number, len: number): number {
  if (!Number.isFinite(width) || width <= 0) return 1;
  return Math.max(1, Math.min(len, Math.floor((width + GAP) / SLOT)));
}

// ≥44px touch target at EVERY breakpoint (mobile used to be 40px, below the
// WCAG 2.2 target-size minimum). Desktop keeps the larger 56px hit area.
const ARROW_BTN =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0AAE9A] shadow-[0_8px_24px_rgba(16,27,61,0.10)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] md:h-14 md:w-14";

// One slot per card: fixed on desktop, full-width of the track below md.
const CARD_SLOT = "min-w-[332px] w-[332px] max-md:min-w-0 max-md:w-full";

export function OrbitalModules({ modules }: { modules: ModuleData[] }) {
  const len = modules.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  // Default to a single card so SSR/first paint renders exactly one card: the
  // wider window only appears after the client measures the track. Rendering
  // the full window in the SSR HTML makes the track ~1096px wide at a 390px
  // viewport (each card w-full of the shrunk ul), and the harness measures at
  // DOMContentLoaded — before hydration collapses it — flagging ul/viewport
  // scrollWidth as a fixed-width risk. One card keeps the track <= viewport at
  // every pre-hydration instant.
  const [visibleCount, setVisibleCount] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  // ── Hooks (ALL of them run before the empty-state return below) ──
  // The early return used to precede three useCallback hooks, so a 0→N modules
  // transition changed the hook order and threw. Keep every hook up here.
  useEffect(() => {
    if (len === 0) return;
    setActiveIndex((i) => (i >= len ? len - 1 : i));
  }, [len]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setVisibleCount(cardsFor(el.clientWidth, len));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [len]);

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

  if (len === 0) {
    return (
      <div className="mx-auto max-w-[1360px] py-12 text-center text-storm">
        <p className="text-sm">No hay expediciones disponibles.</p>
      </div>
    );
  }

  // Window anchored at the ACTIVE module — no rotation, no translateX, no
  // alternating −8px jitter: the row itself never moves (transform: none at
  // every step), only its contents change.
  const activeSlug = modules[activeIndex]!.slug;
  const ordered = Array.from(
    { length: Math.min(visibleCount, len) },
    (_, k) => modules[(activeIndex + k) % len]!,
  );

  const renderCard = (mod: ModuleData) => {
    const isActive = mod.slug === activeSlug;
    const theme = getLabCardTheme(mod.slug);
    const xp = mod.xpReward ?? mod.lessons * 20;
    const model = buildModuleCardModel({
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      lessonCount: mod.lessons,
      labCount: mod.labCount,
      xpReward: xp,
      completed: null,
      total: null,
    });

    return (
      <li
        key={mod.slug}
        data-carousel="card"
        data-active={isActive ? "true" : undefined}
        className={[
          CARD_SLOT,
          "list-none transition-all duration-300",
          // Emphasis WITHOUT container opacity: opacity-60 dragged the
          // description to 2.14:1. Inactive cards just shrink slightly; the
          // active card keeps full size and wears an inset mint ring (painted
          // inside its own box, so it can never be clipped by the viewport).
          isActive
            ? "rounded-2xl ring-2 ring-[#0AAE9A]/30 ring-inset"
            : "md:scale-[0.98]",
        ].join(" ")}
        style={
          shouldReduceMotion
            ? undefined
            : {
                transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
              }
        }
      >
        <ModuleCard model={model} href={mod.href} theme={theme} variant="compact" />
      </li>
    );
  };

  const renderDot = (mod: ModuleData) => {
    const isActive = mod.slug === activeSlug;
    return (
      <div key={mod.slug} className="flex justify-center">
        <button
          type="button"
          data-carousel="dot"
          aria-label={`Ir a ${mod.title}`}
          aria-current={isActive ? "true" : undefined}
          onClick={() => setActiveIndex(modules.findIndex((m) => m.slug === mod.slug))}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0AAE9A] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className={
              isActive
                ? "h-2.5 w-6 rounded-full bg-brand-800 transition-colors"
                : "h-2.5 w-2.5 rounded-full bg-brand-500 transition-colors"
            }
          />
        </button>
      </div>
    );
  };

  return (
    <div
      className="mx-auto max-w-[1360px]"
      role="region"
      aria-label="Carrusel de expediciones"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Flex row: the arrows flank the viewport as siblings (not absolute
          children), so flex + items-center centers them against the card height
          without computing a top. overflow-hidden lives only on the central
          viewport, never on the outer container, so the arrows are never cut.
          The desktop set hides below md; mobile has its own row further down. */}
      <div className="relative mx-auto flex max-w-[1360px] items-center gap-2 md:gap-4">
        <button
          type="button"
          aria-label="Anterior"
          onClick={prev}
          className={`${ARROW_BTN} hidden md:flex`}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div
          ref={viewportRef}
          data-carousel="viewport"
          className="scroll-hide min-w-0 flex-1 overflow-hidden pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <ul
            aria-label="Modulos del curso"
            data-carousel="track"
            className="m-0 flex list-none gap-4 p-0"
          >
            {ordered.map(renderCard)}
          </ul>

          {/* Dots — one per expedition (NOT per visible slot). Mapping them to
              the visible window rendered 3 dots for 4 expeditions on desktop
              and a single dot on tablet, hiding the size of the course. Each dot
              jumps to its own module via setActiveIndex. The active state is
              carried by shape (wide pill vs dot) as well as colour, and the
              active/inactive pair was re-picked so both clear 3:1 against the
              section background: #00388C = 10.4:1, #008DBF = 3.6:1. The previous
              pair (#0063AE / #008DBF) cleared the ratio but was visually
              indistinguishable. */}
          <div
            className="mt-8 flex justify-center gap-2 md:mt-10 md:gap-3"
            role="group"
            aria-label="Selectores de expedición"
          >
            {modules.map(renderDot)}
          </div>
        </div>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={next}
          className={`${ARROW_BTN} hidden md:flex`}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile controls: the card owns the whole row width (the arrows used to
          eat 96px of it, leaving a 262px card) and the arrows sit in their own
          row below. Drag was removed: with a measured single-card mobile track
          there is no track to traverse, so the gesture could never do anything
          — the arrows, dots and keyboard cover every navigation. */}
      <div className="mt-4 flex items-center justify-center gap-8 md:hidden">
        <button type="button" aria-label="Anterior" onClick={prev} className={ARROW_BTN}>
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Siguiente" onClick={next} className={ARROW_BTN}>
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
