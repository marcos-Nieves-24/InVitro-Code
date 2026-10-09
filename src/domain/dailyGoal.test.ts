import { describe, it, expect } from "vitest";
import {
  clampDailyGoal,
  dailyGoalProgress,
  shouldNudge,
  DAILY_GOAL_DEFAULT,
} from "./dailyGoal";

describe("dailyGoal domain", () => {
  describe("clampDailyGoal", () => {
    it("clamps below MIN to 10", () => {
      expect(clampDailyGoal(5)).toBe(10);
    });
    it("clamps above MAX to 200", () => {
      expect(clampDailyGoal(250)).toBe(200);
    });
    it("snaps to STEP (57 → 60)", () => {
      expect(clampDailyGoal(57)).toBe(60);
    });
    it("snaps 14 → 10 and 15 → 20", () => {
      expect(clampDailyGoal(14)).toBe(10);
      expect(clampDailyGoal(15)).toBe(20);
    });
    it("fallback DEFAULT for NaN", () => {
      expect(clampDailyGoal(NaN)).toBe(DAILY_GOAL_DEFAULT);
      expect(clampDailyGoal("not-a-number")).toBe(DAILY_GOAL_DEFAULT);
    });
    it("coerces string numeric '80' → 80", () => {
      expect(clampDailyGoal("80")).toBe(80);
    });
    it("handles undefined / null fallback", () => {
      expect(clampDailyGoal(undefined)).toBe(DAILY_GOAL_DEFAULT);
      expect(clampDailyGoal(null)).toBe(DAILY_GOAL_DEFAULT);
    });
    it("keeps valid step value unchanged", () => {
      expect(clampDailyGoal(50)).toBe(50);
      expect(clampDailyGoal(100)).toBe(100);
    });
  });

  describe("dailyGoalProgress", () => {
    it("30/50 → 60% remaining 20 not achieved", () => {
      const p = dailyGoalProgress(30, 50);
      expect(p.percent).toBe(60);
      expect(p.remaining).toBe(20);
      expect(p.achieved).toBe(false);
    });
    it("50/50 → 100% achieved", () => {
      const p = dailyGoalProgress(50, 50);
      expect(p.percent).toBe(100);
      expect(p.remaining).toBe(0);
      expect(p.achieved).toBe(true);
    });
    it("70/50 → 100% achieved (overflow capped)", () => {
      const p = dailyGoalProgress(70, 50);
      expect(p.percent).toBe(100);
      expect(p.remaining).toBe(0);
      expect(p.achieved).toBe(true);
    });
    it("0/50 → 0% remaining 50", () => {
      const p = dailyGoalProgress(0, 50);
      expect(p.percent).toBe(0);
      expect(p.remaining).toBe(50);
      expect(p.achieved).toBe(false);
    });
  });

  describe("shouldNudge", () => {
    const today = "2026-10-08";
    it("xp<goal sin nudge hoy → true (null)", () => {
      expect(shouldNudge(20, 50, null, today)).toBe(true);
    });
    it("xp<goal con nudge ayer → true", () => {
      expect(shouldNudge(20, 50, "2026-10-07T22:00:00.000Z", today)).toBe(true);
    });
    it("xp>=goal → false", () => {
      expect(shouldNudge(50, 50, null, today)).toBe(false);
      expect(shouldNudge(60, 50, null, today)).toBe(false);
    });
    it("ya nudged hoy → false", () => {
      expect(shouldNudge(20, 50, "2026-10-08T03:00:00.000Z", today)).toBe(false);
      expect(shouldNudge(20, 50, today, today)).toBe(false);
    });
    it("xp<goal con lastNudgeAt same day diferentes horas → false", () => {
      expect(shouldNudge(10, 50, "2026-10-08T23:59:59.000Z", today)).toBe(false);
    });
  });
});
