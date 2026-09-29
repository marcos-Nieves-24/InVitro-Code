import { describe, it, expect } from "vitest";
import {
  calcXpForLesson,
  calcLevel,
  rankTitle,
  rankNameForXp,
  rankIndexForXp,
  RANK_THRESHOLDS,
} from "./utils";

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
  it("maps levels to ranks at the canonical XP boundaries", () => {
    // XP ladder is 0/200/500/1000/2000/3500 with 100 XP per level,
    // so the level boundaries are 0/2/5/10/20/35.
    expect(rankTitle(0)).toBe("Novato");
    expect(rankTitle(1)).toBe("Novato");
    expect(rankTitle(2)).toBe("Analista");
    expect(rankTitle(4)).toBe("Analista");
    expect(rankTitle(5)).toBe("Investigador Jr.");
    expect(rankTitle(9)).toBe("Investigador Jr.");
    expect(rankTitle(10)).toBe("Investigador");
    expect(rankTitle(19)).toBe("Investigador");
    expect(rankTitle(20)).toBe("Especialista");
    expect(rankTitle(34)).toBe("Especialista");
    expect(rankTitle(35)).toBe("ML Engineer");
  });

  it("agrees with the XP-based lookup the /niveles roadmap uses", () => {
    for (const xp of [0, 99, 100, 199, 200, 499, 500, 999, 1000, 1999, 2000, 3499, 3500, 99999]) {
      expect(rankTitle(calcLevel(xp).level)).toBe(rankNameForXp(xp));
    }
  });

  it("falls back to the first rank for invalid input", () => {
    expect(rankTitle(-5)).toBe("Novato");
    expect(rankTitle(Number.NaN)).toBe("Novato");
    expect(rankNameForXp(Number.NaN)).toBe("Novato");
  });
});

describe("rankIndexForXp", () => {
  it("picks the highest threshold the XP total satisfies", () => {
    expect(rankIndexForXp(0)).toBe(0);
    expect(rankIndexForXp(199)).toBe(0);
    expect(rankIndexForXp(200)).toBe(1);
    expect(rankIndexForXp(500)).toBe(2);
    expect(rankIndexForXp(1000)).toBe(3);
    expect(rankIndexForXp(2000)).toBe(4);
    expect(rankIndexForXp(3500)).toBe(5);
  });

  it("clamps to the last rank for XP beyond the ladder", () => {
    expect(rankIndexForXp(10_000)).toBe(RANK_THRESHOLDS.length - 1);
  });
});
