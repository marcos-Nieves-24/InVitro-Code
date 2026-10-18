# Phase 1 Visual Audit & Phase 2 Improvement Plan — Expeditions Module 1 (`ia`)

**Feature:** `expediciones-m1-refactor`
**Project:** `invitro-code`
**Date:** 2026-10-15
**Auditor / Architect:** Gentle Orchestrator (Playwright real browser audit on `http://localhost:3001/learn/ia/*`)
**TDD Configuration:** `strict_tdd: false` (source: `openspec/config.yaml`), test runner: `npm run test` (Vitest 4.1.10, Node environment), static & build gates: `npm run type-check`, `npm run assets:check`, `npm run build`.
**Delivery Strategy:** `single-pr` (with `size:exception` if accumulated lines across 4 lessons + visual components exceed 400 lines; task-level work units kept coherent).

---

## 1. Phase 1: Mandatory Visual Audit with Playwright

### 1.1 Routes & Files Examined

- **Evaluated Routes (Authenticated Clerk Session in Chromium):**
  - `/learn/ia/lesson01_what_is_ai` (16 scenes, 35 interactive states)
  - `/learn/ia/lesson02_how_ai_learns` (16 scenes, 23 interactive states)
  - `/learn/ia/lesson03_ai_in_biotech` (12 scenes, 17 interactive states)
  - `/learn/ia/lesson04_real_cases` (12 scenes, 23 interactive states)
  - `/preview/lesson/ia/*` (verified redirect behavior when unauthenticated due to `src/middleware.ts`)
- **Viewports Tested:** Desktop `1440×900`, Tablet `768×1024`, Mobile `390×844`.
- **Evidence Artifacts:**
  - `/tmp/opencode/audit-m1-before/audit-1440x900.json` (98 states measured across all 4 lessons)
  - `/tmp/opencode/audit-m1-before/*.png` (desktop, tablet, and mobile screenshots of initial states, reveals, tables, iframes, and labs)
- **Implicated Components & Content Files:**
  - Shell & Layout: `src/app/learn/[module]/[slug]/page.tsx`, `src/components/lesson/lesson-carousel.tsx`, `src/components/lesson/section.tsx`, `src/components/lesson/interactive-frame.tsx`
  - Presentation Primitives: `src/components/lesson/presentation/RevealSequence.tsx`, `src/components/lesson/presentation/DialogueBox.tsx`, `src/components/lesson/presentation/ChoiceQuestion.tsx`, `src/components/lesson/presentation/FeatureButtonList.tsx`
  - Interactive Labs & Games: `src/components/lesson/diagnostic-trainer.tsx`, `src/components/lesson/conidia-sort-game.tsx`, `src/components/lesson/threshold-lab.tsx`, `src/components/lesson/perceptron-trainer.tsx`, `src/components/lesson/knn-trainer.tsx`, `src/components/lesson/regression-trainer.tsx`, `src/components/lesson/reflection-check.tsx`
  - Anymotion Players & Controls: `src/components/anymotion/AnymotionStage.tsx`, `src/components/anymotion/AnymotionControls.tsx`, `src/components/anymotion/animations/ConidiaToVectorPlayer.tsx`, `src/components/anymotion/animations/FeatureSpace2DPlayer.tsx`, `src/components/anymotion/animations/OverfittingPlayer.tsx`, `src/components/anymotion/animations/PipelineStagesPlayer.tsx`, `src/components/anymotion/animations/SpeciesComparePlayer.tsx`
  - Module 1 Content: `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md`, `lesson02_how_ai_learns/lesson.md`, `lesson03_ai_in_biotech/lesson.md`, `lesson04_real_cases/lesson.md`
- **Protected Code Consoles (DO NOT MODIFY):**
  - `src/components/lesson/code-block.tsx`
  - `src/components/LessonComponents.tsx` (`LessonCodeEditor`)
  - `src/components/editor/PyodideRunner.tsx`
  - `src/lib/pyodide-worker.ts` & `public/pyodide-worker.js`
  - All `lab.md`, `assignment.md`, and `notebook.ipynb` files in `src/content/modules/ia/lessons/*/`

### 1.2 Verified Defects vs. Design Proposals

