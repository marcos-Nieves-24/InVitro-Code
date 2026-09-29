# Feature: dashboard-progreso-mision-tweaks

## Objective
Adjust "Tu Progreso" + "Misión Actual" dimensions, typography 2x/1.5x, roadmap placement, and bioreactor centering.

## Problem
Tu Progreso card has ~250px empty space below description; vessel xl stretches card; fonts too small; roadmap in header; bioreactor top-aligned not centered.

## Why
User requested via Playwright-verified dashboard.

## Scope
- src/components/dashboard/DashboardContainer.tsx (lines 118-237)
- src/components/dashboard/BioreactorProgress/BioreactorSvg.tsx:183 (circle cy)

## Constraints
- Dashboard only; no hero/tube/shell changes
- Keep BioreactorProgress vessel true (b36670f)
- Respect prefers-reduced-motion

## Tasks
### T1 — Tu Progreso layout + typography [x] c2ecd44
- Grid items-center, vessel xl->md, roadmap below description, 2x/1.5x scaling

### T2 — Mision Actual typography + spacing [x] c2ecd44
- p-4->p-6, fonts 2x/1.5x, Gem + favicon larger, button lg

### T3 — BioreactorSvg console fix [x] c2ecd44
- Move cy to initial

## Progress
- 2026-09-29: Created
- 2026-09-29: T1-T3 done in c2ecd44 — type-check + build pass

## Verification
- type-check, build, Playwright dashboard desktop/mobile + preview 0 errors
