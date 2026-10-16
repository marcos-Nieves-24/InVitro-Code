import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

const root = process.cwd();
const lessons = [
  "lesson01_what_is_ai",
  "lesson02_how_ai_learns",
  "lesson03_ai_in_biotech",
  "lesson04_real_cases",
];
const mdPath = (slug: string) =>
  join(root, "src/content/modules/ia/lessons", slug, "lesson.md");
const countMatches = (md: string, re: RegExp) => (md.match(re) ?? []).length;

describe("expediciones-m1-refactor contract (Module 1 ia)", () => {
  for (const slug of lessons) {
    it(`${slug}: every Section uses RevealSequence for progressive click reveal`, () => {
      const md = readFileSync(mdPath(slug), "utf8");
      const sectionCount = countMatches(md, /<Section\s/g);
      const revealCount = countMatches(md, /<RevealSequence/g);
      expect(sectionCount).toBeGreaterThan(0);
      expect(revealCount).toBe(sectionCount);
    });

    it(`${slug}: zero raw tables or table components remain in lesson.md`, () => {
      const md = readFileSync(mdPath(slug), "utf8");
      expect(md).not.toMatch(/<InteractiveTable/);
      expect(md).not.toMatch(/<ComparisonTable/);
      expect(md).not.toMatch(/<MarkdownTable/);
      expect(md).not.toMatch(/^\|/m);
    });

    it(`${slug}: no multiline <p> tags that would cause nested <p> hydration errors`, () => {
      const md = readFileSync(mdPath(slug), "utf8");
      expect(md).not.toMatch(/<p\s+className="[^"]+">\s*\n/);
    });
  }

  it("lesson02_how_ai_learns: zero accidental code fences in lesson.md", () => {
    const md = readFileSync(mdPath("lesson02_how_ai_learns"), "utf8");
    expect(md).not.toMatch(/```/);
  });

  it("registers SupervisedFlow, ConfusionMatrixVisual, and ModelCompare in page.tsx and index.ts", () => {
    const page = readFileSync(
      join(root, "src/app/learn/[module]/[slug]/page.tsx"),
      "utf8",
    );
    expect(page).toContain("SupervisedFlow: SupervisedFlowPlayer");
    expect(page).toContain("ConfusionMatrixVisual: ConfusionMatrixPlayer");
    expect(page).toContain("ModelCompare: ModelComparePlayer");

    const idx = readFileSync(
      join(root, "src/components/lesson/index.ts"),
      "utf8",
    );
    expect(idx).toContain("export { SupervisedFlowPlayer }");
    expect(idx).toContain("export { ConfusionMatrixPlayer }");
    expect(idx).toContain("export { ModelComparePlayer }");
  });
});
