import { describe, it, expect } from "vitest";
import {
  canAutoFreeze,
  applyAutoFreeze,
  shouldRechargeWeekly,
  dateMinusDays,
} from "./streak";

describe("streak domain - freeze", () => {
  const today = "2026-10-08";
  const yesterday = "2026-10-07";
  const twoDaysAgo = "2026-10-06";

  describe("dateMinusDays", () => {
    it("subtracts days correctly", () => {
      expect(dateMinusDays("2026-10-08", 1)).toBe("2026-10-07");
      expect(dateMinusDays("2026-10-08", 2)).toBe("2026-10-06");
      expect(dateMinusDays("2026-01-01", 1)).toBe("2025-12-31");
    });
  });

  describe("canAutoFreeze", () => {
    it("true when gap exactly 1 and freeze available", () => {
      const row = {
        current_streak: 5,
        longest_streak: 5,
        last_active_date: twoDaysAgo,
        freezes_available: 1,
        last_freeze_used: null,
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(true);
    });

    it("false when gap 1 but freeze 0", () => {
      const row = {
        current_streak: 5,
        longest_streak: 5,
        last_active_date: twoDaysAgo,
        freezes_available: 0,
        last_freeze_used: "2026-10-01",
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(false);
    });

    it("false when gap 2 (last_active older than twoDaysAgo)", () => {
      const row = {
        current_streak: 5,
        longest_streak: 5,
        last_active_date: "2026-10-05",
        freezes_available: 1,
        last_freeze_used: null,
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(false);
    });

    it("false when same day (idempotent)", () => {
      const row = {
        current_streak: 5,
        longest_streak: 5,
        last_active_date: today,
        freezes_available: 1,
        last_freeze_used: null,
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(false);
    });

    it("false when yesterday (continuity, no freeze needed)", () => {
      const row = {
        current_streak: 5,
        longest_streak: 5,
        last_active_date: yesterday,
        freezes_available: 1,
        last_freeze_used: null,
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(false);
    });

    it("false when last_active null", () => {
      const row = {
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
        freezes_available: 1,
        last_freeze_used: null,
      };
      expect(canAutoFreeze(row, today, yesterday, twoDaysAgo)).toBe(false);
    });
  });

  describe("applyAutoFreeze", () => {
    it("preserves/increments streak, consumes freeze, sets dates", () => {
      const row = {
        current_streak: 5,
        longest_streak: 7,
        last_active_date: twoDaysAgo,
        freezes_available: 1,
        last_freeze_used: null,
      };
      const next = applyAutoFreeze(row, today);
      expect(next.current_streak).toBe(6);
      expect(next.longest_streak).toBe(7);
      expect(next.freezes_available).toBe(0);
      expect(next.last_freeze_used).toBe(today);
      expect(next.last_active_date).toBe(today);
    });

    it("increments longest when new streak exceeds it", () => {
      const row = {
        current_streak: 7,
        longest_streak: 7,
        last_active_date: twoDaysAgo,
        freezes_available: 1,
        last_freeze_used: null,
      };
      const next = applyAutoFreeze(row, today);
      expect(next.longest_streak).toBe(8);
    });

    it("handles zero streak → 1", () => {
      const row = {
        current_streak: 0,
        longest_streak: 0,
        last_active_date: twoDaysAgo,
        freezes_available: 1,
        last_freeze_used: null,
      };
      const next = applyAutoFreeze(row, today);
      expect(next.current_streak).toBe(1);
    });
  });

  describe("shouldRechargeWeekly", () => {
    it("true on Monday (1) with 0 freezes", () => {
      expect(shouldRechargeWeekly(0, 1)).toBe(true);
    });
    it("false on Monday with 1 freeze (already full)", () => {
      expect(shouldRechargeWeekly(1, 1)).toBe(false);
    });
    it("false on other days even with 0", () => {
      expect(shouldRechargeWeekly(0, 2)).toBe(false);
      expect(shouldRechargeWeekly(0, 0)).toBe(false); // Sunday
      expect(shouldRechargeWeekly(0, 5)).toBe(false);
    });
  });
});
