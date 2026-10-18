import http from "k6/http";
import { check, sleep, group } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

const BASE_URL = (__ENV.APP_URL || __ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const BENCH_SECRET = __ENV.BENCH_SECRET || "";
const BROWSER_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// If BENCH_SECRET not set, we still test unauth flows (will get 401 for writes — not a crash)
// With secret, we simulate real writes until DB / Supabase / rate-limit breaks

const LESSONS = [
  { module: "python", lesson: "lesson01_installing_python" },
  { module: "python", lesson: "lesson03_variables" },
  { module: "python", lesson: "lesson06_functions" },
  { module: "estadistica", lesson: "lesson01_descriptive_stats" },
  { module: "estadistica", lesson: "lesson03_probability" },
  { module: "ia", lesson: "lesson01_what_is_ai" },
  { module: "ia", lesson: "lesson02_how_ai_learns" },
  { module: "machine-learning", lesson: "lesson01_ml_fundamentals" },
  { module: "machine-learning", lesson: "lesson02_linear_regression" },
];

// 4 student archetypes — weights sum to 100
const JOURNEYS = [
  { id: "explorador", weight: 30, steps: ["dashboard", "browse3", "bookmark"] },
  { id: "completador", weight: 30, steps: ["lesson", "lab", "progress", "streak"] },
  { id: "procrastinador", weight: 20, steps: ["lesson", "abandon"] },
  { id: "intensivo", weight: 20, steps: ["lesson", "lab", "progress", "bookmark", "lesson2", "lab2", "progress2"] },
];

function pickJourney() {
  const r = (__VU * 73 + __ITER * 17) % 100;
  let acc = 0;
  for (const j of JOURNEYS) {
    acc += j.weight;
    if (r < acc) return j;
  }
  return JOURNEYS[0];
}

function benchUserId() {
  // Cycle through 100 bench users to distribute rate-limit and avoid single-user 429
  // Also includes VU to avoid collisions but still realistic per-user load
  const pool = 100;
  const n = ((__VU - 1) % pool) + 1;
  return `bench_user_${String(n).padStart(3, "0")}`;
}

function benchHeaders(userId) {
  const h = {
    "Content-Type": "application/json",
    "User-Agent": BROWSER_UA,
  };
  if (BENCH_SECRET && userId) {
    h["x-bench-secret"] = BENCH_SECRET;
    h["x-bench-user-id"] = userId;
  }
  return h;
}

function browserHeaders() {
  return { "User-Agent": BROWSER_UA, Accept: "text/html,application/xhtml+xml" };
}

// Custom metrics
const progressTrend = new Trend("progress_write_duration");
const labTrend = new Trend("lab_write_duration");
const pageTrend = new Trend("page_duration");
const errorRate = new Rate("students_errors");
const challengeCounter = new Counter("vercel_challenge_403");

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    // Crash definition: p95 >2s OR error >5% OR 429 >10% OR challenge >5%
    http_req_duration: ["p(95)<2000"],
    students_errors: ["rate<0.05"],
    http_req_failed: ["rate<0.10"],
  },
};

