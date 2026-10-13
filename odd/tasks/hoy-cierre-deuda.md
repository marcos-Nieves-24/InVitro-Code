# HOY — Cierre de deuda que bloquea

**Objetivo:** Dejar repo en 0 dirty + 95+ audit + 10 tasks. Base limpia para auditar learn/dashboard mañana.

**Branch:** `feat/presentation-reemplazo-directo` — tiene 4 dirty + 2 untracked que son la feature presentación a medias.

**Forecast:** ~100 líneas autoras + moves. Estrategia: `single-pr` (1 work-unit commit).

## Tasks

- [x] **T1 — Triage presentación (4 dirty + 2 untracked)** — `git diff` de cada uno, decisión individual:
  - `src/components/anymotion/AnymotionStage.tsx` (9+/1-): animación/presentación (view-height budget para 16:9 shell full-bleed) → **STAGEADO**.
  - `src/components/lesson/section.tsx` (1+/1-): fix layout `px-4 sm:px-6 lg:px-8` → **STAGEADO**.
  - `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md` (25+/17-): contenido lección ia — nueva Section 5 "Features medibles de la conidia", renumbering 4→15, `<p>`→`<div>` → **STAGEADO**.
  - `src/middleware.ts` (1+): NO es el hunk de crons (crons ya en HEAD desde 60b7e4c). El dirty real agrega `/preview/lesson` a `publicRoutes` — acoplado al preview untracked de otro agente → **DEJADO unstaged** (restore NO aplica: no es duplicado; dejaría la ruta pública colgando del preview no commiteado).
  - Extra: `src/components/lesson/lesson-carousel.tsx` + `src/components/lesson/presentation/RevealSequence.tsx` (fuera de mi superficie, WIP acoplado "single owner forward advance" de otro agente) → **DEJADOS unstaged**, no piso.
  - Untracked: `audit-visual/` (screenshots featura) y `src/app/preview/lesson/` → NO están en `.gitignore` (`git check-ignore` exit 1), son preview de otro agente → **DEJADOS untracked**, documentados. No borrados ni stageados.
  - Acción: `git add` individual por archivo (nunca `-A`). Resultado: 5 stageados (3 dirty + 2 de T2).

- [x] **T2 — Fix fixed-width real (responsive.fixed-width.risk)** — 94.5 → **95.0/100** con 0 casos `fixed-width` en 3 runs consecutivos. Root cause MEDIDO con Playwright (`scrollWidth`/rect), no adivinado:
  - Los 2 offenders estables eran decoración: círculo `h-480 w-480 -right-32` (rect.width 480 > 392) + su wrapper `absolute inset-0 overflow-hidden` (scrollWidth 518 — `overflow-hidden` recorta paint pero NO scrollWidth). Fix: `max-md:right-0 max-md:bottom-0 max-md:h-[220px] max-md:w-[220px]` en el círculo → wrapper 390, círculo 220. Verifiqué que `overflow: clip` y `contain: paint` NO bajan scrollWidth (test aislado) — la única vía es contener el hijo.
  - Los casos `li`/`ul` 262px eran el estado pre-hydration: el harness navega con `waitUntil: "domcontentloaded"` y mide ANTES de que la hydration colapse SSR (`isMobile=false` → 4 cards en track de 262px → `ul`/viewport scrollWidth ~1096). Fix: `useState(true)` por defecto en `OrbitalModules` → SSR/first-paint = 1 card, track ≤ viewport en todo instante. (La hipótesis del task sobre `maxOffset`/`gap` no era el causante; y el `ul` ya era `flex-1` en viewport 262 matemáticamente limpio.)
  - Métricas finales: `documentScrollWidth` 390, offenders a nivel página: **0** (probe + audit ×3).

- [x] **T3 — Archivar 29 tasks stale** — `mkdir -p odd/tasks/archive` + `git mv odd/tasks/<f>.md odd/tasks/archive/` × 29 (git mv, no mv+add — historial preservado, renames stageados). Quedan 15 tasks + `_triage-fase2.md` en `odd/tasks/` (12 activos + 3 stale intactos: antigravity-frontend-agent, lab-heroes-restore, proyectos-restore-exp-streak-jerarquia).

