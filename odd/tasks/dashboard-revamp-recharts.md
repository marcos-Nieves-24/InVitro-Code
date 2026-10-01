# Feature: dashboard-revamp-recharts

## Objective
Revamp del dashboard: tanque/tubo más grandes, layout 100% alineado, copy nuevo y 3 gráficas Recharts modernas sin duplicar info de /logros.

## Problem
Dashboard actual: bioreactor `md` pequeño, tubo `240` pequeño, cards no ocupan 100% del contenedor video y alturas desiguales, copy largo "El tanque se llena con EXP...", sin visualización de progreso temporal/distribución/constancia. Usuario pide propuesta estética moderna con Recharts.

## Why
Pedido explícito 4 cambios: 1) tamaño tanque/tubo, 2) aprovechar div 100% y alinear, 3) copy "Completa lecciones para llenar el tanque y subir de rango.", 4) gráficas con Recharts no duplicadas. Aprobado en plan.

## Scope
- `src/lib/content/modules.ts` (FALLBACK_PROGRESS_HINT)
- `src/components/dashboard/DashboardContainer.tsx` (layout + integración)
- `src/components/dashboard/BioreactorProgress/BioreactorProgress.tsx` (sizeMap)
- `src/components/dashboard/BioreactorProgress/BioreactorVessel.tsx` (fix hardcode)
- `src/components/dashboard/BiotechGrowthTube.tsx` (size prop ya ok, solo uso)
- `src/lib/gamification/activity.ts` (nuevo helper queries)
- `src/components/dashboard/ProgressCharts.tsx` (nuevo 3 charts Recharts)
- `package.json` (recharts dep)
- No tocar: `src/app/(dashboard)/logros/page.tsx`, `InVitroShell`, `HeroSection`, labs.

## Constraints
- Stack: Next 16 App Router, Tailwind v4, motion/react, Recharts (nueva dep, 45kb gz ok)
- RLS: `auth.jwt() ->> 'sub'` + `createAdminClient()` para queries
- Respetar `prefers-reduced-motion` (isAnimationActive false)
- No duplicar: no barra semanal 7 días vertical, no grilla logros, no % nivel ya mostrado
- Colores: `var(--color-mint/fog/slate/graphite)` + `glass-card`
- Verificación: `npm run type-check` + `npm run build` + `npm run test` (37 tests)

## Authorized Scope
Usuario autorizó explícitamente los 4 cambios + Recharts. Branch feature desde main, work-unit commits.

## Acceptance Criteria
- [x] Copy muestra "Completa lecciones para llenar el tanque y subir de rango." (sin split EXP)
- [x] Bioreactor visible ~30% más grande (lg 220x300), tubo 300 desktop / 220 mobile
- [x] Cards Tu Progreso y Misión Actual misma altura, ocupan 100% grid, min-h 360px
- [x] 3 gráficas renderizan con datos reales (8 semanas area, donut módulos, bar 30 días), sin duplicar /logros
- [x] type-check + build pass, responsive md/lg verifica

## Tasks
### T1 — Copy + layout 100% alineado [x] — 677a564
- Editar `FALLBACK_PROGRESS_HINT` en `modules.ts:53`, simplificar render en `DashboardContainer.tsx:142-154` a texto plano, fix wrapper `p-2`→`p-0`, grid `items-stretch`, cards `h-full min-h-[360px] p-6 md:p-8`, contenedor `max-w-[1440px] mx-auto w-full`.
- Route: delegated (writer) | Files: 2 | Commit: 677a564

### T2 — Aumentar tanque y tubo [x] — 677a564
- `BioreactorVessel.tsx:13` hardcode `h-[220px] w-[160px]` → `h-full w-full`, `BioreactorProgress.tsx:60` gobierna tamaño, `DashboardContainer.tsx:171 size="md"`→`lg`, `BiotechGrowthTube` props `240`→`300`/`220`.
- Route: delegated (same writer batch T1+T2) | Files: 3 | Commit: 677a564

### T3 — Helpers actividad + dep Recharts [x] — bf71f51
- `npm i recharts` (verificar react@19 compat), crear `src/lib/gamification/activity.ts` con `getProgressTimeline` (8 sem), `getDailyActivity` (30 días), `getModuleCompletion` helpers, patrón `try/catch → empty` como `achievements.ts`.
- Route: delegated | Files: 2 | Commit: bf71f51

### T4 — ProgressCharts 3 widgets Recharts [x] — bf71f51
- Crear `src/components/dashboard/ProgressCharts.tsx` con `ProgressTimelineArea`, `ModulesDonut`, `DailyActivityBars`, `ResponsiveContainer h={220}`, gradientes, tooltips custom, `isAnimationActive={!shouldReduce}`, a11y labels. Importar `useReducedMotion`.
- Route: delegated | Files: 1 | Commit: bf71f51

