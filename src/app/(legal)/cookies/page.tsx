import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies — InVitro-Code",
  description: "Solo cookies técnicas __clerk_* y almacenamiento local funcional. 0 analíticas, 0 publicitarias.",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">Índice</p>
          <nav className="mt-3 space-y-1.5">
            <a href="#tecnicas" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1. Técnicas</a>
            <a href="#local" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2. Local funcional</a>
            <a href="#noexiste" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3. No existen</a>
            <a href="#consent" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">4. Consentimiento</a>
          </nav>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Política de Cookies</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">0 tracking</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Solo lo necesario
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          No usamos analítica ni píxeles. Solo sesión y memoria local para que tus labs funcionen.
        </p>

        <div className="mt-6 rounded-xl border border-mint/20 bg-mint/[0.06] p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">Resumen para humanos</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">No hay <em>rechazar todo</em> porque no hay nada que rechazar. Solo cookies técnicas <code>__session</code>/<code>__clerk_*</code> y 3 <code>localStorage</code> funcionales. Sin analíticas, sin anuncios.</p>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-a:text-brand-800 mt-8">
          <h2 id="tecnicas">1. Cookies técnicas — estrictamente necesarias</h2>
          <div className="not-prose overflow-x-auto rounded-xl border border-surface-raised">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-wide text-storm"><tr><th className="px-4 py-2">Cookie</th><th className="px-4 py-2">Titular</th><th className="px-4 py-2">Duración</th><th className="px-4 py-2">Evidencia</th></tr></thead>
              <tbody className="divide-y divide-surface-raised">
                <tr><td className="px-4 py-2 font-mono font-medium text-ink">__session</td><td className="px-4 py-2 text-storm">Clerk (EE. UU.)</td><td className="px-4 py-2 text-storm">Sesión/1 año</td><td className="px-4 py-2 font-mono text-xs text-storm">layout.tsx:37</td></tr>
                <tr><td className="px-4 py-2 font-mono font-medium text-ink">__clerk_*</td><td className="px-4 py-2 text-storm">Clerk</td><td className="px-4 py-2 text-storm">Sesión</td><td className="px-4 py-2 font-mono text-xs text-storm">middleware.ts:1</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-storm">Art.9 exenta (estrictamente necesaria) + Art.26 informada. No hay <code>document.cookie</code> manual en <code>src/</code>.</p>

          <h2 id="local">2. Almacenamiento local funcional</h2>
          <div className="not-prose grid gap-3 md:grid-cols-2">
            {[
              { k: "lab-active-tab-*", s: "localStorage", d: "LabTabs.tsx:46" },
              { k: "lab-workspace-*", s: "localStorage", d: "LabWorkspace.tsx:53" },
              { k: "lab-onboarding-completed", s: "localStorage", d: "OnboardingController.tsx:95" },
              { k: "console-maximized-*", s: "sessionStorage", d: "ConsoleFrame.tsx:41" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="font-mono text-xs font-bold text-ink">{x.k}</p>
                <p className="mt-1 text-xs text-storm"><span className="rounded bg-surface-raised px-1.5 py-0.5 font-mono">{x.s}</span> · {x.d}</p>
              </div>
            ))}
          </div>

          <h2 id="noexiste">3. Analíticas y publicitarias — no existen</h2>
          <div className="not-prose rounded-xl border border-surface-raised bg-surface-card p-5">
            <div className="grid gap-2 text-sm text-storm">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> GA4 / GTM / Clarity / Hotjar — <strong className="text-ink">No detectado</strong> <span className="font-mono text-xs">grep gtag|GTM vacío</span></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Meta / TikTok / LinkedIn — <strong className="text-ink">No detectado</strong> <span className="font-mono text-xs">grep fbq vacío</span></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Server-side tracking — <strong className="text-ink">No detectado</strong></div>
            </div>
            <p className="mt-3 font-mono text-xs text-storm">src/app/layout.tsx:1-55 sin &lt;Script&gt; tracking · next.config.ts sin GTM · package.json sin @vercel/analytics</p>
          </div>

          <h2 id="consent">4. Consentimiento</h2>
          <p>No hay banner con <em>rechazar</em> porque no hay cookies que bloquear (V-01..V-05 N/A-Cumple en <code>cookies-audit.md: §4</code>). Revocación de localStorage: borrar datos de sitio en el navegador. Para datos server-side: <Link href="/privacidad">Privacidad §4</Link> (invitro.code@gmail.com, 10/15 días).</p>
        </div>
      </article>
    </div>
  );
}
