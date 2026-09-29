# Feature: lab-crecimiento-duplicados

## Objective
Unificar métricas de laboratorios a % crecimiento, eliminar duplicados visuales en /laboratorios/[module].

## Problem
- 3 lugares muestran "% progreso" mientras el tubo muestra "% crecimiento" (incoherencia, mismo cálculo).
- BiotechGrowthTube renderiza texto interno duplicado debajo del tubo.
- Botón Empezar duplicado (hero CTA + standalone) en page.tsx; IntroConsole añade tercer CTA hacia #mision.
- ConsoleForModule duplicado en LabLandingHero y proyectos/[module]/page.

## Why
Claridad semántica y paridad labs/proyectos; reducir duplicación DRY.

## Scope
- src/app/(dashboard)/laboratorios/[module]/page.tsx
- src/components/labs/explorer/ModuleExplorerCard.tsx
- src/components/shared/ModuleCardContent.tsx
- src/components/dashboard/BiotechGrowthTube.tsx
- src/components/labs/consoles/IntroConsole.tsx
- src/lib/labs/consoleForModule.tsx (nuevo)

## Tasks
- [x] T1 — % crecimiento + borrar texto tubo
- [x] T2 — Eliminar Empezar duplicado
- [ ] T3 — Desduplicar consola

## Constraints
- No tocar DashboardContainer
- Mantener a11y (ariaText en tubo)
- Preservar LabProgressRing

## Verification
- type-check, build, Playwright /laboratorios y /laboratorios/ia

## Progress
- 2026-09-29: feature creada
- 2026-09-29: T1 done — % crecimiento unified, tube text removed, type-check green
- 2026-09-29: T2 done — standalone Empezar and IntroConsole CTA removed, type-check green