| ID | Category | Type | Priority | Evidence (Playwright Measurements & Screenshots) | Educational UX Impact | Concrete Recommendation |
|---|---|---|---|---|---|---|
| **AUD-01** | Progressive Reveal & Linear Reading | **Verified Defect** | **Critical** | **31 of 56 sections (55%)** across Module 1 have `hasReveal: false` (L1: 6/16, L2: 14/16, L3: 11/12, L4: 9/12). Entire walls of prose, lists, quizzes, and 500px+ interactive trainers dump onto the screen simultaneously. | Destroys the interactive fullscreen presentation feel; overwhelms the student with simultaneous text and charts instead of guided step-by-step discovery. | Wrap all multi-block sections in `<RevealSequence>` (using default `appear` mode so each click reveals one coherent pedagogical step in place, avoiding vertical stacking overflow). Convert introductory/narrative prose into `<DialogueBox>` or concise step cards. |
| **AUD-02** | Vertical Overflow & Container Clipping | **Verified Defect** | **Critical** | At `1440×900`, **21 of 98 slices** overflow vertically (`verticalOverflowPx` up to **980px**):<br>• `lesson01` S4 (`showHistory` + `SpeciesCompare`): **429px** overflow<br>• `lesson01` S8 (`DiagnosticTrainer` + quiz + prose): **563px** overflow<br>• `lesson01` S12 (`ThresholdLab` + quiz + prose): **868px** overflow<br>• `lesson02` S4 (`PerceptronTrainer` + quiz + lists): **942px** overflow<br>• `lesson02` S7 (`KnnTrainer` + quiz + lists): **894px** overflow<br>• `lesson02` S9 (`RegressionTrainer` + quiz + lists): **850px** overflow<br>• `lesson03` S3 & S8 (`InteractiveFrame` `height="700px"` + quiz): **739px** overflow (`clippedBottom: 342px`)<br>• `lesson03` S10 (`InteractiveTable` + 4 `ConceptCard`s + quiz): **804px** overflow<br>• `lesson04` S8 (`InteractiveTable` + `RevealSequence` + quiz): **980px** overflow | Content falls below the fold inside a fullscreen carousel shell (`fixed inset-y-0`), forcing awkward inner scrolling while click-zones on left/right halves compete with scrolling. | 1) Use `RevealSequence` default `appear` mode (one active step at a time) instead of `showHistory` when a step contains an `AnymotionStage`, `InteractiveFrame`, or trainer.<br>2) In trainer/iframe sections (L1 S8/S12, L2 S4/S7/S9/S11, L3 S3/S8), place the `ChoiceQuestion` as Step 1 of `<RevealSequence>` and the interactive trainer/iframe + concise guide as Step 2.<br>3) Make `InteractiveFrame` height responsive (`max-h-[min(52vh,520px)]`) instead of fixed `700px`. |
| **AUD-03** | API 400 Console Errors on Every Interaction | **Verified Defect** | **Critical** | **35 console errors** (`Failed to load resource: status of 400`) recorded across the 4 lessons whenever a `ChoiceQuestion`, `DiagnosticTrainer`, `ConidiaSortGame`, `ThresholdLab`, or `ReflectionCheck` submits progress. Root cause: `POST /api/progress/reflection` (`route.ts:48`) requires `input.block_id`, but all 5 client components send `JSON.stringify({ blockId })`. | Every interactive quiz click logs a network error and sets error state (`"Invalid or missing block_id"`) in `ChoiceQuestion` and `ReflectionCheck`, breaking gamification persistence and showing red error alerts inside slides. | Accept `input.block_id ?? input.blockId` in `src/app/api/progress/reflection/route.ts` AND send `{ block_id: blockId, blockId }` from client callers so backward and forward compatibility are guaranteed. |
| **AUD-04** | Tables & ASCII Blocks Remaining in Module 1 | **Verified Defect / Requirement** | **High** | 3 tabular/raw structures remain:<br>1) `lesson02` S2: raw ASCII pipeline block (`Ejemplos de entrenamiento → Algoritmo → Modelo → Predicciones`) rendered inside dark Linux terminal `<CodeBlock>` with `$` prompt!<br>2) `lesson03` S10: `<InteractiveTable>` for Confusion Matrix (TP=35, FN=10, FP=5, TN=50) + 3 separate definition cards causing 804px overflow.<br>3) `lesson04` S8: `<InteractiveTable>` comparing AlphaFold vs Evo vs Traditional methods, immediately duplicated by 4 static card pairs below it (980px overflow). | 1) In L2 S2, a conceptual diagram is mistakenly rendered as a bash terminal command with `$` prompts.<br>2) In L3 S10, a static sortable table fails to visually connect TP/FP/FN/TN cells to Precision, Recall, and F1.<br>3) In L4 S8, the table and the 4 reveal cards repeat the exact same information twice on the same screen. | 1) Replace L2 S2 ASCII block with an interactive/animated `<SupervisedFlowPlayer />` SVG diagram showing Training Data → Algorithm → Model → Predictions + textbook analogy.<br>2) Replace L3 S10 `<InteractiveTable>` with `<ConfusionMatrixPlayer />` interactive 2×2 visual matrix that highlights TP/FN/FP/TN and dynamically illustrates Precision (35/40), Recall (35/45), and F1 (0.824).<br>3) Replace L4 S8 redundant table + cards with `<ModelComparePlayer />` interactive visual comparison (AlphaFold vs Evo vs Traditional across Input, Main Task, Output, Generative capability, and Lab relation). |
| **AUD-05** | DialogueBox Typewriter & Click Conflict | **Verified Defect** | **High** | In `lesson01` S1, `<DialogueBox lines={[...6 lines...]} />` is inside `<div>` with a paragraph below it inside `<RevealSequence showHistory>`. On initial load, only `"Bienvenido al laboratorio."` is visible (`1 / 6`), while the paragraph below it is already visible, and clicking the footer `"Continuar →"` advances the `RevealSequence` to Step 2 instead of advancing line `2 / 6` of `DialogueBox`! | The student misses 5 of Dra. Coni's 6 dialogue lines unless they specifically click inside the speech bubble, and the narrative order is inverted. | Register `DialogueBox` (when `hasLines && !isLastLine`) with the reveal advance coordinator OR make each dialogue thought a clean step / ensure `DialogueBox` consumes the forward advance until its lines complete, and show a clear `"Continuar diálogo (1/6) →"` affordance. |
| **AUD-06** | Visual Hierarchy, Micro-Typography & Touch Targets | **Verified Defect** | **Medium** | • `section.tsx` renders `h2` at `24px` (`lg:text-2xl`) and body at `16px` (ratio 1.5:1), while `10px` and `11px` fonts appear in 46+ places (`STEP_LABEL`, `ConceptCard` label, `AnymotionControls`, SVG labels).<br>• `AnymotionControls` play/replay buttons and `OverfittingPlayer` `−`/`+` buttons are `28×28px` (`h-7 w-7`), and `SpeciesComparePlayer` pills are `36px` tall (`min-h-9`), below the 44px touch target minimum.<br>• Console logs `[deprecated] Button primary — use SlideArrowButton instead` on every lesson load. | Weak typographic contrast between scene title and body; small control buttons on interactive animations are hard to tap on mobile/tablet; deprecated Button variant pollutes console warnings. | • Restore clear scene title hierarchy (`text-xl md:text-2xl lg:text-[28px]` with `max-w-4xl mx-auto` centered stage composition) and raise UI labels from `10px/11px` to `12px` (`text-xs`).<br>• Increase interactive control buttons in `AnymotionControls`, `OverfittingPlayer`, and `SpeciesComparePlayer` to `min-h-11` (`44px`) or `h-9 w-9` with touch padding.<br>• Fix the deprecated `Button` variant call in lesson header/controls. |
| **AUD-07** | Header Progress Indicator Format & Centering | **Design Proposal** | **Medium** | Top bar shows `"Diapositiva N de M"`, and `Section` content stretches full-bleed across `1440px` (`w-full`) without a readable centered measure (`max-w-4xl mx-auto`), making single-sentence steps look like wide horizontal ribbons. | Wide full-bleed cards on 1440px monitors force long eye saccades (160ch line length flagged by design harness) and feel like web cards rather than a centered presentation stage. | Constrain the scene stage content inside `Section` to a centered presentation frame (`mx-auto w-full max-w-4xl`) with balanced vertical rhythm, and display `"Escena N de M"` (with `"Diapositiva N de M"` preserved in `aria-label` / `sr-only` if needed for compatibility). |

