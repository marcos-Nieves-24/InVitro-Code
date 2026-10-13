# Proposal: Figma Plugin — Lesson Presentation Mode

## Intent

Ship the lesson presentation mode (fullscreen slide shell, progressive reveal, anime speech box, pre-set answer quizzes) to Figma as a real design system, not flat mockups.

Two blockers were found while auditing the terrain and must be resolved before any design is produced:

1. **Palette drift.** `DESIGN.md` §1.1/§6 documents the legacy palette (`mint #a3cfcd`, `fog #82a0aa`, `surface #f4f6f8`) while `src/app/globals.css:14-29` implements the "scientific gradient" palette (`brand-950 #22005A` → `brand-300 #45DCC6`) with `--color-mint: var(--color-brand-400)` and `--color-fog: var(--color-brand-500)`. Building a Figma design system from `DESIGN.md` today would ship wrong colors.
2. **Stale spec.** `DESIGN.md` §2.4 predates the presentation layer entirely. It does not document `DialogueBox`, `RevealSequence`, `ChoiceQuestion`, `QuizButton`, `FeatureButtonList`, the fullscreen shell geometry (`fixed inset-y-0 right-0 lg:left-[var(--sidebar-offset)]`), the left/right click zones (`midX`), or the Anymotion animations (`ConidiaToVector`, `FeatureSpace2D`, `BrainVsChipPlayer`, `MatrixPlayer`).

## Route Decision

**Chosen: a first-party Figma plugin.** Rejected alternatives and why:

| Route | Verdict | Reason |
|---|---|---|
| Figma REST API | **Not viable** | The REST API cannot create file nodes. It is read-only for file content (comments, webhooks, and Variables on Enterprise plan only). Any plan that pushes nodes over REST will fail. |
| Figma Dev Mode MCP | Wrong direction | Reads designs *out* of Figma into code. Useful later, useless for getting our designs in. No Figma MCP server is currently connected either. |
| `html.to.design` + JSON | Viable fallback | Lower fidelity — depends on the third-party plugin's interpretation of the layer JSON. |
| **First-party plugin** | **Chosen** | Full fidelity via `figma.createFrame` / `createComponentSet` / `figma.variables`, real auto-layout, native variants, and fully re-runnable. Runs inside the user's Figma session, so it needs **no personal access token and no REST permissions**. |

## Scope

### In Scope — presentation mode only (scope choice: option 1, user-selected)

- Reconcile `DESIGN.md` §1.1/§6/§2.8 with the shipped implementation
- Generate `design/tokens.json` (W3C DTCG) by **parsing** `globals.css` — never hardcoded, so it cannot drift again
- Scaffold `figma-plugin/` (manifest, `code.ts`, `ui.html`, esbuild build, `@figma/plugin-typings`)
- Component sets with variants: `QuizButton`, `ChoiceQuestion`, `FeatureButtonList`, `DialogueBox`, `RevealSequence`, plus base `ConceptCard`, `Section`, `ComparisonTable`, `LabProgress`, `Button`/`SlideArrowButton`
- Screens: all 14 slides of `lesson01_what_is_ai` at 1280×800 and 375×667, populated from the real `lesson.md` content
- Verification PNGs via `brave --headless --screenshot`
- CI drift check on `design/tokens.json`

### Out of Scope

- The 12 non-presentation windows in `DESIGN.md` §4 (landing, dashboard, labs, projects, levels, achievements, community) — deferred to a later change
- Any write into a live Figma file by this repository's CI (the plugin is run manually from the Figma app)
- Changing the shipped UI. This change produces design artifacts; it does not alter `src/`

## Deliverables

### F0 — Reconcile source of truth (~1.5h)

- Rewrite `DESIGN.md` §1.1 and §6 with the real palette; declare `mint = brand-400` / `fog = brand-500` as aliases; document `.dark` overrides (`globals.css:103-112`)
- Add `DESIGN.md` §2.8: the five presentation components with props and state machines, fullscreen shell geometry, `midX` click zones, `Paso x de y`, tip + ghost arrows, and the four Anymotion animations with durations
- `scripts/figma-extract-tokens.mjs` → `design/tokens.json`; npm script `figma:tokens`

### F1 — Plugin scaffold (~1h)

`figma-plugin/manifest.json` (Figma API, `main` + `ui`) · `code.ts` · minimal `ui.html` (target page selector + dark-mode toggle) · esbuild build to `dist/code.js` · `@figma/plugin-typings` devDependency.

### F2 — Component sets (~3h)

Tokens become Variables: `InVitro/Color`, `InVitro/Type`, `InVitro/Space`, `InVitro/Radius`, `InVitro/Shadow`. Real auto-layout, no flat images.

| Component set | Variants |
|---|---|
| `QuizButton` | `state`: idle / hover / selected / correct / incorrect × `showHoverHint`: on / off |
| `ChoiceQuestion` | idle / incorrect+hint / correct / blocked (`blockOnQuiz`) |
| `FeatureButtonList` | collapsed / expanded, circular `+`/`−` affordance |
| `DialogueBox` | `variant`: scientist / coni × `mood`: neutral / thinking / celebrating, 45° tail |
| `RevealSequence` | `mode`: appear / stack × `showHistory`; control states complete / blocked |
| base | `ConceptCard` (definition / key-idea / warning), `Section`, `ComparisonTable`, `LabProgress`, `Button` |

### F3 — Screens (~2.5h)

`Lesson Presentation` page: 14 slides of `lesson01_what_is_ai` × 2 breakpoints, texts taken from the real `lesson.md` so the design cannot lie about the product. States to cover: S1 `Paso 1 de 2` with history, tip + `Entendido`, ghost arrows, S4 table → `FeatureButtonList` → `Conidia→Vector` (5 keyframes), S7 `FeatureSpace` 1D→2D (3 keyframes), S13 blocked checkpoint and incorrect quiz with hint.

### F4 — Verification and governance (~1h)

- `brave --headless --screenshot` per state → reference PNGs to diff against frames
- CI: regenerate tokens and diff against the committed `design/tokens.json`; fail on drift

## Acceptance Criteria

- [ ] Plugin is importable from `figma-plugin/manifest.json` in the Figma desktop app
- [ ] Tokens exist as Figma Variables and are applied to nodes — no loose hex values
- [ ] All five presentation component sets exist with navigable variants
- [ ] 14 slides × 2 breakpoints exist with copy identical to the shipped `lesson.md`
- [ ] `npm run figma:tokens` is reproducible from `globals.css` alone
- [ ] Zero color discrepancy between `design/tokens.json` and `globals.css`

## Operational Requirement

Open Figma → `Plugins → Development → Import plugin from manifest…` → select `figma-plugin/manifest.json`. The plugin runs in the user's session; **no personal access token and no REST scopes are required**.

## Related

- Worktree: `../invitro-code-worktrees/presentation-reemplazo-directo`
- Branch: `feat/presentation-reemplazo-directo`
- Design spec source: `DESIGN.md`, implementation source of truth: `src/app/globals.css`
