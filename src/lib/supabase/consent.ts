// Infrastructure adapter — Supabase implementation of ConsentRepository.
// Uses service-role admin client (bypasses RLS); never uses anon key or auth.jwt().

import type { ConsentPurpose, ConsentRecord } from "@/domain/consent";
import { hasPurpose } from "@/domain/consent";
import type { ConsentRepository } from "@/application/ports/ConsentRepository";
import { createAdminClient } from "@/lib/supabase/admin";

// Raw row shape as returned by Supabase (snake_case)
type ConsentRow = {
  id: string;
  user_id: string;
  policy_version: string;
  accepted_text_hash: string;
  purposes: string[];
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

/**
 * Maps a DB row to the domain ConsentRecord.
 * Purposes are cast from TEXT[] to ConsentPurpose[]; values are constrained
 * by the domain enum but stored as plain text for flexibility.
 */
function toDomain(row: ConsentRow): ConsentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    policyVersion: row.policy_version,
    acceptedTextHash: row.accepted_text_hash,
    purposes: row.purposes as ConsentPurpose[],
    // Normalize null to undefined for optional fields
    ...(row.ip ? { ip: row.ip } : {}),
    ...(row.user_agent ? { userAgent: row.user_agent } : {}),
    createdAt: row.created_at,
  };
}

class SupabaseConsentRepository implements ConsentRepository {
  async save(
    record: Omit<ConsentRecord, "id" | "createdAt">,
  ): Promise<ConsentRecord> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("consent_logs")
      .insert({
        user_id: record.userId,
        policy_version: record.policyVersion,
        accepted_text_hash: record.acceptedTextHash,
        purposes: record.purposes,
        ip: record.ip ?? null,
        user_agent: record.userAgent ?? null,
      })
      .select("*")
      .single();

    if (error !== null || data === null) {
      throw new Error(
        `Failed to save consent record: ${error?.message ?? "no data returned"}`,
      );
    }

    return toDomain(data as ConsentRow);
  }

  async findByUserId(userId: string): Promise<ConsentRecord[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("consent_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error !== null) {
      throw new Error(
        `Failed to fetch consent records for user ${userId}: ${error.message}`,
      );
    }

    const rows = (data as ConsentRow[] | null) ?? [];
    return rows.map(toDomain);
  }

  async hasValidConsent(
    userId: string,
    purpose: ConsentPurpose,
  ): Promise<boolean> {
    // No expiration logic here; pending TTL is handled by the webhook/cron layer (COMP-07).
    const records = await this.findByUserId(userId);
    return records.some((r) => hasPurpose(r, purpose));
  }

  async hasGenderConsent(userId: string): Promise<boolean> {
    const records = await this.findByUserId(userId);
    // Import enum member via string literal to keep hasPurpose pure
    // but we resolve the sensitive purpose as ConsentPurpose.GENDER_X
    const genderPurpose: ConsentPurpose = "gender:x" as ConsentPurpose;
    return records.some((r) => hasPurpose(r, genderPurpose));
  }
}

/**
 * Factory that creates a service-role backed ConsentRepository.
 * Call per-request; createAdminClient reads env at call time.
 */
export function createConsentRepository(): ConsentRepository {
  return new SupabaseConsentRepository();
}
