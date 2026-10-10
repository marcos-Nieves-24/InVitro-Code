"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { getScientistVariant } from "@/lib/gamification/utils";
import { ScientistFigure } from "./ScientistFigure";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";
import { TypingText } from "@/components/ui/TypingText";

export interface HeroBannerProps {
  userName: string;
  startHref: string;
  gender?: string | null;
  levelInfo?: { level: number; nextLevelXp: number; progressToNext: number };
}

const BUBBLE_TEXT = "¿Listo para tu próxima misión?";

export function HeroBanner(props: HeroBannerProps) {
  return <HeroComic {...props} />;
}

function HeroComic({ startHref, gender }: HeroBannerProps) {
  const shouldReduceMotion = useReducedMotion();
  const fondoRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [typeActive, setTypeActive] = useState(() => !!shouldReduceMotion);
  const [isHoverScientist, setIsHoverScientist] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypeActive(true);
    }
  }, [shouldReduceMotion]);

  // This hero intentionally runs two animation runtimes, each for one job:
  //   - gsap: the one-shot enter timeline (background parallax, figure slide-in,
  //     bubble pop, then the typewriter start). Loaded dynamically so the chunk
  //     stays out of the initial bundle and can degrade gracefully when offline.
  //   - motion/react: the hover speech-bubble scale on the scientist figure, which
  //     is a state-driven keyframe sequence rather than part of the enter timeline.
  // This split is deliberate; do not collapse the two into a single runtime.
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
    <section className="relative min-h-[400px] rounded-3xl lg:min-h-[480px]">
      <div ref={fondoRef} className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
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
          <div className="font-mono rounded-lg bg-black/80 border border-white/10 p-4">
            <TypingText
              text="> Bienvenido, investigador"
              delay={28}
              repeat={false}
              smooth={false}
              hideCursorOnComplete={false}
              cursor={<span className="text-[var(--color-brand-300)]">█</span>}
              className="text-sm font-bold text-[var(--color-brand-300)]"
            />
            <TypingText
              text="// sistema listo"
              delay={22}
              repeat={false}
              smooth={false}
              hideCursorOnComplete
              className="mt-2 block text-xs text-white/60"
            />
            <TypingText
              text="Continua entrenando modelos y explorando la inteligencia artificial"
              delay={18}
              repeat={false}
              smooth={false}
              hideCursorOnComplete
              className="mt-1 block text-sm text-white/80"
            />
          </div>
          <SlideArrowButton
            text="Iniciar Lección"
            primaryColor="var(--color-brand-400)"
            href={startHref}
            className="w-fit"
          />

          {/* Static bubble removed — now appears on scientist hover (see figure hover bubble) */}
        </div>
      </div>

      <div
        ref={figureRef}
        style={figureInitialStyle}
        className="absolute bottom-0 right-[4%] z-[2] hidden aspect-[440/511] w-[clamp(280px,28vw,380px)] overflow-visible lg:right-[6%] lg:block"
        onMouseEnter={() => setIsHoverScientist(true)}
        onMouseLeave={() => setIsHoverScientist(false)}
      >
        <ScientistFigure
          variant={getScientistVariant(gender)}
          priority
          alt="Científica con hélice de ADN"
        />
        {/* Hover speech bubble — connected to scientist, bouncy expand/shrink */}
        <motion.div
          className="pointer-events-none absolute -left-[168px] top-[68px] hidden lg:block"
          initial={{ scale: 0 }}
          animate={
            isHoverScientist
              ? { scale: [0, 1.25, 1] }
              : { scale: 0 }
          }
          transition={
            isHoverScientist
              ? { duration: 0.25, times: [0, 0.5, 1], ease: "easeOut" }
              : { duration: 0.1, ease: "easeIn" }
          }
          style={{ transformOrigin: "100% 100%" }}
          aria-hidden={!isHoverScientist}
        >
          <div className="relative rounded-[10px] bg-[#5a5a5a] px-4 py-3 text-center text-sm font-bold text-white shadow-lg">
            {BUBBLE_TEXT}
            <span
              className="absolute -bottom-[10px] right-6 block h-0 w-0 border-[10px] border-solid border-transparent"
              style={{
                borderTopColor: "#5a5a5a",
                borderRightColor: "#5a5a5a",
                transform: "rotate(-10deg)",
              }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>

    </section>
  );
}
