import Link from "next/link";
import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";
import { createAdminClient } from "@/lib/supabase/admin";

interface ModuleInfo {
  slug: string;
  name: string;
  totalLessons: number;
}

function getModuleDisplayName(slug: string): string {
  const metaPath = path.join(
    process.cwd(),
    "src/content/modules",
    slug,
    "module.json",
  );
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (meta.name) return meta.name;
  } catch { /* fallback */ }
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getModuleOrder(slug: string): number {
  const metaPath = path.join(
    process.cwd(),
    "src/content/modules",
    slug,
    "module.json",
  );
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (typeof meta.order === "number") return meta.order;
  } catch { /* fallback */ }
  return Infinity;
}

function getLessonCount(slug: string): number {
  const lessonDir = path.join(
    process.cwd(),
    "src/content/modules",
    slug,
    "lessons",
  );
  try {
    if (!fs.existsSync(lessonDir)) return 0;
    return fs
      .readdirSync(lessonDir, { withFileTypes: true })
      .filter((e) => e.isDirectory()).length;
  } catch {
    return 0;
  }
}

function getModules(): ModuleInfo[] {
  const modulesDir = path.join(process.cwd(), "src/content/modules");
  try {
    if (!fs.existsSync(modulesDir)) return [];
    return fs
      .readdirSync(modulesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({
        slug: e.name,
        name: getModuleDisplayName(e.name),
        totalLessons: getLessonCount(e.name),
      }))
      .sort((a, b) => {
        const oa = getModuleOrder(a.slug);
        const ob = getModuleOrder(b.slug);
        if (oa !== ob) return oa - ob;
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth().catch(() => ({ userId: null }));
  const userId = session?.userId ?? "dev-user";

  const supabase = createAdminClient();

  const [progressRes, reflectionRes] = await Promise.all([
    supabase.from("progress").select("xp_earned").eq("user_id", userId),
    supabase
      .from("reflection_completions")
      .select("xp_earned")
      .eq("user_id", userId),
  ]);

  const totalXp = [
    ...(progressRes.data ?? []),
    ...(reflectionRes.data ?? []),
  ].reduce((sum, row) => sum + (row.xp_earned ?? 0), 0);

  const modules = getModules();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-900">
          InVitro-Code
        </Link>
      </header>

      <main className="flex-1 p-6">
        <h2 className="mb-2 text-2xl font-semibold">
          Bienvenido, Estudiante
        </h2>
        <p className="mb-8 text-gray-600">
          Continúa tu aprendizaje y desbloquea nuevas lecciones.
        </p>

        <div className="grid gap-8">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Estadísticas de Progreso
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">Nivel Actual</h4>
                <div className="mt-1">
                  <LevelBadge userId={userId} totalXp={totalXp} />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">Puntos Totales</h4>
                <p className="mt-1 text-2xl font-bold">{totalXp} XP</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">Racha Actual</h4>
                <div className="mt-1">
                  <StreakBadge userId={userId} />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">
                  Progreso Hacia el Nivel Siguiente
                </h4>
                <div className="mt-1">
                  <XPBar userId={userId} totalXp={totalXp} />
                </div>
              </div>
            </div>
          </div>

          {modules.length > 0 && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Progreso de Módulos
              </h3>
              <div className="space-y-6">
                {modules.map((mod) => (
                  <ModuleProgress
                    key={mod.slug}
                    moduleSlug={mod.slug}
                    moduleName={mod.name}
                    userId={userId}
                    totalLessons={mod.totalLessons}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
