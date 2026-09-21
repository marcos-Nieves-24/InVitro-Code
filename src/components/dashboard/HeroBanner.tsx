// Server component — no "use client"
import Image from "next/image";
import Link from "next/link";
import { Play, Map } from "lucide-react";
import { DashboardHero3DWrapper } from "./DashboardHero3DWrapper";

interface HeroBannerProps {
  userName: string;
  startHref: string;
  totalXp: number;
}

export function HeroBanner({ userName, startHref }: HeroBannerProps) {
  return (
    <section className="relative flex min-h-[320px] rounded-2xl lg:min-h-[480px]">
      {/* Layer 0: Background image — anime-style dashboard background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/dashboard/dashboard-fondo-anime.png"
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
          className="pointer-events-none object-cover object-center"
        />
      </div>

      {/* Layer 1: Gradient overlay for text contrast — softer for anime bg */}
      <div className="absolute inset-0 z-[1] overflow-hidden bg-gradient-to-r from-[#0b0e2a]/70 via-[#0b0e2a]/40 to-transparent" />

      {/* Layer 2: Content.
          The section is a flex container so this row stretches to the hero's full
          height at every viewport. Without it the row stayed content-sized and
          top-aligned, leaving a 40px dead band above the bottom edge wherever the
          hero hit its min-height (~1920px wide) and the bust looked amputated. */}
      <div className="relative z-[2] flex w-full items-center gap-8 p-10">
        <div className="flex-1">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            ¡Bienvenido de vuelta, {userName}!
          </h2>
          <p className="mb-8 mt-4 max-w-lg text-white/80">
            Estás construyendo tu camino en InVitro-Code. Continúa tu
            investigación y descubre nuevas formas de aplicar la Inteligencia
            Artificial.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={startHref}
              className="flex items-center gap-2 rounded-xl bg-mint px-8 py-4 font-bold text-ink shadow-lg shadow-glow transition-transform hover:scale-105"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Continuar Misión
            </Link>
            <Link
              href="/niveles"
              className="glass-card flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-bold text-white transition-colors hover:bg-white/10"
            >
              <Map className="h-4 w-4" />
              Explorar Mapa
            </Link>
          </div>
        </div>

        {/* Layer 3: 3D canvas — client boundary.
            Anchored to the hero's real bottom-right edge: self-end + -mb-10 closes
            the bust crop against the bottom, and -mr-10 pulls the canvas through the
            right padding so the figure bleeds off the hero edge like the reference.
            Without -mr-10 the canvas bled off only its own box, leaving a 40px band. */}
        <div className="hidden h-[480px] w-96 shrink-0 self-end overflow-visible lg:-mb-6 lg:-mr-2 lg:block">
          <DashboardHero3DWrapper />
        </div>
      </div>

      {/* Layer 4: Decorative chip */}
      <div className="absolute right-6 top-6 z-[3] rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
        IA + Biotecnología = Mejor futuro
      </div>
    </section>
  );
}
