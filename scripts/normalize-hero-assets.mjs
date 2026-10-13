#!/usr/bin/env node
// On-demand curator for the SVG framing contract.
//
// Measures the real bounds of every SVG (browser getBBox) and proposes a
// viewBox = bounding envelope + 2% padding, with width/height derived from the
// width the SVG already declares. Dry-run by default; --write applies to both
// the manifest (scripts/hero-assets.json) and the SVG opening tag.
//
// Requires playwright-core (dev-only). The build gate -- scripts/check-hero-assets.mjs
// -- never needs it: it only compares declared attributes.
//
// Safety: only SVGs missing from the manifest (or every SVG with --force) are
// measured and proposed, so a careless run cannot silently re-frame healthy assets.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const PADDING_RATIO = 0.02;

const USAGE = `Measure SVG bounds and propose the curated framing contract.

Usage: node scripts/normalize-hero-assets.mjs [options]

  --public-dir <dir>  SVG tree to inspect (default: <repo>/public)
  --manifest <file>   manifest to read/update (default: <repo>/scripts/hero-assets.json)
  --force             also re-measure assets already in the manifest
  --write             apply the proposal (default is a dry-run print)
  --help              show this message

Requires playwright-core (dev-only). Install with: npm i -D playwright-core
The build gate (scripts/check-hero-assets.mjs) does not need playwright.`;

const PLAYWRIGHT_HINT =
  "instalar con npm i -D playwright-core (dev-only, el gate no lo necesita) - playwright-core no descarga browsers en el postinstall, usa el cache local";

function parseArgs(argv) {
  const options = {
    publicDir: join(REPO_ROOT, "public"),
    manifest: join(SCRIPT_DIR, "hero-assets.json"),
    force: false,
    write: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [flag, inlineValue] = arg.includes("=") ? splitOnce(arg, "=") : [arg, undefined];
    const readValue = () => {
      if (inlineValue !== undefined) return inlineValue;
      index += 1;
      if (index >= argv.length) throw new Error(`missing value for ${flag}`);
      return argv[index];
    };
    if (flag === "--public-dir") {
      options.publicDir = resolveFromCwd(readValue());
    } else if (flag === "--manifest") {
      options.manifest = resolveFromCwd(readValue());
    } else if (flag === "--force") {
      options.force = true;
    } else if (flag === "--write") {
      options.write = true;
    } else if (flag === "--help" || flag === "-h") {
      process.stdout.write(`${USAGE}\n`);
      process.exit(0);
    } else {
      throw new Error(`unknown flag: ${flag}`);
    }
  }
  return options;
}

function splitOnce(value, separator) {
  const position = value.indexOf(separator);
  return [value.slice(0, position), value.slice(position + 1)];
}

function resolveFromCwd(value) {
  return isAbsolute(value) ? value : join(process.cwd(), value);
}

function listSvgFiles(directory) {
  if (!existsSync(directory)) {
    throw new Error(`directory does not exist: ${directory}`);
  }
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) found.push(fullPath);
    }
  };
  walk(directory);
  return found.sort();
}

function findSvgTag(text) {
  const match = text.match(/<svg\b[^>]*>/i);
  return match ? match[0] : null;
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  if (!match) return null;
  return match[1] !== undefined ? match[1] : match[2];
}

function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) return { _doc: "", assets: {} };
  const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!parsed || typeof parsed.assets !== "object" || parsed.assets === null) {
    throw new Error(`manifest has no "assets" key: ${manifestPath}`);
  }
  return parsed;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Proposed curation for one measured SVG: bounding envelope + 2% padding.
 * width/height derive from the width the SVG already declares (spec: never
 * invent a display size the author did not ask for).
 */
function propose({ bounds, declaredWidth, declaredHeight }) {
  const padding = Math.max(bounds.width, bounds.height) * PADDING_RATIO;
  const viewWidth = bounds.width + padding * 2;
  const viewHeight = bounds.height + padding * 2;
  const viewBox = [
    round1(bounds.x - padding),
    round1(bounds.y - padding),
    round1(viewWidth),
    round1(viewHeight),
  ].join(" ");

  let width = null;
  let height = null;
  const declaredWidthNumber = Number.parseFloat(declaredWidth);
  const declaredHeightNumber = Number.parseFloat(declaredHeight);
  if (Number.isFinite(declaredWidthNumber) && declaredWidthNumber > 0) {
    width = Math.round(declaredWidthNumber);
    height = Math.max(1, Math.round((width * viewHeight) / viewWidth));
  } else if (Number.isFinite(declaredHeightNumber) && declaredHeightNumber > 0) {
    height = Math.round(declaredHeightNumber);
    width = Math.max(1, Math.round((height * viewWidth) / viewHeight));
  }
  return { viewBox, width, height };
}

