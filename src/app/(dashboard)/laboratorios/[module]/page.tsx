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
import { LabLandingHero } from "@/components/labs/landing/LabLandingHero";
import { LabHistoryCard } from "@/components/labs/LabHistoryCard";
import { LabProgressRing } from "@/components/labs/LabProgressRing";

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

export default async function LabModuleLandingPage({ params }: Props) {
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
    // Labs lifecycle: fetch lab_progress for this module (fallback to progress if empty)
    supabase
      .from("lab_progress")
      .select("lesson_slug, completion_status, completion_date, last_position, updated_at")
      .eq("user_id", userId)
      .eq("module_slug", modSlug),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});

  const moduleName = getModuleDisplayName(modSlug);
  const description = getModuleDescription(modSlug) ?? `Laboratorio de ${moduleName}`;
  const lessonSlugs = getLessonSlugs(modSlug).sort();
  const labCount = lessonSlugs.length;

  // Build progress map from lab_progress when available, fallback to progress
  const progressMap: LabProgressMap = new Map();
  const hasLabProgressRows = Array.isArray(labProgressRes.data) && labProgressRes.data.length > 0;

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

  // Smart resume CTA (REQ-LC-06..08)
  const resume = getLabResumeTarget(modSlug, progressMap);
  // When fallback (no lab_progress rows), getLabResumeTarget will scan missing as not_started → Caso 2, but completedCount already fallback-based.
  // If fallback and labCount>0 and completedCount covers all via legacy, override to case 3 presentation
  const allCompleted = labCount > 0 && completedCount === labCount;

  let ctaHref: string;
  let ctaLabel: string;
  let showSingleCTA: boolean;

  if (hasLabProgressRows) {
    if (resume.case === 3 || resume.target === null) {
      showSingleCTA = false;
      ctaHref = "/laboratorios";
      ctaLabel = "Repasar";
    } else {
      showSingleCTA = true;
      ctaHref = `/laboratorios/${resume.target.moduleSlug}/${resume.target.lessonSlug}`;
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
    ctaHref = legacySlug ? `/laboratorios/${modSlug}/${legacySlug}` : "/laboratorios";
    ctaLabel = allCompleted ? "Repasar" : "Empezar";
    showSingleCTA = !allCompleted;
    // For Caso 3 fallback, hide single CTA and show message + per-card Repasar
    if (allCompleted) {
      showSingleCTA = false;
    }
  }

  const eyebrow = `${moduleName} · ${labCount} laboratorios · ${xpTotal} XP`;

  return (
    <InVitroShell userName={userName} userRole={profileRes.data?.role} theme={profileRes.data?.theme}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10">
        <Link
          href="/laboratorios"
          className="mb-6 inline-flex items-center text-sm font-medium text-storm transition-colors hover:text-ink"
        >
          ← Volver a laboratorios
        </Link>

        <LabLandingHero
          moduleSlug={modSlug}
          title={moduleName}
          description={description}
          eyebrow={eyebrow}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />

        {/* Header: % progreso + ring (REQ-LC-04) */}
        <div className="mt-6 flex items-center gap-3">
          <LabProgressRing completed={completedCount} total={labCount} size={36} strokeWidth={3} />
          <span className="text-sm font-semibold tabular-nums text-ink">{progressPct}% crecimiento</span>
          <span className="text-xs text-storm">
            {completedCount} de {labCount} completados
          </span>
          {progressMap.size === 0 && labCount > 0 && !hasLabProgressRows && (
            <span className="sr-only">Datos desde progreso histórico</span>
          )}
        </div>

        {/* Smart resume CTA area (REQ-LC-06..08) */}
        {showSingleCTA ? (
          <div className="mt-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-mint px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mint/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
            >
              {ctaLabel}
            </Link>
          </div>
        ) : labCount > 0 && completedCount === labCount ? (
          <div className="mt-4 rounded-xl border border-success-green/20 bg-success-green/[0.06] px-4 py-3">
            <p className="text-sm font-semibold text-success-green">¡Completaste todos los laboratorios!</p>
            <p className="mt-1 text-xs text-storm">Elige un laboratorio para repasar.</p>
          </div>
        ) : null}

        {/* History grid (REQ-LC-04/05) */}
        {lessonSlugs.length > 0 ? (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Laboratorios incluidos</h2>
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
                } else if (completedLessonKeysFallback.has(`${modSlug}/${slug}`) && !hasLabProgressRows) {
                  status = "completed";
                  updatedAt = null;
                } else {
                  status = "not_started";
                }
                const href = `/laboratorios/${modSlug}/${slug}`;
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
            <p className="text-sm text-storm">Este módulo aún no tiene laboratorios.</p>
          </div>
        )}
      </div>
    </InVitroShell>
  );
}