---

## 2. Phase 2: Improvement Plan Before Implementation

### 2.1 Component Architecture Decisions

1. **Components Preserved Intact (Protected Code Consoles & Core Infrastructure):**
   - `src/components/lesson/code-block.tsx` (PROTECTED — 0 edits)
   - `src/components/LessonComponents.tsx` & `src/components/editor/PyodideRunner.tsx` (PROTECTED — 0 edits)
   - `src/lib/pyodide-worker.ts` & `public/pyodide-worker.js` (PROTECTED — 0 edits)
   - `src/content/modules/ia/lessons/*/lab.md`, `assignment.md`, `notebook.ipynb` (PROTECTED — 0 edits)
   - `ChoiceQuestion`, `QuizButton`, `FeatureButtonList`, `ConceptCard`, `MascotMessage`, `CalloutInfo` (reused as presentation primitives).

2. **Components to Refactor:**
   - `src/app/api/progress/reflection/route.ts`: Accept both `block_id` and `blockId` in POST body so reflection/quiz persistence returns HTTP 200 (0 console 400 errors).
   - `src/components/lesson/section.tsx`: Center the scene header and stage container (`mx-auto w-full max-w-4xl`), refine typographic scale (`h2` at `text-xl md:text-2xl lg:text-[28px]`), remove the bottom border line between scenes, and tighten vertical padding so scenes fit comfortably inside the `1440×900` and `768×1024` viewports.
   - `src/components/lesson/lesson-carousel.tsx`: Update the discrete top progress indicator to show `Escena {current + 1} de {total}` (while keeping `role="region"` and accessible labels clean), and eliminate the `[deprecated] Button primary` console warning.
   - `src/components/lesson/presentation/RevealSequence.tsx` & `src/components/lesson/presentation/DialogueBox.tsx`: Ensure `DialogueBox` integrates smoothly with `RevealSequence` (advancing dialogue lines on click/Continuar before advancing the reveal step), raise `STEP_LABEL` from `10px` to `12px` (`text-xs`), and ensure smooth step transitions (`reveal-up` 250ms, respecting `prefers-reduced-motion`).
   - `src/components/lesson/interactive-frame.tsx`: Replace oversized default `650px`/`700px` heights with a viewport-budgeted responsive height (`h-[min(52vh,480px)]`) so 3D protein and pipeline iframes fit inside the presentation stage without clipping (`clippedBottom === 0`).
   - `src/components/anymotion/AnymotionControls.tsx`, `OverfittingPlayer.tsx`, `SpeciesComparePlayer.tsx`: Ensure control buttons meet touch target ergonomics and respect `prefers-reduced-motion`.

