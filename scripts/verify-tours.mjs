#!/usr/bin/env node
/**
 * Test automatizado — tour completo labs + proyectos
 * Verifica: Listo, hasEditor, maximize fill (659-675 vs 400), shotOk
 * Uso: BENCH_SECRET=... node scripts/verify-tours.mjs [--quick]
 *  --quick: solo 6 labs representativos (CI rápido), sin --quick: 41+41
 */
import { chromium } from "playwright-core";

const BASE = process.env.APP_URL || "http://localhost:3000";
const SECRET = process.env.BENCH_SECRET;
const USER = process.env.BENCH_USER || "bench_user_001";
const QUICK = process.argv.includes("--quick");

if (!SECRET) {
  console.error("BENCH_SECRET requerido (export BENCH_SECRET=...)");
  process.exit(1);
}

const ALL = [
  "estadistica/lessons/lesson01_descriptive_stats",
  "estadistica/lessons/lesson02_data_distribution",
  "estadistica/lessons/lesson03_probability",
  "estadistica/lessons/lesson04_statistical_distributions",
  "estadistica/lessons/lesson05_relationships",
  "estadistica/lessons/lesson06_exploratory_data_analysis",
  "estadistica/lessons/lesson07_dimensionality_reduction",
  "estadistica/lessons/lesson08_clustering",
  "estadistica/lessons/lesson09_model_evaluation",
  "estadistica/lessons/lesson10_data_storytelling",
  "ia/lessons/lesson01_what_is_ai",
  "ia/lessons/lesson02_how_ai_learns",
  "ia/lessons/lesson03_ai_in_biotech",
  "ia/lessons/lesson04_real_cases",
  "machine-learning/lessons/lesson01_ml_fundamentals",
  "machine-learning/lessons/lesson02_linear_regression",
  "machine-learning/lessons/lesson03_classification",
  "machine-learning/lessons/lesson04_decision_trees",
  "machine-learning/lessons/lesson05_random_forest",
  "machine-learning/lessons/lesson06_kmeans",
  "machine-learning/lessons/lesson07_pca",
  "machine-learning/lessons/lesson08_gradient_boosting",
  "machine-learning/lessons/lesson09_model_interpretation",
  "machine-learning/lessons/lesson10_applications",
  "python/lessons/lesson01_installing_python",
  "python/lessons/lesson02_jupyter_notebook",
  "python/lessons/lesson03_variables",
  "python/lessons/lesson04_data_types",
  "python/lessons/lesson05_operators",
  "python/lessons/lesson06_functions",
  "python/lessons/lesson07_loops",
  "python/lessons/lesson08_conditionals",
  "python/lessons/lesson09_lists",
  "python/lessons/lesson10_tuples",
  "python/lessons/lesson11_dictionaries",
  "python/lessons/lesson12_sets",
  "python/lessons/lesson13_numpy",
  "python/lessons/lesson14_pandas",
  "python/lessons/lesson15_matplotlib",
  "python/lessons/lesson16_seaborn",
  "python/lessons/lesson17_plotly",
];

const QUICK_SET = [
  "python/lessons/lesson01_installing_python",
  "python/lessons/lesson13_numpy",
  "estadistica/lessons/lesson01_descriptive_stats",
  "machine-learning/lessons/lesson06_kmeans",
  "ia/lessons/lesson01_what_is_ai",
  "machine-learning/lessons/lesson01_ml_fundamentals",
];

const targets = QUICK ? QUICK_SET : ALL;

async function withBench(page, fn) {
  await page.route("**/*", async (route) => {
    try {
      const u = new URL(route.request().url());
      if (u.origin === BASE) {
        const h = { ...route.request().headers(), "x-bench-secret": SECRET, "x-bench-user-id": USER };
        await route.continue({ headers: h });
      } else await route.continue();
    } catch { await route.continue(); }
  });
  try { await fn(); } finally { await page.unroute("**/*"); }
}

async function tour(page, prefix) {
  const results = [];
  for (const p of targets) {
    const [module, lesson] = p.split("/lessons/");
    const url = `${BASE}/${prefix}/${module}/${lesson}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    try { await page.evaluate(() => document.fonts.ready); } catch {}
    let status = "unknown";
    for (let i = 0; i < 6; i++) {
      status = await page.evaluate(() =>
        document.body.innerText.includes("Listo") ? "Listo" : document.body.innerText.includes("Cargando") ? "Cargando" : "other",
      );
      if (status === "Listo") break;
      await page.waitForTimeout(600);
    }
    const meta = await page.evaluate(() => ({
      hasEditor: !!document.querySelector(".monaco-editor"),
      hasLab: document.body.innerText.includes("LAB") || document.body.innerText.includes("Laboratorio"),
      hasConsola: document.body.innerText.includes("Consola"),
    }));
    let maximize = null;
    if (meta.hasEditor) {
      await page.evaluate(() => document.querySelector('button[aria-label="Maximizar"]')?.click());
      await page.waitForTimeout(900);
      maximize = await page.evaluate(() => {
        const ed = document.querySelector(".fixed.inset-0 .monaco-editor");
        return { fixed: !!document.querySelector(".fixed.inset-0"), h: ed ? Math.round(ed.getBoundingClientRect().height) : null };
      });
      await page.evaluate(() => document.querySelector('button[aria-label="Restaurar"]')?.click());
      await page.waitForTimeout(600);
    }
    let shotOk = false;
    try { await page.screenshot({ fullPage: false, animations: "disabled", timeout: 12000 }); shotOk = true; } catch {}
    results.push({ path: `${prefix}/${module}/${lesson}`, status, ...meta, maximize, shotOk });
    const ok = prefix === "laboratorios"
      ? status === "Listo" && meta.hasEditor && maximize?.h > 500 && shotOk
      : shotOk && (meta.hasEditor ? status === "Listo" && maximize?.h > 500 : true);
    const icon = ok ? "✅" : "❌";
    console.log(`${icon} ${prefix}/${module}/${lesson} status=${status} editor=${meta.hasEditor} h=${maximize?.h ?? "-"} shot=${shotOk}`);
    if (!ok) results[results.length - 1]._fail = true;
  }
  return results;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

let failures = 0;
await withBench(page, async () => {
  console.log(`\n=== LABORATORIOS (${targets.length}) ===`);
  const labs = await tour(page, "laboratorios");
  const labFails = labs.filter(r => r._fail).length;
  console.log(`Labs: ${labs.length - labFails}/${labs.length} OK`);
  failures += labFails;

  console.log(`\n=== PROYECTOS (${targets.length}) ===`);
  const proys = await tour(page, "proyectos");
  // proyectos solo exige shotOk; los que tienen editor deben dar Listo+maximize
  const proyFails = proys.filter(r => r._fail).length;
  console.log(`Proyectos: ${proys.length - proyFails}/${proys.length} OK (18 con consola, 23 asignación pura)`);
  failures += proyFails;
});

await browser.close();
if (failures > 0) {
  console.error(`\n❌ ${failures} checks fallaron`);
  process.exit(1);
}
console.log("\n✅ Tour completo OK");
