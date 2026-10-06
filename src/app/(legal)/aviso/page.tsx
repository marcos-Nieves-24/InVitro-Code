import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal InVitro Code",
  description: "Titular domicilio contacto y jurisdicción de InVitro Code NIT 700329113 7 Corregimiento Altavista Medellín Colombia",
};

const toc = [
  { id: "titular", label: "1 Titular" },
  { id: "objeto", label: "2 Objeto" },
  { id: "jurisdiccion", label: "3 Jurisdicción" },
  { id: "hosting", label: "4 Infraestructura" },
  { id: "propiedad", label: "5 Propiedad intelectual" },
  { id: "contacto", label: "6 Contacto" },
];

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
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
            <p className="mt-1 font-mono text-xs text-storm">LGL 2026 10 06 v1</p>
            <p className="mt-2 text-xs leading-relaxed text-storm">NIT 700329113 7 Altavista Medellín</p>
          </div>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Protocolo LGL Aviso Legal</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">v1 6 oct 2026</span>
          <span className="font-mono text-xs text-storm">Lectura 2 min</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Aviso Legal
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Te contamos quién está detrás de InVitro Code donde estamos y qué reglas nos guían Queremos que todo quede claro desde el inicio
        </p>

        <div className="mt-6 rounded-xl border border-mint/20 bg-mint/[0.06] p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">En pocas palabras</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            InVitro Code es un espacio gratuito para aprender inteligencia artificial y aprendizaje automático con Python Pensado para estudiantes de biotecnología Lo impulsa una persona natural en Colombia con NIT 700329113 7 No vendemos cursos ni suscripciones Tratamos tus datos con respeto bajo la Ley 1581 y solo los compartimos con servicios en Estados Unidos cuando nos das tu autorización
          </p>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-ink/90 prose-a:text-brand-800 prose-a:underline prose-a:decoration-mint/40 hover:prose-a:text-ink prose-li:text-storm mt-8">
          <h2 id="titular">1 Titular y responsable</h2>
          <div className="not-prose rounded-xl border border-surface-raised bg-surface-card p-5">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Titular</span><span className="text-storm">Persona natural en Colombia con NIT 700329113 7</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Domicilio</span><span className="text-storm">Corregimiento Altavista Medellín</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Contacto legal</span><a href="mailto:invitro.code@gmail.com" className="font-semibold text-brand-800">invitro.code@gmail.com</a></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Actividad</span><span className="text-storm">Plataforma educativa totalmente gratuita</span></div>
              <div className="flex justify-between gap-4"><span className="font-semibold text-ink">Público</span><span className="text-storm">Mayores de 18 años No dirigido a menores</span></div>
            </div>
          </div>

          <h2 id="objeto">2 Objeto del sitio</h2>
          <p>
            InVitro Code ofrece módulos de Python inteligencia artificial estadística y aprendizaje automático con lecciones en formato MDX laboratorios que ejecutan Python de forma local en tu navegador mediante Pyodide y actividades de gamificación para seguir tu progreso El acceso requiere registro a través de Clerk que valida tu identidad de manera segura
          </p>

          <h2 id="jurisdiccion">3 Jurisdicción y ley aplicable</h2>
          <ul>
            <li><strong>Ancla Colombia</strong> Nos regimos por la Ley 1581 el Decreto 1377 y el Decreto 1074 la Ley 527 la Ley 1480 en lo que aplica por gratuidad y la Ley 23 con la Decisión 351 para propiedad intelectual</li>
            <li><strong>Alcance regional</strong> Nuestra base está en Colombia pero el servicio llega a toda Latinoamérica Si estás fuera de Colombia también puedes invocar la norma que te protege en tu país</li>
            <li><strong>Autoridad de control</strong> Superintendencia de Industria y Comercio a través del Registro Nacional de Bases de Datos</li>
          </ul>

          <h2 id="hosting">4 Infraestructura</h2>
          <div className="not-prose grid gap-3 md:grid-cols-3">
            {[
              { k: "Hosting", v: "Vercel en Estados Unidos", d: "Infraestructura moderna y escalable" },
              { k: "Base de datos", v: "Supabase en Estados Unidos", d: "Seguridad por filas según tu identidad" },
              { k: "Identidad", v: "Clerk en Estados Unidos", d: "Validación segura con firma" },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-surface-raised bg-surface-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-storm">{c.k}</p>
                <p className="mt-1 text-sm font-bold text-ink">{c.v}</p>
                <p className="mt-1 font-mono text-[11px] text-storm">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-storm">Los servicios de descarga de código como jsDelivr y PyPI solo entregan el entorno de Python No reciben tus datos personales</p>

          <h2 id="propiedad">5 Propiedad intelectual</h2>
          <p>Los contenidos de las lecciones son de nuestra autoría salvo la bibliografía que citamos como referencia académica El código del sitio está bajo licencia MIT con una excepción para la librería de animación gsap Las tipografías se sirven desde nuestro propio servidor Los elementos visuales generados con inteligencia artificial se informan con transparencia en la sección de <Link href="/ia">Transparencia IA</Link></p>

          <h2 id="contacto">6 Contacto y reclamaciones</h2>
          <div className="not-prose rounded-xl border border-brand-800/20 bg-brand-950 px-6 py-5 text-white">
            <p className="font-display text-lg font-bold">invitro.code@gmail.com</p>
            <p className="mt-1 text-sm text-white/70">Escríbenos para consultas reclamos o solicitudes de supresión Respondemos en los plazos que marca la ley y gestionamos la eliminación de tu cuenta de forma completa Puedes revisar los detalles de retención en <Link href="/privacidad" className="text-mint">Privacidad</Link></p>
          </div>
        </div>
      </article>
    </div>
  );
}
