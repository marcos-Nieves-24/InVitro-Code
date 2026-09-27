"use client";

import { useRef } from "react";
import { TypingText } from "@/components/ui/TypingText";

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

/**
 * LabHero — video 4K + consola + HUD footer (solo Nivel).
 * T1 labs-hero-tweaks: sin XP bar, sin racha, sin CTA.
 */
export function LabHero({
  totalXp: _totalXp,
  currentStreak: _currentStreak,
  levelInfo,
  rankTitle: rank,
}: LabHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-3xl bg-graphite"
      style={{ opacity: 1 }}
    >
      {/* ── Video layer ── */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-lab-4k-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/hero-lab-4k.mp4" type="video/mp4" />
      </video>
      {prefersReducedMotion && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/videos/hero-lab-4k-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
      )}
      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-graphite/80 via-graphite/50 to-transparent"
        aria-hidden="true"
      />

      {/* ── Content grid — console card ── */}
      <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col gap-0 p-8 lg:p-12 pb-0">
        <div className="w-[420px] shrink-0 rounded-3xl border border-[var(--color-comic-border)] bg-[var(--color-comic-bg)]/85 p-8 backdrop-blur-sm">
          <div className="font-mono rounded-lg bg-black/80 border border-white/10 p-4">
            <TypingText
              text="> Sala de laboratorios"
              delay={28}
              repeat={false}
              smooth={false}
              hideCursorOnComplete={false}
              cursor={<span className="text-[var(--color-brand-300)]">█</span>}
              className="text-sm font-bold text-[var(--color-brand-300)]"
            />
            <TypingText
              text="// 4 laboratorios · IA · Python · Bioestadística · ML"
              delay={22}
              repeat={false}
              smooth={false}
              hideCursorOnComplete
              className="mt-2 block text-xs text-white/60"
            />
            <TypingText
              text="Completa los ejercicios interactivos y domina los conceptos."
              delay={18}
              repeat={false}
              smooth={false}
              hideCursorOnComplete
              className="mt-1 block text-sm text-white/80"
            />
          </div>
        </div>
      </div>

      {/* ── HUD footer — solo Nivel + rank ── */}
      <div className="relative z-10 border-t border-[var(--color-hud-border)] bg-[var(--color-hud-bg)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-4 px-6 py-3 md:gap-8 md:px-10">
          {/* Level */}
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-hud-text)]">
            <span className="rounded bg-[var(--color-hud-border)] px-2 py-0.5 text-xs tabular-nums">
              Niv. {levelInfo.level}
            </span>
            <span className="hidden text-[var(--color-hud-muted)] sm:inline">{rank}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
