import { describe, it, expect } from "vitest";
import { calcXpForLesson, calcLevel, rankTitle } from "./utils";

describe("calcXpForLesson", () => {
  it("returns base XP for standard modules", () => {
    expect(calcXpForLesson("ia", "lesson01_what_is_ai")).toBe(25);
    expect(calcXpForLesson("python", "lesson03_variables")).toBe(25);
    expect(calcXpForLesson("estadistica", "lesson01_descriptive_stats")).toBe(25);
  });

  it("applies machine-learning multiplier", () => {
    expect(calcXpForLesson("machine-learning", "lesson01_ml_fundamentals")).toBe(30);
  });

  it("applies complexity factor for advanced lessons", () => {
    // 25 * 1.0 * 1.5 = 37.5 -> 38
    expect(calcXpForLesson("ia", "lesson_avanzado_x")).toBe(38);
    // machine-learning advanced: 25 * 1.2 * 1.5 = 45
    expect(calcXpForLesson("machine-learning", "lesson_avanzada_x")).toBe(45);
  });

  it("defaults unknown modules to 1.0 multiplier", () => {
    expect(calcXpForLesson("otro", "lesson01_x")).toBe(25);
  });
});

describe("calcLevel", () => {
  it("computes level, nextLevelXp and progress", () => {
    expect(calcLevel(0)).toEqual({ level: 0, nextLevelXp: 100, progressToNext: 0 });
    expect(calcLevel(99)).toEqual({ level: 0, nextLevelXp: 100, progressToNext: 99 });
    expect(calcLevel(100)).toEqual({ level: 1, nextLevelXp: 200, progressToNext: 0 });
    expect(calcLevel(250)).toEqual({ level: 2, nextLevelXp: 300, progressToNext: 50 });
  });
});

describe("rankTitle", () => {
  it("maps levels to Spanish ranks", () => {
    expect(rankTitle(0)).toBe("Novato");
    expect(rankTitle(1)).toBe("Novato");
    expect(rankTitle(2)).toBe("Analista");
    expect(rankTitle(5)).toBe("Investigador Jr.");
    expect(rankTitle(8)).toBe("Investigador");
    expect(rankTitle(12)).toBe("Especialista");
    expect(rankTitle(20)).toBe("ML Engineer");
  });
});
