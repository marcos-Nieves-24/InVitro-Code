#!/usr/bin/env node
/**
 * C-G02 — Guard service-role
 * Fails if `createAdminClient` is imported in a "use client" file.
 * No eslint config in repo (AGENTS.md: lint roto por Next 16), so this script
 * is the minimal viable guard. Run: `node scripts/check-admin-client.mjs`
 * Intended as pre-build / CI check.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

function shell(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch (e) {
    // grep exits 1 when no match — treat as empty output
    if (e.status === 1) return "";
    throw e;
  }
}

// Files that reference createAdminClient
const hits = shell(
  'grep -R "createAdminClient" src --include="*.ts" --include="*.tsx" -l 2>/dev/null || true',
)
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

if (hits.length === 0) {
  console.log("check-admin-client: no file uses createAdminClient — ok");
  process.exit(0);
}

const offenders = [];
for (const file of hits) {
  const content = fs.readFileSync(file, "utf8");
  // Detect "use client" directive — covers both quote styles, optional semicolon
  if (/^\s*["']use client["']\s*;?/m.test(content)) {
    offenders.push(file);
  }
}

if (offenders.length > 0) {
  console.error(
    "check-admin-client FAILED: createAdminClient imported in client component(s):",
  );
  for (const f of offenders) console.error(`  - ${f}`);
  console.error(
    '\nFix: move createAdminClient usage to a Server Component / Route Handler / Server Action. Guard in src/lib/supabase/admin.ts throws if typeof window !== "undefined".',
  );
  process.exit(1);
}

console.log(
  `check-admin-client: ok — ${hits.length} server file(s) use createAdminClient, no "use client" hit`,
);
for (const f of hits) console.log(`  - ${f}`);
