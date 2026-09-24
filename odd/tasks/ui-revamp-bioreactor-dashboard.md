# Feature: ui-revamp-bioreactor-dashboard

## Objective
Revamp dashboard/biota visuals: scientific palette, hero with scientist anchored bottom-0, coupled bioreactor physics (impeller-fluid + bubbles), TestTube grid cleanup, and micro-interactions (SlideArrowButton + TypingText).

## Problem
Current dashboard lacks scientific identity: generic palette, static bioreactor illustration, cluttered grid (Progreso/Logros/Proyecto), and no motion polish or hero anchoring.

## Why
Align UI with biotech lab aesthetic; improve hierarchy and engagement; add physics-driven feedback to reinforce learning context.

## Scope
- Palette & HeroBanner layout
- BioreactorSvg + motion hook + preview
- TestTube component + Dashboard grid restructure
- SlideArrowButton + TypingText adaptation and integration
- Out of scope: data model changes, auth, content/MDX, backend

## Constraints
- Tailwind v4 / globals.css is source of truth for palette (no hardcoded hex outside tokens)
- Existing lesson rendering and MDX pipeline untouched
- Standard Mode verification (no strict TDD)
- Keep verified build: `npm run type-check` + `npm run build`

## Tasks

### T1 — Paleta + Hero científica [x]
- **Description:** Map palette #22005A → #45DCC6 + #FFFFFF in globals.css (primitive → semantic tokens); adjust HeroBanner so scientist image is `absolute bottom-0` with correct z-index/containment.
- **Files:** `src/app/globals.css`, `src/components/dashboard/HeroBanner.tsx` (or equivalent hero path)
- **Acceptance:** Tokens resolve in both light/dark contexts; hero image pinned to bottom edge at all breakpoints; no overflow/clipping.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☑ done — palette brand scale + hero anchoring implemented; `type-check` PASS, `build` PASS (warn only)

### T2 — Bioreactor física acoplada impeller-fluido + bubbles [ ]
- **Description:** Implement coupled physics: impeller rotation drives fluid surface/movement + bubble emission; hook `useBioreactorMotion` drives `BioreactorSvg.tsx`; provide preview harness.
- **Files:** `src/components/lab/BioreactorSvg.tsx`, `src/hooks/useBioreactorMotion.ts`, `src/app/(preview)/bioreactor/page.tsx` (or `src/components/lab/__preview__/`)
- **Acceptance:** Impeller speed ∝ fluid displacement + bubble rate; animation is frame-stable, pausable, respects reduced-motion.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☐ unchecked

### T3 — TestTube component + Dashboard grid [ ]
- **Description:** Create `TestTube` component; update Dashboard grid: remove Progreso/Logros/Proyecto cards, place Misión Actual next to Tu progreso, TestTube anchored in corner.
- **Files:** `src/components/dashboard/TestTube.tsx`, `src/components/dashboard/DashboardGrid.tsx` (or `src/app/(dashboard)/page.tsx`)
- **Acceptance:** Grid renders without removed cards; Misión Actual adjacent to Tu progreso; TestTube visible in corner on desktop, stacked sensibly on mobile.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☐ unchecked

### T4 — SlideArrowButton + TypingText [ ]
- **Description:** Adapt provided snippets into `SlideArrowButton` and `TypingText`; integrate into HeroBanner and DashboardContainer with accessible labels and motion.
- **Files:** `src/components/ui/SlideArrowButton.tsx`, `src/components/ui/TypingText.tsx`, `src/components/dashboard/HeroBanner.tsx`, `src/components/dashboard/DashboardContainer.tsx`
- **Acceptance:** Buttons show slide arrow affordance + keyboard focus; TypingText animates with cursor, respects reduced-motion, no layout shift.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☐ unchecked

### T5 — Integración, pulido y verificación final [ ]
- **Description:** Cross-task integration polish, responsive QA, a11y check, and final build/type gate.
- **Files:** `odd/tasks/ui-revamp-bioreactor-dashboard.md`, touched UI files above
- **Acceptance:** All T1–T4 acceptance met together; no visual regressions; `type-check` and `build` green.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☐ unchecked

## Authorized Scope
Dashboard/biota UI revamp only (palette, hero, bioreactor, dashboard grid, micro-interactions). No schema, auth, or content pipeline changes.

## TDD Mode
Standard Mode — `strict_tdd: false` per `sdd-init` / `openspec/config.yaml`. No RED requirement; ordinary functional checks (`type-check` + `build`) per task.

## Delivery Strategy
`ask-on-risk` (default). Forecast ~800 authored lines; if running count exceeds ~400, split via `stacked-to-main` or `feature-branch-chain` after user confirmation.

## Forecast
- **Authored lines:** ~800 (additions + deletions, generated excluded)
- **Files:** 8–10 (globals.css, HeroBanner, BioreactorSvg, useBioreactorMotion, preview, TestTube, Dashboard grid/container, SlideArrowButton, TypingText)
- **Work-unit commits:** 4–5 (one per T1–T4 + T5 polish)

## Progress
- 2026-09-24 — Feature document created; no source writes yet. All tasks ☐ unchecked.
- 2026-09-24 — T1 completed: mapped scientific palette (#22005A → #45DCC6 + #FFFFFF) in `src/app/globals.css` via `--color-brand-*` + rewired semantics (`--color-comic-bg/border`, `--color-mint/fog/slate`); fixed HeroBanner anchoring (`absolute bottom-0 right-8 lg:right-12`, `items-end`, `pb-0`) in both `LegacyStatic` + `HeroComic`; figure removed from flex flow, responsive `hidden lg:block` preserved. Commit: `<pending — not committed per T1 instructions>` (branch `odd/ui-revamp-bioreactor-dashboard`).

## Verification Evidence
- `npm run type-check` — PASS (tsc --noEmit, no errors)
- `npm run build` — PASS (Next.js 16.2.10 Turbopack, Compiled successfully, warn only: `middleware` → `proxy` deprecation)
- Checked: `white` text on `var(--color-brand-950) #22005A` contrast ok; `glass-card`, `hud`, `hero-terminal`, `comic-bg/border` resolve via `var()`; no hardcoded hex outside `@theme`; scientist `absolute bottom-0` inside `relative` hero not clipped (`overflow-hidden` container contains absolute).

## Next Step
Start T2 (Bioreactor física acoplada) — T1 done, other tasks remain unchecked.

---
*Locator: `odd/tasks/ui-revamp-bioreactor-dashboard.md` | Engram mirror: `odd/ui-revamp-bioreactor-dashboard/tasks`*
