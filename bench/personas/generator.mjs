#!/usr/bin/env node
/**
 * Personas generator — MiroFish-inspired, offline, deterministic fallback.
 * Reads src/content/modules lessons to seed personas.
 * Generates bench/personas/fixtures.json with 50 profiles.
 *
 * Usage:
 *   LLM_API_KEY=sk-... LLM_BASE_URL=https://api.openai.com/v1 LLM_MODEL_NAME=gpt-4o-mini node bench/personas/generator.mjs
 *   node bench/personas/generator.mjs --fallback   # force deterministic
 *   node bench/personas/generator.mjs --count 50
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const MODULES_ROOT = path.join(ROOT, "src/content/modules");
const OUT = path.join(ROOT, "bench/personas/fixtures.json");

const args = process.argv.slice(2);
const forceFallback = args.includes("--fallback");
const countIdx = args.indexOf("--count");
const COUNT = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) || 50 : 50;

function readModuleLessons() {
  const seeds = [];
  try {
    const modules = fs.readdirSync(MODULES_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
    for (const mod of modules.slice(0, 3)) {
      const lessonsDir = path.join(MODULES_ROOT, mod, "lessons");
      try {
        const lessons = fs.readdirSync(lessonsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort().slice(0, 2);
        for (const les of lessons) {
          const md = path.join(lessonsDir, les, "lesson.md");
          try {
            const raw = fs.readFileSync(md, "utf8").slice(0, 2000);
            const title = (raw.match(/Lesson Title:\s*(.+)/)?.[1] || les).trim();
            seeds.push({ module: mod, lesson: les, title, snippet: raw.slice(0, 500).replace(/\n/g, " ") });
          } catch { seeds.push({ module: mod, lesson: les, title: les, snippet: "" }); }
        }
      } catch {}
    }
  } catch {}
  return seeds.length ? seeds : [{ module: "python", lesson: "lesson01_installing_python", title: "Instalando Python", snippet: "seed fallback" }];
}

const PERSONA_ARCHETYPES = [
  { id: "ansioso", weight: 30, base: "Abandona rápido si la lección tarda >2s, revisa 1 lección y sale" },
  { id: "perfeccionista", weight: 25, base: "Repite quiz hasta 100%, hace 2 POST /api/progress idempotentes" },
  { id: "explorador", weight: 25, base: "Navega 2-3 lecciones seguidas, guarda bookmarks, lee referencias" },
  { id: "troll", weight: 20, base: "Envía payloads inválidos (blank slugs, last_position roto) para probar validación" },
];

function deterministicFixtures(seeds) {
  const fixtures = [];
  for (let i = 0; i < COUNT; i++) {
    const arch = PERSONA_ARCHETYPES[i % PERSONA_ARCHETYPES.length];
    const seed = seeds[i % seeds.length];
    fixtures.push({
      id: `${arch.id}-${String(i + 1).padStart(2, "0")}`,
      archetype: arch.id,
      weight: arch.weight,
      seed_lesson: `${seed.module}/${seed.lesson}`,
      seed_title: seed.title,
      behavior: arch.base,
      actions: arch.id === "ansioso" ? ["view_lesson", "abandon"] : arch.id === "perfeccionista" ? ["view_lesson", "submit_progress", "repeat_quiz"] : arch.id === "explorador" ? ["view_lesson", "view_lesson", "bookmark"] : ["invalid_progress", "invalid_lab"],
      think_time_ms: arch.id === "ansioso" ? 300 : arch.id === "perfeccionista" ? 800 : 500,
    });
  }
  return fixtures;
}

async function llmFixtures(seeds) {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.LLM_MODEL_NAME || "gpt-4o-mini";
  if (!apiKey) return null;

  const prompt = `Sos un generador de personas para stress test de InVitro-Code (plataforma educativa Next.js para biotecnología).
Seeds de lecciones reales:
${seeds.map((s) => `- ${s.module}/${s.lesson}: ${s.title} — ${s.snippet.slice(0, 200)}`).join("\n")}

Generá exactamente ${COUNT} personas diversas en JSON array. Cada persona: {id, archetype: ansioso|perfeccionista|explorador|troll, weight, seed_lesson, behavior: string corto en español, actions: array, think_time_ms: number}.
Distribución: ansioso 30%, perfeccionista 25%, explorador 25%, troll 20%.
Responde SOLO JSON array, sin markdown.`;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      console.error(`[personas] LLM ${res.status}: ${await res.text().then((t) => t.slice(0, 500))}`);
      return null;
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonStr = content.match(/\[.*\]/s)?.[0] || content;
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize to required shape, cap at COUNT
      return parsed.slice(0, COUNT).map((p, i) => ({
        id: p.id || `${p.archetype || "ansioso"}-${String(i + 1).padStart(2, "0")}`,
        archetype: ["ansioso", "perfeccionista", "explorador", "troll"].includes(p.archetype) ? p.archetype : PERSONA_ARCHETYPES[i % 4].id,
        weight: p.weight || PERSONA_ARCHETYPES[i % 4].weight,
        seed_lesson: p.seed_lesson || seeds[i % seeds.length].module + "/" + seeds[i % seeds.length].lesson,
        seed_title: p.seed_title || seeds[i % seeds.length].title,
        behavior: p.behavior || PERSONA_ARCHETYPES[i % 4].base,
        actions: Array.isArray(p.actions) ? p.actions : PERSONA_ARCHETYPES[i % 4].base.split(","),
        think_time_ms: p.think_time_ms || 500,
      }));
    }
  } catch (e) {
    console.error("[personas] LLM error", e?.message || e);
  }
  return null;
}

async function main() {
  const seeds = readModuleLessons();
  console.log(`[personas] seeds: ${seeds.map((s) => s.module + "/" + s.lesson).join(", ")}`);

  let fixtures = null;
  if (!forceFallback) {
    fixtures = await llmFixtures(seeds);
    if (fixtures) console.log(`[personas] LLM generó ${fixtures.length} personas`);
    else console.log("[personas] LLM no disponible, usando fallback determinístico");
  }
  if (!fixtures) fixtures = deterministicFixtures(seeds);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(fixtures, null, 2) + "\n");
  console.log(`[personas] -> ${path.relative(ROOT, OUT)} (${fixtures.length} personas)`);
  // Also emit weight summary
  const byArch = fixtures.reduce((a, p) => ((a[p.archetype] = (a[p.archetype] || 0) + 1), a), {});
  console.log("[personas] distribución:", byArch);
}

main();
