import { describe, it, expect } from "vitest";
import { buildModuleCardModel } from "./module-card";

describe("module-card domain", () => {
  const base = {
    slug: "python",
    title: "Python",
    description: "Aprende Python",
    lessonCount: 10,
    xpReward: 250,
  };

  it("progressPct null when completed null", () => {
    const m = buildModuleCardModel({ ...base, completed: null, total: 10 });
    expect(m.progressPct).toBeNull();
    expect(m.completed).toBeNull();
  });

  it("progressPct null when total is 0 (avoid div/0)", () => {
    const m = buildModuleCardModel({ ...base, completed: 0, total: 0 });
    expect(m.progressPct).toBeNull();
  });

  it("progressPct 20% for 2/10", () => {
    const m = buildModuleCardModel({ ...base, completed: 2, total: 10 });
    expect(m.progressPct).toBe(20);
  });

  it("progressPct null when completed null and total null (defaults total to lessonCount but completed null)", () => {
    const m = buildModuleCardModel({ ...base, completed: null, total: null });
    expect(m.progressPct).toBeNull();
    expect(m.completed).toBeNull();
    // total defaults to lessonCount when null
    expect(m.total).toBe(10);
  });

  it("xp passthrough unchanged", () => {
    const m = buildModuleCardModel({ ...base, xpReward: 999 });
    expect(m.xpReward).toBe(999);
  });

  it("xp passthrough 0", () => {
    const m = buildModuleCardModel({ ...base, xpReward: 0 });
    expect(m.xpReward).toBe(0);
  });

  it("lessonCount and labCount default labCount to lessonCount", () => {
    const m = buildModuleCardModel({ ...base, lessonCount: 7 });
    expect(m.lessonCount).toBe(7);
    expect(m.labCount).toBe(7);
  });

  it("labCount explicit overrides default", () => {
    const m = buildModuleCardModel({ ...base, lessonCount: 7, labCount: 3 });
    expect(m.labCount).toBe(3);
  });

  it("total defaults to lessonCount when not provided", () => {
    const m = buildModuleCardModel({ ...base, lessonCount: 12 });
    expect(m.total).toBe(12);
  });

  it("progressPct rounds correctly (1/3 => 33%)", () => {
    const m = buildModuleCardModel({ ...base, completed: 1, total: 3 });
    expect(m.progressPct).toBe(33);
  });

  it("progressPct 100% when completed === total", () => {
    const m = buildModuleCardModel({ ...base, completed: 10, total: 10 });
    expect(m.progressPct).toBe(100);
  });

  it("completed undefined defaults to null", () => {
    const m = buildModuleCardModel({ ...base });
    expect(m.completed).toBeNull();
    expect(m.progressPct).toBeNull();
  });
});
