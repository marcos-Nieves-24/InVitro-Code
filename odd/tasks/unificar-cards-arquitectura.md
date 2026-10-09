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
  - Commit: `feat(cards): dominio puro ModuleCard + LessonCard models + tests` (c3793ec)
- [x] FASE 2 — Primitivas + ModuleCard + migrar /learn
  - [x] `src/components/modules/CardPrimitives.tsx` — CardShell (motion --card-accent), CardChip, CardArt, XpBadge, LabBadge, ProgressFooter
  - [x] `src/components/modules/ModuleCard.tsx` — presentacional puro (model+href+theme, variant grid|compact, Link wrapper, ProgressFooter solo grid+progressPct!==null)
  - [x] `src/components/modules/ModuleGrid.tsx` — grid 1/2/3 (compact 4), motion stagger grid, empty FlaskConical
  - [x] `src/app/learn/page.tsx` — elimina MODULE_FAVICON/glass-card, usa getModules+getLessonSlugs+calcXpForLesson(sum real)+toSerializableTheme+buildModuleCardModel+ModuleGrid, header Expediciones preservado
  - [x] `type-check` PASS, `build` PASS (29 rutas), `test` 174/174 PASS
  - Commit: `feat(cards): CardPrimitives + ModuleCard + migrar /learn`
- [x] FASE 3 — Migrar /laboratorios (ModuleExplorerGrid)
  - [x] `src/components/modules/ModuleGrid.tsx` — añade `columns?: 3|4` (effectiveColumns, lg:grid-cols-4 vs 3, sm:2 preservado)
  - [x] `src/components/labs/explorer/ModuleExplorerGrid.tsx` — elimina ModuleExplorerCard + motion propio, pasa a server component, usa ModuleGrid+buildModuleCardModel+getLabCardTheme+toSerializableTheme+calcXpForLesson+getModuleShortDescription, 4-col grid (lg:grid-cols-4) con ProgressFooter via variant grid
  - [x] `src/components/labs/explorer/ModuleExplorerCard.tsx` — marca `@deprecated — replaced by ModuleCard, remove in Phase5`
  - [x] `type-check` PASS, `build` PASS (29 rutas), `test` 174/174 PASS
  - Commit: `refactor(labs): ModuleExplorerGrid usa ModuleCard canónico`
- [ ] FASE 4 — UI unificada (migrar LabCard/LessonCard)

## Decisión clave
**Domain puro sin theme ni xp calculation.** `buildModuleCardModel` y `buildLessonCardModel` reciben `xpReward`/`xp` como param (caller calcula via `calcXpForLesson`). Theme (`LabCardTheme`) se resuelve en presentation — evita import presentation en domain (violación dependency direction). `total` default = `lessonCount`, `labCount` default = `lessonCount`, `progressPct` solo si `completed!=null && total>0`.

## Branch
`feat/unificar-cards-arquitectura` desde `main` e23ceb1.

## Verificación FASE 1
- `npm run type-check` → PASS (0 errors)
- `npm run test` → 174/174 PASS (previo 92 + 30 nuevos domain + resto suite)

## Verificación FASE 2
- `npm run type-check` → PASS
- `npm run build` → PASS (29 rutas)
- `npm run test` → 174/174 PASS
- Manual: /learn cards con LabCardArt SVG, chip accent, XpBadge/LabBadge, sin favicon hardcodeado

## Verificación FASE 3
- `npm run type-check` → PASS
- `npm run build` → PASS (29 rutas)
- `npm run test` → 174/174 PASS
- Manual: /laboratorios grid 4-col con cards canónicas, progreso coherente con /learn XP (BiotechGrowthTube + % crecimiento)
