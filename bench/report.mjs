#!/usr/bin/env node
/**
 * Report parser — turns k6 JSON summary into markdown + console summary.
 * Usage: node bench/report.mjs [path/to/summary.json]
 *   default: bench/reports/summary.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const input = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, "bench/reports/summary.json");
const outMd = path.join(ROOT, "bench/reports/summary.md");

function fmt(n, d = 2) {
  if (n === undefined || n === null) return "—";
  return Number(n).toFixed(d);
}

function load() {
  if (!fs.existsSync(input)) {
    console.error(`[report] no existe ${path.relative(ROOT, input)} — corré k6 primero (npm run bench:run)`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(input, "utf8"));
}

function main() {
  const data = load();
  const m = data.metrics || {};

  const vusMax = m.vus_max?.values?.max ?? m.vus?.values?.max ?? "—";
  const reqs = m.http_reqs?.values?.count ?? 0;
  const failedRate = m.http_req_failed?.values?.rate ?? 0;
  const rps = m.http_reqs?.values?.rate ?? 0;
  const p50 = m.http_req_duration?.values?.["p(50)"];
  const p95 = m.http_req_duration?.values?.["p(95)"];
  const p99 = m.http_req_duration?.values?.["p(99)"];
  const avg = m.http_req_duration?.values?.avg;
  const count429 = m.rate_limited_429?.values?.count ?? 0;
  const checksFails = m.checks?.values?.fails ?? 0;

  // Per-endpoint breakdown if tagged
  const endpoints = {};
  for (const [k, v] of Object.entries(m)) {
    if (k.startsWith("http_req_duration{endpoint:")) {
      const ep = k.match(/endpoint:([^}]+)/)?.[1] || k;
      endpoints[ep] = v.values;
    }
  }

  const passed = failedRate < 0.01 && (p95 === undefined || p95 < 800);

  const md = `# Bench Report — InVitro-Code

> Generado: ${new Date().toISOString()}
> Fuente: \`${path.relative(ROOT, input)}\`
> Base URL: \`${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}\`

## Resumen

| Métrica | Valor | Umbral | Estado |
|---------|-------|--------|--------|
| VUs máx | ${vusMax} | — | — |
| Requests | ${reqs} | — | — |
| RPS | ${fmt(rps)} | — | — |
| Fallos \`http_req_failed\` | ${fmt(failedRate * 100, 2)}% | <1% | ${failedRate < 0.01 ? "✅" : "❌"} |
| 429 Rate Limited | ${count429} | — | ${count429 > 0 ? "⚠️" : "✅"} |
| Checks fallidos | ${checksFails} | 0 | ${checksFails === 0 ? "✅" : "❌"} |
| \`http_req_duration\` p50 | ${fmt(p50)} ms | — | — |
| p95 | ${fmt(p95)} ms | <800 ms | ${p95 === undefined || p95 < 800 ? "✅" : "❌"} |
| p99 | ${fmt(p99)} ms | <1500 ms | ${p99 === undefined || p99 < 1500 ? "✅" : "❌"} |
| avg | ${fmt(avg)} ms | — | — |

**Resultado global:** ${passed ? "✅ PASS" : "❌ FAIL"} — ${failedRate >= 0.01 ? "Demasiados fallos. " : ""}${p95 !== undefined && p95 >= 800 ? "p95 supera 800 ms. " : ""}

## Latencia por endpoint

| Endpoint | p50 | p95 | p99 | avg | count |
|----------|-----|-----|-----|-----|-------|
${Object.entries(endpoints).length
    ? Object.entries(endpoints)
        .map(([ep, v]) => `| ${ep} | ${fmt(v["p(50)"])} | ${fmt(v["p(95)"])} | ${fmt(v["p(99)"])} | ${fmt(v.avg)} | ${v.count ?? "—"} |`)
        .join("\n")
    : "| (sin tags por endpoint) | — | — | — | — | — |"}

## Hallazgos automáticos

${(() => {
  const findings = [];
  if (failedRate >= 0.01) findings.push("- ❌ **Tasa de fallos alta**: revisá logs de Vercel/Supabase, puede ser RLS o timeout de Clerk.");
  if (count429 > 0) findings.push(`- ⚠️ **Rate limiting activo (${count429} x 429)**: \`checkRateLimit\` es in-memory y resetea al redeploy. En multi-instancia (Vercel) no es consistente — migrar a Upstash Redis si escala (ver \`src/lib/rate-limit.ts\` comentario F10).`);
  if (p95 !== undefined && p95 >= 800) findings.push("- ⚠️ **p95 lento**: revisá render MDX (\`lesson.md\` split por \`<Section>\`), imágenes sin optimizar, o queries Supabase sin índice en \`progress(user_id, module_slug)\`.");
  if (checksFails > 0) findings.push("- ❌ **Checks fallidos**: algún endpoint devolvió 500 en lugar de 400/401 esperado — el troll encontró un bug de validación.");
  if (endpoints.progress && endpoints.progress["p(95)"] > 600) findings.push("- ⚠️ **POST /api/progress p95 >600 ms**: puede ser \`advanceStreak\` + \`evaluateAchievements\` en serie. Considerá desacoplar achievements.");
  if (findings.length === 0) findings.push("- ✅ Sin hallazgos críticos. La plataforma aguanta la rampa configurada.");
  findings.push("- ℹ️ **Siguiente paso:** subí VUs a 1000 para encontrar el punto de quiebre, o corré contra preview de Vercel para medir cold starts.");
  return findings.join("\n");
})()}

## Cómo reproducir

\`\`\`bash
# Local (requiere app corriendo)
npm run dev # en otra terminal
npm run bench:run

# Contra preview/producción
APP_URL=https://tu-preview.vercel.app npm run bench:run

# Con auth (para medir flujo autenticado)
BENCH_AUTH_TOKEN=xxx npm run bench:run
\`\`\`

## Notas MiroFish

Personas en \`bench/personas/fixtures.json\` (generadas offline, inspiradas en MiroFish swarm).
Para regenerar con LLM: \`LLM_API_KEY=sk-... node bench/personas/generator.mjs\`
Para usar MiroFish externo como seed avanzado: exportá su JSON de agentes y convertilo a \`fixtures.json\` (mismo shape).
`;

  fs.mkdirSync(path.dirname(outMd), { recursive: true });
  fs.writeFileSync(outMd, md);
  console.log(`[report] -> ${path.relative(ROOT, outMd)}`);

  // Console summary
  console.log("\n=== Bench Summary ===");
  console.log(`VUs max: ${vusMax} | Reqs: ${reqs} | RPS: ${fmt(rps)}`);
  console.log(`Failed: ${fmt(failedRate * 100, 2)}% | 429: ${count429} | p95: ${fmt(p95)} ms | p99: ${fmt(p99)} ms`);
  console.log(`Resultado: ${passed ? "PASS" : "FAIL"}`);
  if (!passed) process.exitCode = 1;
}

main();
