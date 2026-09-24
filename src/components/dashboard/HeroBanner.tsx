"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { getScientistVariant } from "@/lib/gamification/utils";
import { ComicBubble } from "./ComicBubble";
import { ScientistFigure } from "./ScientistFigure";

export interface HeroBannerProps {
  userName: string;
  startHref: string;
  gender?: string | null;
  levelInfo?: { level: number; nextLevelXp: number; progressToNext: number };
}

const BUBBLE_TEXT = "¡Listo para tu próxima misión?";

function LegacyStatic({
  userName: _userName,
  startHref,
  gender,
}: HeroBannerProps) {
  const variant = getScientistVariant(gender);
  const scientistSrc =
    variant === "m"
      ? "/dashboard/cientifico-440x511.svg"
      : "/dashboard/cientifica-1.svg";

  return (
    <section className="relative min-h-[400px] overflow-hidden rounded-3xl lg:min-h-[480px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/dashboard/dashboard-fondo-anime.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-[2] flex items-end gap-0 p-8 pb-0 lg:p-12 lg:pb-0">
        <div className="relative z-[1] w-[420px] shrink-0 rounded-3xl border border-[var(--color-comic-border)] bg-[var(--color-comic-bg)]/85 p-8 backdrop-blur-sm">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-comic-text)] md:text-4xl">
            ¡Bienvenido, investigador!
          </h2>
          <p className="mt-4 text-lg text-[var(--color-comic-text)]/80">
            Continua entrenando modelos y explorando la inteligencia artificial
          </p>
          <Link
            href={startHref}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-3 font-bold text-ink shadow-lg shadow-glow transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Iniciar Lección
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 right-8 z-[2] hidden h-[480px] w-[350px] overflow-visible lg:right-12 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scientistSrc}
          alt="Científica con hélice de ADN"
          className="h-[480px] w-full object-contain object-bottom"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2">
        <a
          href="#stats"
          className="flex flex-col items-center gap-2 text-[var(--color-comic-text)]/60 transition-colors hover:text-[var(--color-comic-text)]"
        >
          <span className="text-xs font-medium">Siguiente</span>
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

export function HeroBanner(props: HeroBannerProps) {
  if (process.env.NEXT_PUBLIC_HERO_FALLBACK === "true") {
    return <LegacyStatic {...props} />;
  }

  return <HeroComic {...props} />;
}

function HeroComic({ startHref, gender }: HeroBannerProps) {
  const shouldReduceMotion = useReducedMotion();
  const fondoRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [typeActive, setTypeActive] = useState(() => !!shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypeActive(true);
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let timeline: { kill: () => void } | null = null;
    let mounted = true;

    const run = async () => {
      try {
        const mod = await import("gsap");
        const gsap = (mod as unknown as { gsap: typeof import("gsap").gsap }).gsap ?? (mod as unknown as { default: typeof import("gsap").gsap }).default ?? (mod as unknown as typeof import("gsap")).gsap;
        if (!mounted) return;

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        timeline = tl;

        tl.addLabel("enter");
        if (fondoRef.current) {
          tl.to(
            fondoRef.current,
            { y: -8, duration: 0.6, ease: "power2.out" },
            "enter"
          );
        }
        if (figureRef.current) {
          tl.fromTo(
            figureRef.current,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6 },
            "enter+=0.1"
          );
        }
        tl.addLabel("bubblePop");
        if (bubbleRef.current) {
          tl.fromTo(
            bubbleRef.current,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "elastic.out(1, 0.5)",
            },
            "bubblePop"
          );
        }
        tl.addLabel("type");
        tl.call(
          () => {
            if (mounted) setTypeActive(true);
          },
          undefined,
          "type"
        );
      } catch {
        if (mounted) setTypeActive(true);
        if (bubbleRef.current) {
          bubbleRef.current.style.transform = "scale(1)";
          bubbleRef.current.style.opacity = "1";
        }
        if (figureRef.current) {
          figureRef.current.style.transform = "translateX(0)";
          figureRef.current.style.opacity = "1";
        }
      }
    };

    run();

    return () => {
      mounted = false;
      if (timeline) {
        try {
          timeline.kill();
        } catch {
          // ignore
        }
      }
    };
  }, [shouldReduceMotion]);

  const bubbleInitialStyle = shouldReduceMotion
    ? undefined
    : { transform: "scale(0)", opacity: 0, transformOrigin: "bottom left" as const };

  const figureInitialStyle = shouldReduceMotion
    ? undefined
    : { transform: "translateX(40px)", opacity: 0 };

  return (
    <section className="relative min-h-[400px] overflow-hidden rounded-3xl lg:min-h-[480px]">
      <div ref={fondoRef} className="absolute inset-0 z-0">
        <Image
          src="/dashboard/dashboard-fondo-anime.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-[2] flex items-end gap-0 p-8 pb-0 lg:p-12 lg:pb-0">
        <div className="relative z-[1] flex w-[420px] shrink-0 flex-col gap-4 rounded-3xl border border-[var(--color-comic-border)] bg-[var(--color-comic-bg)]/85 p-8 backdrop-blur-sm">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-comic-text)] md:text-4xl">
            ¡Bienvenido, investigador!
          </h2>
          <p className="text-lg text-[var(--color-comic-text)]/80">
            Continua entrenando modelos y explorando la inteligencia artificial
          </p>
          <Link
            href={startHref}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-mint px-6 py-3 font-bold text-ink shadow-lg shadow-glow transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Iniciar Lección
          </Link>

          <div
            ref={bubbleRef}
            style={bubbleInitialStyle}
            className="mt-2"
          >
            {typeActive ? (
              <ComicBubble text={BUBBLE_TEXT} />
            ) : (
              <div aria-hidden="true" className="h-[72px]" />
            )}
          </div>
        </div>
      </div>

      <div
        ref={figureRef}
        style={figureInitialStyle}
        className="absolute bottom-0 right-8 z-[2] hidden h-[480px] w-[350px] overflow-visible lg:right-12 lg:block"
      >
        <ScientistFigure
          variant={getScientistVariant(gender)}
          priority
          alt="Científica con hélice de ADN"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2">
        <a
          href="#stats"
          className="flex flex-col items-center gap-2 text-[var(--color-comic-text)]/60 transition-colors hover:text-[var(--color-comic-text)]"
        >
          <span className="text-xs font-medium">Siguiente</span>
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
