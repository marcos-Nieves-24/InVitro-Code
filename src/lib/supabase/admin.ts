import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";

/**
 * Crea un cliente Supabase con `SUPABASE_SERVICE_ROLE_KEY`.
 * Bypasea RLS — uso exclusivo en servidor (Route Handlers, Server Components,
 * Server Actions, middleware). Nunca importar en componentes "use client":
 * expondría la clave al bundle del navegador.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient can only be called on the server");
  }
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}
