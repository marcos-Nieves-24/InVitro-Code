# Design: acento-neutro — voseo → neutral "tú" Spanish

## Technical Approach

Content-only string conversion (Hybrid C from the proposal): a **scripted safe-regex pass** applies a closed, word-boundary-anchored dictionary to all user-facing Spanish, then a **per-module LLM review pass** resolves the morphological remainder. Zero runtime components, zero new dependencies. The conversion dictionary is the single shared contract both passes read. Rendering surfaces are verbatim (lesson page splits `<Section>` blocks; `quiz-parser.ts` extracts `question`/`explanation`; `InteractivePrompt`/`ReflectionCheck` render attributes), so editing content/string literals is sufficient — no parser, component, or code change.

## Architecture Decisions

| Decision | Option (tradeoff) | Choice |
|---|---|---|
| Conversion engine | Pure-LLM (style drift, token cost, weak audit) vs pure-regex (no stem/enclitic) vs hybrid (two tools to coordinate) | **Hybrid** — regex does ~85% deterministically + auditable zero-marker exit; LLM handles the small morphological remainder |
| Delivery | Single PR (blows 400-line budget) vs per-module slices (more PRs, clean revert) | **Per-module chained slices** — `delivery_strategy=auto-chain`, each slice isolated with `git revert` |
| Locale | `es` vs `es-MX` (changes separators → visible behavior change) | **`es` only** — es-AR and es share grouping (1.234,56), byte-identical output |
| Conversion dictionary | Ad-hoc per-module rewriting (drift) vs single shared table (uniform, auditable) | **Single shared dictionary** as the pass contract |

## Conversion Dictionary (shared contract)

**A. Mechanical pass — closed-set, word-boundary both sides, no stem/accent shift** (source → target):

| Present/indicative | Imperative/other |
|---|---|
| tenés→tienes, podés→puedes, querés→quieres, sabés→sabes, hacés→haces, necesitás→necesitas, entrás→entras, creés→crees | Escribí→Escribe, Elegí→Elige, Seleccioná→Selecciona, Completá→Completa, Ejecutá→Ejecuta, Usá/Usa→Usa, Creá→Crea, Calculá→Calcula, Compará→Compara, Visualizá→Visualiza, Graficá→Grafica, Analizá→Analiza, Interpretá→Interpreta, Ajustá→Ajusta, Explorá→Explora, Guardá→Guarda, Marcá→Marca, Imaginá→Imagina, Mirá→Mira, Leé→Lee, Establecé→Establece, acá→aquí, sos→eres |

**B. NO-CHANGE list (identical in both dialects — do NOT rewrite):** `estás, ves, viste, vas a / vamos a, tenías, podrías, usarías, sé, tu/tus/tuyo, te, prueba (noun "test")`.

**C. LLM-pass remainder (stem-changing / enclitic / contextual):** `probá→prueba, empezá→empieza, contá→cuenta, vení→ven, seguí→sigue, poné→pon, respondé→responde, intentá→intenta, descubrí→descubre, hacé clic→haz clic`; enclitics `probálo→pruébalo, pensála→piénsala, mostralas→muéstralas, fijate→fíjate, acordate→acuérdate, Grabate→Recuerda`; pronouns `por vos→por ti, con vos→contigo, por vos mismo→por ti mismo`.

## Protection Strategy (mechanical pass)

- Skip ``` fenced blocks, inline `` ` `` code, YAML frontmatter keys, and `$...$` LaTeX — **verbatim**.
- **In scope**: Spanish instructional text inside `InteractivePrompt`/`ReflectionCheck` `defaultValue` template literals (user-facing editor starter code).
- MDX attribute structure (`<InteractivePrompt prompt= answer=>`, `<ReflectionCheck prompt= answer= blockId=>`) preserved — only string *values* change.

## Audit Exit Check

