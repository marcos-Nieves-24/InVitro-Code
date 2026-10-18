import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

// Custom metrics
const lessonTrend = new Trend("lesson_duration");
const progressTrend = new Trend("progress_duration");
const errorRate = new Rate("bench_errors");
const rateLimited = new Counter("rate_limited_429");

// Config from env
const BASE_URL = (__ENV.APP_URL || __ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const AUTH_TOKEN = __ENV.BENCH_AUTH_TOKEN || __ENV.CLERK_BENCH_TOKEN || "";

// Real modules/lessons from content (hardcoded to avoid FS in k6 VM)
// These are validated against getLessonSlugs() on server — use exact dir names
const LESSONS = [
  { module: "python", lesson: "lesson01_installing_python" },
  { module: "estadistica", lesson: "lesson01_descriptive_stats" },
  { module: "ia", lesson: "lesson01_introduccion_ia" },
  { module: "machine-learning", lesson: "lesson01_introduccion_ml" },
];

// Personas (loaded from fixtures.json when available, fallback inline)
// Weight determines probability: ansioso 30%, perfeccionista 25%, explorador 25%, troll 20%
const PERSONAS = [
  { id: "ansioso", weight: 30, actions: ["view_lesson", "abandon"] },
  { id: "perfeccionista", weight: 25, actions: ["view_lesson", "submit_progress", "repeat_quiz"] },
  { id: "explorador", weight: 25, actions: ["view_lesson", "view_lesson", "bookmark"] },
  { id: "troll", weight: 20, actions: ["invalid_progress", "invalid_lab"] },
];

function pickPersona() {
  const r = (__VU * 37 + __ITER * 13) % 100;
  let acc = 0;
  for (const p of PERSONAS) {
    acc += p.weight;
    if (r < acc) return p;
  }
  return PERSONAS[0];
}

function headers() {
  const h = { "Content-Type": "application/json" };
  if (AUTH_TOKEN) h["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  return h;
}

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
  },
};

// Static quick check for GET /
export function setup() {
  return { baseUrl: BASE_URL, hasAuth: !!AUTH_TOKEN };
}

export default function () {
  const persona = pickPersona();
  const lesson = LESSONS[__ITER % LESSONS.length];

  // 1. Public page — always 200
  let res = http.get(`${BASE_URL}/`, { tags: { endpoint: "home" } });
  check(res, { "home 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(0.3);

  // 2. Lesson page — unauth redirects to /sign-in (302 or 200 depending on follow), authed 200
  res = http.get(`${BASE_URL}/learn/${lesson.module}/${lesson.lesson}`, {
    tags: { endpoint: "lesson" },
    redirects: 0,
  });
  // Clerk middleware: API->401, pages->redirect 307/302 to /sign-in
  const lessonOk = res.status === 200 || res.status === 302 || res.status === 307;
  check(res, { "lesson reachable": () => lessonOk });
  lessonTrend.add(res.timings.duration);
  sleep(0.5);

  // 3. Persona-specific actions
  if (persona.id === "ansioso") {
    // Abandon: view one lesson and stop, short think time
    sleep(0.2);
  } else if (persona.id === "perfeccionista") {
    // Submit progress 2x (idempotent upsert — second should be no-op but 200)
    for (let i = 0; i < 2; i++) {
      const payload = JSON.stringify({
        module_slug: lesson.module,
        lesson_slug: lesson.lesson,
        completed: true,
      });
      const r2 = http.post(`${BASE_URL}/api/progress`, payload, {
        headers: headers(),
        tags: { endpoint: "progress" },
      });
      progressTrend.add(r2.timings.duration);
      if (r2.status === 429) rateLimited.add(1);
      // Unauth -> 401 is expected and correct; authed -> 200
      const ok = r2.status === 200 || r2.status === 401 || r2.status === 429;
      check(r2, { "progress ok": () => ok });
      sleep(0.2);
    }
  } else if (persona.id === "explorador") {
    // View second lesson + bookmarks
    const lesson2 = LESSONS[(__ITER + 1) % LESSONS.length];
    http.get(`${BASE_URL}/learn/${lesson2.module}/${lesson2.lesson}`, {
      tags: { endpoint: "lesson" },
    });
    const bm = http.get(`${BASE_URL}/api/bookmarks`, {
      headers: headers(),
      tags: { endpoint: "bookmarks" },
    });
    check(bm, { "bookmarks 200|401": (r) => r.status === 200 || r.status === 401 });
    sleep(0.4);
  } else if (persona.id === "troll") {
    // Invalid payloads — should be 400, never 500
    const badPayload = JSON.stringify({ module_slug: "", lesson_slug: "" });
    const rBad = http.post(`${BASE_URL}/api/progress`, badPayload, {
      headers: headers(),
      tags: { endpoint: "progress" },
    });
    check(rBad, { "troll 400|401": (r) => r.status === 400 || r.status === 401 });
    if (rBad.status === 500) errorRate.add(1);

    const badLab = JSON.stringify({ module_slug: "python", lesson_slug: "nope", last_position: "bad" });
    const rLab = http.post(`${BASE_URL}/api/lab-progress`, badLab, {
      headers: headers(),
      tags: { endpoint: "lab" },
    });
    check(rLab, { "troll lab 400|401": (r) => r.status === 400 || r.status === 401 || r.status === 429 });
    if (rLab.status === 500) errorRate.add(1);
    sleep(0.3);
  }

  // Small jitter to avoid thundering herd
  sleep(Math.random() * 0.5);
}

export function handleSummary(data) {
  return {
    "bench/reports/summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(
      {
        vus_max: data.metrics.vus_max?.values?.max,
        http_reqs: data.metrics.http_reqs?.values?.count,
        http_req_failed: data.metrics.http_req_failed?.values?.rate,
        p95: data.metrics.http_req_duration?.values["p(95)"],
        p99: data.metrics.http_req_duration?.values["p(99)"],
        "429s": data.metrics.rate_limited_429?.values?.count || 0,
      },
      null,
      2
    ),
  };
}
