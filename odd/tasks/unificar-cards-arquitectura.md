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
- [x] FASE 4 — Migrar landing (OrbitalModules) + proyectos hub
  - [x] `src/components/landing/Modules.tsx` — server calcula `xpReward = getLessonSlugs().reduce(sum calcXpForLesson)` + `href = firstLesson ? /learn/slug/first : /learn/slug`, pasa a ModuleData
  - [x] `src/components/landing/OrbitalModules.tsx` — extiende `ModuleData` con `xpReward?: number; href: string`, usa `mod.xpReward ?? mod.lessons*20` y `href={mod.href}` (fix /sign-in bug)
  - [x] `src/app/(dashboard)/proyectos/page.tsx` — reemplaza grid inline `ModuleCardContent` por `ModuleGrid` canónico: `getLessonSlugs+calcXpForLesson+completedCount+getModuleDisplayName+getModuleShortDescription+toSerializableTheme+buildModuleCardModel`, `variant="grid" columns={4}`, elimina `ModuleCardContent` y wrapper `div border`
  - [x] `type-check` PASS, `build` PASS (29 rutas), `test` 174/174 PASS
  - Commit: `refactor(landing): OrbitalModules fix XP+href + proyectos usa ModuleCard`
- [x] FASE 5 — LessonCard canónico + borrado duplicados (FINAL)
  - [x] `src/components/modules/LessonCard.tsx` — presentacional puro canónico: props model+href+theme+moduleName+variant, motion hover y:-4 con --card-accent, chip accent + LabCardArt 48, title, meta row (GraduationCap+normalizeDifficulty, estimatedDuration, prerequisites filtrado), XP badge + CheckCircle2/Lock, href via Link blocked => # aria-disabled, DIFFICULTY_MAP reutilizado
  - [x] `src/components/labs/LabCard.tsx` — thin wrapper sobre LessonCard: getLabCardTheme + buildLessonCardModel({title,difficulty,estimatedDuration,prerequisites,completed,blocked,xp:calcXpForLesson}) + href /laboratorios/..., mantiene export compat
  - [x] `src/components/projects/ProjectCard.tsx` — thin wrapper sobre LessonCard: buildLessonCardModel completed:false blocked:false + href /proyectos/..., mantiene export compat
  - [x] `src/components/landing/OrbitalModules.tsx` — migra de ModuleCardContent compact a ModuleCard variant compact: buildModuleCardModel({slug,title,description,lessonCount,labCount,xpReward,completed:null,total:null}) + ModuleCard + preserva isActive scale/saturate en <li>, elimina import ModuleCardContent
  - [x] `src/components/modules/CardPrimitives.tsx` — elimina comentario "inspired by ModuleExplorerCard"
  - [x] `src/components/labs/explorer/index.ts` — elimina export ModuleExplorerCard
  - [x] Borra `src/components/labs/explorer/ModuleExplorerCard.tsx` (deprecated) y `src/components/shared/ModuleCardContent.tsx` (reemplazado) — grep 0 verificado
  - [x] `type-check` PASS, `build` PASS (29 rutas), `test` 174/174 PASS (18 files), `grep -rln "ModuleCardContent\|ModuleExplorerCard" src/` 0
  - Commit: `refactor(cards): LessonCard unifica LabCard+ProjectCard, borra duplicados`

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

## Verificación FASE 4
- `npm run type-check` → PASS
- `npm run build` → PASS (29 rutas)
- `npm run test` → 174/174 PASS
- Manual: landing carrusel href correcto a /learn/... (no /sign-in), proyectos hub cards canónicas + progreso

## Verificación FASE 5 (FINAL)
- `npm run type-check` → PASS (0 errors)
- `npm run build` → PASS (29 rutas)
- `npm run test` → 174/174 PASS (18 files)
- `grep -rln "ModuleCardContent\|ModuleExplorerCard" src/` → 0 (solo comentarios purgados)
- Manual: /laboratorios/[module] grid LabCard ok, /proyectos/[module] ProjectCard ok, /learn ModuleCard ok, / landing compact ok — click navega correcto, XP consistente via calcXpForLesson, badges dificultad

## Resumen final
5 fases en 4 commits previos + este: dominio puro → primitivas+ModuleCard → ModuleExplorerGrid → landing+proyectos hub → LessonCard+borrado. Arquitectura queda: `domain/{module-card,lesson-card}` puro (sin theme/xp calc), `components/modules/{CardPrimitives,ModuleCard,ModuleGrid,LessonCard}` presentacional canónico, `LabCard`/`ProjectCard` thin wrappers compat, `ModuleCardContent`/`ModuleExplorerCard` borrados. OrbitalModules migrado a ModuleCard compact. Theme resuelto siempre en presentation (getLabCardTheme). Verificación total 7 gates PASS.

## Decisión de borrar
**Borrar ModuleExplorerCard + ModuleCardContent** — ambos sin uso tras Fase 5 (verified grep 0). ModuleExplorerCard deprecated desde Fase 3 (replaced by ModuleCard); ModuleCardContent replaced por ModuleCard+CardPrimitives en Fase 4 y OrbitalModules en Fase 5. Borrado reduce duplicación, mantiene single source of truth LessonCard/ModuleCard. Si rollback necesario, git revert restores archivos (history intact).
