import { describe, it, expect } from "vitest";
import { getLabCardTheme } from "./LabCardTheme";
import { calcXpForLesson } from "@/lib/gamification/utils";

describe("getLabCardTheme", () => {
  it("returns accent #0F161F for ia slug", () => {
    const theme = getLabCardTheme("ia");
    expect(theme.accent).toBe("#0F161F");
  });

  it("returns accent #0F161F for python slug", () => {
    const theme = getLabCardTheme("python");
    expect(theme.accent).toBe("#0F161F");
  });

  it("returns accent #2A272A for estadistica slug", () => {
    const theme = getLabCardTheme("estadistica");
    expect(theme.accent).toBe("#2A272A");
  });

  it("returns accent #2A272A for machine-learning slug", () => {
    const theme = getLabCardTheme("machine-learning");
    expect(theme.accent).toBe("#2A272A");
  });

  it("returns fallback theme for unknown slug", () => {
    const theme = getLabCardTheme("unknown-module");
    expect(theme.accent).toBe("#677381");
    expect(theme.label).toBe("Modulo");
  });
});

describe("calcXpForLesson", () => {
  it("returns a number greater than 0 for any lesson", () => {
    const xp = calcXpForLesson("ia", "lesson01_intro");
    expect(xp).toBeGreaterThan(0);
  });

  it("applies 1.2x multiplier for machine-learning module", () => {
    const baseXp = calcXpForLesson("python", "lesson01_intro");
    const mlXp = calcXpForLesson("machine-learning", "lesson01_intro");
    expect(mlXp).toBe(Math.round(baseXp * 1.2));
  });

  it("applies 1.5x complexity factor for advanced lessons", () => {
    const normalXp = calcXpForLesson("ia", "lesson01_intro");
    const advancedXp = calcXpForLesson("ia", "lesson05_avanzado");
    expect(advancedXp).toBe(Math.round(normalXp * 1.5));
  });
});
