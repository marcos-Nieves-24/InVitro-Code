---
name: react-best-practices
description: "React and Next.js performance optimization — 8 rule categories prioritized by impact (waterfalls, bundle, server/client perf, re-renders). Use when: writing a new component, doing data fetching, optimizing the bundle, or reviewing App Router code for performance."
metadata:
  author: vercel
  version: "1.0.0"
  adapted-for: invitro-code (Next 16 App Router + React 19 + Tailwind v4)
---

# React Best Practices

Performance rules for this stack: **Next.js 16 App Router, React 19, TypeScript, Tailwind v4**. Apply categories top-down — earlier categories have larger real-world impact. Do not micro-optimize before the waterfalls and bundle are clean.

## 1. Eliminating Waterfalls (highest impact)

Sequential `await`s are the single most common App Router perf bug.

- Start promises early, await late: create the promise, do synchronous work, then `await`.
- Run independent async work with `Promise.all([...])` instead of awaiting in series.
- Use `React.cache()` to dedupe the same fetch across a request (e.g. user lookup called by layout + page).
- Never `await` inside a loop when the iterations are independent — map to promises, then `Promise.all`.
- In this repo, lesson/quiz/lab file reads are independent: read them concurrently, not one-by-one.

## 2. Bundle Size

- Import only what you use: `import { X } from "lib"`, never `import * as`.
- Keep heavy client-only libs (Pyodide, Plotly, charting) out of server components and load them lazily.
- Check for accidental "use client" at the top of a file that pulls a large subtree into the client bundle.
- Prefer dynamic `import()` for below-the-fold or interaction-only code.
- `lucide-react` icons and MDX components should be tree-shaken; verify no barrel re-exports fan out.

## 3. Server-Side Performance

- This project's lesson pages are server components — keep `fs`/`matter`/`compileMDX` server-side, never import them into client files.
- Stream slow sections with `<Suspense>` + a fallback instead of blocking the whole page.
- Avoid re-reading files per request when the content is static; it's acceptable here but note it for scale.
- Derive data in server components and pass plain props down — do not re-fetch in client children.

## 4. Client-Side Data Fetching

- Prefer server components for initial data; use client fetching only for interactive/real-time needs.
- Deduplicate and cache with a stable key; avoid fetch-on-render waterfalls.
- Realtime is off in this project — gamification is server-rendered per request. Do not add `supabase.channel(...)` without also wiring subscription + publication.

## 5. Re-render Optimization

- `useMemo` for expensive derived values, `useCallback` for handlers passed to memoized children.
- Keep state as local as possible; lift only when siblings must share it.
- Split components so a state change re-renders the smallest subtree.

## 6. Rendering Performance

- Virtualize long lists; avoid rendering hundreds of DOM nodes for interactive labs.
- Use CSS transforms/opacity for animation (GPU-friendly); respect `prefers-reduced-motion`.
- Defer non-critical work off the render path (`startTransition`, `useDeferredValue`).

## 7. JavaScript Micro-optimizations

- Prefer `Map`/`Set` for membership tests over `Array.includes` in hot paths.
- Hoist constants and regexes out of render/loops.
- Only apply when it is both safe and clearly hot — measure first.

## 8. Advanced Patterns

- `useSyncExternalStore` only for true external stores, not component state.
- `React.cache()` for per-request server memoization; `unstable_cache`/`revalidate` for cross-request.
- Avoid `useEffect` for derived state — compute during render instead.

## How to apply

1. Identify the category that matches the change (data fetch → 1; new lib → 2; new client component → 5).
2. Fix the highest-impact category first; do not skip to micro-optimizations.
3. Verify with a real signal: `npm run build` output (bundle), or a profiler — never guess.
