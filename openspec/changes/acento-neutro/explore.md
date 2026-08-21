## Exploration: acento-neutro — Convert user-facing content from Argentine voseo Spanish to neutral "tú" Spanish

### Current State

InVitro-Code is a content-driven Next.js 16 platform (Duolingo-style, for biotech students learning AI/ML). All user-facing content is Spanish, currently written in Argentine/Rioplatense voseo. Content lives in `src/content/modules/{python, ia, estadistica, etica, machine-learning}/lessons/lessonNN_*/` as `lesson.md` (MDX), `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`, `references.bib`, plus module `README.md` and `module.json` (frontmatter/display names are neutral). UI strings live in `src/app`, `src/components`, and `src/lib`. Rendering is verbatim: the lesson page splits `lesson.md` on `<Section>` blocks and compiles them; `quiz-parser.ts` extracts `question`/`explanation` text from `quiz.md`; MDX attributes (`InteractivePrompt`, `ReflectionCheck` — the repo uses `ReflectionCheck`, not `ReflectionPrompt`) are rendered by components. Nothing here requires a code change — every affected string is content or a string literal.

**Corpus volume (verified, word-boundary-anchored marker grep):** **146 markdown files / 469 voseo hits** under `src/content/modules/`.

| Module | Files | Hits | Dominant files |
|---|---|---|---|
| python | 51 | 172 | lesson.md (105), assignment.md (51), quiz.md (24) |
| machine-learning | 31 | 119 | lesson.md (82), assignment.md (26), quiz.md (16), subunits README (3) |
| estadistica | 29 | 89 | assignment.md (42), lesson.md (37), quiz.md (11) |
| etica | 27 | 63 | lesson.md (22), lab.md (21), assignment.md (16), quiz.md (8) |
| ia | 8 | 26 | assignment.md (16), lesson.md (11) |

By file type (all modules): `lesson.md` 46 files / 244 hits, `assignment.md` 47 / 147, `quiz.md` 44 / 56, `lab.md` 7 / 19, `README.md` 2 / 3. Top offenders: `machine-learning/lesson01_ml_fundamentals/lesson.md` (13), `python/lesson03_variables/lesson.md` (10), `python/lesson01_installing_python/lesson.md` (10).

**Verified clean (do NOT touch):** `.ipynb` notebooks (0 real hits — the greps matched "casos/falsos" tails and base64 image data), `.bib` files (0), `public/interactives/*.html` (0). Root `README.md` and `PROJECT_STRUCTURE.md` are clean. Module READMEs with voseo: only `machine-learning/subunits/01_supervised/README.md` and `02_unsupervised/README.md` (tenés/necesitás).

**Marker-frequency trap:** `sos\b` (unanchored) matches word TAILS ("casos", "pesos", "ingresos", "falsos", "esos") — this inflates counts ~3× and hits code files (`diagnostic-trainer.tsx`, `perceptron-trainer.tsx` are FALSE positives: "569 casos reales", "pesos actualizados"). Real standalone `sos` (voseo "eres") appears exactly **once** (`ia/lesson01_what_is_ai/lesson.md:26`). All exit checks must use `\bsos\b`. Similarly "posta"/"dale" greps were false positives from "código postal".

**Neutral forms that LOOK voseo but are identical in "tú" (NO-CHANGE):** `estás`, `ves`, `vas a` / `vamos a`, `viste` (preterite), `tenías`, `podrías`, `usarías`, `sé` (imperative ser), `tu/tus/tuyo` possessives, `te` clitics. A conversion dictionary that lists these as no-ops prevents over-rewriting.

### Affected Areas

**Content (`src/content/modules/`, 146 files, 469 hits — content only, no structure changes):**
- `*/lessons/*/lesson.md` (46 files, 244 hits) — prose, `<Section>` blocks, `<InteractivePrompt prompt= answer= defaultValue=>`, `<ReflectionCheck prompt= answer=>` attributes, frontmatter is neutral.
- `*/lessons/*/assignment.md` (47 files, 147 hits) — instruction lists ("Calculá la matriz de correlación", "Seleccioná el mejor modelo").
- `*/lessons/*/quiz.md` (44 files, 56 hits) — question stems ("**Q8.** Escribí una función...") and `<details>` answer explanations ("establecé learning_rate = 0.01-0.1 y usá early stopping").
- `*/lessons/*/lab.md` (7 files, 19 hits, all etica + ia lesson04) — lab instructions ("Elegí uno de los siguientes casos", "Leé la descripción").
- `machine-learning/subunits/*/README.md` (2 files, 3 hits).

