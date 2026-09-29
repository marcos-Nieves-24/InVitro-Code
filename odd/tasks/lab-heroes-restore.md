# Feature: lab-heroes-restore

## Objective
Restore hub and module heroes for /laboratorios that were overwritten by merge a23e104 (odd/lab-journey-redesign).

## Problem
- Hub hero `LabHero.tsx` now shows pixel-art + console only, ignoring props and hiding RiveBioreactor. User's biorreactor is gone.
- Module heroes `/laboratorios/[module]` now use video-only `LabLandingHero` (HERO_VIDEOS) instead of `HeroWithConsole` + per-module consoles (Intro/Python/Stats/Ml/Hub). Breaks parity with `/proyectos/[module]`.
- Module page also lost lab_progress lifecycle UI (LabProgressRing, LabHistoryCard, smart resume).

## Why
User explicitly requested restoration. Maintains educational parity labs ↔ proyectos and preserves lab lifecycle UX shipped in 921573c/625c226.

## Scope
- `src/components/labs/LabHero/LabHero.tsx`
- `src/components/labs/landing/LabLandingHero.tsx`
- `src/app/(dashboard)/laboratorios/[module]/page.tsx`
- Verify `src/lib/labs/heroImages.ts` remains authoritative for lab/proyecto banners
- No change to dashboard BioreactorProgress (already preserved)

## Constraints
- Keep `RiveBioreactor` at `public/rive/bioreactor.riv` (exists, 356 bytes placeholder - verify content)
- Respect prefers-reduced-motion
- Follow dependency direction: domain <- application <- infrastructure <- presentation

## Tasks

### T1 — Restore hub LabHero with RiveBioreactor + HUD [x]
**Authorized scope:** `src/components/labs/LabHero/LabHero.tsx`
**Acceptance:** Hub shows RiveBioreactor on right, BUBBLES layer, HUD with level/rank, XP bar, streak, CTA scrolls to #hub. Props are used. Reduced-motion fallback works.
**Checks:** `npm run type-check`, visual /laboratorios

### T2 — Restore module LabLandingHero with HeroWithConsole + consoles [x]
**Authorized scope:** `src/components/labs/landing/LabLandingHero.tsx`
**Acceptance:** Uses `HeroWithConsole backgroundSrc={getLabHeroImage(moduleSlug)}` + `ConsoleForModule` (Intro/Python/Stats/Ml/Hub). Matches proyectos/[module] pattern.
**Checks:** `npm run type-check`, visual per module

### T3 — Restore module page lifecycle (progress ring, history cards, smart resume) [x]
**Authorized scope:** `src/app/(dashboard)/laboratorios/[module]/page.tsx`
**Acceptance:** Reads `lab_progress` with fallback to `progress`, renders `LabProgressRing`, smart CTA (Continuar/Empezar/Repasar), `LabHistoryCard` grid. Restores 921573c behavior.
**Checks:** `npm run type-check`, `npm run build`

## Progress
- 2026-09-29: Feature created, branch odd/lab-heroes-restore to be created. 0/3 tasks complete.
- 2026-09-29: T1 complete — restored hub LabHero with RiveBioreactor and HUD (c5b4a4b).
- 2026-09-29: T2 complete — restored module LabLandingHero with HeroWithConsole (8c76427). Expected intermediate type error in page.tsx pending T3.
- 2026-09-29: T3 complete — restored module page with lab_progress ring, LabHistoryCard, getLabResumeTarget (4f2171a). type-check and build passed.
- 2026-09-29: Fix LabHero visibility bugs — prefersReducedMotion opacity, Rive placeholder fallback to BioreactorProgress, SplitText safety (fix/labs-visibility).

## Verification Evidence
- npm run type-check: passed (0 errors) after T3 — T2 intermediate expected error resolved
- npm run build: passed (Compiled successfully, Generating static pages 21/21)
- T1 c5b4a4b: hub LabHero restored, BUBBLES + HUD verified
- T2 8c76427: LabLandingHero restored, HeroWithConsole + consoles verified
- T3 4f2171a: module page restored, lab_progress + LabProgressRing + LabHistoryCard verified
- Fix visibility (2026-09-29): hero opacity conditional on prefersReducedMotion, useLabHeroMotion sets opacity 1 on reduced-motion/failure, Rive placeholder fetch check + BioreactorProgress fallback, SplitText try/catch + gsap.context guard — type-check and build passed (21/21 pages)

## Next Step
- PR ready (single PR <400 lines, 4 work-unit commits). No change to LabLandingHero or module page.

## Delivery Strategy
- Single PR (forecast <400 lines). Work-unit commits per task.
