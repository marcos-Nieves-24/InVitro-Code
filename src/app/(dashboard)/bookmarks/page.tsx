import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Bookmark, BookOpen } from "lucide-react";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { getLessonTitle, getModuleDisplayName } from "@/lib/content/modules";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();

  const [profileRes, bookmarksRes] = await Promise.all([
    supabase.from("profiles").select("username, email, role, theme").eq("id", userId).maybeSingle(),
    supabase
      .from("bookmarks")
      .select("module_slug, lesson_slug, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const userName = getDisplayName(profileRes.data ?? {});

  const rows = (bookmarksRes.data ?? []) as Array<{
    module_slug: string;
    lesson_slug: string;
    created_at: string;
  }>;

  const enriched = rows.map((r) => {
    const title = getLessonTitle(r.module_slug, r.lesson_slug) ?? r.lesson_slug.replace(/^lesson\d+_/, "").replace(/[-_]/g, " ");
    const moduleName = getModuleDisplayName(r.module_slug);
    return { ...r, title, moduleName };
  });

  return (
    <InVitroShell userName={userName} userRole={profileRes.data?.role} theme={profileRes.data?.theme}>
      <div className="mx-auto w-full max-w-[960px] px-6 py-8 md:px-10">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <Bookmark className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Guardados</h1>
              <p className="text-sm text-storm">Lecciones marcadas para volver sin navegar.</p>
            </div>
          </div>
        </header>

        {enriched.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Sin guardados"
            description="Guardá lecciones con el ícono de marcador para tenerlas a mano."
            actionLabel="Explorar lecciones"
            href="/learn"
          />
        ) : (
          <ul className="grid gap-3">
            {enriched.map((b) => (
              <li key={`${b.module_slug}/${b.lesson_slug}`} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-storm">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={`/learn/${b.module_slug}/${b.lesson_slug}`} className="block truncate text-sm font-semibold hover:text-mint hover:underline">
                    {b.title}
                  </Link>
                  <span className="text-xs text-storm">
                    {b.moduleName} · {b.module_slug}/{b.lesson_slug}
                  </span>
                </span>
                <Link
                  href={`/learn/${b.module_slug}/${b.lesson_slug}`}
                  className="shrink-0 rounded-xl border border-surface-raised bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-surface-raised"
                >
                  Abrir
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </InVitroShell>
  );
}
