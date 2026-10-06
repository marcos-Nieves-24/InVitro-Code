import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal — InVitro-Code",
  description: "Titular, domicilio, contacto y jurisdicción de InVitro-Code. NIT 700329113-7, Corregimiento Altavista, Medellín, Colombia.",
};

const toc = [
  { id: "titular", label: "1. Titular" },
  { id: "objeto", label: "2. Objeto" },
  { id: "jurisdiccion", label: "3. Jurisdicción" },
  { id: "hosting", label: "4. Hosting" },
  { id: "propiedad", label: "5. Propiedad intelectual" },
  { id: "contacto", label: "6. Contacto" },
];

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      {/* TOC — sticky lab index */}
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">En esta página</p>
          <nav className="mt-3 space-y-1.5">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm transition-colors hover:bg-surface-raised hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 rounded-lg bg-mint/10 p-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">Protocolo</p>
            <p className="mt-1 font-mono text-xs text-storm">LGL-2026-10-06-v1</p>
            <p className="mt-2 text-xs leading-relaxed text-storm">NIT 700329113-7 · Altavista, Medellín</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Protocolo LGL — Aviso Legal</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">v1 · 6 oct 2026</span>
          <span className="font-mono text-xs text-storm">Lectura 2 min</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Aviso Legal
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Quién está detrás de InVitro-Code, desde dónde opera y bajo qué reglas. Sin letra chica escondida.
        </p>

        {/* Summary — plain language */}
        <div className="mt-6 rounded-xl border border-mint/20 bg-mint/[0.06] p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">En pocas palabras</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            InVitro-Code es una plataforma educativa gratuita para biotecnólogos que aprenden IA/ML con Python. La opera una persona natural en Colombia (NIT 700329113-7). No vendemos, no suscribimos. Tus datos se tratan bajo Ley 1581 y viajan a EE. UU. (Clerk/Supabase/Vercel) con tu autorización.
          </p>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-ink/90 prose-a:text-brand-800 prose-a:underline prose-a:decoration-mint/40 hover:prose-a:text-ink prose-li:text-storm mt-8">
          <h2 id="titular">1. Titular y responsable</h2>
          <div className="not-prose rounded-xl border border-surface-raised bg-surface-card p-5">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Titular</span><span className="text-storm">Persona natural — Colombia — NIT 700329113-7</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Domicilio</span><span className="text-storm">Corregimiento Altavista, Medellín</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Contacto legal</span><a href="mailto:invitro.code@gmail.com" className="font-semibold text-brand-800">invitro.code@gmail.com</a></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Actividad</span><span className="text-storm">Plataforma educativa 100% gratuita</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Público</span><span className="text-storm">+18, no dirigido a menores</span></div>
            </div>
            <p className="mt-3 font-mono text-[11px] text-storm">Evidencia: project-classification.md:9-11 · supabase-migration.sql:4-7</p>
          </div>

          <h2 id="objeto">2. Objeto del sitio</h2>
          <p>
            InVitro-Code (<code>package.json:2</code> <code>invitro-code</code>) ofrece módulos <code>python</code>, <code>ia</code>, <code>estadistica</code>, <code>machine-learning</code> con lecciones MDX (<code>src/content/modules/**/lesson.md</code>), labs 100% locales vía Pyodide 0.25.0 (<code>public/pyodide-worker.js:4-5</code>), quizzes y gamificación (<code>progress</code>, <code>streaks</code> en <code>supabase-migration.sql:65-360</code>). El acceso requiere registro vía Clerk (<code>middleware.ts:18</code>).
          </p>

          <h2 id="jurisdiccion">3. Jurisdicción y ley aplicable</h2>
          <ul>
            <li><strong>Ancla: Colombia</strong> — Ley 1581, Decreto 1377/1074, Ley 527, Ley 1480 (atenuada por gratuidad), Ley 23 + Decisión 351.</li>
            <li><strong>Alcance:</strong> LATAM, base Colombia. Usuarios fuera de Colombia pueden invocar norma local imperativa.</li>
            <li><strong>Autoridad:</strong> Superintendencia de Industria y Comercio (SIC) — RNBD.</li>
          </ul>

          <h2 id="hosting">4. Hosting e infraestructura</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            {[
              { k: "Hosting", v: "Vercel Inc. (EE. UU.)", d: "next.config.ts:4 standalone" },
              { k: "DB/Storage", v: "Supabase (AWS EE. UU.)", d: "RLS auth.jwt()->>sub" },
              { k: "IdP", v: "Clerk Inc. (EE. UU.)", d: "clerkMiddleware + svix" },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-storm">{c.k}</p>
                <p className="mt-1 text-sm font-bold text-ink">{c.v}</p>
                <p className="mt-1 font-mono text-[11px] text-storm">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-storm">CDN jsDelivr + PyPI solo sirven runtime (no datos personales) — P-04/P-05.</p>

          <h2 id="propiedad">5. Propiedad intelectual</h2>
          <p>Contenido de lecciones del titular, salvo bibliografía <code>references.bib</code>. Código MIT (<code>LICENSE:1</code>) con excepción gsap Standard Free (<code>LICENSE:25</code>). Tipografías OFL self-hosted (<code>layout.tsx:6-22</code>). 8 favicons Recraft C2PA + 12 Anymotion + ~40 Spritecook — ver <Link href="/ia">Transparencia IA</Link>.</p>

          <h2 id="contacto">6. Contacto y reclamaciones</h2>
          <div className="not-prose rounded-xl border border-brand-800/20 bg-brand-950 px-6 py-5 text-white">
            <p className="font-display text-lg font-bold">invitro.code@gmail.com</p>
            <p className="mt-1 text-sm text-white/70">Consultas, reclamos art.15 (15 días), supresión art.8 (15 días, DELETE /api/account + user.deleted) y reporte de contenido. Retención según <Link href="/privacidad" className="text-mint">Privacidad §7</Link>.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
