import { describe, it, expect } from "vitest";
import {
  buildLessonCardModel,
  normalizeDifficulty,
} from "./lesson-card";

describe("lesson-card domain", () => {
  describe("normalizeDifficulty", () => {
    it("Principiante passthrough", () => {
      expect(normalizeDifficulty("Principiante")).toBe("Principiante");
    });
    it("Intermedio passthrough", () => {
      expect(normalizeDifficulty("Intermedio")).toBe("Intermedio");
    });
    it("Avanzado passthrough", () => {
      expect(normalizeDifficulty("Avanzado")).toBe("Avanzado");
    });
    it("undefined => —", () => {
      expect(normalizeDifficulty(undefined)).toBe("—");
    });
    it("unknown string => —", () => {
      expect(normalizeDifficulty("Expert")).toBe("—");
      expect(normalizeDifficulty("")).toBe("—");
    });
  });

  describe("buildLessonCardModel state", () => {
    const base = {
      moduleSlug: "python",
      lessonSlug: "lesson01_intro",
      title: "Intro",
      xp: 25,
    };

    it("blocked true => blocked (priority over completed)", () => {
      const m = buildLessonCardModel({ ...base, blocked: true, completed: true });
      expect(m.state).toBe("blocked");
    });

    it("completed true, not blocked => completed", () => {
      const m = buildLessonCardModel({ ...base, completed: true });
      expect(m.state).toBe("completed");
    });

    it("neither => available", () => {
      const m = buildLessonCardModel({ ...base });
      expect(m.state).toBe("available");
    });
  });

  describe("buildLessonCardModel xp passthrough", () => {
    it("xp is preserved", () => {
      const m = buildLessonCardModel({
        moduleSlug: "ia",
        lessonSlug: "lesson01_what_is_ai",
        title: "What is AI",
        xp: 42,
      });
      expect(m.xp).toBe(42);
    });

    it("xp 0 preserved", () => {
      const m = buildLessonCardModel({
        moduleSlug: "ia",
        lessonSlug: "lesson01_x",
        title: "X",
        xp: 0,
      });
      expect(m.xp).toBe(0);
    });
  });

  describe("buildLessonCardModel prerequisites filtering", () => {
    const base = {
      moduleSlug: "python",
      lessonSlug: "lesson01_intro",
      title: "Intro",
      xp: 25,
    };

    it("Ninguno => undefined (filtered)", () => {
      const m = buildLessonCardModel({ ...base, prerequisites: "Ninguno" });
      expect(m.prerequisites).toBeUndefined();
    });

    it("ninguno (lowercase) => undefined", () => {
      const m = buildLessonCardModel({ ...base, prerequisites: "ninguno" });
      expect(m.prerequisites).toBeUndefined();
    });

    it("meaningful prerequisites preserved", () => {
      const m = buildLessonCardModel({ ...base, prerequisites: "Python básico" });
      expect(m.prerequisites).toBe("Python básico");
    });

    it("empty string => undefined", () => {
      const m = buildLessonCardModel({ ...base, prerequisites: "" });
      expect(m.prerequisites).toBeUndefined();
    });

    it("prerequisites trimmed", () => {
      const m = buildLessonCardModel({ ...base, prerequisites: "  Variables  " });
      expect(m.prerequisites).toBe("Variables");
    });
  });

  describe("buildLessonCardModel difficulty", () => {
    it("difficultyLabel derived from difficulty", () => {
      const m = buildLessonCardModel({
        moduleSlug: "python",
        lessonSlug: "lesson01_intro",
        title: "Intro",
        xp: 25,
        difficulty: "Avanzado",
      });
      expect(m.difficultyLabel).toBe("Avanzado");
      expect(m.difficulty).toBe("Avanzado");
    });

    it("unknown difficulty => label —", () => {
      const m = buildLessonCardModel({
        moduleSlug: "python",
        lessonSlug: "lesson01_intro",
        title: "Intro",
        xp: 25,
        difficulty: "Expert",
      });
      expect(m.difficultyLabel).toBe("—");
    });

    it("undefined difficulty => label — and difficulty empty string", () => {
      const m = buildLessonCardModel({
        moduleSlug: "python",
        lessonSlug: "lesson01_intro",
        title: "Intro",
        xp: 25,
      });
      expect(m.difficultyLabel).toBe("—");
      expect(m.difficulty).toBe("");
    });
  });

  describe("buildLessonCardModel estimatedDuration", () => {
    it("preserved when provided", () => {
      const m = buildLessonCardModel({
        moduleSlug: "python",
        lessonSlug: "lesson01_intro",
        title: "Intro",
        xp: 25,
        estimatedDuration: "15 min",
      });
      expect(m.estimatedDuration).toBe("15 min");
    });

    it("undefined when not provided", () => {
      const m = buildLessonCardModel({
        moduleSlug: "python",
        lessonSlug: "lesson01_intro",
        title: "Intro",
        xp: 25,
      });
      expect(m.estimatedDuration).toBeUndefined();
    });
  });
});
