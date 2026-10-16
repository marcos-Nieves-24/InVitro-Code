# Expediciones — contenido interno didáctico (M2-M4)

**Objetivo:** extender el modelo canónico de IA a python/estadistica/machine-learning como material didáctico interactivo.
**Branch:** `feat/expediciones-m1-refactor` (base `7883d02`, PR #80 ya en main) · **Delivery:** `ask-on-risk` + chain `feature-branch-chain` (elegido 2026-10-16; forecast ~4000 líneas, supera 400 → encadenar) · **Runner:** `npm run test` (Vitest), gates `npm run type-check` + `npm run build` + `npm run assets:check` · **TDD:** `strict_tdd: false` (origen `openspec/config.yaml`)

## Specs

- **S1 — Alcance contenido interno:** "vamos a trabajar en el frontend y diseño de las expedicciones para volverlo un material y contenido educativo didactico." + decisión posterior `Contenido interno`. Cubre sólo `src/content/modules/{python,estadistica,machine-learning}/lessons/*/lesson.md` + players nuevos que reemplacen tablas; no landing ni `/learn`, no `lab.md`/`assignment.md`/`notebook.ipynb`, no consolas protegidas (`code-block.tsx`, `LessonComponents.tsx`, `PyodideRunner.tsx`, `pyodide-worker.ts/js`).
- **S2 — Gramática de slice didáctica:** cada `<Section>` es composición de primitives (`DialogueBox` con `lines`, `RevealSequence` modo `appear`, `ChoiceQuestion` con `blockId` preservado, `AnymotionStage` + `AnymotionControls`, `ConceptCard`, `ThresholdLab`/`KnnTrainer` y afines). Prohibida prosa corrida suelta y tablas crudas (`InteractiveTable`, ASCII en `CodeBlock` con `$`).
- **S3 — Interactividad que enseña:** toda animación reemplaza un párrafo/tabla existente, es controlable (pause/replay/seek), respeta `prefers-reduced-motion` (frame clave estático), permite variar un parámetro y ver el efecto, y lleva `caption` obligatoria.
- **S4 — Persistencia y a11y sin regresiones:** `POST /api/progress/reflection` acepta `block_id ?? blockId` (0 errores 400); `DialogueBox` avanza líneas antes que el reveal; encabezado `Escena N de M`; `Section` centrado `max-w-4xl mx-auto`; targets táctiles ≥44px; 0 errores consola/hidratación; LaTeX `$...$` intacto; `blockId` y secuencia de aprendizaje 100% preservados.
- **S5 — Verificación por lote:** por cada lote `npm run type-check` + compilación MDX de cada `lesson.md` tocado + `npm run build` + Playwright real (1440×900, 768×1024, 390×844) con `hOverflow 0`, `vOverflow 0` en inicial, 0 errores consola, reveal click a click, y screenshots del antes/después.

## Tasks

- [x] **T1 — Auditoría baseline M2-M4** | S1,S5 | route: delegated (explorer) — trigger: Mapping (>5 lookups, 37 lecciones) | evidencia: `/tmp/opencode/audit-m234-before/` (handoff ses_ebb2dc89affeJ47Thh7fNtJjrF) + spot-check `lesson02_jupyter_notebook/lesson.md:140` con `InteractiveTable` y 0 `RevealSequence` | status: done (2026-10-16)
- [ ] **T2 — Refactor python (17 lecciones) en 2 sublotes** | S1-S5 | route: delegated (writer) — trigger: Preparation (lectura prepara escritura, 17 archivos) + Context (backstop) | superficie: `src/content/modules/python/lessons/*/lesson.md` + `src/components/anymotion/animations/*Player.tsx` nuevos, barrel `src/components/lesson/index.ts`, mapa `src/app/learn/[module]/[slug]/page.tsx` | status: pending
- [ ] **T3 — Refactor estadistica (10 lecciones)** | S1-S5 | route: delegated (writer) — trigger: Preparation + Context | superficie: `src/content/modules/estadistica/lessons/*/lesson.md` + players nuevos (mismo barrel + mapa) | status: pending
- [ ] **T4 — Refactor machine-learning (10 lecciones)** | S1-S5 | route: delegated (writer) — trigger: Preparation + Context | superficie: `src/content/modules/machine-learning/lessons/*/lesson.md` + players nuevos (mismo barrel + mapa) | status: pending
- [ ] **T5 — Verificación independiente + gates** | S4,S5 | route: delegated (verifier) — trigger: Verification (cambio toca contratos que consumen otros: `blockId`, API reflection, LaTeX) | evidencia: `type-check`, `test`, `assets:check`, `build`, Playwright 3 viewports, diff de protegidos idéntico | status: pending

## Log

- **L1 (2026-10-16):** "vamos a trabajar en el frontend y diseño de las expedicciones para volverlo un material y contenido educativo didactico."
- **Decisión alcance (2026-10-16):** usuario eligió `Contenido interno` (DialogueBox + Reveal + animación + quiz como referencia canónica). No presentación.
- **Evidencia base (2026-10-16):** `ia` canónico verificado (56 secciones con `RevealSequence`, 0 tablas, 0 errores consola, `Escena N de M`, commit `7883d02` + PR #80 mergeada). `python` 17 lecciones con 0 `RevealSequence`; `estadistica` 10 lecciones con 12 `InteractiveTable` y 0 `RevealSequence`; `machine-learning` 10 lecciones con 7 `InteractiveTable` y 0 `RevealSequence`. Total pendiente: 37 lecciones.
- **Riesgo:** `CardPrimitives`/`ModuleCard` sirven a `/proyectos`, `/laboratorios`, `/preview/cards` — Lotes T2-T4 no los tocan salvo botones de players (verificar esas 3 rutas si se tocan).
- **Next:** correr T1 (auditoría baseline) antes de cualquier escritura de contenido.
- **T1 done (2026-10-16, ses_ebb2dc89affeJ47Thh7fNtJjrF):** 37 lecciones / 336 secciones con `hasReveal=false` (python 134, estadistica 107, ML 95); 27 `InteractiveTable` + 3 tablas crudas (python lesson01) = 30 candidatos a player; 0 `ChoiceQuestion`/`DialogueBox` en M2-M4; `CodeEditor` único trainer (14 python + 10 ML). Top overflow: `python/lesson03_variables:34`, `python/lesson06_functions:144`. Sublotes: python A (01-08) + B (09-17), estadistica ×1, ML ×1.
