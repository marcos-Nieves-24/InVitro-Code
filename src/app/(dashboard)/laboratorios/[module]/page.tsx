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
} from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { LabLandingHero } from "@/components/labs/landing/LabLandingHero";

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

  // Validate module exists
  const moduleDir = path.join(process.cwd(), "src/content/modules", modSlug);
  if (!fs.existsSync(moduleDir)) {
    notFound();
  }

  const supabase = createAdminClient();

  const [profileRes, progressRes] = await Promise.all([
    supabase.from("profiles").select("username, email, role, theme").eq("id", userId).maybeSingle(),
    supabase
      .from("progress")
      .select("module_slug, lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true)
      .not("completed_at", "is", null),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});

  const moduleName = getModuleDisplayName(modSlug);
  const description = getModuleDescription(modSlug) ?? `Laboratorio de ${moduleName}`;
  const lessonSlugs = getLessonSlugs(modSlug);
  const labCount = lessonSlugs.length;

  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  let completedCount = 0;
  for (const slug of lessonSlugs) {
    if (completedLessonKeys.has(`${modSlug}/${slug}`)) completedCount += 1;
  }

  let xpTotal = 0;
  for (const slug of lessonSlugs) {
    xpTotal += calcXpForLesson(modSlug, slug);
  }

  const eyebrow = `${moduleName} · ${labCount} laboratorios · ${xpTotal} XP`;

  // CTA: first incomplete → else first (Repasar when all done)
  let ctaSlug = lessonSlugs[0] ?? "";
  for (const slug of lessonSlugs) {
    if (!completedLessonKeys.has(`${modSlug}/${slug}`)) {
      ctaSlug = slug;
      break;
    }
  }
  const allCompleted = labCount > 0 && completedCount === labCount;
  const ctaHref = ctaSlug ? `/laboratorios/${modSlug}/${ctaSlug}` : "/laboratorios";
  const ctaLabel = allCompleted ? "Repasar" : "Empezar";

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

        {lessonSlugs.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Laboratorios incluidos</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {lessonSlugs.slice(0, 6).map((slug) => {
                const isCompleted = completedLessonKeys.has(`${modSlug}/${slug}`);
                return (
                  <li
                    key={slug}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      isCompleted
                        ? "bg-mint/20 text-ink border border-mint/30"
                        : "bg-surface-raised text-storm border border-surface-raised"
                    }`}
                  >
                    {slug.replace(/^lesson\d+_/, "").replace(/[-_]/g, " ")}
                  </li>
                );
              })}
              {lessonSlugs.length > 6 && (
                <li className="inline-flex items-center px-2 py-1 text-xs text-storm">
                  +{lessonSlugs.length - 6} más
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </InVitroShell>
  );
}
