"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroVideo } from "@/lib/labs/heroVideos";

interface LabLandingHeroProps {
  moduleSlug: string;
  title: string;
  description: string;
  eyebrow: string;
  video: HeroVideo;
  ctaHref: string;
  ctaLabel: string;
}

export function LabLandingHero({
  title,
  description,
  eyebrow,
  video,
  ctaHref,
  ctaLabel,
}: LabLandingHeroProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const showVideo = !prefersReducedMotion;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-surface-raised bg-graphite"
      aria-label={title}
    >
      {/* Video layer */}
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster || undefined}
          aria-hidden="true"
        >
          <source src={video.src} type="video/mp4" />
        </video>
      ) : video.poster ? (
        // Reduced-motion: static poster fallback
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/40 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex max-w-2xl flex-col gap-4 px-6 py-12 md:px-10 md:py-20">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-mint">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-white/80 md:text-base">{description}</p>
        <div className="pt-2">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-8 py-3.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-mint/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
