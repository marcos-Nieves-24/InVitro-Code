import Link from "next/link";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { ModuleProgress } from "@/components/gamification/ModuleProgress";

const DEV_USER_ID = "dev-user";

export default async function DashboardPage() {
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
                  <LevelBadge userId={DEV_USER_ID} totalXp={25} />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">Puntos Totales</h4>
                <p className="mt-1 text-2xl font-bold">25 XP</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">Racha Actual</h4>
                <div className="mt-1">
                  <StreakBadge userId={DEV_USER_ID} />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-600">
                  Progreso Hacia el Nivel Siguiente
                </h4>
                <div className="mt-1">
                  <XPBar userId={DEV_USER_ID} totalXp={25} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Progreso de Módulos
            </h3>
            <div className="space-y-4">
              <ModuleProgress moduleSlug="python" userId={DEV_USER_ID} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
