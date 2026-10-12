#!/usr/bin/env node
// Framing contract gate for served SVGs.
//
// Every SVG under public/ that declares a viewBox must have an entry in
// scripts/hero-assets.json whose viewBox/width/height match the declared ones.
// Enforced by `npm run prebuild`; testable in isolation via --public-dir/--manifest.
//
// Zero dependencies on purpose: node builtins only, so it cannot break because a
// dev dependency is missing. It compares declared attributes -- it never renders,
// so it never tells you whether the frame actually fits the content. Measuring is
// the job of scripts/normalize-hero-assets.mjs (playwright, dev-only).

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { isAbsolute, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TOLERANCE = 0.5;
const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));

const USAGE = `Check the SVG framing contract (viewBox/width/height vs the manifest).

Usage: node scripts/check-hero-assets.mjs [--public-dir <dir>] [--manifest <file>]

  --public-dir <dir>  SVG tree to inspect (default: <repo>/public)
  --manifest <file>   framing contract (default: <repo>/scripts/hero-assets.json)

Exit codes: 0 = every SVG matches the contract, 1 = at least one mismatch.`;

function parseArgs(argv) {
  const options = {
    publicDir: join(REPO_ROOT, "public"),
    manifest: join(SCRIPT_DIR, "hero-assets.json"),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [flag, inlineValue] = arg.includes("=") ? splitOnce(arg, "=") : [arg, undefined];
    const readValue = () => {
      if (inlineValue !== undefined) return inlineValue;
      index += 1;
      if (index >= argv.length) throw new Error(`falta el valor de ${flag}`);
      return argv[index];
    };
    if (flag === "--public-dir") {
      options.publicDir = resolveFromCwd(readValue());
    } else if (flag === "--manifest") {
      options.manifest = resolveFromCwd(readValue());
    } else if (flag === "--help" || flag === "-h") {
      process.stdout.write(`${USAGE}\n`);
      process.exit(0);
    } else {
      throw new Error(`flag desconocida: ${flag}`);
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

// --- SVG parsing -------------------------------------------------------------

/** First opening <svg ...> tag, or null when the file has none. */
function findSvgTag(text) {
  const match = text.match(/<svg\b[^>]*>/i);
  return match ? match[0] : null;
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  if (!match) return null;
  return match[1] !== undefined ? match[1] : match[2];
}

function parseViewBox(value) {
  if (value === null) return null;
  const parts = value
    .trim()
    .split(/[\s,]+/)
    .filter((part) => part.length > 0)
    .map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  return parts;
}

function parseLength(value) {
  if (value === null) return null;
  const trimmed = value.trim();
  if (!/^-?\d+(?:\.\d+)?(?:px)?$/.test(trimmed)) return { unparsable: true };
  return { number: Number.parseFloat(trimmed) };
}

function formatViewBox(numbers) {
  if (!numbers) return "(ninguno)";
  return numbers.join(" ");
}

// --- Filesystem --------------------------------------------------------------

function listSvgFiles(directory) {
  if (!existsSync(directory)) {
    throw new Error(`el directorio no existe: ${directory}`);
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

// --- Contract -----------------------------------------------------------------

function loadManifest(manifestPath) {
  let raw;
  try {
    raw = readFileSync(manifestPath, "utf8");
  } catch {
    throw new Error(`no se pudo leer el manifiesto: ${manifestPath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`manifiesto JSON invalido (${manifestPath}): ${error.message}`);
  }
  if (!parsed || typeof parsed.assets !== "object" || parsed.assets === null) {
    throw new Error(`el manifiesto no tiene la clave "assets" (${manifestPath})`);
  }
  return parsed.assets;
}

/** Collect contract failures for one SVG. Returns [] when the SVG is compliant. */
function checkAsset(relativePath, text, manifest) {
  const problems = [];
  const tag = findSvgTag(text);
  if (tag === null) {
    // No <svg> root tag at all: nothing to declare, nothing to enforce.
    return problems;
  }

  const declaredViewBox = readAttribute(tag, "viewBox");
  const viewBox = parseViewBox(declaredViewBox);

  if (viewBox === null) {
    if (declaredViewBox === null) {
      // Rule: SVGs without a declared viewBox are outside the contract.
      return problems;
    }
    problems.push(
      `viewBox declarado pero ilegible ("${declaredViewBox}"): se esperaban 4 numeros separados por espacios o comas`
    );
    return problems;
  }

  const entry = Object.prototype.hasOwnProperty.call(manifest, relativePath)
    ? manifest[relativePath]
    : null;

  if (entry === null) {
    problems.push(
      `sin curar: declara viewBox pero no esta en el manifiesto; corre "npm run assets:normalize" para medirlo y curarlo`
    );
    return problems;
  }

  const expected = parseViewBox(entry.viewBox);
  if (expected === null) {
    problems.push(`el manifiesto declara un viewBox invalido ("${entry.viewBox}")`);
  } else if (viewBox.some((value, axis) => Math.abs(value - expected[axis]) > TOLERANCE)) {
    const diff = viewBox.map((value, axis) => round(value - expected[axis]));
    problems.push(
      `viewBox difiere mas de ${TOLERANCE} unidades: declarado "${viewBox.join(" ")}", esperado "${expected.join(" ")}", diff "${diff.join(" ")}"`
    );
  }

  for (const axis of ["width", "height"]) {
    const raw = readAttribute(tag, axis);
    const declared = parseLength(raw);
    const expectedLength = entry[axis];
    const expectedPresent = expectedLength !== null && expectedLength !== undefined;
    const expectedNumber = Number(expectedLength);

    if (declared !== null && declared.unparsable) {
      problems.push(`${axis} declarado no numerico ("${raw}"): el contrato no puede verificarlo`);
    } else if (declared !== null && !expectedPresent) {
      problems.push(
        `${axis} declarado en el SVG (${declared.number}) pero ausente en el manifiesto`
      );
    } else if (declared === null && expectedPresent) {
      problems.push(`${axis} ausente en el SVG pero el manifiesto lo declara (${expectedLength})`);
    } else if (declared !== null && expectedPresent) {
      if (!Number.isFinite(expectedNumber)) {
        problems.push(`${axis} invalido en el manifiesto ("${expectedLength}")`);
      } else if (declared.number !== expectedNumber) {
        problems.push(`${axis} difiere: declarado ${declared.number}, esperado ${expectedNumber}`);
      }
    }
  }

  return problems;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`check-hero-assets: ${error.message}\n${USAGE}\n`);
    return 1;
  }

  let manifest;
  try {
    manifest = loadManifest(options.manifest);
  } catch (error) {
    process.stderr.write(`check-hero-assets: ${error.message}\n`);
    return 1;
  }

  let files;
  try {
    files = listSvgFiles(options.publicDir);
  } catch (error) {
    process.stderr.write(`check-hero-assets: ${error.message}\n`);
    return 1;
  }

  const failures = [];
  let checked = 0;
  for (const file of files) {
    const relativePath = relative(options.publicDir, file).split(sep).join("/");
    const problems = checkAsset(relativePath, readFileSync(file, "utf8"), manifest);
    if (problems.length === 0) continue;
    checked += 1;
    for (const problem of problems) {
      failures.push(`ASSET ${relativePath}: ${problem}`);
    }
  }

  if (failures.length === 0) {
    process.stdout.write(`assets:check ${files.length} SVG revisados, contrato OK\n`);
    return 0;
  }

  for (const failure of failures) {
    process.stderr.write(`${failure}\n`);
  }
  process.stderr.write(
    `assets:check FALLO: ${failures.length} problema(s) en ${checked} asset(s)\n`
  );
  return 1;
}

process.exit(main());
