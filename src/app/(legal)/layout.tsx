import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Centro Legal — InVitro-Code",
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Lab protocol header — signature element */}
      <div className="border-b border-surface-raised bg-surface">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3 md:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-negativo.svg" alt="InVitro-Code" className="h-6 w-6 invert" />
            <span className="font-display text-sm font-bold text-ink">InVitro-Code</span>
            <span className="hidden items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              Centro Legal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[11px] tracking-wide text-storm md:inline">
              NIT 700329113-7 · Altavista, Medellín
            </span>
            <Link
              href="/"
              className="rounded-full border border-surface-raised bg-surface-card px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-surface-raised"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>

      {/* Protocol stamp bar — lab notebook signature */}
      <div className="border-b border-mint/20 bg-mint/[0.04]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2 px-6 py-2.5 text-[11px] font-medium md:px-10">
          <span className="font-mono uppercase tracking-[0.14em] text-ink">Protocolo LGL-2026-10-06-v1</span>
          <span className="hidden h-3 w-px bg-surface-raised md:block" />
          <span className="flex items-center gap-1.5 text-storm">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Revisado · 6 oct 2026
          </span>
          <span className="hidden h-3 w-px bg-surface-raised md:block" />
          <span className="text-storm">Jurisdicción: Colombia · LATAM · +18</span>
          <Link href="/privacidad" className="ml-auto hidden text-xs font-semibold text-brand-800 underline decoration-mint/40 underline-offset-4 hover:text-ink md:inline">
            Ver Política de Privacidad →
          </Link>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-[1280px] px-6 py-10 md:px-10 md:py-12">
        {children}
      </main>

      <footer className="border-t border-surface-raised bg-surface-card px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 text-xs leading-relaxed text-storm md:flex-row md:items-center md:justify-between">
          <span>© 2026 InVitro-Code · Persona natural NIT 700329113-7 · invitro.code@gmail.com</span>
          <span className="font-mono text-[11px]">Protocolo LGL-2026-10-06-v1 · Revisado</span>
        </div>
      </footer>
    </div>
  );
}
