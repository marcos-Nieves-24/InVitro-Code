#!/usr/bin/env node
/**
 * Seed bench users in Supabase so x-bench-auth bypass writes succeed.
 * Creates 100 synthetic profiles: bench_user_001 ... bench_user_100
 * with consent_status = approved (bypass pending gate) and minimal fields.
 *
 * Usage: node bench/scripts/seed-bench-users.mjs [--count 100] [--dry-run]
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const countIdx = args.indexOf("--count");
const COUNT = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) || 100 : 100;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("  Load from .env.local: node --env-file=.env.local bench/scripts/seed-bench-users.mjs");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log(`[seed] Seeding ${COUNT} bench users -> profiles (bench_user_001 ...)`);
  if (dryRun) {
    console.log("[seed] dry-run: would insert", COUNT, "rows");
    return;
  }

  const rows = Array.from({ length: COUNT }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return {
      id: `bench_user_${n}`,
      email: `bench_${n}@invitro-code.test`,
      username: `bench_student_${n}`,
      role: "user",
      consent_status: "verified",
      consent_version: "v1",
      created_at: new Date().toISOString(),
    };
  });

  // Upsert 100 rows (onConflict id)
  const { data, error } = await supabase.from("profiles").upsert(rows, { onConflict: "id" }).select("id");
  if (error) {
    console.error("[seed] upsert failed:", error.message);
    console.error(error);
    process.exit(1);
  }
  console.log(`[seed] upserted ${data?.length ?? COUNT} profiles`);
  // Verify one
  const { data: check } = await supabase.from("profiles").select("id, consent_status").eq("id", "bench_user_001").maybeSingle();
  console.log("[seed] check bench_user_001:", check);
  console.log("[seed] Done. Use BENCH_SECRET=xxx and x-bench-user-id: bench_user_001 for bench.");
}

main();