```bash
# Content DONE (per-module and corpus-wide) — zero hits:
grep -rEn '\b(tenés|podés|querés|sabés|hacés|necesitás|entrás|creés|sos|Escribí|escribí|Elegí|elegí|Seleccioná|seleccioná|Completá|completá|Ejecutá|ejecutá|Usá|usá|Creá|creá|Calculá|calculá|Compará|compará|Visualizá|visualizá|Graficá|graficá|Analizá|analizá|Interpretá|interpretá|Ajustá|ajustá|Explorá|explorá|Guardá|guardá|Marcá|marcá|Imaginá|imaginá|Mirá|mirá|Leé|leé|Establecé|establecé|acá|Acá)\b' src/content/modules

# UI DONE — zero hits (excludes 'prueba' noun; trainer files with 'prueba' are clean):
grep -rEn '\b(tenés|podés|querés|sabés|hacés|necesitás|entrás|sos|Escribí|escribí|Elegí|elegí|Seleccioná|seleccioná|Completá|completá|Ejecutá|ejecutá|Usá|usá|Creá|creá|acá|Acá|respondé|Respondé|intentá|Intentá|descubrí|Descubrí|Ajustá|ajustá|Hacé|hacé|Explorá|explorá|Empezá|empezá|Probá|probá|Seguí|seguí)\b' src/app src/components src/lib

# Stem/enclitic remainder (LLM-pass DONE): zero hits
grep -rEn '\b(Probá|probá|Empezá|empezá|Contá|contá|Vení|vení|Seguí|seguí|Poné|poné|probálo|pensála|mostralas|fijate|acordate|Grabate)\b' src

# Locale swap — zero 'es-AR':
grep -rn 'es-AR' src
```

Every marker in all three greps is anchored with `\b` on **both** sides: the left `\b` defeats the `casos/pesos/ingresos/falsos` tail-trap (it stops `sos` matching a longer word's tail), and the right `\b` stops prefix over-match. Case is enumerated per imperative marker rather than `grep -i`, because the neutral tú target is a case-variant of the voseo source (`usá→usa`, `explorá→explora`, `empezá→empieza`, `establecé→establece`) — `-i` would permanently match those already-correct neutral forms, so the zero-hit gate could never pass. `\bsos\b` appears exactly **1×** corpus-wide (`ia/lessons/lesson01_what_is_ai/lesson.md:26`) — the audit must reach zero. `diagnostic-trainer.tsx` is clean; `perceptron-trainer.tsx` is a *real* voseo hit (`Hacé clic`, line 559), not a false positive.

## Delivery Slices (auto-chain)

| # | Slice | Scope | Exit check | Rollback |
|---|---|---|---|---|
| 1 | python | `src/content/modules/python/**` | content grep → 0 | `git revert <sha>` |
| 2 | machine-learning | `.../machine-learning/**` (incl. 2 subunits READMEs) | content grep → 0 | revert |
| 3 | estadistica | `.../estadistica/**` | content grep → 0 | revert |
| 4 | etica | `.../etica/**` | content grep → 0 | revert |
| 5 | ia | `.../ia/**` | content grep → 0 | revert |
| 6 | UI + locales | `src/app` `src/components` `src/lib` strings + 14 `toLocaleString("es-AR")`→`"es"` | UI grep → 0 + `es-AR` → 0 | revert |

## File Changes

| File | Action | Description |
|---|---|---|
| `src/content/modules/{python,machine-learning,estadistica,etica,ia}/**/*.md` | Modify | voseo → neutral (lesson/quiz/lab/assignment + 2 subunit READMEs) |
| `src/app/**`, `src/components/**`, `src/lib/**` (UI string spots + `es-AR`) | Modify | ~23 string literals + 14 locale swaps |
| `src/lib/gamification/achievements.ts` | Modify (optional) | 2 `es-AR` comment refs |
| `**/*.ipynb`, `**/*.bib`, `public/interactives/*` | None | verified clean — excluded |

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Static gate | Type safety + build | `npm run type-check` + `npm run build` at slice-6 end |
| Diff discipline | Content/string-literal lines only | `git diff` per slice: no fence/MDX-structure/LaTeX change; no code line touched |
| Exit check | Zero voseo markers | `\b`-anchored greps above (acceptance, not unit tests — no runner configured) |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No data/schema migration. Per-module slices limit review load; each slice reverts via `git revert`.

## Open Questions

- [ ] Rewrite the 2 `es-AR` **comments** in `achievements.ts` (week-start semantics) to `es`, or leave code comments untouched? (recommend: leave — they document weekday behavior, not user-facing text)
- [ ] Confirm `es-MX` exclusion is absolute (yes — separators differ; `es` only).
