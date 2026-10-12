# MOV 3 — Cerrar V-01..V-07 con harness (preview audit)

**Objetivo:** Que los 7 hallazgos del diagnóstico visual (`diagnostico-visual-leccion.md`) dejen de ser PNGs y pasen a ser `audit.json` verificable con `runs/lesson`.

**Diagnóstico origen:** Playwright 1440×900 sobre `/preview/lesson/ia/lesson01_what_is_ai` — 7 hallazgos:
- V-01: escenario 16:9 sale del viewport (stage top 483/bottom 1258, scrollHeight===clientHeight) — **cerrado**
- V-02: texto en x=0 (left===0) — fix previo `e2a0f75` con `section.tsx px-4` — **cerrado**
- V-03: botones cortados por footer (cortados por `position:fixed` footer) — **cerrado**
- V-04: `<p>` anidado hydration — fix previo — **cerrado**
- V-05: rebote navegación — fix previo `consumeRevealAdvance` (`ef16eae`) — **cerrado**
- V-06: diapositiva 4 con 10 pasos (demasiados) — **cerrado** (split ya en `ef16eae`)
- V-07: full-bleed sin scroll (stage sin scroll) — **cerrado**

**Scope autorizado:** Solo fixes visuales en lesson/presentation, no tocar lógica de progreso/xp, no tocar deps.

**Forecast:** ~80 líneas. Estrategia: `single-pr`.

## Tasks

- [x] **T1 — V-01/V-07 Stage overflow** — `AnymotionStage.tsx` ahora usa `max-h-[min(40vh,calc(100vw*9/16))]` con `max-w` derivado del mismo budget (`max-w-[calc(min(40vh,calc(100vw*9/16))*16/9)]`), manteniendo 16:9 real. `RevealSequence` container: `md:min-h` recortado de `calc(100vh-160px)` (740px @900vh, forzaba overflow) a `min(50vh,calc(100vh-240px))` en los modos `showHistory` y `appear` con >3 hijos. `LessonCarousel` slide area ya era `flex-1 overflow-y-auto`. **Verificado con Playwright:** stage 640×360 @1440×900 (bottom 590 ≤ 900), 512×288 @1280×720 (bottom 464), 326×183 @390×844 (bottom 526); ratio 1.778 en todos; slide area scrolleable (scrollHeight 1230 > clientHeight 790).

- [x] **T2 — V-03 Botones cortados por footer** — El footer ya NO es `position:fixed` desde `ef16eae` (es `flex shrink-0` en flujo normal), y los controles de `RevealSequence` son `sticky bottom-0` con `bg-surface/95` dentro del scrollport. No hace falta `pb-20` (agregaría scroll muerto porque el footer no solapa). **Verificado con Playwright mid-reveal (Paso 3 de 5, diapositiva 4):** botones `Continuar`/`Atrás` top 531–bottom 575 (h=44px ✓ ≥44px), footer top 860 → sin solape (575 < 860). Idem en 1280×720 y 390×844: controles bottom 661/785 < footer top 681/805.

- [x] **T3 — V-06 Diapositiva 4 con 10 pasos** — El split ya existía en `ef16eae` (el diagnóstico se midió en `2f03e1d` con "Features (parte 1)" de 10 pasos; hoy son 3 Sections). **Contado programáticamente (children reales de cada `RevealSequence`):** S1=2, S2=2, S3=1, S4=5 (con `showHistory`), S5=2, S6=3, S9=4, S15=4 (con `blockOnQuiz`). Ninguna diapositiva supera 5 pasos → criterio cumplido, sin cambios de contenido necesarios. `page.tsx` renumeró automáticamente (15 slides tras filtrar `Resumen`).

- [x] **T4 — Re-audit preview** — Dev server corriendo (PID 125913): `npx @design-harness/cli audit --url http://localhost:3000/preview/lesson/ia/lesson01_what_is_ai --out runs/lesson` → **89/100 (usable)**. Findings residuales son heurísticas de página pre-existentes (falta landmark `<main>`, line-length 160ch, `a11y.moving-content.controls`, `sticky-obstruction` low/medium), NO los V-01/V-03/V-06. Verificación V-01/V-03 complementaria con Playwright directo (ver T1/T2).

