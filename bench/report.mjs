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

  const gv = (obj) => obj?.values ?? obj ?? {};
  const vusMax = gv(m.vus_max)?.max ?? gv(m.vus)?.max ?? "—";
  const reqs = gv(m.http_reqs)?.count ?? 0;
  const failedRate = gv(m.http_req_failed)?.rate ?? 0;
  const rps = gv(m.http_reqs)?.rate ?? 0;
  const p50 = gv(m.http_req_duration)?.["p(50)"];
  const p95 = gv(m.http_req_duration)?.["p(95)"];
  const p99 = gv(m.http_req_duration)?.["p(99)"];
  const avg = gv(m.http_req_duration)?.avg;
  const count429 = gv(m.rate_limited_429)?.count ?? 0;
  const checksFails = gv(m.checks)?.fails ?? 0;
  const checksPasses = gv(m.checks)?.passes ?? 0;

  // Per-endpoint breakdown if tagged
  const endpoints = {};
  for (const [k, v] of Object.entries(m)) {
    if (k.startsWith("http_req_duration{endpoint:")) {
      const ep = k.match(/endpoint:([^}]+)/)?.[1] || k;
      endpoints[ep] = gv(v);
    }
  }

  // Note: http_req_failed counts 401s as failed by k6 default — use checks for real correctness
  const realFailed = checksFails > 0;
  const passed = !realFailed && (p95 === undefined || p95 < 800);

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
  // 401s are expected for unauth — only checks matter for correctness
  if (checksFails > 0) findings.push(`- ❌ **Checks fallidos (${checksFails})**: algún endpoint devolvió 500 en lugar de 400/401 esperado — el troll encontró un bug de validación.`);
  else findings.push(`- ✅ **Checks: ${checksPasses} pasaron, 0 fallaron** — todos los endpoints respondieron con status esperado (200/307/401/400).`);
  if (count429 > 0) findings.push(`- ⚠️ **Rate limiting activo (${count429} x 429)**: \`checkRateLimit\` es in-memory y resetea al redeploy. En multi-instancia (Vercel) no es consistente — migrar a Upstash Redis si escala.`);
  if (p95 !== undefined && p95 >= 800) findings.push("- ⚠️ **p95 lento**: revisá render MDX, imágenes, o queries Supabase sin índice.");
  else if (p95 !== undefined) findings.push(`- ✅ **p95 ${Math.round(p95)}ms** dentro de umbral <800ms — latencia OK.`);
  if (failedRate >= 0.3) findings.push(`- ℹ️ **http_req_failed ${(failedRate*100).toFixed(1)}%** es esperado: son 401s de flujo sin auth (k6 los cuenta como failed aunque sean correctos). Mirá checks.`);
  if (endpoints.progress && endpoints.progress["p(95)"] > 600) findings.push("- ⚠️ **POST /api/progress p95 >600 ms**: puede ser \`advanceStreak\` + \`evaluateAchievements\` en serie.");
  if (findings.length === 0) findings.push("- ✅ Sin hallazgos críticos. La plataforma aguanta la rampa configurada.");
  findings.push("- ℹ️ **Siguiente paso:** probá 50-100 VUs o contra preview de Vercel para medir cold starts. Para test con auth: \`BENCH_AUTH_TOKEN=xxx k6 run ...\`");
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
