import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones — InVitro-Code",
  description: "Reglas de uso de InVitro-Code. Gratuito +18, Pyodide local, sin venta. NIT 700329113-7.",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">Índice</p>
          <nav className="mt-3 space-y-1">
            <a href="#objeto" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1. Objeto</a>
            <a href="#registro" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2. Registro</a>
            <a href="#uso" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3. Uso</a>
            <a href="#pi" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">4. Propiedad</a>
            <a href="#gratuidad" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">5. Gratuidad</a>
            <a href="#terminacion" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">6. Terminación</a>
          </nav>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Términos y Condiciones</span>
          <span className="font-mono text-xs text-storm">v1 · 6 oct 2026 · Gratuito +18</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Reglas claras, sin letra chica
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Al usar InVitro-Code aceptás estos Términos y nuestra <Link href="/privacidad" className="font-semibold text-brand-800">Privacidad</Link> y <Link href="/cookies" className="font-semibold text-brand-800">Cookies</Link>.
        </p>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-a:text-brand-800 mt-8">
          <h2 id="objeto">1. Objeto</h2>
          <p>Plataforma educativa gratuita para biotecnólogos que aprenden IA/ML con Python (<code>README.md:3</code>). Módulos <code>python/ia/estadistica/machine-learning</code> con MDX + labs Pyodide + quizzes.</p>

          <h2 id="registro">2. Registro y cuentas</h2>
          <p><strong>Clerk Inc. (EE. UU.)</strong> IdP único (<code>middleware.ts:18</code>). +18, una cuenta por persona, datos veraces. Sesión vía <code>__session</code>. Notificá a <a href="mailto:invitro.code@gmail.com">invitro.code@gmail.com</a> ante uso no autorizado.</p>

          <h2 id="uso">3. Uso permitido y prohibido</h2>
          <ul>
            <li>Labs: Python local vía Pyodide 0.25.0 (<code>worker.js:4-5</code>), <code>codeSnapshot</code> 8k en <code>lab_progress</code> (<code>migration.sql:315</code>). No pegues secretos.</li>
            <li>Gamificación: <code>progress/lab_progress/streaks</code> + rate-limit 100/15min (<code>rate-limit.ts:12</code>).</li>
            <li>Prohibido: vulnerar RLS (<code>migration.sql:52-335</code>), subir avatar no <code>jpg|png|webp 2MB</code> (<code>validateAvatar.ts</code>), spamear APIs.</li>
          </ul>

          <h2 id="pi">4. Propiedad intelectual</h2>
          <p>Código MIT (<code>LICENSE:1</code>) con excepción gsap Standard Free (<code>LICENSE:25</code>). Tipografías OFL (<code>layout.tsx:6-22</code>). 8 favicons Recraft C2PA + 12 Anymotion + 40 Spritecook — ver <Link href="/ia">IA</Link>.</p>

          <h2 id="gratuidad">5. Gratuidad, sin venta</h2>
          <div className="not-prose rounded-xl border border-mint/20 bg-mint/[0.06] p-4">
            <p className="text-sm font-bold text-ink">100% gratuito — sin venta, sin suscripciones</p>
            <p className="mt-1 font-mono text-xs text-storm">grep vacío stripe/paypal/checkout · package.json sin SDK pago · migration.sql sin subscriptions</p>
            <p className="mt-2 text-xs text-storm">No aplican retracto ni reversión (Ley 1480 Cap.V), sí deber de información veraz.</p>
          </div>

          <h2 id="terminacion">6. Terminación y supresión</h2>
          <p><code>DELETE /api/account</code> o <a href="mailto:invitro.code@gmail.com">invitro.code@gmail.com</a> (15 días). Cascada <code>lab_progress→profiles</code> + cron 24h (<code>vercel.json</code>) + <Link href="/privacidad#retencion">Retención DEFINIDA v1</Link>.</p>

          <h2>7. Responsabilidad y ley aplicable</h2>
          <p>As is (MIT <code>LICENSE:15</code>), depende de Vercel/Supabase/Clerk/jsDelivr. Certify stub <code>route.ts:22</code> no es título oficial. Ley Colombia (Ley 1480/1581/527), SIC/juzgados Medellín; LATAM base Colombia.</p>
        </div>
      </article>
    </div>
  );
}
