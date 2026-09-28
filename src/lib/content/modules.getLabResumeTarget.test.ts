import { describe, it, expect } from "vitest";
import { getLabResumeTarget, getLessonSlugs } from "./modules";
import type { LabProgressMap, LabProgressEntry } from "./modules";

function entry(status: LabProgressEntry["status"]): LabProgressEntry {
  return {
    status,
    last_position: {},
    completion_date: status === "completed" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

describe("getLabResumeTarget", () => {
  it("Caso 1: picks first in_progress in lessonNN_ order", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    expect(slugs.length).toBeGreaterThan(4);

    // Setup: lesson 0 completed, lesson 1 in_progress (activeTab quiz), lesson 2 in_progress, lesson 3 not_started
    const map: LabProgressMap = new Map();
    map.set(slugs[0]!, entry("completed"));
    map.set(slugs[1]!, { ...entry("in_progress"), last_position: { activeTab: "quiz" } });
    map.set(slugs[2]!, entry("in_progress"));
    map.set(slugs[3]!, entry("not_started"));

    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.case).toBe(1);
    expect(result.target).toEqual({ moduleSlug, lessonSlug: slugs[1] });
  });

  it("Caso 2: all not_started picks first slug", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    const map: LabProgressMap = new Map();
    // all not_started explicitly
    for (const s of slugs.slice(0, 3)) map.set(s, entry("not_started"));

    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.case).toBe(2);
    expect(result.target).toEqual({ moduleSlug, lessonSlug: slugs[0] });
  });

  it("Caso 2: mixed completed + not_started picks first not_started", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    const map: LabProgressMap = new Map();
    map.set(slugs[0]!, entry("completed"));
    map.set(slugs[1]!, entry("completed"));
    map.set(slugs[2]!, entry("not_started"));
    // rest missing → treated as not_started, but first not_started is slugs[2]
    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.case).toBe(2);
    expect(result.target).toEqual({ moduleSlug, lessonSlug: slugs[2] });
  });

  it("Caso 3: all completed → null case 3", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    const map: LabProgressMap = new Map();
    for (const s of slugs) map.set(s, entry("completed"));
    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.target).toBeNull();
    expect(result.case).toBe(3);
  });

  it("edge: empty module (no slugs) → null case 3 without throw", () => {
    const result = getLabResumeTarget("no_existe_modulo_xyz", new Map());
    expect(result.target).toBeNull();
    expect(result.case).toBe(3);
  });

  it("edge: invalid slug in map ignored, determinism preserved", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    const map: LabProgressMap = new Map();
    map.set("lesson99_fake" as string, entry("in_progress"));
    map.set(slugs[0]!, entry("completed"));
    // first missing after completed should be slugs[1]
    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.case).toBe(2);
    expect(result.target).toEqual({ moduleSlug, lessonSlug: slugs[1] });
    // determinism
    const again = getLabResumeTarget(moduleSlug, map);
    expect(again).toEqual(result);
  });

  it("edge: last lab is in_progress → caso 1 picks it", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    const last = slugs[slugs.length - 1]!;
    const map: LabProgressMap = new Map();
    for (const s of slugs.slice(0, -1)) map.set(s, entry("completed"));
    map.set(last, entry("in_progress"));
    const result = getLabResumeTarget(moduleSlug, map);
    expect(result.case).toBe(1);
    expect(result.target).toEqual({ moduleSlug, lessonSlug: last });
  });

  it("ordering respects lessonNN_ sort", () => {
    const moduleSlug = "python";
    const slugs = getLessonSlugs(moduleSlug).sort();
    // Ensure sorted
    const sorted = [...slugs].sort();
    expect(slugs).toEqual(sorted);
    // Empty map should return first sorted slug
    const result = getLabResumeTarget(moduleSlug, new Map());
    expect(result.target?.lessonSlug).toBe(sorted[0]);
    expect(result.case).toBe(2);
  });
});