- [x] **T4 — Verification** — `npm run type-check` → **RED (solo en WIP de otro agente, ver abajo)**; `npm run test` → **21 files / 199 tests PASS**; audit → **95.0/100** (0 fixed-width ×3 runs, sin regresiones desktop nuevas). Dirty count: ver `git status` final.

## Criterios de aceptación

- [x] 4 dirty triageados y stageados (o documentado por qué no): 3 stageados de T1 + middleware documentado (acoplado a preview de otro agente). 2 dirty extra (lesson-carousel, RevealSequence) = WIP de otro agente, documentado.
- [x] Re-audit sin `responsive.fixed-width.risk`: **0 casos en 3 runs** (94.5 → 95.0)
- [x] 29 tasks archivados, quedan 15 tasks + triage en `odd/tasks/*.md`
- [~] `git status --porcelain` = 5 staged-presentation + 29 renames staged + 3 unstaged (WIP ajeno) + 5 untracked (preview ajeno + task docs) — ver detalle abajo
- [~] type-check: RED solo en `RevealSequence.tsx` (WIP ajeno, fuera de mi superficie) — test: verde (21 files / 199 tests)

## Progreso

- 2026-10-12: Creado. Otros agentes libres.
- 2026-10-12: T1-T4 completados por writer (HOY). Evidencia en sección Evidencia.

## Evidencia

- Commits: (pendiente — el orchestrator commitea; staged listo)
- Audit: `runs/demo/report.md` run 2026-10-12 → **95.0/100**; `responsive.fixed-width.risk` = 0 en 3 runs consecutivos (antes 94.5 con 2-4 casos).
- Probes Playwright (`/tmp/opencode/probe-carousel.mjs`): `documentScrollWidth` 390, offenders página completa = 0.
- Tests: `npm run test` → 21 passed / 199 passed.
- `git status --porcelain` final:
  - STAGEADO (8 + 29 renames): AnymotionStage, Modules.tsx, OrbitalModules.tsx, section.tsx, lesson.md, y 29 → `odd/tasks/archive/`
  - UNSTAGED (3, WIP de otros agentes — documentado, no pisado): `src/components/lesson/lesson-carousel.tsx`, `src/components/lesson/presentation/RevealSequence.tsx`, `src/middleware.ts`
  - UNTRACKED (5, documentados): `audit-visual/`, `src/app/preview/lesson/` (preview ajeno), `odd/tasks/diagnostico-visual-leccion.md`, `odd/tasks/expediciones-visual-learning-plan.md` (planes activos ajenos), `odd/tasks/hoy-cierre-deuda.md` (este task)

## Coordinación

- Writer único, no paralelo. No toca `audit-visual/` ni preview si son de otro agente sin confirmar. Si hay duda, deja untracked y documenta.

## Key Learnings

1. **`overflow-hidden` NO reduce `scrollWidth`.** Un hijo absoluto que sobresale del padding edge infla el `scrollWidth` del padre aunque el paint esté recortado — y el detector de fixed-width mide ese `scrollWidth`. `overflow: clip` y `contain: paint` tampoco lo bajan (verificado con test aislado): la única vía es contener al hijo (tamaño + posición dentro del viewport).
2. **El harness mide con `waitUntil: "domcontentloaded"`**, antes de que la hydration de React colapse el SSR. Cualquier estado SSR que difiera del estado post-hydration (ej. carousel que renderiza 4 cards pre-hydration a 390px) se flaggea como fixed-width aunque a los 300ms esté limpio. Patrón defensivo: SSR debe renderizar el estado móvil (default `useState(true)` + effect que corrige), no el desktop.
3. **Un detector de elementos mide `rect.width` y `scrollWidth`, no `x+width`** — un elemento puede estar 100px fuera del viewport y no ser flaggeado si su ancho propio ≤ viewport+2. Solo importan ancho propio, scrollWidth del elemento y visibilidad (display/visibility/rect>0).
4. **Los informes audit pueden ser stale-vs-árbol-de-trabajo**: el report de 22:36 (4 casos) y el re-run (2 casos) corrieron contra el mismo código; la diferencia es timing de hydration, no regresión. Medir con probe propio + 3 runs antes de afirmar root cause.
5. **zsh no hace word-splitting en variables** (`for f in $LIST` itera una sola vez con todo el string): usar `${=LIST}` o arrays. Y `document.body.querySelectorAll("body *")` incluye elementos fuera del viewport — "visible" solo significa display/visibility no-none con rect > 0.
