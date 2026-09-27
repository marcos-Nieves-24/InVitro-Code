"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Gem, Flame, ArrowRight } from "lucide-react";
import { useLabHeroMotion } from "./useLabHeroMotion";
import { LabHeroCopy } from "./LabHeroCopy";

const RiveBioreactor = dynamic(
  () => import("./RiveBioreactor").then((m) => m.RiveBioreactor),
  { ssr: false },
);

interface LevelInfo {
  level: number;
  nextLevelXp: number;
  progressToNext: number;
}

interface LabHeroProps {
  totalXp: number;
  currentStreak: number;
  levelInfo: LevelInfo;
  rankTitle: string;
}

/** 20 bubble positions (pre-computed for deterministic layout) */
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 47) % 90}%`,
  bottom: `${(i * 31) % 60}%`,
  size: 6 + (i % 5) * 4,
  delay: (i * 0.3) % 3,
}));

/**
 * LabHero — animated hero for /laboratorios.
 * Replaces the old InVitroTopBar + static h1 on this route.
 */
export function LabHero({
  totalXp,
  currentStreak,
  levelInfo,
  rankTitle: rank,
}: LabHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useLabHeroMotion({
    heroRef,
    h1Ref,
    bubblesRef,
    canvasRef,
    prefersReducedMotion,
  });

  const xpPercent = levelInfo.nextLevelXp > 0
    ? Math.round((levelInfo.progressToNext / (levelInfo.nextLevelXp - levelInfo.level * 100)) * 100)
    : 0;

  const scrollToHub = () => {
    document.getElementById("hub")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[var(--color-comic-bg)] bg-dot-grid"
      style={{ opacity: 0 }}
    >
      {/* ── Bubble layer ── */}
      <div ref={bubblesRef} className="bubble-layer absolute inset-0 z-0">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="bubble absolute rounded-full bg-[var(--color-bubble)]"
            style={{
              left: b.left,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              opacity: 0.55,
              animationDelay: `${b.delay}s`,
              "--bubble-x": `${(b.id % 2 === 0 ? 1 : -1) * (8 + (b.id % 12))}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Content grid ── */}
      <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center gap-8 px-6 py-16 md:flex-row md:items-center md:gap-12 md:px-10 md:py-24">
        {/* Left: Copy */}
        <div className="flex-1 text-center md:text-left">
          <p className="eyebrow mb-3 text-[var(--color-comic-accent)]">
            Laboratorio &middot; InVitro-Code
          </p>
          <h1
            ref={h1Ref}
            className="font-display text-4xl font-extrabold leading-tight text-[var(--color-comic-text)] md:text-5xl lg:text-6xl"
          >
            Sala de laboratorios
          </h1>

          <div className="mt-4 min-h-[3.5rem]">
            <LabHeroCopy />
          </div>

          <p className="mt-3 max-w-lg text-sm text-[var(--color-comic-accent)] md:text-base">
            Cada módulo tiene lecciones con laboratorios interactivos. Completa
            los ejercicios para dominar los conceptos.
          </p>
        </div>

        {/* Right: Rive canvas */}
        <div ref={canvasRef} className="flex-shrink-0">
          <RiveBioreactor progress={levelInfo.progressToNext} />
        </div>
      </div>

      {/* ── HUD footer ── */}
      <div className="relative z-10 border-t border-[var(--color-hud-border)] bg-[var(--color-hud-bg)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-4 px-6 py-3 md:gap-8 md:px-10">
          {/* Level */}
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-hud-text)]">
            <span className="rounded bg-[var(--color-hud-border)] px-2 py-0.5 text-xs tabular-nums">
              Niv. {levelInfo.level}
            </span>
            <span className="hidden text-[var(--color-hud-muted)] sm:inline">
              {rank}
            </span>
          </div>

          {/* XP bar */}
          <div className="flex flex-1 items-center gap-2">
            <Gem className="h-4 w-4 text-[var(--color-comic-accent)]" fill="currentColor" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-hud-border)]">
              <div
                className="progress-bar-animated h-full rounded-full bg-gradient-to-r from-[var(--color-fog)] to-[var(--color-mint)]"
                style={{ "--progress": `${xpPercent}%`, width: `${xpPercent}%` } as React.CSSProperties}
              />
            </div>
            <span className="text-xs tabular-nums text-[var(--color-hud-muted)]">
              {totalXp.toLocaleString("es")} XP
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-hud-border)] px-3 py-1 text-xs font-bold text-[var(--color-hud-text)]">
            <Flame className="h-3.5 w-3.5 text-[var(--color-error)]" />
            <span className="tabular-nums">
              {currentStreak} día{currentStreak !== 1 ? "s" : ""}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToHub}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-comic-accent)] px-4 py-1.5 text-xs font-bold text-[var(--color-comic-bg)] transition-transform hover:scale-105"
          >
            Explorar laboratorios
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
