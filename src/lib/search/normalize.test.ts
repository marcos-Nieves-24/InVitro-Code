import { describe, it, expect } from "vitest";
import { normalizeSearchText, matchesNormalized } from "./normalize";

describe("normalizeSearchText", () => {
  it("lowercases", () => {
    expect(normalizeSearchText("Python")).toBe("python");
  });
  it("strips accented chars (áéíóú)", () => {
    expect(normalizeSearchText("estadística")).toBe("estadistica");
    expect(normalizeSearchText("ÁÉÍÓÚ ñ")).toBe("aeiou n");
  });
  it("matchesNormalized true when normalized includes", () => {
    expect(matchesNormalized("Estadística Básica", "estadistica")).toBe(true);
    expect(matchesNormalized("Fundamentos de IA", "FUNDAMENTOS")).toBe(true);
  });
  it("matchesNormalized false when not includes", () => {
    expect(matchesNormalized("Python", "java")).toBe(false);
  });
  it("empty needle always matches", () => {
    expect(matchesNormalized("anything", "")).toBe(true);
  });
  it("case-insensitive accent-insensitive combo", () => {
    expect(matchesNormalized("Introducción a Python", "INTRODUCCION")).toBe(true);
  });
});
