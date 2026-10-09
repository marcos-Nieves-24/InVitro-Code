// Application port — streak persistence abstraction.
// Depends only on domain types; never imports infrastructure (Supabase, Clerk, etc.).

import type { StreakRow, FreezeState } from "@/domain/streak";

export type StreakWithFreezeRow = StreakRow & FreezeState;

export interface StreakRepository {
  /** Returns streak row with freeze state, or null if no row exists. */
  get(userId: string): Promise<StreakWithFreezeRow | null>;

  /** Persists streak row (upsert). Returns persisted row. */
  save(userId: string, row: StreakWithFreezeRow): Promise<StreakWithFreezeRow>;
}
