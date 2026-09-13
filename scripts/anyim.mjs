#!/usr/bin/env node
/**
 * anyim — Anymotion authoring pipeline for invitro-code.
 *
 * Subcommands:
 *   list                     List the animation catalog (scripts/animations.json)
 *   import --source <dir>    Copy a generated Anymotion project into public/animations/<slug>
 *                            [--slug <slug>] [--title <title>] [--type concept|algorithm]
 *   convert --slug <slug>    Scaffold a React wrapper component for an imported animation
 *   verify                   Ensure every catalog entry exists under public/animations/
 *   generate --prompt "…"    Run `anymotion generate` then import the freshest project
 *                            [--approve auto] [--serve false]
 *
 * The bridge (bridge.js) is copied once into public/animations/ and injected
 * into each imported index.html so AnymotionPlayer with `controls` can drive
 * playback from outside the iframe.
 *
 * Node >= 20.9 required (same constraint as the Next.js app).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractDuration, slugify, titleToComponent } from "./anymotion-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_ANIM_DIR = path.join(ROOT, "public", "animations");
const CATALOG_PATH = path.join(__dirname, "animations.json");
const BRIDGE_SRC = path.join(__dirname, "assets", "bridge.js");
const COMPONENTS_DIR = path.join(ROOT, "src", "components", "anymotion", "animations");
const ANYMOTION_PROJECTS = process.env.ANYMOTION_PROJECTS_DIR
  ? path.resolve(process.env.ANYMOTION_PROJECTS_DIR)
  : path.join(process.env.HOME || "", "anymotion-projects");

const quote = slugify;

function readCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

function writeCatalog(catalog) {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function log(msg) {
  console.log(`· ${msg}`);
}

/** Copies a generated Anymotion project into public/animations/<slug>. */
async function importProject({ source, slug, title, type = "concept" }) {
  if (!source || !fs.existsSync(source)) fail(`source project not found: ${source}`);
  slug = slug || quote(path.basename(source));
  if (!slug) fail("could not derive a slug — pass --slug");

  const dest = path.join(PUBLIC_ANIM_DIR, slug);
  fs.mkdirSync(dest, { recursive: true });
  fs.mkdirSync(PUBLIC_ANIM_DIR, { recursive: true });

  // Copy the generated HTML/CSS/JS assets. Skip index.html if dest already has
  // one so we don't overwrite a previously imported animation.
  let copied = [];
  for (const file of fs.readdirSync(source)) {
    if (file === "index.html" && fs.existsSync(path.join(dest, file))) continue;
    const stat = fs.statSync(path.join(source, file));
    if (stat.isFile() && !file.startsWith(".")) {
      fs.copyFileSync(path.join(source, file), path.join(dest, file));
      copied.push(file);
    }
  }
  if (!copied.includes("index.html") && !fs.existsSync(path.join(dest, "index.html")))
    fail("source project has no index.html");

  // Inject the bridge so external controls work.
  const bridgePath = path.join(PUBLIC_ANIM_DIR, "bridge.js");
  if (!fs.existsSync(bridgePath)) fs.copyFileSync(BRIDGE_SRC, bridgePath);
  const htmlPath = path.join(dest, "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  const bridgeTag = '<script src="/animations/bridge.js"></script>';
  if (!html.includes("bridge.js")) {
    html = html.replace(/\s*<\/body>/i, `\n  ${bridgeTag}\n</body>`);
    fs.writeFileSync(htmlPath, html);
  }

  // Duration from the generated contract if present.
  let duration = 0;
  const timeline = copied.find((f) => f === "timeline.js" || f === "script.js");
  if (timeline) {
    duration = extractDuration(fs.readFileSync(path.join(dest, timeline), "utf8"));
  }

  // Update the catalog.
  const catalog = readCatalog();
  const existing = catalog.animations.find((a) => a.slug === slug);
  const entry = {
    slug,
    title: title || (existing ? existing.title : slug),
    type,
    duration,
    src: `/animations/${slug}/index.html`,
    reactComponent: existing ? existing.reactComponent : null,
    generated: true,
    inLesson: existing ? existing.inLesson : false,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  if (existing) catalog.animations[catalog.animations.indexOf(existing)] = entry;
  else catalog.animations.push(entry);
  writeCatalog(catalog);

  log(`imported → public/animations/${slug}/ (${copied.join(", ")})`);
  return entry;
}

/** Scaffolds a React wrapper component for an imported animation. */
async function convertSlug({ slug }) {
  const catalog = readCatalog();
  const entry = catalog.animations.find((a) => a.slug === slug);
  if (!entry) fail(`unknown slug: ${slug} (import it first)`);
  const htmlPath = path.join(PUBLIC_ANIM_DIR, slug, "index.html");
  if (!fs.existsSync(htmlPath)) fail(`no index.html for ${slug} — import it first`);
  if (typeof entry.reactComponent === "string" && entry.reactComponent.length > 0) {
    const compPath = path.join(COMPONENTS_DIR, `${entry.reactComponent}.tsx`);
    if (fs.existsSync(compPath)) {
      log(`component already scaffolded → ${path.relative(ROOT, compPath)}`);
      return;
    }
  }

  const name = titleToComponent(entry.title, slug);
  entry.reactComponent = name;
  writeCatalog(catalog);

  fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
  const compPath = path.join(COMPONENTS_DIR, `${name}.tsx`);
  const tsx = `"use client";

import { AnymotionPlayer } from "..";

interface ${name}Props {
  controls?: boolean;
  autoPlay?: boolean;
  caption?: string;
}

/**
 * React integration for the "${entry.title}" animation.
 *
 * Generated by \`npm run anim:convert -- --slug ${slug}\`. Renders the
 * Anymotion HTML output in a sandboxed iframe with optional external
 * playback controls. Edit freely — this file is a scaffold, not a lock.
 */
export function ${name}({ controls = true, autoPlay = false, caption }: ${name}Props) {
  return (
    <AnymotionPlayer
      src="${entry.src}"
      title="${entry.title}"
      caption={caption ?? \`\${controls ? "Avanza la línea de tiempo para ver cada frame de la animación." : ""}\`}
      controls={controls}
      autoPlay={autoPlay}
    />
  );
}
`;
  fs.writeFileSync(compPath, tsx);
  log(`scaffolded React component → ${path.relative(ROOT, compPath)}`);
  log(`register it in src/components/anymotion/index.ts and the lesson page components map`);
}

/** Checks every catalog entry resolves under public/animations/. */
function verifyAll() {
  const catalog = readCatalog();
  let ok = true;
  for (const a of catalog.animations) {
    const p = path.join(PUBLIC_ANIM_DIR, a.slug, "index.html");
    const exists = fs.existsSync(p);
    if (!exists) ok = false;
    console.log(`  ${exists ? "✓" : "✗"} ${a.slug} → ${path.relative(ROOT, p)}`);
  }
  if (!ok) {
    fail("some catalog entries are missing — run import for the failing slugs");
  }
  log(`catalog verified: ${catalog.animations.length} animations`);
}

/** Runs `anymotion generate`, then imports the freshest project it wrote. */
function generateAndImport({ prompt, approve = "auto" }) {
  if (!prompt) fail("generate needs --prompt \"…\"");

  const before = new Set(
    fs.existsSync(ANYMOTION_PROJECTS)
      ? fs.readdirSync(ANYMOTION_PROJECTS)
      : [],
  );

  log(`running: anymotion generate "${prompt.slice(0, 60)}…" -a ${approve}`);
  execSync(`anymotion generate ${JSON.stringify(prompt)} -a ${approve} --serve false`, {
    cwd: ANYMOTION_PROJECTS,
    stdio: "inherit",
    env: { ...process.env, ANYMOTION_PROJECTS_DIR: ANYMOTION_PROJECTS },
  });

  const after = fs.readdirSync(ANYMOTION_PROJECTS).filter((d) => !before.has(d));
  if (after.length === 0) fail("anymotion generate finished but no new project dir appeared");
  const newest = after
    .map((d) => ({ d, t: fs.statSync(path.join(ANYMOTION_PROJECTS, d)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].d;
  const slug = quote(newest);
  log(`generated project → ${path.join(ANYMOTION_PROJECTS, newest)}`);

  return importProject({
    source: path.join(ANYMOTION_PROJECTS, newest),
    slug,
    title: prompt,
  });
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flag = (name, fallback) => {
    const i = rest.indexOf(name);
    return i >= 0 && rest[i + 1] ? rest[i + 1] : fallback;
  };

  switch (cmd) {
    case "list": {
      const catalog = readCatalog();
      for (const a of catalog.animations) {
        console.log(
          `  ${a.slug.padEnd(28)} ${a.type.padEnd(10)} ${String(a.duration).padStart(3)}s  ${a.title}`,
        );
      }
      break;
    }
    case "import": {
      const source = flag("--source", null);
      const slug = flag("--slug", undefined);
      const title = flag("--title", undefined);
      const type = flag("--type", "concept");
      await importProject({ source, slug, title, type });
      break;
    }
    case "convert":
      await convertSlug({ slug: flag("--slug", null) });
      break;
    case "verify":
      verifyAll();
      break;
    case "generate": {
      const prompt = flag("--prompt", null);
      const approve = flag("--approve", "auto");
      await generateAndImport({ prompt, approve });
      break;
    }
    default:
      console.error(
        `usage: anyim [list|import|convert|verify|generate]\n` +
          `  anyim generate --prompt "…"\n` +
          `  anyim import --source <dir> [--slug x] [--title "…"] [--type concept|algorithm]\n` +
          `  anyim convert --slug x\n` +
          `  anyim verify\n` +
          `  anyim list`,
      );
      process.exit(cmd ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});