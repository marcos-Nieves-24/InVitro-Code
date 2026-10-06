import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparencia IA InVitro Code",
  description: "No usamos inteligencia artificial generativa en producción Pyodide es Python local IA solo para favicons Recraft y animaciones",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">En esta página</p>
          <nav className="mt-3 space-y-1.5">
            <a href="#runtime" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1 Sin IA en producción</a>
            <a href="#offline" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2 IA para imágenes</a>
            <a href="#futuro" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3 Futuro</a>
          </nav>
          <div className="mt-5 rounded-lg bg-ink p-4 text-white">
            <p className="font-mono text-[11px] uppercase tracking-wide text-white/60">Estado</p>
            <p className="mt-1 text-sm font-bold">Cero IA generativa en producción</p>
            <p className="text-xs text-white/60">Python local y determinista</p>
          </div>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Transparencia IA</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">Python local</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Sin inteligencia generativa en producción
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Tus laboratorios ejecutan Python real en tu navegador No hay asistente que te califique ni modelo que tome decisiones por ti La inteligencia artificial que sí usamos está solo en los dibujos
        </p>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] mt-8">
          <h2 id="runtime">1 Sin IA en la experiencia de aprendizaje</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            {[
              { n: "Asistente virtual", s: "No disponible", e: "Sin chat integrado" },
              { n: "Modelo generativo", s: "No disponible", e: "Sin servicio externo" },
              { n: "Certificación automática", s: "Simulación", e: "Sin validación real" },
            ].map((c) => (
              <div key={c.n} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="text-sm font-bold text-ink">{c.n}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-success"><span className="h-2 w-2 rounded-full bg-success" /> {c.s}</p>
                <p className="mt-1 font-mono text-[11px] text-storm">{c.e}</p>
              </div>
            ))}
          </div>
          <p>Los laboratorios funcionan con Pyodide que ejecuta Python de forma local en tu navegador Es un entorno determinista y predecible No toma decisiones por ti Ejecuta el código que tú escribes La certificación que ves hoy es una simulación sin valor oficial</p>

          <h2 id="offline">2 Inteligencia artificial solo para imágenes</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">Ocho favicons</p>
              <p className="mt-1 text-sm font-bold text-ink">Recraft</p>
              <p className="mt-1 font-mono text-xs text-storm">Con sello de origen verificable</p>
            </div>
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">Doce animaciones</p>
              <p className="mt-1 text-sm font-bold text-ink">Anymotion</p>
              <p className="mt-1 font-mono text-xs text-storm">Modelo mimo versión 2 5</p>
            </div>
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">Cuarenta sprites</p>
              <p className="mt-1 text-sm font-bold text-ink">Spritecook</p>
              <p className="mt-1 font-mono text-xs text-storm">Paleta de laboratorio</p>
            </div>
          </div>
          <p><strong>Trazabilidad</strong> Los favicons originales conservan su sello de origen Las versiones optimizadas pueden haberlo perdido al comprimirse y por eso lo informamos aquí <strong>Conservación</strong> Las imágenes se guardan y versionan en nuestro repositorio <strong>Alcance</strong> La inteligencia artificial creó solo el recurso visual No el contenido educativo que está curado y citado con bibliografía académica</p>

          <h2 id="futuro">3 Si incorporamos inteligencia generativa</h2>
          <p>Si en el futuro activamos una función que use inteligencia generativa lo comunicaremos con claridad Indicaríamos en la interfaz que el contenido fue generado de forma automática quién es el proveedor cómo se conserva la información qué revisión humana existe y cuáles son sus limitaciones</p>

          <div className="not-prose mt-8 rounded-xl border border-brand-800/20 bg-brand-950 px-6 py-5 text-white">
            <p className="font-display font-bold">¿Tienes dudas sobre este punto?</p>
            <p className="mt-1 text-sm text-white/70">Escríbenos a <a href="mailto:invitro.code@gmail.com" className="font-semibold text-mint">invitro.code@gmail.com</a> Con gusto te explicamos cómo usamos cada herramienta</p>
          </div>
        </div>
      </article>
    </div>
  );
}
