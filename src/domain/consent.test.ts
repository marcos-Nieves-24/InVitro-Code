import { describe, it, expect } from "vitest";
import {
  CURRENT_POLICY_VERSION,
  hasPurpose,
  isPendingExpired,
  buildConsentState,
  canCompleteConsent,
  nextConsentStateAfterComplete,
  ConsentPurpose,
  type ConsentRecord,
} from "./consent";

describe("consent domain — trámite", () => {
  describe("buildConsentState", () => {
    it("creates pending state with version null", () => {
      const s = buildConsentState("pending", null, "2026-10-09T00:00:00Z");
      expect(s).toEqual({ status: "pending", version: null, pendingSince: "2026-10-09T00:00:00Z" });
    });

    it("creates verified state", () => {
      const s = buildConsentState("verified", CURRENT_POLICY_VERSION, null);
      expect(s.status).toBe("verified");
      expect(s.version).toBe(CURRENT_POLICY_VERSION);
      expect(s.pendingSince).toBeNull();
    });

    it("creates blocked state", () => {
      const s = buildConsentState("blocked", null, null);
      expect(s.status).toBe("blocked");
    });
  });

  describe("canCompleteConsent", () => {
    it("true only for pending", () => {
      expect(canCompleteConsent("pending")).toBe(true);
    });
    it("false for verified", () => {
      expect(canCompleteConsent("verified")).toBe(false);
    });
    it("false for blocked", () => {
      expect(canCompleteConsent("blocked")).toBe(false);
    });
  });

  describe("nextConsentStateAfterComplete", () => {
    it("transitions to verified with current version and null pendingSince", () => {
      const next = nextConsentStateAfterComplete("2026-10-09T00:00:00Z");
      expect(next).toEqual({
        status: "verified",
        version: CURRENT_POLICY_VERSION,
        pendingSince: null,
      });
    });
    it("same result when pendingSince is null", () => {
      const next = nextConsentStateAfterComplete(null);
      expect(next.status).toBe("verified");
      expect(next.version).toBe(CURRENT_POLICY_VERSION);
      expect(next.pendingSince).toBeNull();
    });
  });

  describe("hasPurpose (unchanged)", () => {
    const base: ConsentRecord = {
      id: "1",
      userId: "u1",
      policyVersion: CURRENT_POLICY_VERSION,
      acceptedTextHash: "abc",
      purposes: [ConsentPurpose.REGISTRO, ConsentPurpose.TRANSFER_EEUU],
      createdAt: new Date().toISOString(),
    };
    it("true when purpose present", () => {
      expect(hasPurpose(base, ConsentPurpose.REGISTRO)).toBe(true);
      expect(hasPurpose(base, ConsentPurpose.TRANSFER_EEUU)).toBe(true);
    });
    it("false when purpose absent", () => {
      expect(hasPurpose(base, ConsentPurpose.GENDER_X)).toBe(false);
      expect(hasPurpose(base, ConsentPurpose.LAB)).toBe(false);
    });
  });

  describe("isPendingExpired (unchanged)", () => {
    it("false when pendingSince is now", () => {
      const now = new Date("2026-10-09T12:00:00Z");
      const since = "2026-10-09T11:00:00Z";
      expect(isPendingExpired(since, now)).toBe(false);
    });
    it("true when > 24h", () => {
      const now = new Date("2026-10-10T13:00:00Z");
      const since = "2026-10-09T12:00:00Z";
      expect(isPendingExpired(since, now)).toBe(true);
    });
    it("true for invalid date", () => {
      expect(isPendingExpired("not-a-date")).toBe(true);
    });
  });
});
