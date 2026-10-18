#!/usr/bin/env node
/**
 * Students bench runner — ramps 10->500 until crash
 * Usage: node scripts/bench-students.mjs [--check] [--out bench/reports/students-summary.json]
 * Requires: BENCH_SECRET set for authenticated writes (or runs unauth 401 checks)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const isCheck = args.includes("--check");
const outIdx = args.indexOf("--out");
const out = outIdx !== -1 ? path.resolve(args[outIdx + 1]) : path.join(ROOT, "bench/reports/students-summary.json");
const scenario = path.join(ROOT, "bench/scenarios/students.js");

function hasK6() {
  return spawnSync("k6", ["version"], { encoding: "utf8" }).status === 0;
}

function main() {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const benchSecret = process.env.BENCH_SECRET ? "***set***" : "(not set — will test unauth 401)";
  console.log(`[students] APP_URL=${appUrl} BENCH_SECRET=${benchSecret}`);
  console.log(`[students] scenario=${path.relative(ROOT, scenario)} -> ${path.relative(ROOT, out)}`);
  console.log(`[students] journeys: explorador 30% / completador 30% / procrastinador 20% / intensivo 20%`);
  console.log(`[students] rampa: 10->50->100->200->500 VUs (hasta p95>2000ms o error>5%)`);

  if (isCheck) {
    console.log("[students] --check: validando sintaxis");
    if (!hasK6()) {
      const c = spawnSync("node", ["--check", scenario], { encoding: "utf8" });
      process.exit(c.status ?? 1);
    }
    const r = spawnSync("k6", ["run", "--vus", "1", "--duration", "1s", scenario], { stdio: "inherit", env: process.env });
    process.exit(r.status ?? 0);
  }

  if (!hasK6()) {
    console.error("[students] k6 no encontrado. Instalá: brew install k6 o ~/.local/bin/k6");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  const k6Args = ["run", `--summary-export=${out}`, scenario];
  console.log(`[students] k6 ${k6Args.join(" ")}`);
  const res = spawnSync("k6", k6Args, { stdio: "inherit", env: process.env });
  if (res.status !== 0) {
    console.error(`[students] k6 finalizó con código ${res.status} — puede ser quiebre esperado (thresholds)`);
  }
  // Try to generate markdown via report.mjs if available, else just cat json
  const report = path.join(ROOT, "bench/report.mjs");
  if (fs.existsSync(report)) {
    spawnSync("node", [report, out], { stdio: "inherit" });
  }
  process.exit(res.status ?? 0);
}

main();
