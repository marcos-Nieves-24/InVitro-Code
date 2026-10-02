import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import {
  getModuleDisplayName,
  getLessonSlugs,
  getLessonFrontmatter,
  getLabResumeTarget,
  type CompletionStatus,
  type LabProgressMap,
  type LabProgressEntry,
} from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { HeroWithConsole } from "@/components/shared/HeroWithConsole";
import { getProyectoHeroImage } from "@/lib/labs/heroImages";
import { getConsoleForModule } from "@/lib/labs/consoleForModule";
import { LabProgressRing } from "@/components/labs/LabProgressRing";
import { LabHistoryCard } from "@/components/labs/LabHistoryCard";

interface Props {
  params: Promise<{ module: string }>;
}

function getModuleDescription(slug: string): string | null {
  const metaPath = path.join(process.cwd(), "src/content/modules", slug, "module.json");
  try {
    const raw = fs.readFileSync(metaPath, "utf8");
    const json = JSON.parse(raw) as { description?: string };
    if (typeof json.description === "string" && json.description.trim().length > 0) {
      return json.description;
    }
  } catch {
    // fallback below
  }
  return null;
}

export default async function ProyectoModulePage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { module: modSlug } = await params;

  const moduleDir = path.join(process.cwd(), "src/content/modules", modSlug);
  if (!fs.existsSync(moduleDir)) {
    notFound();
  }

  const supabase = createAdminClient();

  const [profileRes, progressRes, labProgressRes] = await Promise.all([
    supabase.from("profiles").select("username, email, role, theme").eq("id", userId).maybeSingle(),
    supabase
      .from("progress")
      .select("module_slug, lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true)
      .not("completed_at", "is", null),
    supabase
      .from("lab_progress")
      .select("lesson_slug, completion_status, completion_date, last_position, updated_at")
      .eq("user_id", userId)
      .eq("module_slug", modSlug),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});

  const moduleName = getModuleDisplayName(modSlug);
  const description = getModuleDescription(modSlug) ?? `Proyecto de ${moduleName}`;
  const lessonSlugs = getLessonSlugs(modSlug);
  const labCount = lessonSlugs.length;

  // Build progressMap from lab_progress when available, fallback to progress
  const progressMap: LabProgressMap = new Map();
  const hasLabProgressRows =
    Array.isArray(labProgressRes.data) && labProgressRes.data.length > 0;

  if (hasLabProgressRows) {
    for (const row of labProgressRes.data as Array<{
      lesson_slug: string;
      completion_status: string;
      completion_date: string | null;
      last_position: unknown;
      updated_at: string;
    }>) {
      const status = row.completion_status as CompletionStatus;
      if (status !== "not_started" && status !== "in_progress" && status !== "completed") continue;
      progressMap.set(row.lesson_slug, {
        status,
        completion_date: row.completion_date,
        updated_at: row.updated_at,
        last_position: (row.last_position as Record<string, unknown>) ?? {},
      } as LabProgressEntry);
    }
  }

  // Fallback counters from legacy progress when lab_progress empty
  const completedLessonKeysFallback = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  let completedCount: number;
  if (hasLabProgressRows) {
    completedCount = 0;
    for (const slug of lessonSlugs) {
      if (progressMap.get(slug)?.status === "completed") completedCount += 1;
    }
  } else {
    completedCount = 0;
    for (const slug of lessonSlugs) {
      if (completedLessonKeysFallback.has(`${modSlug}/${slug}`)) completedCount += 1;
    }
  }

  let xpTotal = 0;
  for (const slug of lessonSlugs) {
    xpTotal += calcXpForLesson(modSlug, slug);
  }

  const progressPct = labCount === 0 ? 0 : Math.round((completedCount / labCount) * 100);

  const eyebrow = `${moduleName} · ${labCount} proyectos · ${xpTotal} XP`;

  // Smart resume CTA (paridad con laboratorios)
  const resume = getLabResumeTarget(modSlug, progressMap);
  const allCompleted = labCount > 0 && completedCount === labCount;

  let ctaHref: string;
  let ctaLabel: string;
  let showSingleCTA: boolean;

  if (hasLabProgressRows) {
    if (resume.case === 3 || resume.target === null) {
      showSingleCTA = false;
      ctaHref = "/proyectos";
      ctaLabel = "Repasar";
    } else {
      showSingleCTA = true;
      ctaHref = `/proyectos/${resume.target.moduleSlug}/${resume.target.lessonSlug}`;
      ctaLabel = resume.case === 1 ? "Continuar" : "Empezar";
    }
  } else {
    // Legacy behavior: first incomplete else Repasar
    let legacySlug = lessonSlugs[0] ?? "";
    for (const slug of lessonSlugs) {
      if (!completedLessonKeysFallback.has(`${modSlug}/${slug}`)) {
        legacySlug = slug;
        break;
      }
    }
    ctaHref = legacySlug ? `/proyectos/${modSlug}/${legacySlug}` : "/proyectos";
    ctaLabel = allCompleted ? "Repasar" : "Empezar";
    showSingleCTA = !allCompleted;
    if (allCompleted) {
      showSingleCTA = false;
    }
  }

  const bg = getProyectoHeroImage(modSlug);

  return (
    <InVitroShell userName={userName} userRole={profileRes.data?.role} theme={profileRes.data?.theme}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10">
        <Link
          href="/proyectos"
          className="mb-6 inline-flex items-center text-sm font-medium text-storm transition-colors hover:text-ink"
        >
          ← Volver a proyectos
        </Link>

        <HeroWithConsole
          backgroundSrc={bg}
          eyebrow={eyebrow}
          title={moduleName}
          description={description}
          cta={showSingleCTA ? { href: ctaHref, label: ctaLabel } : undefined}
          console={getConsoleForModule(modSlug)}
        />

        {/* Header: % progreso + ring (paridad labs) */}
        <div className="mt-6 flex items-center gap-3">
          <LabProgressRing completed={completedCount} total={labCount} size={36} strokeWidth={3} />
          <span className="text-sm font-semibold tabular-nums text-ink">{progressPct}% crecimiento</span>
          <span className="text-xs text-storm">
            {completedCount} de {labCount} proyectos completados
          </span>
        </div>

        {allCompleted && labCount > 0 ? (
          <div className="mt-4 rounded-xl border border-success-green/20 bg-success-green/[0.06] px-4 py-3">
            <p className="text-sm font-semibold text-success-green">¡Completaste todos los proyectos!</p>
            <p className="mt-1 text-xs text-storm">Elige un proyecto para repasar.</p>
          </div>
        ) : null}

        {/* History grid (paridad labs) */}
        {lessonSlugs.length > 0 ? (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Proyectos incluidos</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessonSlugs.map((slug) => {
                const fm = getLessonFrontmatter(modSlug, slug);
                const title = fm?.title ?? slug.replace(/^lesson\d+_/, "").replace(/[-_]/g, " ");
                const entry = progressMap.get(slug);
                let status: CompletionStatus;
                let completionDate: string | null = null;
                let updatedAt: string | null = null;
                if (entry) {
                  status = entry.status;
                  completionDate = entry.completion_date;
                  updatedAt = entry.updated_at;
                } else if (
                  completedLessonKeysFallback.has(`${modSlug}/${slug}`) &&
                  !hasLabProgressRows
                ) {
                  status = "completed";
                  updatedAt = null;
                } else {
                  status = "not_started";
                }
                const href = `/proyectos/${modSlug}/${slug}`;
                const isRepasar = !showSingleCTA && labCount > 0 && completedCount === labCount;
                return (
                  <LabHistoryCard
                    key={slug}
                    moduleSlug={modSlug}
                    lessonSlug={slug}
                    title={title}
                    status={status}
                    completionDate={completionDate}
                    updatedAt={updatedAt}
                    href={href}
                    isRepasar={isRepasar}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-surface-raised p-8 text-center">
            <p className="text-sm text-storm">Este módulo aún no tiene proyectos.</p>
          </div>
        )}
      </div>
    </InVitroShell>
  );
}
