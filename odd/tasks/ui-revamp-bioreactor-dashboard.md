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

### T2 — Bioreactor física acoplada impeller-fluido + bubbles [x]
- **Description:** Implement coupled physics: impeller rotation drives fluid surface/movement + bubble emission; hook `useBioreactorMotion` drives `BioreactorSvg.tsx`; provide preview harness.
- **Files:** `src/components/dashboard/BioreactorProgress/BioreactorProgress.tsx`, `src/components/dashboard/BioreactorProgress/BioreactorSvg.tsx`, `src/components/dashboard/BioreactorProgress/useBioreactorMotion.ts`, `src/app/preview/bioreactor/page.tsx`
- **Acceptance:** Impeller speed ∝ fluid displacement + bubble rate; animation is frame-stable, pausable, respects reduced-motion.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☑ done — coupled physics implemented: rpm=60+120*h*(1-slip) slip=exp(-4h) duration=60/rpm, slosh 8*h*(rpm/120) mirrored, squash 0.9-0.3h amplitude ∝ rpm/120, bubbles 4+round(h*4) duration 3.2-1.5h; motion.g rotate impeller, reduced-motion static fallback; `type-check` PASS, `build` PASS

### T3 — TestTube component + Dashboard grid [x]
- **Description:** Create `TestTube` component; update Dashboard grid: remove Progreso/Logros/Proyecto cards, place Misión Actual next to Tu progreso, TestTube anchored in corner.
- **Files:** `src/components/dashboard/TestTube.tsx`, `src/components/dashboard/DashboardContainer.tsx`
- **Acceptance:** Grid renders without removed cards; Misión Actual adjacent to Tu progreso; TestTube visible in corner on desktop, stacked sensibly on mobile.
- **Verification:** `npm run type-check && npm run build`
- **Status:** ☑ done — `TestTube.tsx` (SVG tube lip+glass, `motion.rect` fill spring 180/15, clipPath `useId`, ticks 25/50/75, reduced-motion static, sizes sm/md/lg, brand tokens); `DashboardContainer.tsx` paired grid `md:grid-cols-2` (Tu progreso glass-card + Misión Actual glass-card), removed `ProgressSection`/`AchievementsSection`/Proyecto Actual+EMPTY, `overallProgress` from `modules` total/completed, TestTube `sm` flex-right on desktop + stacked `sm:hidden` on mobile, dead imports/vars purged; `type-check` PASS, `build` PASS

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
- 2026-09-24 — T2 completed: coupled bioreactor physics in `src/components/dashboard/BioreactorProgress/useBioreactorMotion.ts` (`getBioreactorPhysics`, `BioreactorPhysics` interface, slip/rpm/duration/slosh/squash/bubbles) and `src/components/dashboard/BioreactorProgress/BioreactorSvg.tsx` (motion.g impeller rotate duration=60/rpm, sloshGroup x=[-A,A] duration=2*duration, squash scaleY [1,squashMin,1] duration 0.9-0.3h, bubbles sliced 4+round(h*4) duration 3.2-1.5h delay 0-1.6, spring stiffness 180+40h, reduced-motion branches preserved, clipPath/a11y IDs intact); verified preview harness `src/app/preview/bioreactor/page.tsx` still works (slider 0-100).
- 2026-09-24 — T3 completed: created `src/components/dashboard/TestTube.tsx` (SVG tube 48×96 viewBox, lip+glass `var(--color-slate)`, liquid `linearGradient brand-600→brand-400→brand-300` via `motion.rect` spring 180/15 mass 0.8, clipPath `useId` unique, ticks at 25/50/75 with opacity by progress, `size` sm/md/lg, `label` mono, reduced-motion static `rect`+no scale, `role=progressbar`); restructured `src/components/dashboard/DashboardContainer.tsx` to paired grid (removed `ProgressSection`/`AchievementsSection` imports+usages, deleted `#mission` Proyecto Actual card+EMPTY and `projectModule`/`recentAchievements` logic, moved Misión Actual card into Tu progreso `md:grid-cols-2`, computed `overallProgress` via `modules.reduce`+`completedLessonKeys.size`, placed `TestTube` right-flex `hidden sm:flex` desktop + `sm:hidden` stacked mobile, preserved `BioreactorProgress`/`HeroSection`/gamification, purged dead `EMPTY_STATES`/`evaluateAchievements`/`getLessonSlugs`/`ProjectIcon`.

## Verification Evidence
- `npm run type-check` — PASS (tsc --noEmit, no errors) — T1
- `npm run build` — PASS (Next.js 16.2.10 Turbopack, Compiled successfully, warn only: `middleware` → `proxy` deprecation) — T1
- Checked: `white` text on `var(--color-brand-950) #22005A` contrast ok; `glass-card`, `hud`, `hero-terminal`, `comic-bg/border` resolve via `var()`; no hardcoded hex outside `@theme`; scientist `absolute bottom-0` inside `relative` hero not clipped (`overflow-hidden` container contains absolute).
- `npm run type-check` — PASS (tsc --noEmit, no errors) — T2 (BioreactorSvg + useBioreactorMotion physics, impeller/slosh/squash/bubbles, preserves clipPath vesselInnerClip, IDs standBase/impellerGroup/motor, a11y role=img/progressbar)
- `npm run build` — PASS (Next.js 16.2.10 Turbopack, Compiled successfully 13.5s, Generating static pages 19/19, warn only middleware→proxy) — T2, preview route `/preview/bioreactor` built, no regression in DashboardContainer/BioreactorProgress orchestrator
- Checked: rpm 60→178 as h 0→1 (slip exp(-4h) low-fill slip, high-fill coupled), impellerDuration 1.0s→0.34s drives sloshAmplitude 0→11.9 and squashDuration 0.9→0.6s + squashMin ∝ rpm/120; bubbles visible 4→8, bubbleDuration 3.2→1.7s, delay spread 0-1.6; prefers-reduced-motion renders static ellipses/bubbles, no motion.g animate; liquidGrad still fog→mint via brand tokens.
- `npm run type-check` — PASS (tsc --noEmit, no errors) — T3 (TestTube `useId` clipPath unique, motion.rect spring 180/15, brand tokens, DashboardContainer no dead imports/vars, overallProgress calc)
- `npm run build` — PASS (Next.js 16.2.10 Turbopack, Compiled successfully 13.9s, Generating static pages 19/19, warn only middleware→proxy) — T3, dashboard route built without ProgressSection/AchievementsSection/Proyecto Actual, no empty placeholders, no dead hrefs (`#mission`→removed, `#modules` links removed), grid `md:grid-cols-2` paired, TestTube sm visible corner desktop + stacked mobile, Bioreactor untouched
- Checked: TestTube `progress` 0–100 clamp, fillH = h*76, ticks at 69.5/49/28.5 y with opacity by threshold, surface ellipse scaleX pulse 2.2s, reduced-motion branch static rect+ellipse no motion; Dashboard glass-card `overflow-hidden` prevents tube overflow, mobile `sm:hidden` vs desktop `hidden sm:flex` no overlap with text, flexible min-w-0 title truncation safe.

## Next Step
Start T4 (SlideArrowButton + TypingText) — T1–T3 done, T4–T5 remain unchecked.

---
*Locator: `odd/tasks/ui-revamp-bioreactor-dashboard.md` | Engram mirror: `odd/ui-revamp-bioreactor-dashboard/tasks`*