- [x] **T5 — Verification** — `npm run type-check` ✓ (tsc --noEmit limpio). `npm run test` ✓ (21 files, 199 tests, todos verdes). `git diff --stat`: solo `AnymotionStage.tsx` (+6/−4) y `RevealSequence.tsx` (+2/−2) — no se toca `Modules`, `OrbitalModules` ni `design-guide.yaml`.

## Criterios de aceptación

- [x] V-01/V-07 sin stage overflow (stage.bottom ≤ viewport en 1440×900, 1280×720 y 390×844; slide area scrolleable)
- [x] V-03 botones visibles sobre footer en 1440×900 y 390×844 (h=44px, sin solape)
- [x] V-06 <=5 pasos por diapositiva (todas las secciones verificadas)
- [x] Re-audit runs/lesson ejecutado: 89/100, corriendo sobre el preview real
- [x] type-check + test verde

## Progreso

- 2026-10-12: Creado.
- 2026-10-12: T1–T5 completadas. Fixes: `AnymotionStage` budget 40vh/width-aware + `RevealSequence` md-min-h recortado. V-01/V-03/V-06/V-07 verificados con Playwright a 3 viewports + run de harness.

## Evidencia

- Re-audit: `runs/lesson/report.md` + `runs/lesson/screenshots/{desktop,mobile}.png` — score 89/100.
- Medición Playwright (scripts throwaway en `/tmp/opencode/verify-v-01-v-03.mjs`, `verify-v-03-midreveal.mjs`):
  - 1440×900: stage 640×360 (ratio 1.778), bottom 590; reveal controls bottom 575, footer top 860.
  - 1280×720: stage 512×288, bottom 464; controls bottom 661 < footer 681.
  - 390×844: stage 326×183, bottom 526; controls bottom 785 < footer 805.
  - Sin errores de consola (hydration) en el recorrido.
- Commits: (pendiente — a cargo del orchestrator)

## Coordinación

- No pisar al otro agente: si `lesson-carousel`/`RevealSequence` ya están en WIP, coordinar diff. Usar `git diff` para ver su trabajo y no duplicar.
- Árbol limpio al empezar (solo `odd/tasks/mov3-cerrar-v-qa.md` untracked). `lesson-carousel.tsx` y `section.tsx` NO requerían cambios (footer normal-flow + px-4 ya están).

## Key Learnings

1. **El diagnóstico estaba desactualizado para V-06**: se midió en `2f03e1d` cuando la Section 4 tenía 10 pasos; `ef16eae` ya la partió en 3 Sections (5+2+3 pasos). Contar los children reales del MDX (chunks separados por líneas en blanco) antes de editar evitó un split duplicado.
2. **`aspect-video` + `max-h` NO reduce el ancho solo**: con `w-full` (ancho definido) el navegador mantiene el ancho y recorta la proporción; para preservar 16:9 hay que emparejar `max-w = max-h * 16/9` desde el MISMO budget (`min(40vh, 100vw*9/16)`), así la restricción que liga es la misma y el box se encoge en proporción.
3. **`md:min-h-[calc(100vh-160px)]` = 740px @900vh es un bug latente**: supera la banda viva (~650px tras header+progress+footer) y fuerza scroll muerto en slides cortos. Recortarlo a `min(50vh, calc(100vh-240px))` elimina el overflow sin cambiar la sensación de centrado.
4. **V-03 estaba resuelto en estructura, no en CSS**: el footer pasó de `position:fixed` a `flex shrink-0` en flujo normal (`ef16eae`), así que ya no puede solapar contenido; los controles `sticky bottom-0` del reveal se anclan al scrollport y quedan siempre por encima del footer. Agregar `pb-20` habría sido scroll muerto.
5. **El footer "Continuar" se deshabilita mientras la reveal tiene pasos** (`aria-disabled` + `opacity-50`): para auditar hay que clickear `[data-reveal-continue]` (el propio botón de la reveal), no el del footer; y el label de diapositiva va en mayúsculas (`Incluir` es case-sensitive).