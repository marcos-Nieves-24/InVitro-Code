import { describe, it, expect } from "vitest";
import { lastPositionSchema, labProgressPostSchema, capLastPosition, formatLabDate } from "./labProgress";

describe("lastPositionSchema", () => {
  it("accepts valid last_position with activeTab and scrollY", () => {
    expect(lastPositionSchema.safeParse({ activeTab: "lab", scrollY: 120 }).success).toBe(true);
    expect(lastPositionSchema.safeParse({ activeTab: "quiz" }).success).toBe(true);
  });

  it("rejects non-object last_position", () => {
    expect(lastPositionSchema.safeParse("not-an-object" as unknown as object).success).toBe(false);
  });

  it("allows passthrough extra keys", () => {
    const parsed = lastPositionSchema.safeParse({ activeTab: "lab", foo: "bar" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect((parsed.data as Record<string, unknown>).foo).toBe("bar");
  });

  it("allows undefined / optional", () => {
    expect(lastPositionSchema.safeParse(undefined).success).toBe(true);
  });
});

describe("labProgressPostSchema", () => {
  it("accepts valid payload", () => {
    expect(
      labProgressPostSchema.safeParse({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "in_progress",
        last_position: { activeTab: "lab" },
      }).success,
    ).toBe(true);
  });

  it("rejects missing required fields", () => {
    expect(labProgressPostSchema.safeParse({ lesson_slug: "x" }).success).toBe(false);
  });

  it("rejects invalid completion_status", () => {
    expect(
      labProgressPostSchema.safeParse({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "bogus" as unknown as string,
      }).success,
    ).toBe(false);
  });
});

describe("capLastPosition", () => {
  it("returns same object when under 8KB", () => {
    const obj = { activeTab: "lab", scrollY: 10, codeSnapshot: "print('hi')" };
    expect(capLastPosition(obj as Record<string, unknown>)).toEqual(obj);
  });

  it("truncates codeSnapshot when JSON >8KB preserving activeTab+scrollY", () => {
    const big = "x".repeat(9000);
    const obj = { activeTab: "quiz", scrollY: 200, codeSnapshot: big } as unknown as Record<string, unknown>;
    const capped = capLastPosition(obj);
    expect(capped.activeTab).toBe("quiz");
    expect(capped.scrollY).toBe(200);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(8192);
    // either truncated or dropped
    if ("codeSnapshot" in capped) {
      expect(typeof capped.codeSnapshot).toBe("string");
      expect((capped.codeSnapshot as string).length).toBeLessThan(big.length);
    }
  });

  it("drops codeSnapshot entirely when still too large after truncation attempt", () => {
    const huge = "y".repeat(20000);
    const obj = { activeTab: "lab", scrollY: 0, codeSnapshot: huge } as unknown as Record<string, unknown>;
    const capped = capLastPosition(obj);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(8192);
    // Must keep activeTab+scrollY
    expect(capped.activeTab).toBe("lab");
  });

  it("keeps activeTab+scrollY when no snapshot but other keys bloat", () => {
    const obj = {
      activeTab: "lab",
      scrollY: 5,
      extra: "z".repeat(9000),
    } as unknown as Record<string, unknown>;
    const capped = capLastPosition(obj);
    expect(capped.activeTab).toBe("lab");
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(8192);
  });

  it("total JSON length always ≤8192 after capping", () => {
    const obj = {
      activeTab: "quiz",
      scrollY: 123,
      codeSnapshot: "a".repeat(10000),
      extra: "b".repeat(1000),
    } as unknown as Record<string, unknown>;
    const capped = capLastPosition(obj);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(8192);
  });
});

describe("formatLabDate", () => {
  it("formats ISO date to dd/MM/yyyy (UTC)", () => {
    // Use midday UTC to avoid timezone edge
    expect(formatLabDate("2026-09-20T12:00:00.000Z")).toBe("20/09/2026");
    expect(formatLabDate("2026-01-05T00:00:00.000Z")).toBe("05/01/2026");
  });

  it("returns — for null, undefined, invalid", () => {
    expect(formatLabDate(null)).toBe("—");
    expect(formatLabDate(undefined)).toBe("—");
    expect(formatLabDate("")).toBe("—");
    expect(formatLabDate("not-a-date")).toBe("—");
  });
});
