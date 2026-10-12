---
name: vercel-optimize
description: "Vercel cost and performance audit — collect deployment metrics, investigate slow/expensive routes, produce a ranked optimization report. Use when: optimizing a deployed Vercel project, reducing bandwidth/function costs, or diagnosing slow production routes."
metadata:
  author: vercel
  version: "1.0.0"
  adapted-for: invitro-code (Next 16 App Router, deployed on Vercel)
---

# Vercel Optimize

Audit flow for a deployed Next.js project on Vercel. Goal: find the few changes that cut cost and latency the most, backed by real metrics — not opinions.

## Audit flow

### 1. Collect metrics

Gather evidence before proposing anything:

- Deployments: build time, output size, failed/redeploy churn.
- Functions: invocation count, duration (p50/p95), errors, cold starts per route.
- Edge/bandwidth: bytes served, cache hit ratio (static vs dynamic).
- Core Web Vitals: LCP/INP/CLS by route (Speed Insights).
- Logs: error rate and slow requests.

Do not rely on a single aggregate. Break metrics down **per route** and **per environment** (production vs preview).

### 2. Investigate routes

Work from the most expensive/least cached outward:

- Which routes are dynamic when they could be static? (Check `dynamic`, `revalidate`, cookies/headers usage.)
- Which server functions do heavy synchronous work (fs reads, MDX compile) on every request?
- Which client bundles are largest, and which heavy libs (Pyodide, Plotly) load when they don't need to?
- Are static assets and images cached with long `max-age` + immutable hashing?
- Is ISR/`revalidate` used where content changes rarely (lesson content is static)?

### 3. Rank the report

Output a ranked fix list, each item with: route/file, observed metric, proposed change, and expected impact.

Rank by **impact-to-effort**: a cache header or a `revalidate` export usually beats a refactor.

## Rule of thumb for this project

- Lesson pages read files from disk per request — fine now, but a candidate for static generation/caching as content grows (see `react-best-practices` category 1 & 3).
- Labs require network (Pyodide from jsdelivr + micropip from PyPI) — treat lab routes as inherently heavier; avoid compounding that with unoptimized bundles.
- The `/api/certify` route is an MVP stub — do not "optimize" it until it is real.

## Guardrails

- Evidence first: every recommendation cites a metric or a specific route.
- Never apply infra changes (env, cron, plan) without explicit user approval.
- Prefer reversible changes (cache headers, config) over irreversible ones.
- Never hardcode Vercel tokens/secrets in scripts or committed files.
