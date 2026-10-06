// Application port — consent persistence abstraction.
// Depends only on domain types; never imports infrastructure (Supabase, etc.).

import type { ConsentPurpose, ConsentRecord } from "@/domain/consent";

export interface ConsentRepository {
  /**
   * Persists a new consent evidence record (Ley 527 conservable).
   * The caller provides all fields except auto-generated id and createdAt.
   */
  save(
    record: Omit<ConsentRecord, "id" | "createdAt">,
  ): Promise<ConsentRecord>;

  /** Returns all consent records for a user, newest first. */
  findByUserId(userId: string): Promise<ConsentRecord[]>;

  /** Checks whether the user has a valid consent covering the given purpose. */
  hasValidConsent(userId: string, purpose: ConsentPurpose): Promise<boolean>;

  /** Convenience check for the sensitive gender:x purpose (art.6). */
  hasGenderConsent(userId: string): Promise<boolean>;
}
