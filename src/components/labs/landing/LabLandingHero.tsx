"use client";

import { HeroWithConsole } from "@/components/shared/HeroWithConsole";
import { getLabHeroImage } from "@/lib/labs/heroImages";
import { HubConsole } from "@/components/labs/consoles/HubConsole";
import { IntroConsole } from "@/components/labs/consoles/IntroConsole";
import { PythonConsole } from "@/components/labs/consoles/PythonConsole";
import { StatsConsole } from "@/components/labs/consoles/StatsConsole";
import { MlConsole } from "@/components/labs/consoles/MlConsole";

interface LabLandingHeroProps {
  moduleSlug: string;
  title: string;
  description: string;
  eyebrow: string;
  ctaHref: string;
  ctaLabel: string;
}

function ConsoleForModule({ slug }: { slug: string }) {
  switch (slug) {
    case "ia":
      return <IntroConsole />;
    case "python":
      return <PythonConsole />;
    case "estadistica":
      return <StatsConsole />;
    case "machine-learning":
      return <MlConsole />;
    default:
      return <HubConsole />;
  }
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
      console={<ConsoleForModule slug={moduleSlug} />}
    />
  );
}