export default function () {
  const journey = pickJourney();
  const userId = benchUserId();
  const lesson = LESSONS[__ITER % LESSONS.length];
  const lesson2 = LESSONS[(__ITER + 1) % LESSONS.length];

  group(`student ${journey.id}`, () => {
    // 1. Public home — always 200 (or 403 challenge under WAF)
    let res = http.get(`${BASE_URL}/`, { headers: browserHeaders(), tags: { endpoint: "home" } });
    if (res.headers["X-Vercel-Mitigated"] === "challenge" && res.status === 403) {
      challengeCounter.add(1);
    }
    check(res, { "home 200|403": (r) => r.status === 200 || r.status === 403 });
    pageTrend.add(res.timings.duration);
    if (res.status === 500) errorRate.add(1);
    sleep(0.5);

    // 2. Dashboard (protected — 307 redirect unauth, 200 authed)
    res = http.get(`${BASE_URL}/dashboard`, { headers: browserHeaders(), redirects: 0, tags: { endpoint: "dashboard" } });
    const dashOk = res.status === 200 || res.status === 307 || res.status === 302 || res.status === 308 || (res.status === 403 && res.headers["X-Vercel-Mitigated"] === "challenge");
    check(res, { "dashboard reachable": () => dashOk });
    sleep(0.3);

    if (journey.steps.includes("abandon")) {
      sleep(0.5);
      return;
    }

    // 3. Lesson page
    group("lesson", () => {
      res = http.get(`${BASE_URL}/learn/${lesson.module}/${lesson.lesson}`, {
        headers: browserHeaders(),
        redirects: 0,
        tags: { endpoint: "lesson" },
      });
      const ok = res.status === 200 || res.status === 307 || res.status === 302 || res.status === 308 || res.status === 403;
      check(res, { "lesson 200|redirect": () => ok });
      pageTrend.add(res.timings.duration);
      if (res.status === 500) errorRate.add(1);
      sleep(0.8);
    });

    if (journey.steps.includes("browse3")) {
      for (let i = 0; i < 2; i++) {
        const l = LESSONS[(__ITER + i + 1) % LESSONS.length];
        res = http.get(`${BASE_URL}/learn/${l.module}/${l.lesson}`, {
          headers: browserHeaders(),
          redirects: 0,
          tags: { endpoint: "lesson" },
        });
        check(res, { "browse lesson": (r) => r.status === 200 || r.status === 307 || r.status === 302 || r.status === 308 || r.status === 403 });
        sleep(0.4);
      }
    }

    // 4. Lab + Progress (the DB write path — this is where crash happens)
    if (journey.steps.includes("lab") || journey.steps.includes("lab2")) {
      group("lab+progress", () => {
        // Lab progress
        const labPayload = JSON.stringify({
          module_slug: lesson.module,
          lesson_slug: lesson.lesson,
          completion_status: "completed",
          last_position: { page: 1, scroll: 100 },
        });
        let rLab = http.post(`${BASE_URL}/api/lab-progress`, labPayload, {
          headers: benchHeaders(userId),
          tags: { endpoint: "lab" },
        });
        if (rLab.headers["X-Vercel-Mitigated"] === "challenge") challengeCounter.add(1);
        labTrend.add(rLab.timings.duration);
        const labOk = rLab.status === 200 || rLab.status === 401 || rLab.status === 400 || rLab.status === 429 || rLab.status === 403;
        check(rLab, { "lab 200|401|400|429": () => labOk });
        if (rLab.status === 500) errorRate.add(1);
        if (rLab.status === 429) {
          // rate-limited — back off
          sleep(1);
        }
        sleep(0.3);

        // Progress
        const progPayload = JSON.stringify({
          module_slug: lesson.module,
          lesson_slug: lesson.lesson,
          completed: true,
        });
        let rProg = http.post(`${BASE_URL}/api/progress`, progPayload, {
          headers: benchHeaders(userId),
          tags: { endpoint: "progress" },
        });
        if (rProg.headers["X-Vercel-Mitigated"] === "challenge") challengeCounter.add(1);
        progressTrend.add(rProg.timings.duration);
        const progOk = rProg.status === 200 || rProg.status === 401 || rProg.status === 400 || rProg.status === 429 || rProg.status === 403;
        check(rProg, { "progress 200|401|400|429": () => progOk });
        if (rProg.status === 500) errorRate.add(1);
        sleep(0.3);

        if (journey.steps.includes("lab2")) {
          const lab2Payload = JSON.stringify({
            module_slug: lesson2.module,
            lesson_slug: lesson2.lesson,
            completion_status: "in_progress",
            last_position: { page: 2 },
          });
          rLab = http.post(`${BASE_URL}/api/lab-progress`, lab2Payload, {
            headers: benchHeaders(userId),
            tags: { endpoint: "lab" },
          });
          check(rLab, { "lab2 200|401": () => rLab.status === 200 || rLab.status === 401 || rLab.status === 429 || rLab.status === 403 });
          if (rLab.status === 500) errorRate.add(1);
          sleep(0.2);
          const prog2 = JSON.stringify({ module_slug: lesson2.module, lesson_slug: lesson2.lesson, completed: true });
          rProg = http.post(`${BASE_URL}/api/progress`, prog2, {
            headers: benchHeaders(userId),
            tags: { endpoint: "progress" },
          });
          check(rProg, { "progress2 200|401": () => rProg.status === 200 || rProg.status === 401 || rProg.status === 429 || rProg.status === 403 });
          if (rProg.status === 500) errorRate.add(1);
        }
      });
    }

    // 5. Bookmark
    if (journey.steps.includes("bookmark")) {
      const bmPayload = JSON.stringify({ module_slug: lesson.module, lesson_slug: lesson.lesson });
      const rBm = http.post(`${BASE_URL}/api/bookmarks`, bmPayload, {
        headers: benchHeaders(userId),
        tags: { endpoint: "bookmark" },
      });
      if (rBm.headers["X-Vercel-Mitigated"] === "challenge") challengeCounter.add(1);
      const bmOk = rBm.status === 200 || rBm.status === 401 || rBm.status === 400 || rBm.status === 429 || rBm.status === 403;
      check(rBm, { "bookmark 200|401": () => bmOk });
      if (rBm.status === 500) errorRate.add(1);
      sleep(0.2);
      // GET bookmarks
      const rGet = http.get(`${BASE_URL}/api/bookmarks`, {
        headers: benchHeaders(userId),
        tags: { endpoint: "bookmark" },
      });
      check(rGet, { "get bookmarks 200|401": (r) => r.status === 200 || r.status === 401 || r.status === 403 });
      if (rGet.status === 500) errorRate.add(1);
    }

    // Jitter
    sleep(Math.random() * 1.0);
  });
}

export function handleSummary(data) {
  const m = data.metrics;
  const gv = (o) => o?.values ?? o ?? {};
  return {
    "bench/reports/students-summary.json": JSON.stringify(data, null, 2),
    stdout: JSON.stringify(
      {
        vus_max: gv(m.vus_max)?.max ?? gv(m.vus)?.max,
        http_reqs: gv(m.http_reqs)?.count,
        rps: gv(m.http_reqs)?.rate?.toFixed(1),
        p95: gv(m.http_req_duration)?.["p(95)"]?.toFixed(1),
        p99: gv(m.http_req_duration)?.["p(99)"]?.toFixed(1),
        errors: gv(m.students_errors)?.rate,
        challenge: gv(m.vercel_challenge_403)?.count,
        checks_failed: gv(m.checks)?.fails,
      },
      null,
      2
    ),
  };
}
