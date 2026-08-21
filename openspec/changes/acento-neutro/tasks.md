# Tasks: acento-neutro — voseo → neutral "tú" Spanish

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~600–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Split | PR 1→2→3→4→5→6 |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | PR | Focused test command | Runtime harness | Rollback |
|---|---|---|---|---|---|
| 1 | `python` module | 1 | content grep python → 0 | N/A (content-only) | `git revert` |
| 2 | `machine-learning` + READMEs | 2 | content grep → 0 | N/A | revert |
| 3 | `estadistica` | 3 | content grep → 0 | N/A | revert |
| 4 | `etica` | 4 | content grep → 0 | N/A | revert |
| 5 | `ia` (`sos` → 0) | 5 | content grep → 0 | N/A | revert |
| 6 | UI strings + locales | 6 | UI grep → 0; es-AR → 0 | `npm run build` | revert |

## Phase 1: python

- [x] 1.1 Regex dictionary pass (mechanical + NO-CHANGE list, design §B) over `src/content/modules/python/**/*.md`; fences/inline-code/frontmatter/LaTeX verbatim
- [x] 1.2 LLM pass python: stem-changers `probá→prueba`, enclitics `probálo→pruébalo`, pronouns `por vos→por ti`
- [x] 1.3 Content grep `src/content/modules/python` → 0
- [x] 1.4 Diff discipline (content lines only); commit `feat(content): neutralize voseo in python module`

## Phase 2: machine-learning

- [x] 2.1 Regex pass over `src/content/modules/machine-learning/**` incl. `subunits/*/README.md`
- [x] 2.2 LLM pass remainder
- [x] 2.3 Content grep → 0; commit `feat(content): neutralize voseo in machine-learning module`

## Phase 3: estadistica

- [x] 3.1 Regex pass over `src/content/modules/estadistica/**`
- [x] 3.2 LLM pass remainder
- [x] 3.3 Content grep → 0; commit `feat(content): neutralize voseo in estadistica module`

## Phase 4: etica

- [x] 4.1 Regex pass over `src/content/modules/etica/**`
- [x] 4.2 LLM pass remainder
- [x] 4.3 Content grep → 0; commit `feat(content): neutralize voseo in etica module`

## Phase 5: ia

- [x] 5.1 Regex pass over `src/content/modules/ia/**`
- [x] 5.2 LLM pass remainder; `lesson01_what_is_ai/lesson.md:26` `sos`→`eres`
- [x] 5.3 Content grep → 0; commit `feat(content): neutralize voseo in ia module`

## Phase 6: UI + locales

- [x] 6.1 Regex+LLM pass over voseo literals in `src/app`, `src/components`, `src/lib`: 27 files, 57 lines converted (design-gate hits + spec-driven pronoun/vos catches `(vos)`→`(tú)`, `Vos:`→`Tú:` + accented-final residual sweep catches Aprendé/Agregá/Ingresá/Explicá/Entregá/Cargá/Abrí/descargalo→descárgalo); commit `feat(ui): neutralize voseo strings and es-AR locales`
- [x] 6.2 Swap 14 `toLocaleString("es-AR")→"es"` in `src/app/(dashboard)/{niveles,comunidad,logros,dashboard}/page.tsx` + `InVitroTopBar.tsx`; per orchestrator-resolved decision, achievements.ts:44,231 comment refs also updated to `"es"` (supersedes design open-question recommendation)
- [x] 6.3 UI grep → 0 AND `grep -rn 'es-AR' src` → 0 AND stem/enclitic sweep → 0 AND vos-pronoun sweep → 0; diff 57 ins / 57 del symmetric, string-literal lines only; commit pending (orchestrator-owned)

## Phase 7: Verification

- [x] 7.1 Corpus-wide content grep (5 modules) → 0
- [x] 7.2 `npm run type-check` passes
- [ ] 7.3 `npm run build` passes — BLOCKED locally by documented Turbopack OOM (README); verification delegated to Vercel production build
- [x] 7.4 Final diffs: content/string-literal lines only
