# Design: content-integrity-cleanup

## Technical Approach

Three sequential passes across four modules (python → estadistica → machine-learning → ia), implemented as auto-chained PRs under the 400-line review budget. Pass 1: emoji strip + neutral Spanish. Pass 2: ethics verification (zero content found — verification-only). Pass 3: notebook translation with per-notebook diff review. Content-only; no behavioral contracts change.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| PR slicing strategy | Module-first (not pass-first) | Passes touch overlapping files; module grouping avoids merge conflicts. Python splits into 2 PRs for pass 1 (85 content files > 400 lines). |
| Ethics pass | Verification-only grep audit | Zero "ética" matches across all content + UI — `etica` module already deleted. Removal is a no-op. |
| Notebook review | Per-notebook diff checkpoint | User requires diff summary before each next notebook. Non-gating: present + wait, then proceed. |

## PR Chain (13 PRs)

**python** (17 lessons, 85 .md + 17 notebooks): PR-1 (lessons 01-09 + UI emoji), PR-2 (lessons 10-17), PR-3 (ethics verify), PR-4 (notebooks).
**estadistica** (10 lessons): PR-5 (emoji+neutral), PR-6 (ethics verify), PR-7 (notebooks).
**machine-learning** (10 lessons): PR-8 (emoji+neutral), PR-9 (ethics verify), PR-10 (notebooks).
**ia** (4 lessons): PR-11 (emoji+neutral), PR-12 (ethics verify), PR-13 (notebooks).

Each PR targets the previous PR's branch. Final PR targets the feature branch. UI component emoji removal (16 `.tsx`/`.ts` files, 1-2 lines each) bundled into PR-1.

## Pass 1: Emoji Strip + Neutral Spanish

### Emoji ranges (prose only; code blocks exempt)

| Range | Present in codebase |
|-------|-------------------|
| U+2190–U+21FF (Arrows) | `→` `←` `↓` `↑` — 150 instances across content |
| U+2713 (Check Mark) | `✓` — present |
| U+2600–U+27BF, U+1F300–U+1FAFF, U+FE00–U+FE0F, U+200D, U+2B00–U+2BFF | None currently — scan anyway |

**Algorithm (.md)**: Split on fenced code blocks and inline code. Remove emojis from prose segments only. Reassemble.
**Algorithm (.ipynb)**: Parse JSON. Process markdown cell `source` as prose (protect inline code). Leave code cell `source` untouched. Rewrite valid JSON.

### Regionalisms

**Empirical finding**: Zero voseo. All 39 "hace" matches are standard third-person. Content is already neutral. Apply agent scans and confirms zero for: voseo verbs (`hacés`, `sos`, `tenés`, `podés`, `sabés`, `querés`, `venís`, `decís`, `sentís`, `conocés`, `ponés`, `salís`, `volvés`, `mirás`), imperatives (`ponete`, `salite`, `agate`, `decime`, `mirá`), regionalisms (`che`, `pibe`, `bondi`, `guita`, `afanó`, `piola`, `bárbaro`, `laburar`, `morfar`, `chamuyo`). Note: `después`, `hace`, `vuelta` are standard — not regionalisms.

## Pass 2: Ethics Verification

Search patterns (case-insensitive): `## Ética`, `## Etica`, `### Ética`, `### Etica`, any heading containing `ética`. Cross-reference audit: grep for `ética`/`etica`/`Ética` in links, anchors, nav entries, `module.json`. **All greps return zero — this is a verification gate, not removal.**

## Pass 3: Notebook Translation

**Scope**: Markdown cells → translate English prose to neutral Spanish (preserve LaTeX `$...$`, code fences, HTML). Code cells → translate ONLY `#`-prefixed prose comments. NEVER alter identifiers, imports, function calls, literals, or any executable Python.

**JSON integrity**: Parse → validate `cells`/`metadata`/`nbformat` → translate → rewrite with `json.dumps(indent=1)` → round-trip validation.

**Diff checkpoint**: After each notebook, present: cells modified (index + before/after excerpt), cells untouched (count), code cells verified untouched (count). Wait for acknowledgment before next notebook.

## Verification

| Gate | Command | Expected |
|------|---------|----------|
| Type check | `npm run type-check` (node 22) | Zero errors |
| Emoji zero | emoji regex on non-code content | Zero matches |
| Regionalism zero | voseo/regionalism grep | Zero matches |
| Ethics zero | `rg -i 'tica' src/content/modules/...` | Zero matches |
| Broken links | internal markdown link audit | Zero orphans |
| Notebook JSON | `json.load()` per notebook | Valid |

## File Changes

| Module | .md files | Notebooks | UI components |
|--------|-----------|-----------|---------------|
| python | 85 (17×5) | 17 | — |
| estadistica | 50 (10×5) | 10 | — |
| machine-learning | 50 (10×5) | 10 | — |
| ia | 20 (4×5) | 4 | — |
| UI components | — | — | 16 `.tsx`/`.ts` |

Lesson directories: `lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration. Content-only on feature branch. Each PR revertible via `git revert <slice-sha>`.

## Open Questions

None — specs clear, codebase empirically verified (zero ethics, zero voseo, 150 arrow emojis), mechanical approach deterministic.
