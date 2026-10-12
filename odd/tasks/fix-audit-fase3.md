# Fix Audit Fase 3 — 3 issues determinísticos

**Objetivo:** Fixear 3 familias de findings del audit 2026-10-12-030711357Z sin bloquear otros agentes.

**Findings:**
1. `visual.text-clipping.none` (10 casos) — skip link `body > a` 1x1px, botones "Empezar ahora" clipped, `#modulos` clipped
2. `a11y.target-size.minimum` (8 casos) — dots carrusel 10x10px vs 24px WCAG
3. `responsive.fixed-width.risk` (4 casos mobile) — `#modulos` y `ul` 480px/332px > 390px viewport
4. Bonus: `p > p` hydration error en `RevealSequence` dentro de `Section`
5. `a11y.moving-content.controls` — cursor `▌` sin pausa (low, informativo)

**Scope autorizado:** Solo fixes audit. No tocar lógica de labs, no tocar Pyodide, no tocar deps. Un solo writer para no bloquear otros agentes (max_threads=1 para este fix).

**Coordinación:** Writer único, sin worktree paralelo. Otros agentes siguen libres en sus branches/tasks. Este fix va directo a `feat/presentation-reemplazo-directo` como work-unit commit.

**Forecast:** ~80 líneas autoras. Estrategia: `single-pr`.

## Tasks

- [x] **T1 — Dots tap-target (a11y.target-size.minimum)** — En `OrbitalModules.tsx`: los dots pasaron de `h-3 w-3` / `h-2.5 w-2.5` (10/12px) a un `<button class="flex h-6 w-6 items-center justify-center rounded-full">` (24x24px hit area, WCAG 2.2 2.5.8) con el dot visual como `<span aria-hidden>` interno. Se mantienen `aria-label` y `aria-current`. Verificado en browser: 4/4 dots miden 24x24. `gap-3 md:gap-4` → `gap-2 md:gap-3` para compensar el mayor tamaño del hit area.

- [x] **T2 — Fixed-width responsive (responsive.fixed-width.risk)** — Causa real medida: en mobile el `li` usaba `max-md:w-[calc(100%-32px)]` (159px) mientras el contenido del `ModuleCard` (chip "Machine Learning" `whitespace-nowrap` + `CardShell p-6`) necesita ~231px → overflow real. Cambios:
  - `OrbitalModules.tsx`: `li` mobile → `max-md:min-w-0 max-md:w-full` (el card usa todo el viewport disponible); el `scale-[1.03]`/`scale-[0.98]` activo ahora solo aplica `md:` (en mobile hay 1 sola card y el transform generaba 4px de overflow); gap del flex row `gap-3` → `gap-2`; botones prev/next mobile `h-12 w-12` → `h-10 w-10` (40px, ≥24) `md:h-14`.
  - `Modules.tsx`: `#modulos` `px-6` → `px-4 sm:px-6`; wrapper `px-2` → `sm:px-2`; las decoraciones absolute (blur 380/480px + 2 svg) se movieron a un `<div aria-hidden class="absolute inset-0 overflow-hidden">` para que el `scrollWidth` de la sección no exceda su `clientWidth`.
  - Verificado en browser 390px: `#modulos` 375=375, `ul`/viewport 247=247, `documentScrollWidth` 375 (= viewport menos scrollbar) → sin scroll horizontal.

- [x] **T3 — Text-clipping + p-in-p (visual.text-clipping.none + hydration)**
  - **Skip link `body > a`: FALSO POSITIVO.** Es `sr-only` (Tailwind: `position:absolute;width:1px;height:1px;overflow:hidden;white-space:nowrap`). El detector del harness marca todo elemento con `overflow:hidden|clip` y `scrollWidth>clientWidth`; `sr-only` lo cumple por diseño (texto completo 210px dentro de 1px). **No se toca.**
  - **Botones "Empezar ahora"/"Iniciar sesión": FALSO POSITIVO de media parte.** Causa medida: el `<span>` interno usa `relative left-5` (offset +20px) y `px-10`, por lo que los 40px de padding-derecho del span sobresalen 8px del `<a class="overflow-hidden">`. Lo que se recorta es *padding*, no texto. El fix vive en `src/components/ui/SlideArrowButton.tsx` (`overflow-hidden` + el offset `left`), que **no está en las superficies autorizadas** → documentado, no tocado.
  - **`<p class="line-clamp-2">` del ModuleCard: FALSO POSITIVO.** `line-clamp-2` usa `overflow:hidden` + `-webkit-line-clamp` y por diseño `scrollHeight>clientHeight` (truncado intencional con ellipsis). Vive en `ModuleCard.tsx` (fuera de superficie).
  - **`p > p`: ya resuelto en contenido (otro agente).** `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md` ya cambió los `<p>` sueltos dentro de `<RevealSequence>` por `<div>`. Verificado: SSR y runtime sin `p > p`.
  - **CRASH REAL encontrado y fixeado en `RevealSequence.tsx`:** `ReferenceError: Cannot access 'advance' before initialization` (TDZ) — `handleAdvance` (código WIP de otro agente) referenciaba `advance` en su dependency array antes de su `const`. Esto **rompía con HTTP 500 toda página de lección**. Fix: se movió la definición de `advance` por encima de `handleAdvance`. Verificado: `/learn/ia/lesson01_what_is_ai` → HTTP 200, h1 correcto, 0 errores de consola, 0 `p > p`.

- [x] **T4 — Verification** — `npx tsc --noEmit` exit 0; `npx vitest run` → 21 files / 199 tests pasan. Verificación en browser (Playwright MCP) contra `localhost:3000`: dots 24x24, carousel mobile sin overflow, sección sin overflow, lección 200. **`next build` omitido a propósito** para no pisar el `.next` del dev server compartido que otros agentes usan para auditar (el prompt de la fase pidió solo verificar que parseen). Scoring estimado tras fixes: `a11y.target-size.minimum` (4.5) y `responsive.fixed-width.risk` (0.5) limpios → score 90 → ~95; `visual.text-clipping.none` (4.5) persiste por los 4 FPs documentados (skip link + 2 botones + line-clamp).

## Criterios de aceptación

- [x] Dots 24x24px hit area (medido en browser: 24x24)
- [x] Mobile 390px sin horizontal scroll en #modulos (docSW 375 = viewport − scrollbar)
- [x] No hay `p > p` en SSR ni runtime (contenido ya corregido); bonus: se fixeó el crash TDZ `advance` que devolvía 500 en las lecciones
- [x] type-check (exit 0) + test (199/199) verdes; build omitido a propósito (dev server compartido)
- [~] Re-audit score: target-size y fixed-width limpios (estimado 95); text-clipping persiste por FPs fuera de superficie

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo. Otros agentes libres.
- 2026-10-12: T1-T3 implementados y verificados en browser. TDZ de RevealSequence fixeado (desbloquea lecciones 500).

## Evidencia

- Commits: (pendiente — lo hace el orchestrator)
- Browser (mobile 390px): dots `[24,24,24,24]`; `#modulos` scrollWidth 375 == clientWidth 375; viewport/ul 247 == 247; `documentScrollWidth` 375.
- Browser (lesson): `/learn/ia/lesson01_what_is_ai` → HTTP 200, 0 console errors, 0 `p > p`, 1 región reveal.
- Gates: `npx tsc --noEmit` → 0; `npx vitest run` → 21 files / 199 tests passed.

## Coordinación

- Writer único, no paralelo. No bloquea otros agentes (ellos siguen en sus tasks). Si hay conflicto de merge, rebase.
