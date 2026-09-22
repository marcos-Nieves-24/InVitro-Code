import { describe, it, expect } from "vitest";
import { getScientistVariant } from "../utils";

describe("getScientistVariant", () => {
  it("maps null/undefined/invalid to f fallback", () => {
    expect(getScientistVariant(null)).toBe("f");
    expect(getScientistVariant(undefined)).toBe("f");
    expect(getScientistVariant("")).toBe("f");
    expect(getScientistVariant("z")).toBe("f");
    expect(getScientistVariant("unknown")).toBe("f");
  });

  it("maps f to f", () => {
    expect(getScientistVariant("f")).toBe("f");
  });

  it("maps m to m", () => {
    expect(getScientistVariant("m")).toBe("m");
  });

  it("maps x to f until final art lands", () => {
    expect(getScientistVariant("x")).toBe("f");
  });
});
