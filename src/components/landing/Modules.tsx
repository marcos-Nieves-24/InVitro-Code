import { Reveal } from "@/components/Reveal";
import { OrbitalModules } from "./OrbitalModules";
import { getModules, getModuleShortDescription, getLessonSlugs, hasLab } from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { buildModuleCardModel } from "@/domain/module-card";

export function Modules() {
  const raw = getModules();
  const modules = raw.map((m) => {
    const slugs = getLessonSlugs(m.slug);
    const xpReward = slugs.reduce((sum, ls) => sum + calcXpForLesson(m.slug, ls), 0);
    const href = m.firstLesson ? `/learn/${m.slug}/${m.firstLesson}` : `/learn/${m.slug}`;
    // Real lab count (lab.md per lesson), not the lesson count: the badge says
    // "N labs", so the number must be labs, not lessons.
    const labCount = slugs.filter((s) => hasLab(m.slug, s)).length;
    const model = buildModuleCardModel({
      slug: m.slug,
      title: m.title,
      description: getModuleShortDescription(m.slug),
      lessonCount: m.lessonCount,
      labCount,
      xpReward,
      completed: null,
      total: null,
    });
    // OrbitalModules' ModuleData expects `lessons`; map from the canonical model.
    return { ...model, lessons: model.lessonCount, href };
  });

  return (
    <section
      id="modulos"
      className="relative overflow-hidden bg-[#F8FBFA] px-4 py-24 sm:px-6"
    >
      {/* Ambient decoration — isolated in its own clipped layer so the section's
          own scroll box never exceeds its client box (avoids excess scrollWidth). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full bg-[#DDF5EF]/60 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-[480px] w-[480px] rounded-full bg-[#DDF5EF]/45 blur-3xl max-md:right-0 max-md:bottom-0 max-md:h-[220px] max-md:w-[220px]" />
        <svg
          className="absolute top-10 right-[12%] h-[220px] w-[220px] opacity-50"
          viewBox="0 0 220 220"
          fill="none"
        >
          <path
            d="M 20 180 A 140 140 0 0 1 180 20"
            stroke="#DDF5EF"
            strokeWidth={0.9}
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="absolute bottom-10 left-[8%] h-[200px] w-[200px] opacity-50"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M 180 20 A 130 130 0 0 0 20 180"
            stroke="#DDF5EF"
            strokeWidth={0.9}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1280px] sm:px-2 md:px-4">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.22em] text-[#0AAE9A] uppercase">
              Contenido
            </p>
            <h2 className="font-display mt-3 mb-4 text-[32px] font-bold tracking-tight text-[#101B3D] md:text-[48px]">
              Expediciones del curso
            </h2>
            <p className="mx-auto max-w-[680px] text-[17px] leading-relaxed text-storm">
              Cada módulo es una expedición guiada que combina teoría, práctica
              en terminal y laboratorios interactivos.
            </p>
          </div>
        </Reveal>
        <OrbitalModules modules={modules} />
      </div>
    </section>
  );
}
