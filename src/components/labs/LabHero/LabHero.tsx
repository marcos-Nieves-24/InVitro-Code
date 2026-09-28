"use client";

import { HeroWithConsole } from "@/components/shared/HeroWithConsole";
import { getLabHeroImage } from "@/lib/labs/heroImages";
import { HubConsole } from "@/components/labs/consoles/HubConsole";

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
 * LabHero — hub hero using shared HeroWithConsole + HubConsole.
 * Background from heroImages.ts hub banner.
 */
export function LabHero(_props: LabHeroProps) {
  return (
    <HeroWithConsole
      backgroundSrc={getLabHeroImage("hub")}
      eyebrow="Sala de laboratorios"
      title="Laboratorios"
      description="Completa ejercicios interactivos y domina los conceptos de biotecnología con IA."
      console={<HubConsole />}
    />
  );
}
