import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { CommandPaletteProvider } from "@/components/search/CommandPaletteProvider";
import { getModulesWithLessons } from "@/lib/content/modules";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modulesWithLessons = getModulesWithLessons();
  const modules = modulesWithLessons.map((m) => ({ slug: m.slug, name: m.name }));
  const lessons = modulesWithLessons.flatMap((m) =>
    m.lessons.map((l) => ({ moduleSlug: m.slug, slug: l.slug, title: l.title })),
  );

  return (
    <>
      <ConsentBanner />
      <CommandPaletteProvider modules={modules} lessons={lessons} />
      {children}
    </>
  );
}
