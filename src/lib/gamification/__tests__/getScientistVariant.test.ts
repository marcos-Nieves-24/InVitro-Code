import { describe, it, expect } from "vitest";
import { getScientistVariant } from "../utils";

describe("getScientistVariant", () => {
  it("maps an unset, empty, or unrecognised gender to none so the hero renders no figure", () => {
    expect(getScientistVariant(null)).toBe("none");
    expect(getScientistVariant(undefined)).toBe("none");
    expect(getScientistVariant("")).toBe("none");
    expect(getScientistVariant("z")).toBe("none");
    expect(getScientistVariant("unknown")).toBe("none");
  });

  it("maps f to f", () => {
    expect(getScientistVariant("f")).toBe("f");
  });

  it("maps m to m", () => {
    expect(getScientistVariant("m")).toBe("m");
  });

  it("maps x to f as an explicit placeholder until the non-binary artwork lands", () => {
    expect(getScientistVariant("x")).toBe("f");
  });

  it("is idempotent so a resolved variant survives a second pass", () => {
    for (const variant of ["m", "f", "none"] as const) {
      expect(getScientistVariant(variant)).toBe(variant);
    }
  });
});
