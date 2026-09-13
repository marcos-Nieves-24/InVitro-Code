import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { InteractiveTerminal } from "@/components/landing/InteractiveTerminal";
import { MissionDendrogram } from "@/components/landing/MissionDendrogram";
import { Modules } from "@/components/landing/Modules";
import { Team } from "@/components/landing/Team";
import { Contact } from "@/components/landing/Contact";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

/**
 * Landing page — InVitro-Code interactive learning platform.
 * Dark hero with live terminal, semantic dendrogram, modules,
 * team section, and contact CTA.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />

      <main id="main-content">
        {/* ── Hero: Dark cinematic section ──────────────── */}
        <section className="relative overflow-hidden bg-[#111439] px-6 pt-20 pb-16 md:px-10 md:pt-32 md:pb-24">
          <HeroBackground />

          <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: copy — light tokens over dark hero */}
            <div className="flex flex-col gap-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Aprendizaje Interactivo
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                Aprende{" "}
                <span className="text-mint">IA y Machine Learning</span> con
                Python para Biotecnologia
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/70">
                Un curso para biotecnologos que quieren entender datos, modelos
                y decisiones desde el pregrado. Terminales interactivas, labs en
                vivo y desafios de codigo real.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 rounded-xl bg-mint px-8 py-4 font-bold text-ink shadow-lg shadow-glow transition-all hover:scale-105 hover:shadow-glow"
                >
                  Empezar ahora <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 rounded-xl bg-mint px-8 py-4 font-bold text-ink shadow-lg shadow-glow transition-all hover:scale-105 hover:shadow-glow"
                >
                  Iniciar sesion
                </Link>
              </div>
            </div>

            {/* Right: interactive terminal */}
            <div className="w-full max-w-[880px]">
              <InteractiveTerminal />
            </div>
          </div>
        </section>

        {/* ── Mission Dendrogram ─────────────────────── */}
        <MissionDendrogram />

        {/* ── Modules ────────────────────────────────── */}
        <Modules />

        {/* ── Team ───────────────────────────────────── */}
        <Team />

        {/* ── Contact ────────────────────────────────── */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
