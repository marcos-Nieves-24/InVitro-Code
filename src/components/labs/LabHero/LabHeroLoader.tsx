"use client";

import dynamic from "next/dynamic";

const LabHero = dynamic(
  () => import("./LabHero").then((m) => m.LabHero),
  { ssr: false },
);

interface LevelInfo {
  level: number;
  nextLevelXp: number;
  progressToNext: number;
}

interface LabHeroLoaderProps {
  totalXp: number;
  currentStreak: number;
  levelInfo: LevelInfo;
  rankTitle: string;
}

/**
 * Client wrapper for LabHero — needed because the page is a Server Component
 * and next/dynamic ssr:false is only allowed in Client Components.
 */
export function LabHeroLoader(props: LabHeroLoaderProps) {
  return <LabHero {...props} />;
}
