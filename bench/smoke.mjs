#!/usr/bin/env node
const BASE = process.env.APP_URL || "http://localhost:3000";
const LESSONS = [
  { module: "python", lesson: "lesson01_installing_python" },
  { module: "estadistica", lesson: "lesson01_descriptive_stats" },
  { module: "ia", lesson: "lesson01_what_is_ai" },
];

async function req(label, fn) {
  const start = Date.now();
  try {
    const res = await fn();
    const ms = Date.now() - start;
    const body = await res.text().then(t => t.slice(0, 200).replace(/\n/g, " "));
    console.log(`${label.padEnd(28)} -> ${res.status} ${ms}ms ${body.slice(0,80)}`);
    return { status: res.status, ms, ok: res.status < 400 || res.status === 401 || res.status === 302 || res.status === 307 };
  } catch (e) {
    console.log(`${label.padEnd(28)} -> ERR ${e.message}`);
    return { status: 0, ms: Date.now()-start, ok: false };
  }
}

async function smoke() {
  console.log(`[smoke] BASE=${BASE}`);
  const results = [];
  // 1. Public
  results.push(await req("GET /", () => fetch(`${BASE}/`)));
  // 2. Lessons (should redirect to sign-in if no auth -> 200 html with sign-in or 307)
  for (const l of LESSONS) {
    results.push(await req(`GET /learn/${l.module}/${l.lesson}`, () => fetch(`${BASE}/learn/${l.module}/${l.lesson}`, { redirect: "manual" })));
  }
  // 3. Progress unauth -> 401 expected
  results.push(await req("POST /api/progress unauth", () => fetch(`${BASE}/api/progress`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ module_slug: "python", lesson_slug: "lesson01_installing_python", completed: true }) })));
  // 4. Troll invalid -> 400 or 401
  results.push(await req("POST /api/progress troll", () => fetch(`${BASE}/api/progress`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ module_slug: "", lesson_slug: "" }) })));
  // 5. Lab progress unauth -> 401
  results.push(await req("POST /api/lab-progress unauth", () => fetch(`${BASE}/api/lab-progress`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ module_slug: "python", lesson_slug: "lesson01_installing_python", completion_status: "completed" }) })));
  // 6. Bookmarks unauth -> 401
  results.push(await req("GET /api/bookmarks unauth", () => fetch(`${BASE}/api/bookmarks`)));
  // 7. Concurrent burst: 20 parallel GET /
  console.log("\n[smoke] burst 20 parallel GET /");
  const start = Date.now();
  const burst = await Promise.all(Array.from({length: 20}, (_,i) => fetch(`${BASE}/`).then(r => r.status).catch(()=>0)));
  const elapsed = Date.now() - start;
  const ok = burst.filter(s=>s===200).length;
  console.log(`burst: ${ok}/20 OK in ${elapsed}ms (avg ${(elapsed/20).toFixed(1)}ms, RPS ~${(20000/elapsed).toFixed(1)}) statuses: ${burst.slice(0,5).join(",")}...`);

  const passed = results.filter(r=>r.ok).length;
  console.log(`\n[smoke] ${passed}/${results.length} checks OK`);
  if (passed < results.length) console.log("[smoke] Revisá: algún endpoint dio 500 (bug) o 404");
  else console.log("[smoke] ✅ Bench funciona - listo para k6 con más VUs");
}

smoke();
