import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones InVitro Code",
  description: "Reglas de uso de InVitro Code Gratuito para mayores de 18 años con Python y ciencia de datos NIT 700329113 7",
};

export default function Page() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-xl border border-surface-raised bg-surface-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-storm">Índice</p>
          <nav className="mt-3 space-y-1">
            <a href="#objeto" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">1 Objeto</a>
            <a href="#registro" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">2 Registro</a>
            <a href="#uso" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">3 Uso</a>
            <a href="#pi" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">4 Propiedad</a>
            <a href="#gratuidad" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">5 Gratuidad</a>
            <a href="#terminacion" className="block rounded-md px-2 py-1.5 text-sm font-medium text-storm hover:bg-surface-raised hover:text-ink">6 Cierre</a>
          </nav>
        </div>
      </aside>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">Términos y Condiciones</span>
          <span className="font-mono text-xs text-storm">v1 6 oct 2026 Gratuito para mayores de 18</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Reglas claras sin letra pequeña
          <span className="mt-2 block h-1 w-16 rounded-full bg-mint" />
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-storm">
          Al usar InVitro Code aceptas estos términos y también nuestra <Link href="/privacidad" className="font-semibold text-brand-800">Privacidad</Link> y <Link href="/cookies" className="font-semibold text-brand-800">Cookies</Link>
        </p>

        <div className="prose max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-10 prose-h2:text-xl prose-p:text-[15px] prose-a:text-brand-800 mt-8">
          <h2 id="objeto">1 Objeto</h2>
          <p>Plataforma gratuita para aprender ciencia de datos aplicada a biotecnología con Python y experimentos interactivos Cada módulo combina teoría práctica en terminal y laboratorios guiados</p>

          <h2 id="registro">2 Registro y cuentas</h2>
          <p>El acceso se gestiona a través de Clerk que valida tu identidad de forma segura Debes ser mayor de 18 años usar datos reales y mantener tu contraseña a buen resguardo Si notas un uso extraño avísanos de inmediato en <a href="mailto:invitro.code@gmail.com">invitro.code@gmail.com</a></p>

          <h2 id="uso">3 Uso permitido</h2>
          <ul>
            <li>Los laboratorios ejecutan Python directamente en tu navegador y guardan tu avance de forma temporal Te pedimos no compartir secretos o claves en el editor</li>
            <li>Tu progreso y tus rachas se registran para acompañar tu aprendizaje con límites razonables para evitar abusos</li>
            <li>No intentes vulnerar la seguridad subir archivos que no sean imágenes permitidas o saturar nuestros servicios con peticiones automáticas</li>
          </ul>

          <h2 id="pi">4 Propiedad intelectual</h2>
          <p>El código del sitio está bajo licencia MIT con una excepción para la librería de animación Las tipografías se sirven desde nuestro servidor Las lecciones son de nuestra autoría salvo la bibliografía académica que citamos Los elementos visuales generados con apoyo de inteligencia artificial se detallan con transparencia en <Link href="/ia">Transparencia IA</Link></p>

          <h2 id="gratuidad">5 Gratuidad sin venta</h2>
          <div className="not-prose rounded-xl border border-mint/20 bg-mint/[0.06] p-4">
            <p className="text-sm font-bold text-ink">Todo el servicio es gratuito No vendemos ni suscribimos</p>
            <p className="mt-1 text-xs text-storm">No hay carrito ni pasarela de pago ni planes de suscripción Por ello no aplican figuras como retracto o devolución pero sí nuestro compromiso de brindar información veraz</p>
          </div>

          <h2 id="terminacion">6 Cierre y supresión</h2>
          <p>Puedes eliminar tu cuenta cuando quieras desde tu perfil o escribiéndonos a nuestro correo La eliminación es completa y trazable con borrado en cascada y purga programada Puedes revisar cómo conservamos la información en <Link href="/privacidad">Privacidad</Link></p>

          <h2>7 Responsabilidad y ley aplicable</h2>
          <p>El servicio se ofrece tal cual depende de proveedores como Vercel Supabase y Clerk y requiere conexión para los laboratorios La función de certificación es una simulación sin valor oficial Nos regimos por la normativa colombiana y atendemos tus reclamos con celeridad ante la autoridad competente</p>
        </div>
      </article>
    </div>
  );
}
