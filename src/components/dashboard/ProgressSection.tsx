import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";

export interface ProgressSectionProps {
  modules: { slug: string; name: string; totalLessons: number }[];
  completedByModule: Record<string, number>;
}

export function ProgressSection({ modules, completedByModule }: ProgressSectionProps) {
  if (modules.length === 0) return null;

  return (
    <section id="modules" className="scroll-mt-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Progreso de módulos</h2>
          <p className="text-sm text-storm">Tu avance real a través de las expediciones.</p>
        </div>
        <Link href="/learn" className="flex items-center gap-1 text-sm font-bold text-mint hover:underline">
          Ver expediciones <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="space-y-6">
          {modules.map((mod) => (
            <ModuleProgress
              key={mod.slug}
              moduleSlug={mod.slug}
              moduleName={mod.name}
              totalLessons={mod.totalLessons}
              initialCompletedLessons={completedByModule[mod.slug] ?? 0}
            />
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <a href="#progress" className="flex flex-col items-center gap-2 text-storm/60 transition-colors hover:text-mint">
          <span className="text-xs font-medium">Siguiente</span>
          <svg className="h-5 w-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