3. **New Explanatory Visual & Animated Components (Replacing Tables & ASCII Blocks):**
   - `src/components/anymotion/animations/SupervisedFlowPlayer.tsx` (registered as `SupervisedFlow`):
     - Replaces the raw code-fenced ASCII diagram and static list in `lesson02` Section 2 ("Aprendizaje supervisado").
     - Uses `AnymotionStage` + `useAnymotionTimeline` + `AnymotionControls` + interactive step selector across the 4 stages:
       1. *Datos de entrenamiento* (conidias etiquetadas con área, circularidad, textura + analogía: ejercicios resueltos del libro).
       2. *Algoritmo* (busca patrones matemáticos que conecten features → especie + analogía: estudiante que estudia).
       3. *Modelo* (representación matemática de los patrones aprendidos + analogía: conocimiento adquirido).
       4. *Predicciones* (clasifica nuevas conidias no vistas + analogía: resolver ejercicios nuevos en el examen).
   - `src/components/anymotion/animations/ConfusionMatrixPlayer.tsx` (registered as `ConfusionMatrixVisual`):
     - Replaces `<InteractiveTable>` and the wall of 4 static definition cards in `lesson03` Section 10 ("Matriz de confusión").
     - Renders an interactive 2×2 visual diagnostic grid (`n = 100` conidias: `TP = 35`, `FN = 10`, `FP = 5`, `TN = 50` for *Aspergillus* vs *Penicillium*) inside `AnymotionStage` with interactive lens buttons:
       - *Vista general (TP, FP, FN, TN)*
       - *Precisión = TP / (TP + FP) = 35 / 40 = 87.5%* (highlights the Predicted Aspergillus column)
       - *Recall / Sensibilidad = TP / (TP + FN) = 35 / 45 = 77.8%* (highlights the Real Aspergillus row)
       - *F1-Score = 2 · (P · R) / (P + R) ≈ 0.824* (highlights the harmonic balance & clinical cost of FN vs FP).
     - Preserves 100% of the table headers, numbers, formulas, definitions, and clinical meaning.
   - `src/components/anymotion/animations/ModelComparePlayer.tsx` (registered as `ModelCompare`):
     - Replaces the redundant `<InteractiveTable>` + 4 card pairs in `lesson04` Section 8 ("Evo: modelos fundacionales para la genómica").
     - Interactive visual comparison across **AlphaFold**, **Evo (Arc Institute, 300B nt)**, and **Métodos tradicionales** with dimension tabs:
       1. *Entrada / Tipo de dato* (Secuencia de aminoácidos vs Genomas completos ADN incl. no codificante vs Datos experimentales)
       2. *Tarea principal* (Predicción estructural 3D vs Modelado y diseño generativo de secuencias vs Validación física/experimental)
       3. *Salida principal* (Coordenadas 3D atómicas vs Secuencias, variantes y proteínas diseñadas vs Estructura o función validada)
       4. *¿Genera secuencias nuevas?* (No vs Sí vs No)
       5. *Relación con el laboratorio* (Reduce cristalografía de rayos X vs Amplía ingeniería genética más allá de lo experimental vs Estándar de oro de validación).
     - Preserves every single cell and concept from both the table and the 4 comparison blocks in one cohesive interactive stage.

