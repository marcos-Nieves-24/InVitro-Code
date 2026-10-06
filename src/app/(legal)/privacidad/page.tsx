import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad InVitro Code",
  description: "Cómo tratamos tus datos bajo Ley 1581 NIT 700329113 7 Retención definida transferencias a Estados Unidos con DPA derechos art 8",
};

const toc = [
  { id: "responsable", label: "1 Responsable" },
  { id: "datos", label: "2 Qué tratamos" },
  { id: "bases", label: "3 Bases legales" },
  { id: "derechos", label: "4 Tus derechos" },
  { id: "encargados", label: "5 Encargados" },
  { id: "retencion", label: "6 Retención" },
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
            <p className="font-mono text-sm font-bold">2026 10 06 v1</p>
            <p className="mt-1 text-xs text-white/60">Definida v1 y registrable</p>
          </div>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Política de Privacidad</span>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">Definida v1</span>
          <span className="font-mono text-xs text-storm">Lectura 6 min Ley 1581</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Tus datos bajo tu control
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Tratamos solo lo necesario para enseñarte ciencia de datos aplicada a biotecnología Nada de venta Nada de rastreo oculto Aquí te mostramos con claridad qué guardamos por qué lo hacemos y durante cuánto tiempo
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-mint/20 bg-mint/[0.06] p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Base legal</p><p className="mt-1 text-sm font-bold text-ink">Art 9 y 6 y 26</p><p className="text-xs text-storm">Conservable según Ley 527</p></div>
          <div className="rounded-xl border border-surface-raised bg-surface-card p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Retención</p><p className="mt-1 text-sm font-bold text-ink">Vida de la cuenta más 6 meses</p><p className="text-xs text-storm">Código 60 días</p></div>
          <div className="rounded-xl border border-surface-raised bg-surface-card p-4"><p className="font-mono text-[11px] uppercase tracking-wide text-storm">Transferencia</p><p className="mt-1 text-sm font-bold text-ink">Estados Unidos con DPA</p><p className="text-xs text-storm">Clerk Supabase Vercel</p></div>
        </div>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-p:leading-relaxed prose-a:text-brand-800 hover:prose-a:text-ink mt-8">
          <h2 id="responsable">1 Responsable y contacto</h2>
          <p><strong>Persona natural en Colombia con NIT 700329113 7</strong> ubicada en Corregimiento Altavista Medellín Nuestro canal único para consultas reclamos y solicitudes de supresión es <a href="mailto:invitro.code@gmail.com">invitro.code@gmail.com</a> Respondemos dentro de los plazos que marca la ley y gestionamos la revocatoria de tu autorización cuando nos lo pidas</p>

          <h2 id="datos">2 Qué datos tratamos</h2>
          <div className="not-prose overflow-x-auto rounded-xl border border-surface-raised">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised text-xs uppercase tracking-wide text-storm"><tr><th className="px-4 py-2">Punto</th><th className="px-4 py-2">Datos</th><th className="px-4 py-2">Para qué</th><th className="px-4 py-2">Tiempo</th></tr></thead>
              <tbody className="divide-y divide-surface-raised text-storm">
                <tr><td className="px-4 py-2 font-medium text-ink">Registro</td><td className="px-4 py-2">Correo identidad y género opcional</td><td className="px-4 py-2">Crear tu cuenta</td><td className="px-4 py-2">Definida v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">Perfil</td><td className="px-4 py-2">Nombre biografía y género sensible</td><td className="px-4 py-2">Personalizar tu experiencia</td><td className="px-4 py-2">Definida v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">Avatar</td><td className="px-4 py-2">Imagen en formato jpg png o webp hasta 2 MB</td><td className="px-4 py-2">Tu foto de perfil</td><td className="px-4 py-2">Vida de la cuenta</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">Configuración</td><td className="px-4 py-2">Tema y preferencias de notificación</td><td className="px-4 py-2">Recordar tus ajustes</td><td className="px-4 py-2">Definida v1</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">Progreso</td><td className="px-4 py-2">Avance en lecciones y laboratorios</td><td className="px-4 py-2">Medir tu aprendizaje</td><td className="px-4 py-2">Código 60 días</td></tr>
                <tr><td className="px-4 py-2 font-medium text-ink">Local</td><td className="px-4 py-2">Memoria local del navegador</td><td className="px-4 py-2">Recordar pestañas</td><td className="px-4 py-2">En tu navegador</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-storm">No tratamos pagos ni boletines ni analítica ni asistentes con inteligencia artificial en el servidor</p>

          <h2 id="bases">3 Bases legales</h2>
          <ul>
            <li><strong>Autorización previa</strong> Guardamos tu autorización de forma segura con versión de esta política y registro de fecha y contenido aceptado según la Ley 527</li>
            <li><strong>Dato sensible</strong> El género no binario requiere tu autorización expresa y separada Es opcional y no condiciona tu acceso al servicio</li>
            <li><strong>Transferencia internacional</strong> Cuando tus datos viajan a Estados Unidos te informamos con claridad el país de destino y lo respaldamos con acuerdos de protección</li>
          </ul>

          <h2 id="derechos">4 Tus derechos y cómo ejercerlos</h2>
          <div className="not-prose rounded-xl border border-mint/20 bg-ink px-6 py-5 text-white">
            <p className="font-display font-bold">invitro.code@gmail.com Respuesta en 10 a 15 días hábiles</p>
            <p className="mt-2 text-sm text-white/70">Puedes consultar actualizar rectificar o solicitar la supresión de tus datos También puedes revocar tu autorización en cualquier momento desde tu cuenta o escribiéndonos La eliminación se hace de forma completa y trazable con borrado en nuestros sistemas y en los servicios asociados</p>
          </div>

          <h2 id="encargados">5 Encargados y transferencias a Estados Unidos</h2>
          <div className="not-prose grid gap-3">
            {[
              { n: "Clerk en Estados Unidos", d: "Gestión de identidad y acceso", l: "clerk.com/legal/dpa" },
              { n: "Supabase en Estados Unidos", d: "Base de datos y almacenamiento de imágenes", l: "supabase.com/legal/dpa" },
              { n: "Vercel en Estados Unidos", d: "Hosting y purga programada", l: "vercel.com/legal/dpa" },
            ].map((e) => (
              <div key={e.n} className="flex items-center justify-between rounded-xl border border-surface-raised bg-surface-card px-4 py-3">
                <div><p className="text-sm font-bold text-ink">{e.n}</p><p className="text-xs text-storm">{e.d}</p></div>
                <a href={`https://${e.l}`} className="text-xs font-semibold text-brand-800">Ver DPA</a>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-storm">Los servicios de descarga de código no reciben tus datos personales Solo entregan el entorno de Python Ver <Link href="/cookies">Cookies</Link></p>

          <h2 id="retencion">6 Retención y seguridad</h2>
          <p><strong>Definida v1 del 6 de octubre de 2026</strong> Conservamos tus datos mientras tu cuenta esté activa y seis meses después de una solicitud de supresión Los datos de inactividad prolongada se anonimizan El código temporal de los laboratorios se purga a los sesenta días Las medidas de seguridad incluyen validación estricta de imágenes y control de acceso por tu identidad Para más detalle revisa el <Link href="/aviso">Aviso Legal</Link></p>
        </div>
      </article>
    </div>
  );
}