/** Rewrite only viewBox/width/height inside an opening <svg> tag. */
function applyAttributesToTag(tag, { viewBox, width, height }) {
  const selfClosing = /\/>$/.test(tag.trim());
  let updated = tag.replace(/\s+(?:viewBox|width|height)\s*=\s*(?:"[^"]*"|'[^']*')/gi, "");
  updated = updated.replace(/\/?>$/, "");
  const attributes = [];
  if (width !== null && width !== undefined) attributes.push(`width="${width}"`);
  if (height !== null && height !== undefined) attributes.push(`height="${height}"`);
  attributes.push(`viewBox="${viewBox}"`);
  return `${updated.trimEnd()} ${attributes.join(" ")}${selfClosing ? "/>" : ">"}`;
}

async function measureBounds(browser, filePath) {
  const page = await browser.newPage();
  try {
    await page.goto(pathToFileURL(filePath).href);
    const bounds = await page.evaluate(() => {
      const svg = document.querySelector("svg");
      if (!svg) return null;
      const box = svg.getBBox();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    });
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      throw new Error("getBBox returned an empty box (nothing rendered?)");
    }
    return bounds;
  } finally {
    await page.close();
  }
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`normalize-hero-assets: ${error.message}\n${USAGE}\n`);
    return 1;
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    try {
      ({ chromium } = await import("playwright"));
    } catch {
      process.stderr.write(
        `normalize-hero-assets: playwright no esta instalado, ${PLAYWRIGHT_HINT}\n`
      );
      return 1;
    }
  }

  let manifest;
  try {
    manifest = loadManifest(options.manifest);
  } catch (error) {
    process.stderr.write(`normalize-hero-assets: invalid manifest (${options.manifest}): ${error.message}\n`);
    return 1;
  }

  let files;
  try {
    files = listSvgFiles(options.publicDir);
  } catch (error) {
    process.stderr.write(`normalize-hero-assets: ${error.message}\n`);
    return 1;
  }

  const targets = [];
  const skipped = [];
  for (const file of files) {
    const relativePath = relative(options.publicDir, file).split(sep).join("/");
    const text = readFileSync(file, "utf8");
    const tag = findSvgTag(text);
    if (tag === null || readAttribute(tag, "viewBox") === null) continue;
    const alreadyCurated = Object.prototype.hasOwnProperty.call(manifest.assets, relativePath);
    if (alreadyCurated && !options.force) {
      skipped.push(relativePath);
      continue;
    }
    targets.push({ file, relativePath, text, tag });
  }

  if (targets.length === 0) {
    process.stdout.write(
      `assets:normalize ${files.length} SVGs scanned, nothing to propose (use --force to re-measure curated assets)\n`
    );
    return 0;
  }

  const browser = await chromium.launch();
  let failures = 0;
  const proposals = [];
  try {
    for (const target of targets) {
      const relativePath = target.relativePath;
      try {
        const bounds = await measureBounds(browser, target.file);
        const declaredWidth = readAttribute(target.tag, "width");
        const declaredHeight = readAttribute(target.tag, "height");
        const curation = propose({ bounds, declaredWidth, declaredHeight });
        proposals.push({ ...target, bounds, declaredWidth, declaredHeight, curation });
        process.stdout.write(
          `ASSET ${relativePath}: bounds x ${round1(bounds.x)} y ${round1(bounds.y)} w ${round1(bounds.width)} h ${round1(bounds.height)} -> viewBox "${curation.viewBox}" width ${curation.width} height ${curation.height}\n`
        );
      } catch (error) {
        failures += 1;
        process.stderr.write(`ASSET ${relativePath}: no se pudo medir: ${error.message}\n`);
      }
    }
  } finally {
    await browser.close();
  }

  for (const path of skipped) {
    process.stdout.write(`ASSET ${path}: already curated, skipped (use --force)\n`);
  }

  if (!options.write) {
    process.stdout.write(
      `assets:normalize ${proposals.length} propuesta(s), dry-run: no se escribio nada (usa --write para aplicar)\n`
    );
    return failures === 0 ? 0 : 1;
  }

  for (const proposal of proposals) {
    const { relativePath, curation, text, tag } = proposal;
    const newTag = applyAttributesToTag(tag, curation);
    if (newTag === tag) continue;
    const updated = text.replace(tag, () => newTag);
    if (updated === text) {
      process.stderr.write(`ASSET ${relativePath}: opening tag not found, not written\n`);
      failures += 1;
      continue;
    }
    writeFileSync(proposal.file, updated, "utf8");
    const note =
      `Curated by scripts/normalize-hero-assets.mjs: content ${round1(proposal.bounds.width)} x ${round1(proposal.bounds.height)} user units at (${round1(proposal.bounds.x)}, ${round1(proposal.bounds.y)}), framed as bounding envelope + ${PADDING_RATIO * 100}% padding.`;
    manifest.assets[relativePath] = {
      viewBox: curation.viewBox,
      width: curation.width,
      height: curation.height,
      note,
    };
    process.stdout.write(`ASSET ${relativePath}: curado y aplicado\n`);
  }

  writeFileSync(options.manifest, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(
    `assets:normalize ${proposals.length} asset(s) curado(s) en ${options.manifest}\n`
  );
  return failures === 0 ? 0 : 1;
}

process.exit(await main());
