import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — InVitro-Code",
  description: "Cómo tratamos tus datos bajo Ley 1581. NIT 700329113-7. Retención DEFINIDA v1, transferencias EE. UU. con DPA, derechos art.8.",
};

const toc = [
  { id: "resumen", label: "Resumen" },
  { id: "responsable", label: "1. Responsable" },
  { id: "datos", label: "2. Qué tratamos" },
  { id: "bases", label: "3. Bases art.9/6/26" },
  { id: "derechos", label: "4. Derechos" },
  { id: "encargados", label: "5. Encargados EE. UU." },
  { id: "retencion", label: "6. Retención" },
];

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">En esta política</p>
          <nav className="mt-3 space-y-1.5">
            {toc.map((i) => (
              <a key={i.id} href={`#${i.id}`} className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">
                {i.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 rounded-lg bg-ink p-4 text-white">
            <p className="font-mono text-[11px] uppercase tracking-wide text-white/60">Versión</p>
            <p className="font-mono text-sm font-bold">2026-10-06-v1</p>
            <p className="mt-1 text-xs text-white/60">DEFINIDA v1 · RNBD</p>
          </div>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Política de Privacidad</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">DEFINIDA v1</span>
          <span className="font-mono text-xs text-storm">Lectura 6 min · Ley 1581</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Tus datos, bajo tu control
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Tratamos solo lo necesario para enseñarte IA/ML. Nada de venta, nada de tracking oculto. Acá ves qué guardamos, por qué y cuánto.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Base</p><p className="mt-1 text-sm font-bold text-ink">Art.9 + 6 + 26</p><p className="text-xs text-storm">conservable Ley 527</p></div>
          <div className="rounded-xl border border-surface-raised bg-surface-card p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Retención</p><p className="mt-1 text-sm font-bold text-ink">Vida cuenta +6m</p><p className="text-xs text-storm">codeSnapshot 60d</p></div>
          <div className="rounded-xl border border-surface-raised bg-surface-card p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Transferencia</p><p className="mt-1 text-sm font-bold text-ink">EE. UU. con DPA</p><p className="text-xs text-storm">Clerk/Supabase/Vercel</p></div>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-a:text-brand-800 hover:prose-a:text-ink mt-8">
          <h2 id="responsable">1. Responsable y contacto</h2>
          <p><strong>Persona natural Colombia — NIT 700329113-7</strong> — Corregimiento Altavista, Medellín. Contacto y canal art.8/14-15: <a href="mailto:invitro.code@gmail.com">invitro.code@gmail.com</a> (consultas 10 días, reclamos/supresión 15 días, <code>DELETE /api/account</code> + <code>user.deleted</code>).</p>

          <h2 id="datos">2. Qué datos tratamos (F-01..F-08)</h2>
          <div className="not-prose overflow-x-auto rounded-xl border border-surface-raised">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-wide text-storm"><tr><th className="px-4 py-2">Punto</th><th className="px-4 py-2">Datos</th><th className="px-4 py-2">Finalidad</th><th className="px-4 py-2">Retención</th></tr></thead>
              <tbody className="divide-y divide-surface-raised text-storm">
                <tr><td className="px-4 py-2 font-medium text-ink">F-01 Registro</td><td className="px-4 py-2">email, id sub, gender f/m/x</td><td className="px-4 py-2">Cuenta + login</td><td className="px-4 py-2">DEFINIDA v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">F-02 Perfil</td><td className="px-4 py-2">username, bio, gender x sensible</td><td className="px-4 py-2">Personalizar</td><td className="px-4 py-2">DEFINIDA v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">F-03 Avatar</td><td className="px-4 py-2">imagen jpg/png/webp 2MB</td><td className="px-4 py-2">Foto perfil</td><td className="px-4 py-2">Vida cuenta</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">F-04 Config</td><td className="px-4 py-2">theme, notification_prefs</td><td className="px-4 py-2">Preferencias</td><td className="px-4 py-2">DEFINIDA v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">F-05/06 Labs</td><td className="px-4 py-2">progress, lab_progress, codeSnapshot 8k</td><td className="px-4 py-2">Progreso + labs</td><td className="px-4 py-2">codeSnapshot 60d</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">F-08 Local</td><td className="px-4 py-2">localStorage lab-tabs</td><td className="px-4 py-2">UI sin servidor</td><td className="px-4 py-2">Navegador</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-storm">Fuente: data-inventory.md:38-46 DEFINIDA v1 · No tratamos checkout/newsletter/pixels/LLM runtime.</p>

          <h2 id="bases">3. Bases legales</h2>
          <ul>
            <li><strong>Art.9</strong> — autorización previa/expresa/informada conservable en <code>consent_logs(policy_version, hash, purposes, ip, created_at)</code> (<code>migration.sql:408-437</code> Ley 527).</li>
            <li><strong>Art.6</strong> — <code>gender=x</code> (<code>migration.sql:300</code>) facultativo, autorización explícita separada (<code>ProfileForm acceptGenderX</code>).</li>
            <li><strong>Art.26</strong> — transferencia EE. UU. con mención expresa + DPA/SCC (ver §5).</li>
          </ul>

          <h2 id="derechos">4. Derechos (art.8) — cómo ejercerlos</h2>
          <div className="not-prose rounded-xl border border-mint/20 bg-ink px-6 py-5 text-white">
            <p className="font-display font-bold">invitro.code@gmail.com — 10/15 días hábiles</p>
            <p className="mt-2 text-sm text-white/70">Consulta, rectificación, supresión, revocatoria. Alternativa: <code>DELETE /api/account</code> + <code>user.deleted</code> con cascada <code>lab_progress→progress→...→profiles</code> + cron 24h <code>vercel.json 0 3 * * *</code>. Reclamo ante SIC si no respondemos.</p>
          </div>

          <h2 id="encargados">5. Encargados y transferencias EE. UU.</h2>
          <div className="not-prose grid gap-3">
            {[
              { n: "Clerk Inc. (EE. UU.)", d: "IdP único", l: "clerk.com/legal/dpa" },
              { n: "Supabase (AWS EE. UU.)", d: "Postgres + Storage avatars", l: "supabase.com/legal/dpa" },
              { n: "Vercel Inc. (EE. UU.)", d: "Hosting + cron purga", l: "vercel.com/legal/dpa" },
            ].map((e) => (
              <div key={e.n} className="flex items-center justify-between rounded-xl border border-surface-raised bg-surface-card px-4 py-3">
                <div><p className="text-sm font-bold text-ink">{e.n}</p><p className="text-xs text-storm">{e.d}</p></div>
                <a href={`https://${e.l}`} className="text-xs font-semibold text-brand-800">DPA →</a>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-storm">Terceros técnicos sin datos: jsDelivr + PyPI solo sirven Pyodide (<code>worker.js:4-5</code>). Ver <Link href="/cookies">Cookies</Link>.</p>

          <h2 id="retencion">6. Retención y seguridad</h2>
          <p><strong>DEFINIDA v1 2026-10-06</strong> — vida cuenta +6m tras supresión + 24m inactividad → anonimizar + <code>codeSnapshot</code> 60d o al <code>completed</code>→{`{}`}. Logs según Encargado. Seguridad art.19: RLS <code>auth.jwt()-&gt;&gt;sub</code>, guard <code>admin.ts:11</code>, <code>validateAvatar</code>, rate-limit 100/15min. Ver <Link href="/aviso">Aviso Legal</Link>.</p>
        </div>
      </article>
    </div>
  );
}
