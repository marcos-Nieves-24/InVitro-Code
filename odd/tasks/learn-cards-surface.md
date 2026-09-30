# Feature: learn-cards-surface

## Objective
Unify expediciones cards with landing (surface-card, ModuleCardContent, tube, same favicon).

## Problem
Learn page uses glass-card + MODULE_FAVICON png, no ModuleCardContent, no progress tube.

## Why
Concordance with landing OrbitalModules and labs/proyectos cards.

## Scope
- src/app/learn/page.tsx
- src/components/landing/OrbitalModules.tsx (cleanup iconSrc)
- src/components/shared/ModuleCardContent.tsx (reuse, no change)

## Tasks
### T1 — Learn page to surface-card + ModuleCardContent + progress [pending]
### T2 — Cleanup OrbitalModules iconSrc [pending]

## Verification
- type-check, build, Playwright /learn and / (landing)
