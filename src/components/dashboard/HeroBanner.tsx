// Server component — no "use client"
import Link from "next/link";
import { Play } from "lucide-react";
import { getScientistVariant } from "@/lib/gamification/utils";

export interface HeroBannerProps {
  userName: string;
  startHref: string;
  gender?: string | null;
}

export function HeroBanner({ userName, startHref, gender }: HeroBannerProps) {
  const variant = getScientistVariant(gender);
  const scientistSrc =
    variant === "m"
      ? "/dashboard/cientifico-440x511.svg"
      : "/dashboard/cientifica-1.svg";
  return (
    <section className="relative min-h-[400px] overflow-hidden rounded-3xl lg:min-h-[480px]">
      {/* Layer 0: Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/dashboard/dashboard-fondo-anime.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="relative z-[2] flex items-stretch gap-0 p-8 lg:p-12">
        {/* Hero card */}
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

        {/* SVG scientist illustration */}
        <div className="hidden shrink-0 self-end overflow-visible lg:block lg:w-[350px] lg:-ml-2">
          <img
            src={scientistSrc}
            alt="Científica con hélice de ADN"
            className="h-[480px] w-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2">
        <a href="#stats" className="flex flex-col items-center gap-2 text-[var(--color-comic-text)]/60 transition-colors hover:text-[var(--color-comic-text)]">
          <span className="text-xs font-medium">Siguiente</span>
          <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
