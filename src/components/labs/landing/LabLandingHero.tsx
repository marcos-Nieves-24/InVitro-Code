"use client";

import { HeroWithConsole } from "@/components/shared/HeroWithConsole";
import { getLabHeroImage } from "@/lib/labs/heroImages";
import { getConsoleForModule } from "@/lib/labs/consoleForModule";

interface LabLandingHeroProps {
  moduleSlug: string;
  title: string;
  description: string;
  eyebrow: string;
  ctaHref: string;
  ctaLabel: string;
}

export function LabLandingHero({
  moduleSlug,
  title,
  description,
  eyebrow,
  ctaHref,
  ctaLabel,
}: LabLandingHeroProps) {
  const bg = getLabHeroImage(moduleSlug);

  return (
    <HeroWithConsole
      backgroundSrc={bg}
      eyebrow={eyebrow}
      title={title}
      description={description}
      cta={{ href: ctaHref, label: ctaLabel }}
      console={getConsoleForModule(moduleSlug)}
    />
  );
}
