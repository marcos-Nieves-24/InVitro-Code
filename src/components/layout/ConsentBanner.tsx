import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function ConsentBanner() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("consent_status")
    .eq("id", userId)
    .maybeSingle();

  if ((data as { consent_status?: string | null } | null)?.consent_status !== "pending") {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        <span>Tu cuenta está en estado pendiente — completá tu autorización art.9 para activar progreso y laboratorios. Tenés 24h.</span>
        <Link href="/perfil" className="font-medium underline hover:text-amber-700">
          Ir a perfil
        </Link>
      </p>
    </div>
  );
}
