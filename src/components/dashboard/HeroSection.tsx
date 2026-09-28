"use client";

import dynamic from "next/dynamic";
import type { HeroBannerProps } from "./HeroBanner";

const HeroBanner = dynamic(
  () => import("./HeroBanner").then((mod) => mod.HeroBanner),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] animate-pulse rounded-3xl bg-[var(--color-surface-raised)] lg:min-h-[480px]" />
    ),
  }
);

export interface HeroSectionProps extends HeroBannerProps {}

export function HeroSection(props: HeroSectionProps) {
  return <HeroBanner {...props} />;
}
