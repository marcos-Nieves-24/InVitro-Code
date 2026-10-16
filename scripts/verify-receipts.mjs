#!/usr/bin/env node
/**
 * verify-receipts.mjs — Verifica integridad de `legal/receipts/*.pdf` (Ley 527 art. 12)
 * Uso: node scripts/verify-receipts.mjs [--strict]
 *   Sin flags:  lista hashes SHA-256 de cada receipt encontrado
 *   --strict:   falla (exit 1) si falta algún DPA de los 3 obligatorios
 *
 * No requiere dependencias (solo node:fs + node:crypto + node:path)
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const RECEIPTS_DIR = "legal/receipts";
const REQUIRED = ["clerk-dpa", "supabase-dpa", "vercel-dpa"];
const isStrict = process.argv.includes("--strict");

if (!existsSync(RECEIPTS_DIR)) {
  console.error(`✗ Directorio no existe: ${RECEIPTS_DIR}`);
  process.exit(1);
}

const files = readdirSync(RECEIPTS_DIR).filter((f) => f.endsWith(".pdf") || f.endsWith(".html") || f.endsWith(".txt"));

if (files.length === 0) {
  console.log("ℹ Sin receipts aún — pendiente de aceptación de DPAs (ver legal/dpa-register.md §3)");
  console.log("  Esperados: clerk-dpa-*.pdf, supabase-dpa-*.pdf, vercel-dpa-*.pdf");
  if (isStrict) process.exit(1);
  process.exit(0);
}

console.log(`\nReceipts encontrados (${files.length}):\n`);
for (const file of files.sort()) {
  const buf = readFileSync(join(RECEIPTS_DIR, file));
  const hash = createHash("sha256").update(buf).digest("hex");
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ${hash}  ${file}  (${kb} KB)`);
}

if (isStrict) {
  const missing = REQUIRED.filter((prefix) => !files.some((f) => f.startsWith(prefix)));
  if (missing.length > 0) {
    console.error(`\n✗ Faltan DPAs obligatorios: ${missing.join(", ")}`);
    console.error("  Ver legal/dpa-register.md §3 pasos 1-5");
    process.exit(1);
  }
  console.log("\n✓ Los 3 DPAs obligatorios presentes");
}

console.log("\n→ Copiar hashes a legal/dpa-register.md §1 columna 'Receipt hash'");
console.log("→ Equivalente shell: sha256sum legal/receipts/*.pdf\n");
