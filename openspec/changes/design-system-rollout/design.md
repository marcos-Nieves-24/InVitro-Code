# Design — DESIGN.md "Laboratorio Digital" Rollout

## Decision 1 — Token strategy (foundation)

**What**: Replace the Material 3 palette in `globals.css` `@theme` with DESIGN.md tokens, then delete the old Material 3 vars.

**Mapping table** (DESIGN.md token → CSS var → Tailwind utility):

| DESIGN.md | CSS var | Tailwind utility | Old token (remove) |
|-----------|---------|-----------------|--------------------|
| ink #000000 | `--color-ink` | `bg-ink` / `text-ink` | `--color-deep-navy` (partial) |
| graphite #2a272a | `--color-graphite` | `bg-graphite` | — |
| slate #4b4a54 | `--color-slate` | `text-slate` | `--color-on-surface-variant` (approx) |
| storm #677381 | `--color-storm` | `text-storm` | `--color-storm` (exists) |
| fog #82a0aa | `--color-fog` | `text-fog` / `bg-fog` | — |
| mint #a3cfcd | `--color-mint` | `bg-mint` / `text-mint` | `--color-teal-500` / `--color-primary` |
| surface #f4f6f8 | `--color-surface` | `bg-surface` | `--color-surface` (exists, adjust hex) |
| surface-card #fff | `--color-surface-card` | `bg-surface-card` | `--color-surface-container-lowest` |
| surface-raised #e8ecf0 | `--color-surface-raised` | `bg-surface-raised` | `--color-surface-container` |

Spacing/radius/shadow added verbatim from §1.3–1.4.

**Why**: Single source of truth; avoids dual-theme drift the user explicitly rejected.
**Tradeoff**: Large blast radius — every component referencing a removed var must be migrated in the same change. Mitigation: a migration cheat-sheet (Decision 4) and per-phase Playwright verification.

## Decision 2 — Font pipeline

**What**: `next/font/google` → Inter as `--font-body`, Space Grotesk as `--font-display`, JetBrains Mono as `--font-mono`. Fix the current DM_Sans body bug.

**Why**: DESIGN.md §1.2 mandates Inter body. The current `layout.tsx` (DM_Sans) is wrong.
**Tradeoff**: Inter is a different metric than DM_Sans; verify body-text spacing on 3 key screens.

## Decision 3 — Animation architecture

- **Page fade-in**: CSS `@keyframes fade-in` applied to a route `<main>` wrapper (no JS). 200ms opacity 0→1.
- **Scroll reveals**: `useScrollReveal` hook (client) using IntersectionObserver; adds `.is-visible`; CSS does `translateY(12px)→0 + opacity`. Elements opt in via `data-reveal`.
- **Skeleton**: new `Skeleton` component with `pulse` keyframe (`@keyframes skeleton-pulse`).
- **Terminal typing + cursor blink**: reuse existing `.hero-terminal` / `.animate-cursor-blink` but retheme to ink bg + mint prompt; keep `.hero-terminal-body` light text.
- **All new animations** wrapped in `@media (prefers-reduced-motion: reduce)` → `animation: none`.

**Why**: CSS-only transitions + one small IntersectionObserver hook = minimal JS, framework-idiomatic.
**Tradeoff**: Scroll-reveal adds a client component boundary; keep it leaf-level to avoid hydration cost.

## Decision 4 — Component restyling cheat-sheet

Recurring migrations (find → replace across `src/components/**` and route files):

| Old | New |
|-----|-----|
| `bg-primary` / `text-primary` / `bg-primary-fixed` | `bg-mint` / `text-ink` / `bg-fog/20` |
| `text-on-primary` | `text-ink` |
| `bg-tertiary-fixed` / `text-tertiary` | `bg-mint/30` / `text-mint` |
| `bg-surface-container` / `border-outline-variant` | `bg-surface-raised` / `border-surface-raised` |
| `text-on-surface` | `text-ink` |
| `text-on-surface-variant` | `text-storm` |
| `text-outline` | `text-storm` |
| `bg-surface-container-high` | `bg-surface-raised` |
| `bg-deep-navy/30` (mobile backdrop) | `bg-graphite/40` |
| `shadow-primary/30` etc. | `shadow-glow` / `shadow-md` |

Glass cards keep `backdrop-blur` but recolor stroke to `surface-raised`.

## Decision 5 — Landing hero

Remove `.hero-neural-canvas` markup + `.hero-neural-*` keyframes/classes from `page.tsx` and `globals.css`. Keep the terminal-typing element (retained as signature). Hero bg = `ink`, CTAs = `mint`.

**Why**: DESIGN.md §4.1 shows a simple dark hero + terminal; neural net is out of scope and a perf/complexity cost.
**Tradeoff**: Loses the " bioluminescent" flair; acceptable per user decision "Seguir el DESIGN.md".

## Decision 6 — InVitroTopBar

New sticky `<header>` consuming `totalXp`, `currentStreak`, `trail` props. Themed: mint XP pill, fog/storm streak, storm breadcrumb. Integrated into `InVitroShell` above `<main>`. Replaces the inline top bar currently duplicated in `dashboard/page.tsx`.

**Why**: DESIGN.md §2.1 + §4.5 require a reusable top bar; avoids duplication.
**Tradeoff**: Dashboard page must be refactored to use the component instead of inline header.

## Risks

1. **Token-swap blast radius** (HIGH): one missed old var breaks a screen. Mitigation: grep old vars after each phase; Playwright screenshot every route.
2. **800-line budget** (MED): restyling ~50 files exceeds 800 lines. Mitigation: chain PRs by phase (ask-on-risk); each phase = work unit.
3. **reduced-motion coverage** (MED): new animations must all respect the media query. Mitigation: central `@media` block in globals.css.
4. **Vercel build** (LOW): no local build gate. Mitigation: `npm run type-check` + Playwright per commit.
