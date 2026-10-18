#!/usr/bin/env node
/**
 * Bench runner — thin wrapper around k6.
 * Usage: node scripts/bench.mjs [--check] [--out bench/reports/summary.json]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const isCheck = args.includes("--check");
const outIdx = args.indexOf("--out");
const out = outIdx !== -1 ? path.resolve(args[outIdx + 1]) : path.join(ROOT, "bench/reports/summary.json");
const scenario = path.join(ROOT, "bench/scenarios/invitro.js");

function hasK6() {
  const r = spawnSync("k6", ["version"], { encoding: "utf8" });
  return r.status === 0;
}

function ensureK6() {
  if (hasK6()) return true;
  console.error("[bench] k6 no encontrado. Instalá:");
  console.error("  macOS: brew install k6");
  console.error("  Linux: sudo apt install k6  (o https://k6.io/docs/get-started/installation/)");
  console.error("  O usá Docker: docker run --rm -i -v $PWD:/app -w /app grafana/k6 run bench/scenarios/invitro.js");
  console.error("\nDry-run: validando sintaxis JS sin k6...");
  // Fallback: node --check scenario (syntax only)
  const check = spawnSync("node", ["--check", scenario], { encoding: "utf8" });
  if (check.status === 0) console.log("[bench] sintaxis OK (sin ejecutar carga)");
  else console.error(check.stderr);
  return false;
}

function main() {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  console.log(`[bench] APP_URL=${appUrl}`);
  console.log(`[bench] scenario=${path.relative(ROOT, scenario)} -> ${path.relative(ROOT, out)}`);

  if (isCheck) {
    console.log("[bench] --check: validando sin ejecutar");
    if (!hasK6()) {
      const c = spawnSync("node", ["--check", scenario], { encoding: "utf8" });
      process.exit(c.status ?? 1);
    }
    // k6 can validate with --vus 1 --duration 1s dry
    const r = spawnSync("k6", ["run", "--vus", "1", "--duration", "1s", scenario], { stdio: "inherit", env: process.env });
    process.exit(r.status ?? 0);
  }

  if (!ensureK6()) process.exit(1);

  fs.mkdirSync(path.dirname(out), { recursive: true });

  // k6 summary export
  const k6Args = ["run", `--summary-export=${out}`, scenario];
  console.log(`[bench] k6 ${k6Args.join(" ")}`);
  const res = spawnSync("k6", k6Args, { stdio: "inherit", env: process.env });
  if (res.status !== 0) {
    console.error(`[bench] k6 falló con código ${res.status}`);
    process.exit(res.status ?? 1);
  }

  // Auto-generate markdown report
  const report = spawnSync("node", [path.join(ROOT, "bench/report.mjs"), out], { stdio: "inherit" });
  process.exit(report.status ?? 0);
}

main();
