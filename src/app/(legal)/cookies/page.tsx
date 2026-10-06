import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies InVitro Code",
  description: "Solo cookies técnicas y memoria local funcional Cero analítica cero publicidad",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">Índice</p>
          <nav className="mt-3 space-y-1.5">
            <a href="#tecnicas" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1 Técnicas</a>
            <a href="#local" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2 Memoria local</a>
            <a href="#noexiste" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3 No existen</a>
            <a href="#consent" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">4 Consentimiento</a>
          </nav>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Política de Cookies</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">Cero rastreo</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Solo lo necesario
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          No usamos analítica ni publicidad Solo lo imprescindible para que tu sesión y tus laboratorios funcionen
        </p>

        <div className="mt-6 rounded-xl border border-mint/20 bg-mint/[0.06] p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">Resumen claro</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">No hay un botón de rechazar todo porque no hay nada que rechazar Solo usamos cookies técnicas para tu sesión y memoria local para recordar tus pestañas Nada de analítica Nada de anuncios</p>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-a:text-brand-800 mt-8">
          <h2 id="tecnicas">1 Cookies técnicas totalmente necesarias</h2>
          <div className="not-prose overflow-x-auto rounded-xl border border-surface-raised">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-wide text-storm"><tr><th className="px-4 py-2">Cookie</th><th className="px-4 py-2">Titular</th><th className="px-4 py-2">Duración</th><th className="px-4 py-2">Origen</th></tr></thead>
              <tbody className="divide-y divide-surface-raised">
                <tr><td className="px-4 py-2 font-mono font-medium text-ink">__session</td><td className="px-4 py-2 text-storm">Clerk en Estados Unidos</td><td className="px-4 py-2 text-storm">Sesión</td><td className="px-4 py-2 font-mono text-xs text-storm">Sesión segura</td></tr>
                <tr><td className="px-4 py-2 font-mono font-medium text-ink">__clerk</td><td className="px-4 py-2 text-storm">Clerk</td><td className="px-4 py-2 text-storm">Sesión</td><td className="px-4 py-2 font-mono text-xs text-storm">Estado de acceso</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-storm">Estas cookies son imprescindibles para mantener tu sesión iniciada No requieren tu consentimiento previo pero te las informamos con transparencia</p>

          <h2 id="local">2 Memoria local para tu comodidad</h2>
          <div className="not-prose grid gap-3 md:grid-cols-2">
            {[
              { k: "Pestaña activa del laboratorio", s: "Memoria local", d: "Recuerda tu pestaña abierta" },
              { k: "Espacio de trabajo", s: "Memoria local", d: "Recuerda tu avance" },
              { k: "Tutorial completado", s: "Memoria local", d: "Evita repetir la guía" },
              { k: "Consola maximizada", s: "Memoria de sesión", d: "Recuerda el tamaño" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="font-mono text-xs font-bold text-ink">{x.k}</p>
                <p className="mt-1 text-xs text-storm"><span className="rounded bg-surface-raised px-1.5 py-0.5 font-mono">{x.s}</span> {x.d}</p>
              </div>
            ))}
          </div>

          <h2 id="noexiste">3 Analítica y publicidad No existen</h2>
          <div className="not-prose rounded-xl border border-surface-raised bg-surface-card p-5">
            <div className="grid gap-2 text-sm text-storm">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Analítica tipo Google Analytics No detectada</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Publicidad tipo Meta o TikTok No detectada</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Rastreo en servidor No detectado</div>
            </div>
            <p className="mt-3 font-mono text-xs text-storm">Hemos verificado el código completo y no encontramos herramientas de rastreo ni píxeles ni scripts de medición</p>
          </div>

          <h2 id="consent">4 Consentimiento</h2>
          <p>No mostramos un banner para rechazar cookies porque no hay cookies que bloquear La memoria local se puede borrar desde tu navegador cuando quieras Para tus datos en el servidor puedes ejercer tus derechos en <Link href="/privacidad">Privacidad</Link> escribiendo a invitro.code@gmail.com</p>
        </div>
      </article>
    </div>
  );
}