### T5 — Integrar en DashboardContainer + verificación [x] — bf71f51
- Importar helpers y `ProgressCharts` en `DashboardContainer.tsx:240`, pasar `timeline/modules/daily/overallProgress`, verificar `type-check` + `build` + tests, captura responsive.
- Route: delegated | Files: 1 | Commit: bf71f51

## Progress
- 2026-10-01: Creado, forecast ~350 líneas, single-pr. Pendiente T1-T5.
- 2026-10-01: T1+T2 completado en a8a412f — `feat(dashboard): copy y layout 100% + tanque/tubo agrandados`. 3 files, type-check pass (Node 22), sin build. Pendiente T3-T5.
- 2026-10-01: T3-T5 completado en bf71f51 — `feat(dashboard): graficas Recharts ritmo/donut/constancia + helpers actividad`. Helpers actividad + ProgressCharts + integración DashboardContainer. Verificación type-check/build/test pass.
- 2026-10-02: T6+T7 planificado — gráfica dinámica tabs + video removal + Misión Actual full-width y frase con tildes + reducción proporcional sin desalinear.
- 2026-10-02: T6+T7 completado en 8b3bc99 — `feat(dashboard): grafica dinamica tabs sin video + mision full-width con frase con tildes`. Video eliminado, ProgressCharts refactorizado a 1 card dinámica con tabs, Misión Actual full-width con tildes, reducción proporcional p-5/p-6 sin desalinear. Verificación type-check/build/test pass.
- 2026-10-02: Fix progressHint — `fix(content): alinear progressHint de los 4 modulos con fallback "Completa lecciones..."`. 4× module.json `progressHint` viejo "El tanque se llena con EXP..." → "Completa lecciones para llenar el tanque y subir de rango." (fallback modules.ts:53). Tu Progreso ahora sí muestra frase aprobada. No toca Misión Actual ni layout. Verificación type-check/build/test pass, grep confirma sin texto viejo.

## Verification Evidence
- 2026-10-01 a8a412f: `npm run type-check` pass (tsc --noEmit, 0 errors, Node 22.23.2). Files: `src/lib/content/modules.ts`, `src/components/dashboard/DashboardContainer.tsx`, `src/components/dashboard/BioreactorProgress/BioreactorVessel.tsx`.
- 2026-10-01 bf71f51: `npm run type-check` pass (tsc --noEmit, 0 errors, Node 22.23.2). `npm run build` pass (Next 16.2.10 Turbopack, compiled successfully, 21/21 static pages). `npm run test` pass (92 tests, 11 files). Files: `src/lib/gamification/activity.ts`, `src/components/dashboard/ProgressCharts.tsx`, `src/components/dashboard/DashboardContainer.tsx`, `package.json` (recharts 3.10.1 + react-is 19.3.0 + plotly.js 4.1.1). Recharts 3.x verificado compatible con react@19.
- 2026-10-02 8b3bc99: `npm run type-check` pass (tsc --noEmit, 0 errors, Node 22.23.2). `npm run build` pass (Next 16.2.10 Turbopack, compiled successfully, 21/21 static pages). `npm run test` pass (92 tests, 11 files). Files: `src/components/dashboard/DashboardContainer.tsx` (video eliminado, grid items-stretch preservado, Tu Progreso min-h-0 p-5/p-6 w-full, Misión Actual favicon 20/tubo 320-260/título 2xl, frase con tildes "Completa el módulo para que tu planta crezca"), `src/components/dashboard/ProgressCharts.tsx` (1 card min-h-[380px] h-[260px] con useState tabs, role=tablist, pill activo bg-mint). Sin tocar `src/lib/content/modules.ts:53` (Tu Progreso intacto).
- 2026-10-02 fix(content) progressHint: `npm run type-check` pass (tsc --noEmit, 0 errors). `npm run build` pass (Next 16.2.10 Turbopack, compiled successfully, 21/21 static pages). `npm run test` pass (92 tests, 11 files). Files: 4× `src/content/modules/{ia,python,estadistica,machine-learning}/module.json` (`progressHint` → "Completa lecciones para llenar el tanque y subir de rango." alineado con fallback `src/lib/content/modules.ts:53`). Grep confirma 0 restos "El tanque se llena con EXP", 5 ocurrencias frase aprobada (4 JSON + 1 fallback). Tu Progreso ahora sí muestra fallback correcto. No toca Misión Actual ("Completa el módulo para que tu planta crezca") ni layout.

## Next Step
- Single PR a main — `feat/dashboard-revamp-recharts` listo para review (forecast <400 líneas sin lock).

## Delivery
- Forecast authored changed lines: ~350 (additions+deletions, excl. package-lock), single PR bajo 400. Strategy: single-pr.
- Work-unit commits en feature branch `feat/dashboard-revamp-recharts`.
