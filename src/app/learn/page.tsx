import Link from "next/link";
import { getModules } from "@/lib/content/modules";
import { BookOpen, ArrowRight, Compass } from "lucide-react";

export default function LearnIndexPage() {
  const modules = getModules();

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-mint">
            Expediciones
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Elige tu Expedición
          </h2>
          <p className="mt-1 text-storm">
            Cada módulo es una expedición hacia el dominio de la Inteligencia
            Artificial.
          </p>
        </div>
        <Compass className="hidden h-10 w-10 text-mint md:block" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => (
          <Link
            key={mod.slug}
            href={
              mod.firstLesson
                ? `/learn/${mod.slug}/${mod.firstLesson}`
                : `/learn/${mod.slug}`
            }
            className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-all hover:border-mint/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-fog/20 text-mint">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="eyebrow mb-1 text-[10px]">{mod.slug}</p>
            <h3 className="font-display text-lg font-semibold text-ink">
              {mod.title}
            </h3>
            <p className="mt-1 text-sm text-storm">
              {mod.lessonCount} lecciones
            </p>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-mint">
              Explorar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
