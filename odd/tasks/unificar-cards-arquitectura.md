# Unificar Cards Arquitectura — ModuleCard + LessonCard

## Objetivo
Unificar ModuleCard y LessonCard bajo arquitectura limpia: domain puro (cero dependencia UI), application/infrastructure/presentation después. Cards testeables, theme resuelto en UI.

## Fases
- [x] FASE 1 — Dominio puro + tests (cero riesgo UI)
  - [x] `src/domain/module-card.ts` — ModuleCardModel + buildModuleCardModel (puro, xp inyectado, progressPct math, sin theme)
  - [x] `src/domain/lesson-card.ts` — LessonCardState + LessonCardModel + normalizeDifficulty + buildLessonCardModel (xp inyectado, state blocked>completed>available, prereq filtering)
  - [x] `src/domain/module-card.test.ts` — 12 casos (progressPct null/0/20%/33%/100%, xp passthrough, labCount defaults)
  - [x] `src/domain/lesson-card.test.ts` — 18 casos (state, difficulty normalize, xp passthrough, prerequisites filtering, estimatedDuration)
  - [x] `type-check` PASS, `test` 174/174 PASS (18 files)
  - Commit: `feat(cards): dominio puro ModuleCard + LessonCard models + tests`
- [ ] FASE 2 — Application/Infrastructure adapters (cuando se defina)
- [ ] FASE 3 — UI unificada (migrar LabCard/ModuleExplorerGrid a domain)

## Decisión clave
**Domain puro sin theme ni xp calculation.** `buildModuleCardModel` y `buildLessonCardModel` reciben `xpReward`/`xp` como param (caller calcula via `calcXpForLesson`). Theme (`LabCardTheme`) se resuelve en presentation — evita import presentation en domain (violación dependency direction). `total` default = `lessonCount`, `labCount` default = `lessonCount`, `progressPct` solo si `completed!=null && total>0`.

## Branch
`feat/unificar-cards-arquitectura` desde `main` e23ceb1.

## Verificación FASE 1
- `npm run type-check` → PASS (0 errors)
- `npm run test` → 174/174 PASS (previo 92 + 30 nuevos domain + resto suite)
