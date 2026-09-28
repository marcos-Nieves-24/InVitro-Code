import Image from "next/image";
import type { ReactNode } from "react";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";

export interface HeroWithConsoleProps {
  backgroundSrc: string;
  eyebrow: string;
  title: ReactNode | string;
  description: string;
  cta?: { href: string; label: string };
  console?: ReactNode;
  priority?: boolean;
}

/**
 * Unified hero template: banner image + overlay + two-column grid (copy + console).
 * Used by /laboratorios and /proyectos hubs and module pages.
 */
export function HeroWithConsole({
  backgroundSrc,
  eyebrow,
  title,
  description,
  cta,
  console,
  priority = false,
}: HeroWithConsoleProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl min-h-[480px]">
      {/* Background image */}
      <Image
        src={backgroundSrc}
        alt=""
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111439]/60" aria-hidden="true" />

      {/* Content grid */}
      <div className="relative z-10 grid gap-12 p-8 lg:grid-cols-2 lg:p-12">
        {/* Left copy */}
        <div className="flex flex-col justify-center gap-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            {description}
          </p>
          {cta ? (
            <div className="pt-2">
              <SlideArrowButton href={cta.href} text={cta.label} />
            </div>
          ) : null}
        </div>

        {/* Right console */}
        {console ? (
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[880px]">{console}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
