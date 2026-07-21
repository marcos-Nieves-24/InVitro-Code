import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-xl font-bold">InVitro-Code</h1>
        <UserButton />
      </header>

      <main className="flex-1 p-6">
        <h2 className="mb-2 text-2xl font-semibold">
          Bienvenido, {user?.firstName ?? "Estudiante"}
        </h2>
        <p className="mb-8 text-gray-600">
          Tu progreso aparecerá aquí cuando completes lecciones.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Nivel</h3>
            <p className="mt-1 text-3xl font-bold">1</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Puntos</h3>
            <p className="mt-1 text-3xl font-bold">0 XP</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Racha</h3>
            <p className="mt-1 text-3xl font-bold">0 días</p>
          </div>
        </div>
      </main>
    </div>
  );
}