4. **Scene Structure & Progressive Reveal Plan for Module 1 (`lesson01` – `lesson04`):**
   - Every `<Section>` in `lesson01`, `lesson02`, `lesson03`, and `lesson04` will use `<RevealSequence>` (default `appear` mode for multi-element scenes so only one focused block occupies the stage per click, eliminating the 400px–980px vertical overflows).
   - Where a `<Section>` pairs a `<ChoiceQuestion>` with a heavy interactive lab (`DiagnosticTrainer`, `ConidiaSortGame`, `ThresholdLab`, `PerceptronTrainer`, `KnnTrainer`, `RegressionTrainer`, `Overfitting`, `InteractiveFrame`), Step 1 presents the motivating context + `<ChoiceQuestion>`, and Step 2 presents the interactive lab/trainer with its concise exploration guide.
   - All original educational content, scientific data, LaTeX formulas, `blockId` identifiers, and learning sequence are 100% preserved.

---

## 3. Actionable Task Checklist

- [x] **T1 — Fix Reflection API 400 & Presentation Shell / Primitives (`route: delegated`)**
  - Fix `src/app/api/progress/reflection/route.ts` to accept `block_id` or `blockId` and add unit test coverage if applicable.
  - Update `src/components/lesson/lesson-carousel.tsx` (`Escena X de Y` header indicator, remove deprecated Button warning), `src/components/lesson/section.tsx` (`max-w-4xl mx-auto` centered stage, improved title/body hierarchy), `src/components/lesson/interactive-frame.tsx` (viewport-aware responsive height), `src/components/lesson/presentation/RevealSequence.tsx` (12px step label, DialogueBox advance coordination), and `src/components/lesson/presentation/DialogueBox.tsx` (register with reveal advance while lines remain so clicking Continuar advances dialogue lines sequentially).
- [x] **T2 — Build & Register Explanatory Visual Components (`route: delegated`)**
  - Create `SupervisedFlowPlayer.tsx`, `ConfusionMatrixPlayer.tsx`, and `ModelComparePlayer.tsx` in `src/components/anymotion/animations/`.
  - Export them from `src/components/lesson/index.ts` and register them in `src/app/learn/[module]/[slug]/page.tsx` (`SupervisedFlow`, `ConfusionMatrixVisual`, `ModelCompare`).
  - Improve touch target sizing in `AnymotionControls.tsx`, `OverfittingPlayer.tsx`, and `SpeciesComparePlayer.tsx`.
- [x] **T3 — Refactor Module 1 Lessons (`lesson01` – `lesson04`) into Progressive Interactive Scenes (`route: delegated`)**
  - Refactor `lesson01_what_is_ai/lesson.md`, `lesson02_how_ai_learns/lesson.md`, `lesson03_ai_in_biotech/lesson.md`, and `lesson04_real_cases/lesson.md` so every scene uses progressive reveal (`RevealSequence`), zero raw tables or accidental bash terminals remain in `lesson.md`, all educational concepts and `ChoiceQuestion` `blockId`s are preserved, and no scene overflows the desktop viewport on initial render.
