import { getModulesWithLessons } from "@/lib/content/modules";
import { Sidebar } from "@/components/learn/Sidebar";
import { CommandPaletteProvider } from "@/components/search/CommandPaletteProvider";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModulesWithLessons();
  const payloadModules = modules.map((m) => ({ slug: m.slug, name: m.name }));
  const payloadLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleSlug: m.slug, slug: l.slug, title: l.title })),
  );

  return (
    <div className="flex min-h-screen bg-dot-grid">
      <CommandPaletteProvider modules={payloadModules} lessons={payloadLessons} />
      <Sidebar modules={modules} />
      <main className="min-h-0 flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  );
}
