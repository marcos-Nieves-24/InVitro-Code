# neutral-spanish-content Specification

## Purpose

Establishes neutral Latin-American "tú" as the single register for all user-facing Spanish content and UI string literals, replacing Argentine voseo forms and regional markers with zero behavior change, gated by a `\b`-anchored zero-marker audit.

## Requirements

### Requirement: REQ-NEUTRAL-01 Neutral "tú" Register

All user-facing Spanish content and UI string literals SHALL use neutral Latin-American "tú" forms. Voseo verb forms, imperatives, pronouns, and regional markers MUST convert exactly per the design conversion dictionary (mechanical set, LLM-pass remainder, pronoun forms). NO-CHANGE forms (`estás`, `ves`, `vas a`, `tu`/`tus`, `sé`) MUST NOT be altered.

#### Scenario: Mechanical dictionary conversion

- GIVEN content containing `tenés`, `podés`, `Escribí`, `acá`, `sos`
- WHEN the conversion passes run
- THEN it reads `tienes`, `puedes`, `Escribe`, `aquí`, `eres`

#### Scenario: LLM-pass morphological conversion

- GIVEN content containing `probá`, `probálo`, `fijate`, `por vos`
- WHEN the conversion passes run
- THEN it reads `prueba`, `pruébalo`, `fíjate`, `por ti`

#### Scenario: NO-CHANGE forms preserved

- GIVEN text containing `estás`, `ves`, `vas a`, `tu notebook`, `sé`
- WHEN the conversion passes run
- THEN those forms remain byte-identical

### Requirement: REQ-NEUTRAL-02 Conversion Coverage

The conversion SHALL cover content `.md` files in modules `python`, `machine-learning`, `estadistica`, `etica`, `ia` (lesson, quiz, lab, assignment + the two `machine-learning/subunits/*/README.md`), and UI string literals in `src/app`, `src/components`, `src/lib` — including `InteractivePrompt`/`ReflectionCheck` `defaultValue` template literals. `toLocaleString("es-AR")` SHALL become `"es"` and MUST NOT become `es-MX`. Excluded files MUST NOT be touched.

#### Scenario: Content coverage with protection

- GIVEN a lesson with voseo in instructional text plus code fences, LaTeX, and frontmatter
- WHEN converted
- THEN instructional text is neutral AND fences, `$...$` LaTeX, and frontmatter stay verbatim

#### Scenario: UI and locale coverage

- GIVEN a UI string with `Hacé clic` and a `toLocaleString("es-AR")` call
- WHEN converted
- THEN the string reads `Haz clic` and the locale is `"es"`, never `es-MX`

#### Scenario: Exclusions untouched

- GIVEN voseo-like content inside `**/*.ipynb`, `**/*.bib`, or `public/interactives/*`
- WHEN the change applies
- THEN those files remain byte-identical

### Requirement: REQ-NEUTRAL-03 Audit Exit Check

The three design audit greps (content, UI, stem/enclitic remainder) SHALL return zero hits after each delivery slice and corpus-wide at close. Greps MUST keep `\b` anchoring on both boundaries and per-case marker enumeration (no `grep -i`). The `sos` tail-trap MUST reach zero; `es-AR` MUST reach zero in `src`.

#### Scenario: Per-slice zero hits

- GIVEN a completed delivery slice (e.g. python)
- WHEN the scoped content grep runs
- THEN it returns zero hits

#### Scenario: Both-boundary anchoring

- GIVEN words `casos`, `pesos`, `ingresos`, `falsos`
- WHEN the content grep runs
- THEN none match `\bsos\b`

#### Scenario: Case-enumerated markers

- GIVEN already-neutral targets `usa`, `explora`
- WHEN the audit greps run
- THEN they do not match, since markers are enumerated per case without `-i`

### Requirement: REQ-NEUTRAL-04 Verification

`npm run type-check` and `npm run build` SHALL pass at close. Diffs SHALL contain only content/string-literal lines — no code-logic, fence, MDX-structure, LaTeX, or frontmatter lines.

#### Scenario: Static gates pass

- GIVEN all six delivery slices applied
- WHEN `npm run type-check` and `npm run build` run
- THEN both pass

#### Scenario: Diff discipline

- GIVEN a per-slice `git diff`
- WHEN inspected
- THEN only content/string-literal lines differ

## Out of Scope

- Emoji/decorative-symbol removal; LLM assistant feature
- Notebooks, `.bib`, `public/interactives/*`; code-behavior changes