**UI string literals (11 files, ~18 spots — text changes only):**
- `src/app/(dashboard)/dashboard/page.tsx:197` — "descubrí nuevas formas" → "descubre". (Hero "Bienvenido de vuelta" / "Estás construyendo tu camino" are already neutral.)
- `src/app/(dashboard)/comunidad/page.tsx:261-262` — "Todavía no entrás en el top 50 — tenés X XP" + "Completá tu primera lección".
- `src/app/learn/page.tsx:16` — "Elegí tu Expedición".
- `src/app/(dashboard)/logros/page.tsx:177` — "Completá una lección para..." ; `laboratorios/page.tsx:93` — "Completá".
- `src/lib/ui/empty-states.ts` — "Completá" (×2), "Empezá", "Ejecutá" (×2), "acá", "vas a entrenar" (already neutral).
- `src/components/labs/QuizRunner.tsx:217,229` — placeholders "Escribí tu respuesta..." / "Escribí tu código...".
- `src/components/lesson/reflection-check.tsx:71` — placeholder "Escribí tu respuesta acá...".
- `src/components/lesson/knn-trainer.tsx:749` — "Elegí k y explorá cómo..."; `regression-trainer.tsx` — "explorá"; `overfitting-trainer.tsx:556` — "Explorá cómo...".
- `toLocaleString("es-AR")` — 16 occurrences (14 user-visible in `InVitroTopBar.tsx`, dashboard ×5, logros, comunidad ×2, niveles ×4; 2 in comments in `achievements.ts`). Swap to `"es"`: es-AR and es/es-ES share the same number grouping (1.234,56), so formatting is byte-identical → zero visible behavior change. Do NOT use es-MX (changes separators).

**Parsers (read-only confirmation, no change):** `src/lib/labs/quiz-parser.ts` extracts `question`/`explanation` and renders verbatim; lesson page + `ReflectionCheck`/`InteractivePrompt` components render attributes verbatim. Content-only edit is sufficient.

### Approaches

1. **LLM per-file rewrite, parallel by module** — one agent per module rewrites all 146 files.
   - Pros: Best Spanish morphology (handles "probálo→pruébalo", "fijate→fíjate", "acordate→acuérdate" naturally); no regex risk of touching code fences; consistent voice.
   - Cons: Inconsistency across 5 agents (style drift per module); high token cost re-reading 146 files; risk of accidentally rewording neutral prose or altering MDX structure; auditability depends on human review of every file; slowest.
   - Effort: High.

2. **Scripted regex conversion for the mechanical forms + manual review** — dictionary of word-boundary substitutions (tenés→tienes, Escribí→Escribe, vos→tú, acá→aquí, etc.) applied corpus-wide, then a human reviews diffs.
   - Pros: Fast, uniform, cheap; diffs are pure line edits → perfect auditability; the ~380/469 hits are truly mechanical.
   - Cons: Regex cannot safely handle stem-changing imperatives (probá→prueba, empezá→empieza, contá→cuenta, vení→ven) — would need a large exception table or produce wrong forms; enclitic accent-shift forms (probálo→pruébalo, pensála→piénsala, fijate→fíjate adds an accent) are a distinct rule class; must implement code-fence/inline-code/MDX-attribute-aware tokenization to avoid corrupting `defaultValue` Python templates; risk of over-matching (the `sos` trap).
   - Effort: Medium.