- [x] **T4 — Independent Final Verification with Playwright & Gates (`route: parent-verified`)**
  - Verify `git diff` confirms zero modifications to protected code consoles (`code-block.tsx`, `PyodideRunner.tsx`, `LessonComponents.tsx`, `pyodide-worker.ts`, `lab.md`, `assignment.md`, `notebook.ipynb`).
  - Run `npm run type-check`, `npm run test`, `npm run assets:check`, and `npm run build`.
  - Run Playwright visual verification across all 4 lessons of Module 1 (desktop `1440×900`, tablet `768×1024`, mobile `390×844`), capturing after-screenshots and verifying 0 console errors, progressive click reveal, back/forward navigation, and visual table replacements.

---

## 4. Phase 4 Verification Evidence (2026-10-15)

- **Delegated Writer (`gentle-ai-worker`):** Completed T1, T2, and T3 (`ses_ebeac2025ffev2E6SShGN1xt2U`).
- **Delegated Verifier (`gentle-ai-verify`):** Completed independent static, build, and content audit (`ses_ebe9b57d0ffeZUOqGFwew6KkG6`), confirming 100% of sections use `<RevealSequence>`, zero tables or code fences remain in `lesson.md` across Module 1, and all protected code consoles are byte-identical.
- **Orchestrator Correction During Verification:** Fixed multiline `<p className="...">\n...\n</p>` blocks in `lesson01`–`lesson04` `lesson.md` that MDX compiled into nested `<p><p>...</p></p>` hydration errors; added durable regression test `src/__tests__/expediciones-m1-refactor.test.ts`.
- **Playwright Real Browser Verification (`/tmp/opencode/audit-m1-after/`):**
  - `consoleErrorsCount`: **0** across all 4 lessons and all interactive states (down from 35 HTTP 400 errors and 4 hydration errors).
  - `POST /api/progress/reflection`: **39/39 responses returned HTTP 200**.
  - `DialogueBox` in `lesson01` S1: advances sequentially through all 6 lines (`1 / 6` → `6 / 6`) before `RevealSequence` advances to Step 2 (`step2ReachedAfter6Clicks: true`).
  - Scene header & navigation: displays `Escena X de Y` (`¿QUÉ ES LA INTELIGENCIA ARTIFICIAL? — ESCENA 2 DE 16` ↔ `ESCENA 1 DE 16`), with back/forward navigation working via buttons, click zones, and keyboard.
  - Visual table replacements verified in browser & screenshots:
    - `lesson02-s2-supervised-flow-after.png` (`SupervisedFlowPlayer`)
    - `lesson03-s10-confusion-matrix-after.png` (`ConfusionMatrixPlayer`)
    - `lesson04-s8-model-compare-after.png` (`ModelComparePlayer`)
  - Responsive verification (`768×1024` tablet & `390×844` mobile): `hOverflow: 0`, `vOverflow: 0` on initial scenes.

### Content-accuracy correction (requested by user after Phase 4)
- `lesson04_real_cases` Section 12 ("Fin del Módulo 1") claimed a roadmap of **"Módulo 2: Deep Learning"** and **"Módulo 3: ML en producción"**. Neither module exists in the repository.
- Verified truth from the repository: exactly four modules exist, and their own frontmatter agrees with their `module.json` `order` values — `ia` (order 1, *Introducción a la IA*), `python` (order 2), `estadistica` (order 3, its own `Prerequisites` reads *"Módulo 2 (Fundamentos de Programación en Python)"*), `machine-learning` (order 4, its own `Prerequisites` reads *"Módulo 3 (Estadística para Aprendizaje Automático)"*).
- Replaced the fabricated list with the three real next modules, each linked to its real first lesson: `/learn/python/lesson01_installing_python`, `/learn/estadistica/lesson01_descriptive_stats`, `/learn/machine-learning/lesson01_ml_fundamentals`.
- Verified in the browser (Playwright): all three links render visibly, all three target routes return HTTP 200, no residual text matches `Deep Learning` or `ML en producción`, and the console reports 0 errors.
