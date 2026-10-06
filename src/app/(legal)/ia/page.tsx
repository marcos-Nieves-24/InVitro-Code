import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparencia IA — InVitro-Code",
  description: "No usamos IA generativa en producción. Pyodide es Python local. IA offline solo para 8 favicons Recraft, 12 Anymotion, 40 Spritecook.",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">En esta página</p>
          <nav className="mt-3 space-y-1.5">
            <a href="#runtime" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1. Runtime — No LLM</a>
            <a href="#offline" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2. IA offline — Sí</a>
            <a href="#futuro" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3. Futuro E2B</a>
          </nav>
          <div className="mt-5 rounded-lg bg-ink p-4 text-white">
            <p className="font-mono text-[11px] uppercase tracking-wide text-white/60">Estado</p>
            <p className="mt-1 text-sm font-bold">0 LLM en prod</p>
            <p className="text-xs text-white/60">Pyodide local determinista</p>
          </div>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Transparencia IA</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">Pyodide ≠ IA generativa</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Sin IA generativa en producción
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Tus labs corren Python real en tu navegador. No hay chatbot, no hay LLM calificándote. La IA que sí usamos está solo en los dibujitos.
        </p>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] mt-8">
          <h2 id="runtime">1. Runtime — No LLM, no generación</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            {[
              { n: "Chatbot/Agente", s: "No detectado", e: "grep chatbot vacío" },
              { n: "LLM runtime", s: "No detectado", e: "package.json sin openai" },
              { n: "certify E2B", s: "Stub inactivo", e: "FEATURE_FLAG false" },
            ].map((c) => (
              <div key={c.n} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="text-sm font-bold text-ink">{c.n}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-success"><span className="h-2 w-2 rounded-full bg-success" /> {c.s}</p>
                <p className="mt-1 font-mono text-[11px] text-storm">{c.e}</p>
              </div>
            ))}
          </div>
          <p>Pyodide 0.25.0 + <code>numpy/scikit-learn/scipy</code> en <code>public/pyodide-worker.js:4-5,56-82</code> vía <code>worker.ts:65</code> Web Worker es <strong>CPython WASM determinista local</strong> — no es IA generativa (7 razones en <code>ai-audit.md:113</code>). <code>package.json:18-47</code> sin SDK LLM. <code>certify</code> es stub sin sandbox.</p>

          <h2 id="offline">2. IA offline para assets — Sí, declarada</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">8 favicons</p>
              <p className="mt-1 text-sm font-bold text-ink">Recraft AI</p>
              <p className="mt-1 font-mono text-xs text-storm">C2PA Created by Recraft AI · favicon.svg:1</p>
            </div>
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">12 animaciones</p>
              <p className="mt-1 text-sm font-bold text-ink">Anymotion mimo-v2.5</p>
              <p className="mt-1 font-mono text-xs text-storm">project.json:5 · animations.json</p>
            </div>
            <div className="rounded-xl border border-surface-raised bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-storm">~40 sprites</p>
              <p className="mt-1 text-sm font-bold text-ink">Spritecook</p>
              <p className="mt-1 font-mono text-xs text-storm">lab-palette.json:1</p>
            </div>
          </div>
          <p><strong>Identificación:</strong> favicons fuente con C2PA; derivados pueden haber perdido C2PA al optimizar. <strong>Retención:</strong> versionados en <code>public/</code> git. <strong>Fallo:</strong> Rive placeholder → SVG (<code>RiveBioreactor.tsx:76</code>).</p>

          <h2 id="futuro">3. Si activamos IA generativa (E2B)</h2>
          <p>Si <code>FEATURE_FLAG_CERTIFY=true</code> con E2B sandbox (<code>certify/route.ts:39-43</code>), se publicará <code>2026-10-06-v2</code> con: identificación UI “generado por IA”, proveedor E2B + DPA, retención del <code>code</code> enviado, escalado humano, logging, fallback y limitaciones.</p>

          <div className="not-prose mt-8 rounded-xl border border-brand-800/20 bg-brand-950 px-6 py-5 text-white">
            <p className="font-display font-bold">¿Dudas sobre IA?</p>
            <p className="mt-1 text-sm text-white/70">Escríbenos a <a href="mailto:invitro.code@gmail.com" className="font-semibold text-mint">invitro.code@gmail.com</a> — base no es tratamiento de datos del titular.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
