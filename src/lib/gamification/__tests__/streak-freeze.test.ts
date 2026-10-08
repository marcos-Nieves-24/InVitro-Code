import { describe, it, expect } from "vitest";
import { computeStreak } from "../streak";

describe("computeStreak with auto-freeze", () => {
  const today = "2026-10-08";
  // helper to avoid relying on real utcDay
  const yesterday = "2026-10-07";
  const twoDaysAgo = "2026-10-06";
  const threeDaysAgo = "2026-10-05";

  it("gap 1 con freeze 1 → preserva racha, consume freeze", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: twoDaysAgo,
      freezes_available: 1,
      last_freeze_used: null,
    };
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(6);
    expect(next.freezes_available).toBe(0);
    expect(next.last_freeze_used).toBe(today);
    expect(next.last_active_date).toBe(today);
  });

  it("gap 1 con freeze 0 → resetea a 1", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: twoDaysAgo,
      freezes_available: 0,
      last_freeze_used: "2026-10-01",
    };
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(1);
    expect(next.freezes_available).toBe(0);
    // last_freeze_used stays as is (not overwritten on reset)
    expect(next.last_freeze_used).toBe("2026-10-01");
  });

  it("gap 2 con freeze 1 → resetea, freeze intacto", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: threeDaysAgo,
      freezes_available: 1,
      last_freeze_used: null,
    };
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(1);
    expect(next.freezes_available).toBe(1);
    expect(next.last_freeze_used).toBeNull();
  });

  it("mismo día idempotente → no consume freeze", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: today,
      freezes_available: 1,
      last_freeze_used: null,
    };
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(5);
    expect(next.freezes_available).toBe(1);
    expect(next.last_freeze_used).toBeNull();
  });

  it("yesterday → increment normal sin consumir freeze", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: yesterday,
      freezes_available: 1,
      last_freeze_used: null,
    };
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(6);
    expect(next.freezes_available).toBe(1);
  });

  it("existing null (usuario nuevo) → freezes_available 1 por default, racha 1", () => {
    const next = computeStreak(null, true, today);
    expect(next.current_streak).toBe(1);
    expect(next.longest_streak).toBe(1);
    expect(next.freezes_available).toBe(1);
    expect(next.last_freeze_used).toBeNull();
    expect(next.last_active_date).toBe(today);
  });

  it("completed false → preserva streak y freeze sin cambios", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: twoDaysAgo,
      freezes_available: 1,
      last_freeze_used: null,
    };
    const next = computeStreak(existing, false, today);
    expect(next.current_streak).toBe(5);
    expect(next.freezes_available).toBe(1);
    expect(next.last_active_date).toBe(twoDaysAgo);
  });

  it("existing sin campos freeze (compat) → default 1 y auto-freeze funciona", () => {
    const existing = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: twoDaysAgo,
    } as any;
    const next = computeStreak(existing, true, today);
    expect(next.current_streak).toBe(6);
    expect(next.freezes_available).toBe(0);
  });
});
