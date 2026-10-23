import { HeroBackground } from "@/components/landing/HeroBackground";
import { InteractiveTerminal } from "@/components/landing/InteractiveTerminal";
import { MissionDendrogram } from "@/components/landing/MissionDendrogram";
import { Modules } from "@/components/landing/Modules";
import { Team } from "@/components/landing/Team";
import { Contact } from "@/components/landing/Contact";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Landing page — InVitro-Code interactive learning platform.
 * Dark hero with live terminal, semantic dendrogram, modules,
 * team section, and contact CTA.
 */
export default async function Home() {
  const { userId } = await auth();
  let headerUser: { name: string; imageUrl?: string | null } | null = null;
  if (userId) {
    const cu = await currentUser();
    const name =
      cu?.username ??
      cu?.firstName ??
      cu?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
      "Usuario";
    headerUser = { name, imageUrl: cu?.imageUrl ?? null };
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header user={headerUser} />

      <main id="main-content">
        {/* ── Hero: Dark cinematic section — ocupa el div del header (fixed overlay, sin banda blanca) ── */}
        <section className="relative overflow-hidden bg-[#111439] px-6 pb-16 pt-[72px] md:px-10 md:pb-24 md:pt-[88px]">
          <HeroBackground />

          <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: copy — light tokens over dark hero */}
            <div className="flex flex-col gap-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Aprendizaje Interactivo
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                Aprende{" "}
                <span className="text-mint">IA y Machine Learning</span> con
                Python para Biotecnologia
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/80">
                Un curso para biotecnologos que quieren entender datos, modelos
                y decisiones desde el pregrado. Terminales interactivas, labs en
                vivo y desafios de codigo real.
              </p>
              <div className="flex flex-wrap gap-4">
                <SlideArrowButton href="/sign-up" text="Empezar ahora" size="lg" />
                <SlideArrowButton href="/sign-in" text="Iniciar sesión" size="lg" />
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
