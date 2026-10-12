/**
 * Contract test for the SVG framing gate (scripts/check-hero-assets.mjs).
 *
 * The gate only compares declared attributes against scripts/hero-assets.json;
 * it never renders, so measuring bounds is not its job (that belongs to
 * scripts/normalize-hero-assets.mjs). Each test drives the real script through
 * node against a temporary fixture tree, so the assertions cover the process
 * exit code and the reported messages, not a reimplementation.
 */

import { afterAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHECK_SCRIPT = fileURLToPath(
  new URL("../../scripts/check-hero-assets.mjs", import.meta.url)
);
const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const REPO_PUBLIC = join(REPO_ROOT, "public");
const REPO_MANIFEST = join(REPO_ROOT, "scripts", "hero-assets.json");

/** Temporary fixture roots, removed when the suite finishes. */
const temporaryRoots = [];

afterAll(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

/** Build a throwaway public/ tree plus a throwaway manifest. */
function createFixture({ svgs = {}, assets = {} }) {
  const root = mkdtempSync(join(tmpdir(), "hero-assets-contract-"));
  temporaryRoots.push(root);

  const publicDir = join(root, "public");
  mkdirSync(publicDir, { recursive: true });
  for (const [relativePath, content] of Object.entries(svgs)) {
    const target = join(publicDir, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
  }

  const manifestPath = join(root, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ assets }, null, 2), "utf8");
  return { publicDir, manifestPath };
}

/** Run the real gate script and capture stdout/stderr/exit code. */
function runCheck(publicDir, manifestPath) {
  try {
    const stdout = execFileSync(
      process.execPath,
      [CHECK_SCRIPT, "--public-dir", publicDir, "--manifest", manifestPath],
      { encoding: "utf8" }
    );
    return { code: 0, stdout, stderr: "" };
  } catch (error) {
    return {
      code: typeof error.status === "number" ? error.status : 1,
      stdout: error.stdout ? error.stdout.toString() : "",
      stderr: error.stderr ? error.stderr.toString() : "",
    };
  }
}

const SVG_SANO = `<svg width="440" height="511" viewBox="0 0 440 511" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="511"/></svg>`;

/** The real broken hero: declared frame cuts the content, curated frame is the envelope. */
const SVG_RECORTADO = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="511" viewBox="128.6 69.52 762.01 884.97"><path d="M0 0h673.6v1024H0z"/></svg>`;

/** Commas as viewBox separators must parse as well as spaces. */
const SVG_CON_COMAS = `<svg width="100" height="100" viewBox="0,0,100,100"><circle cx="50" cy="50" r="40"/></svg>`;

describe("check-hero-assets: compliant fixtures", () => {
  it("passes when the declared frame matches the manifest", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "dashboard/hero.svg": SVG_SANO },
      assets: {
        "dashboard/hero.svg": { viewBox: "0 0 440 511", width: 440, height: 511 },
      },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code, result.stderr).toBe(0);
    expect(result.stdout).toContain("contrato OK");
    expect(result.stderr).toBe("");
  });

  it("accepts viewBox values inside the 0.5 unit tolerance", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "a.svg": SVG_SANO },
      assets: {
        "a.svg": { viewBox: "0.3 0 440 511", width: 440, height: 511 },
      },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code, result.stderr).toBe(0);
  });

  it("accepts comma-separated viewBox declarations", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "a.svg": SVG_CON_COMAS },
      assets: { "a.svg": { viewBox: "0 0 100 100", width: 100, height: 100 } },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code, result.stderr).toBe(0);
  });

  it("ignores SVGs without a declared viewBox", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: {
        "icons/plain.svg": `<svg width="24" height="24" fill="none"><path d="M4 4h16v16H4z"/></svg>`,
      },
      assets: {},
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code, result.stderr).toBe(0);
  });
});

describe("check-hero-assets: violations", () => {
  it("fails when the declared frame does not match the curated one", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "dashboard/cientifico-1.svg": SVG_RECORTADO },
      assets: {
        "dashboard/cientifico-1.svg": {
          viewBox: "152.3 -21 714.6 1065",
          width: 440,
          height: 656,
        },
      },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("ASSET dashboard/cientifico-1.svg");
    expect(result.stderr).toContain("difiere");
    expect(result.stderr).toContain("FALLO");
  });

  it("fails when width/height differ from the manifest", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "a.svg": SVG_SANO },
      assets: { "a.svg": { viewBox: "0 0 440 511", width: 440, height: 500 } },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("height difiere");
  });

  it("fails when an SVG declares a viewBox absent from the manifest", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "dashboard/nuevo.svg": SVG_SANO },
      assets: {},
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("ASSET dashboard/nuevo.svg");
    expect(result.stderr).toContain("sin curar");
  });

  it("fails when the SVG declares a size the manifest does not", () => {
    const { publicDir, manifestPath } = createFixture({
      svgs: { "a.svg": SVG_SANO },
      assets: { "a.svg": { viewBox: "0 0 440 511" } },
    });

    const result = runCheck(publicDir, manifestPath);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("width");
  });
});

describe("check-hero-assets: shipped asset tree", () => {
  it("every SVG in public/ satisfies the manifest", () => {
    const result = runCheck(REPO_PUBLIC, REPO_MANIFEST);
    expect(result.code, result.stderr).toBe(0);
    expect(result.stdout).toContain("contrato OK");
  });
});
