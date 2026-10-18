import type { NextRequest } from "next/server";

/**
 * Bench auth bypass — permite a k6 simular estudiantes reales sin pasar por Clerk.
 * Solo activo si BENCH_SECRET está seteado y el header coincide.
 * Uso: x-bench-secret: <BENCH_SECRET> + x-bench-user-id: bench_user_001
 * Seguro: en prod sin BENCH_SECRET, no hace nada. El secret debe ser largo y no committeado.
 */
export function getBenchUserId(request: NextRequest): string | null {
  const secret = process.env.BENCH_SECRET;
  if (!secret) return null;
  const headerSecret = request.headers.get("x-bench-secret");
  if (!headerSecret || headerSecret !== secret) return null;
  const userId = request.headers.get("x-bench-user-id");
  if (!userId || userId.trim().length === 0) return null;
  // Bench user IDs are synthetic: bench_user_001, student_42, etc. — no validación extra
  return userId.trim();
}

export function isBenchBypassActive(): boolean {
  return !!process.env.BENCH_SECRET;
}
