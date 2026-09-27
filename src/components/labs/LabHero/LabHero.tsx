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
 * LabHero — pixel-art background + consola centrada.
 * T7 labs-hero-tweaks: video 4K replaced by pixel-art image as full-bleed background.
 */
export function LabHero({
  totalXp: _totalXp,
  currentStreak: _currentStreak,
  levelInfo: _levelInfo,
  rankTitle: _rank,
}: LabHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-3xl bg-black"
      style={{ opacity: 1 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/spritecook/lab-hero-256-complete-enhanced-1024x576.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[380px] items-center justify-center p-8 lg:p-12">
        <div className="font-mono w-full max-w-[560px] rounded-xl bg-[#0a0a0a]/90 border border-white/10 p-6 shadow-2xl backdrop-blur-sm">
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
            text="Completa los ejercicios interactivos y domina los conceptos."
            delay={18}
            repeat={false}
            smooth={false}
            hideCursorOnComplete
            className="mt-1 block text-sm text-white/80"
          />
        </div>
      </div>
    </section>
  );
}
