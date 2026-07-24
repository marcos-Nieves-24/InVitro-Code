import { getModulesWithLessons } from "@/lib/content/modules";
import { Sidebar } from "@/components/learn/Sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = getModulesWithLessons();

  return (
    <div className="flex min-h-screen bg-dot-grid">
      <Sidebar modules={modules} />
      <main className="min-h-0 flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  );
}
