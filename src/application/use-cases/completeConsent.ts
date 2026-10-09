// Application use-case — complete consent trámite (ventanilla única)
// Saves consent log + flips profiles.consent_status to verified.
// Infrastructure (Supabase) is imported here, never in domain.

import { ConsentPurpose, type ConsentRecord } from "@/domain/consent";
import { createConsentRepository } from "@/lib/supabase/consent";
import { createAdminClient } from "@/lib/supabase/admin";

export type CompleteConsentParams = {
  userId: string;
  policyVersion: string;
  acceptedTextHash: string;
  purposes: ConsentPurpose[];
  ip?: string | null;
  userAgent?: string | null;
};

/**
 * Validates coverage, persists consent evidence, and marks profile verified.
 * - Validation uses domain ConsentPurpose enum (no infra).
 * - Repo handles consent_logs insert (service-role).
 * - Admin update flips profiles.consent_status; if it fails we log but still return the record
 *   (log is conservable evidence per Ley 527; status flip is best-effort).
 */
export async function completeConsent(
  params: CompleteConsentParams,
): Promise<ConsentRecord> {
  const { userId, policyVersion, acceptedTextHash, purposes, ip, userAgent } = params;

  // 1) Coverage validation: must include base F-01 and transfer:EEUU (art.9/art.26)
  const hasRegistro = purposes.includes(ConsentPurpose.REGISTRO);
  const hasTransfer = purposes.includes(ConsentPurpose.TRANSFER_EEUU);
  if (!hasRegistro || !hasTransfer) {
    throw new Error("purposes must include F-01 and transfer:EEUU");
  }

  // 2) Persist evidence
  const repo = createConsentRepository();
  const record = await repo.save({
    userId,
    policyVersion,
    acceptedTextHash,
    purposes,
    ...(ip ? { ip } : {}),
    ...(userAgent ? { userAgent } : {}),
  });

  // 3) Flip profile state (ventanilla única)
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        consent_status: "verified",
        consent_version: policyVersion,
        pending_since: null,
      })
      .eq("id", userId);

    if (error) {
      console.error("[completeConsent] profiles update failed:", error.message);
    }
  } catch (err) {
    console.error("[completeConsent] profiles update threw:", err);
  }

  // 4) Return record regardless of profile update outcome
  return record;
}
