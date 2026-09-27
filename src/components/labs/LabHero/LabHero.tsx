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
 * LabHero — video 4K (subtle) + consola ampliada + spritecook image.
 * T2 hero-lab-tweaks: bg-black, sin HUD, sin purple wrapper, sin // line.
 */
export function LabHero({
  totalXp: _totalXp,
  currentStreak: _currentStreak,
  levelInfo: _levelInfo,
  rankTitle: _rank,
}: LabHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-3xl bg-black"
      style={{ opacity: 1 }}
    >
      {/* ── Video layer — subtle behind console+image ── */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
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
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
      )}
      {/* ── Overlay for readability — console color dominates ── */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* ── Content: consola + spritecook image ── */}
      <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-8 p-8 lg:flex-row lg:p-12">
        <div className="font-mono w-full max-w-[520px] rounded-xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl">
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/spritecook/lab-hero-256-complete-enhanced-1024x576.png"
          alt="Laboratorio"
          width={512}
          height={288}
          className="w-full max-w-[480px] shrink-0 rounded-xl object-contain shadow-xl lg:max-w-[512px] h-auto"
        />
      </div>
    </section>
  );
}
