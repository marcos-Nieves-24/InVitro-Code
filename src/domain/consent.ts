// Domain — consent model (Ley 1581 art.9/art.6/art.26 + Ley 527)
// Pure domain, no infrastructure imports.

export type PolicyVersion = string;

export enum ConsentPurpose {
  REGISTRO = "F-01",
  PERFIL = "F-02",
  AVATAR = "F-03",
  PREFERENCIAS = "F-04",
  PROGRESO = "F-05",
  LAB = "F-06",
  GAMIFICACION = "F-07",
  TRANSFER_EEUU = "transfer:EEUU",
  GENDER_X = "gender:x",
}

export type ConsentRecord = {
  id: string;
  userId: string;
  policyVersion: string;
  acceptedTextHash: string;
  purposes: ConsentPurpose[];
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

// Current accepted policy version (mirrors politica-privacidad.md)
export const CURRENT_POLICY_VERSION: PolicyVersion = "2026-10-06-v1";

// Pending grace period before purge (COMP-07)
export const PENDING_TTL_HOURS = 24;

// Sensitive purpose that requires explicit separate consent (art.6)
export const GENDER_SENSITIVE_PURPOSE = ConsentPurpose.GENDER_X;

/**
 * Checks whether a consent record covers a given purpose.
 * Pure helper — no side effects, no I/O.
 */
export function hasPurpose(
  record: ConsentRecord,
  purpose: ConsentPurpose,
): boolean {
  return record.purposes.includes(purpose);
}

/**
 * Determines whether a pending consent window has expired.
 * @param pendingSince - ISO timestamp when pending status started
 * @param now - reference time (defaults to current time, injectable for tests)
 * @returns true if pendingSince + PENDING_TTL_HOURS is in the past
 */
export function isPendingExpired(
  pendingSince: string,
  now: Date = new Date(),
): boolean {
  const since = new Date(pendingSince);
  // Invalid date is treated as expired to avoid indefinite pending
  if (Number.isNaN(since.getTime())) {
    return true;
  }
  const expiresAt = since.getTime() + PENDING_TTL_HOURS * 60 * 60 * 1000;
  return now.getTime() >= expiresAt;
}