3. **Hybrid: safe mechanical regex pass + LLM review pass** — scripted pass converts the closed dictionary of unambiguous forms with word boundaries, protected fences (` ``` `), inline code (`` ` ``), and LaTeX (`$...$`), then a single LLM review pass per module handles irregular/enclitic/contextual leftovers (prueba-type stem changes, pronoun "vos" object contexts like "por vos→por ti", missed forms) and verifies MDX structure.
   - Pros: Regex removes ~80-90% of the volume deterministically (uniformity + auditable zero-marker exit check); LLM pass concentrates on the genuinely morphological remainder (small, reviewable); one reviewer per module → consistent voice; cheapest correct outcome.
   - Cons: Two tools to coordinate; the LLM pass must NOT re-touch what the regex already fixed; needs a shared conversion dictionary as the contract between both passes.
   - Effort: Medium.

### Recommendation

**Approach C — Hybrid: scripted safe-regex pass + LLM review pass per module.**

Rationale: ~85% of the 469 hits are closed-set, unambiguous substitutions (tenés→tienes, Escribí→Escribe, usá→usa, Seleccioná→Selecciona, creá→crea, etc.) that a word-boundary dictionary handles deterministically with an auditable, diff-friendly result. The genuinely tricky remainder is small and precisely enumerable: stem-changing imperatives (~probá→prueba, empezá→empieza, contá→cuenta, vení→ven, seguí→sigue), enclitic accent-shift forms (probálo→pruébalo, pensála→piénsala, mostralas→muéstralas, fijate→fíjate, acordate→acuérdate, Grabate→Recuerda idiomatically), and the pronoun "vos" in object/preposition contexts (por vos→por ti, con vos→contigo). Those are best handled by a focused LLM review pass per module (5 passes, parallel), with the shared conversion dictionary as the contract.

Implementation guardrails: (1) the regex pass MUST skip ``` fences, inline code, and `$...$` math — but Spanish comments inside `InteractivePrompt defaultValue` templates ARE in scope (user-facing editor starter code); (2) run the marker grep with `\b` on BOTH sides (`\bsos\b`, not `sos\b`) to avoid the casos/pesos trap; (3) exit check = zero hits of the curated voseo marker set in `src/content/modules/` AND in `src/app|components|lib` string literals; (4) UI strings (11 files) and the es-AR→es locale swap are trivial line edits done in the same pass; (5) deliver per-module PRs (python → machine-learning → estadistica → etica → ia → UI) because ~146 files of line edits will blow past the 400-line review budget if shipped as one PR.

### Risks

- **Accent/morphology errors** are the top risk: voseo imperatives LOSE the accent in tú ("Escribí"→"Escribe"), while enclitic forms MOVE the stress (probálo→pruébalo, pensála→piénsala) and fijate→fíjate ADDS one. Regex must only handle the no-op-accent cases; the rest go to the LLM pass.
- **Corrupting MDX/code**: naive regex inside `defaultValue` templates or ``` fences would alter Python code. Fence/inline-code protection is mandatory; only instructional Spanish comments inside templates are in scope.
- **Over-rewriting neutral forms**: estás, ves, viste, vas a, tenías, podrías, tu/tus are identical in both dialects — the dictionary must mark them NO-CHANGE.
- **False-positive exit checks**: the `sos` tail-matching trap must be avoided in the acceptance grep (word boundaries both sides).
- **Locale swap risk**: use `"es"`/`es-ES` only — `es-MX` changes thousands/decimal separators and would be a visible behavior change (violates content-only constraint).
- **Review budget**: ~146 files of line edits far exceeds the 400-line PR budget — plan chained per-module PRs; `delivery_strategy` must be resolved before sdd-tasks.
- **Scope creep**: notebooks, bibs, and public interactives are verified clean — exclude them explicitly from the task list.

### Ready for Proposal

**Yes.** The corpus is fully quantified (146 files / 469 hits, 5 modules, per-file-type breakdown), the code-UI surface is enumerated (11 files, ~18 spots, 16 locale swaps), the conversion dictionary is grounded in real corpus sentences, and three approaches with a clear recommendation are ready. The orchestrator should tell the user: this is a large but purely mechanical content conversion (~146 md files + ~20 UI string literals), no behavior change, zero new dependencies; recommend proposing it with per-module delivery slices and the es-AR→es locale swap included. One decision to surface: whether "acá→aquí" and the es-AR→es swap are in scope (recommended: yes, they are the remaining regional markers).
