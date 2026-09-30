import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Compass } from "lucide-react";
import { getModules, getModuleDisplayName, getModuleShortDescription, getLessonSlugs, getModuleOrder } from "@/lib/content/modules";
import { getLabCardTheme, toSerializableTheme } from "@/components/labs/LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { ModuleCardContent } from "@/components/shared/ModuleCardContent";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LearnIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await auth();
  if (!userId) {
    const sp = searchParams ? await searchParams : undefined;
    const qs = sp
      ? new URLSearchParams(
          Object.entries(sp).flatMap(([k, v]) =>
            v == null ? [] : Array.isArray(v) ? v.map((e) => [k, e]) : [[k, v as string]],
          ),
        ).toString()
      : "";
    const fullPath = `/learn${qs ? `?${qs}` : ""}`;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(fullPath)}`);
  }

  const supabase = createAdminClient();
  const [progressRes] = await Promise.all([
    supabase.from("progress").select("module_slug,lesson_slug").eq("user_id", userId).eq("completed", true).not("completed_at", "is", null),
  ]);

  const completedLessonKeys = new Set(
    (progressRes.data ?? []).map((row) => `${row.module_slug}/${row.lesson_slug}`),
  );

  const modules = getModules();
  const sorted = [...modules].sort((a, b) => {
    const oa = getModuleOrder(a.slug);
    const ob = getModuleOrder(b.slug);
    if (oa !== ob) return oa - ob;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-mint">Expediciones</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">Elige tu Expedición</h2>
          <p className="mt-1 text-storm">Cada módulo es una expedición hacia el dominio de la Inteligencia Artificial.</p>
        </div>
        <Compass className="hidden h-10 w-10 text-mint md:block" />
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-sm font-bold text-ink">No hay expediciones disponibles</p>
          <p className="text-xs text-storm">
            Agrega contenido en <code>src/content/modules/</code> para empezar.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((mod) => {
            const slugs = getLessonSlugs(mod.slug);
            const labCount = slugs.length;
            const xpReward = slugs.reduce((s, slug) => s + calcXpForLesson(mod.slug, slug), 0);
            const completed = slugs.filter((s) => completedLessonKeys.has(`${mod.slug}/${s}`)).length;
            const theme = toSerializableTheme(getLabCardTheme(mod.slug));
            const title = getModuleDisplayName(mod.slug);

            return (
              <Link
                key={mod.slug}
                href={mod.firstLesson ? `/learn/${mod.slug}/${mod.firstLesson}` : `/learn/${mod.slug}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
                aria-label={`${title} — ${completed} de ${labCount} completados`}
              >
                <div
                  className="relative flex min-h-[220px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 transition-colors duration-[250ms] ease-out hover:shadow-lg md:p-7"
                  style={{ ["--card-accent" as string]: theme.accent } as React.CSSProperties}
                >
                  <ModuleCardContent
                    theme={theme}
                    title={title}
                    description={getModuleShortDescription(mod.slug)}
                    lessonsCount={labCount}
                    xpReward={xpReward}
                    labCount={labCount}
                    completed={completed}
                    total={labCount}
                    compact={false}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
