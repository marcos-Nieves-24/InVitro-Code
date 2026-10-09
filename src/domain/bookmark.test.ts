import { describe, it, expect } from "vitest";
import { bookmarkKey, isValidBookmark } from "./bookmark";

describe("bookmark domain", () => {
  describe("bookmarkKey", () => {
    it("joins module/lesson with slash", () => {
      expect(bookmarkKey("python", "lesson01_intro")).toBe("python/lesson01_intro");
    });
    it("preserves slugs verbatim", () => {
      expect(bookmarkKey("machine-learning", "lesson10_final")).toBe("machine-learning/lesson10_final");
    });
  });

  describe("isValidBookmark", () => {
    it("true for non-empty strings", () => {
      expect(isValidBookmark("python", "lesson01_intro")).toBe(true);
    });
    it("false for empty module_slug", () => {
      expect(isValidBookmark("", "lesson01")).toBe(false);
      expect(isValidBookmark("   ", "lesson01")).toBe(false);
    });
    it("false for empty lesson_slug", () => {
      expect(isValidBookmark("python", "")).toBe(false);
      expect(isValidBookmark("python", "  ")).toBe(false);
    });
    it("false for non-string inputs", () => {
      expect(isValidBookmark(null as unknown as string, "lesson01")).toBe(false);
      expect(isValidBookmark("python", undefined as unknown as string)).toBe(false);
      expect(isValidBookmark(123 as unknown as string, "lesson01")).toBe(false);
    });
  });
});
