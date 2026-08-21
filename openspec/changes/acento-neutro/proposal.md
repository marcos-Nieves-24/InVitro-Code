# Proposal: acento-neutro — voseo → neutral "tú" Spanish

## Intent

All user-facing Spanish uses Argentine/Rioplatense voseo plus regional markers (`acá`, `toLocaleString("es-AR")`). Convert to neutral Latin-American "tú" (tienes/puedes/mira/pruébalo) with zero behavior change — content and string literals only.

## Scope

### In Scope
- 146 content `.md` files / 469 voseo hits (lesson/quiz/lab/assignment + 2 `machine-learning/subunits/*/README.md`).
- UI string literals: 11 files / ~18 spots in `src/app`, `src/components`, `src/lib`.
- `acá → aquí`; `toLocaleString("es-AR")` → `"es"` (16 spots, byte-identical). Never `es-MX`.

### Out of Scope
- Emoji/decorative-symbol removal; LLM assistant feature (future changes).
- `.ipynb` / `.bib` / `public/interactives/*` — verified clean.
- Code-behavior changes.

## Capabilities

### New Capabilities
- `neutral-spanish-content`: neutral "tú" register convention + `\b`-anchored voseo-marker audit exit check.

### Modified Capabilities
- None.

## Approach

**Hybrid C:** (1) scripted safe-regex pass applies a closed word-boundary dictionary (tenés→tienes, Escribí→Escribe) with ``` fences, inline code, and `$...$` LaTeX protected; (2) one LLM review pass per module resolves the morphological remainder (probá→prueba, probálo→pruébalo, por vos→por ti). A shared conversion dictionary (NO-CHANGE forms: estás, ves, vas a, tu/tus) is the pass contract.

**Delivery:** `auto-chain`, per-module slices — python → machine-learning → estadistica → etica → ia → UI — each verified by the scoped zero-marker grep (exceeds 400-line budget; no single PR).

## Affected Areas

| Area | Impact | Hits |
|---|---|---|
| `src/content/modules/python/**` | Modified | 51 files / 172 |
| `src/content/modules/machine-learning/**` | Modified | 31 / 119 |
| `src/content/modules/estadistica/**` | Modified | 29 / 89 |
| `src/content/modules/etica/**` | Modified | 27 / 63 |
| `src/content/modules/ia/**` | Modified | 8 / 26 |
| `src/app` + `src/components` + `src/lib` | Modified | ~18 strings + 16 locale |
| `**/*.ipynb`, `**/*.bib`, `public/interactives/*` | None | clean |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Accent/morphology errors | High | Regex only no-op-accent forms; rest to LLM pass |
| MDX/code corruption | Med | fence/inline-code/LaTeX protection |
| Over-rewriting neutral forms | Med | NO-CHANGE dictionary entries |
| `sos` tail-trap exit check | Med | `\bsos\b` both sides |
| Locale separator change | Low | `es` only, never `es-MX` |
| Review budget blow | High | auto-chain per-module slices |

**Tradeoffs:** hybrid over pure-LLM (style drift, token cost, weak auditability) and pure-regex (no stem/enclitic handling); regional markers included despite being cosmetic.

## Rollback Plan

Each slice is an isolated line-edit commit; `git revert <slice-sha>`. No schema/DB/behavior state to roll back.

## Dependencies

None.

## Success Criteria

- [ ] Zero `\b`-anchored voseo markers in 5 modules + `src/app|components|lib`.
- [ ] All 16 `toLocaleString("es-AR")` → `"es"`.
- [ ] `npm run build` passes; diffs content/string-only.
