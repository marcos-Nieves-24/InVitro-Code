# Proposal: content-integrity-cleanup

## Intent

The platform carries three content hygiene debts that block a polished Spanish-first experience: (1) residual emojis scattered across 41 content files and UI strings break the professional tone; (2) ethics sections still exist inside modules whose dedicated `etica` module was already removed, creating broken cross-references and orphaned content; (3) ~37 notebooks remain English-dominant, making the bilingual experience inconsistent. All three must ship together because emoji removal and neutral-Spanish passes touch the same files as ethics removal and notebook translation — splitting them would cause merge conflicts in chained PRs.

## Scope

### In Scope

- **WS-A**: Remove ALL emojis from content files (`lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`) and UI component strings. Rewrite Spanish text to neutral register (no voseo, no regionalisms). Code identifiers and function names untouched.
- **WS-B**: Remove every "ética" SECTION inside `lab.md`, `assignment.md`, `notebook.ipynb` cells, and web components of modules `ia`, `machine-learning`, `estadistica`, `python`. Remove cross-references/links to those sections from indexes, tabs, nav menus. Verify zero broken links or orphaned references.
- **WS-C**: Translate ~37 English-dominant notebooks to neutral Spanish. Code intact; prose comments translated. Module order: python → estadistica → machine-learning → ia.

### Out of Scope

- `console-overlay-responsive` change (separate).
- Layout shell, auth/data, Clerk, Supabase.
- The already-removed `src/content/modules/etica/` module.

## Capabilities

### New Capabilities

None — this is a content-only cleanup with no behavioral contract changes.

### Modified Capabilities

- `assignment-content-cleanup`: extend REQ-CLEAN-01 to include ethics section removal (not just Entregables/Rúbrica/Tiempo).
- `lesson-reader`: add requirement that content MUST render without emoji characters and MUST use neutral Spanish register.
- `lab-runner`: add requirement that lab content MUST NOT contain ethics sections.

## Approach

Auto-chain, per-module slices (python → estadistica → machine-learning → ia). Each slice: (1) emoji strip + neutral-Spanish pass; (2) ethics section removal + cross-reference audit; (3) notebook translation with explicit diff review checkpoint per notebook before moving to the next. Each slice must pass `npm run build` and a grep for residual emojis before merge.

## Affected Areas

| Area | Impact | Workstream |
|------|--------|------------|
| `src/content/modules/python/lessons/**` | Modified | WS-A, WS-B, WS-C |
| `src/content/modules/estadistica/lessons/**` | Modified | WS-A, WS-B, WS-C |
| `src/content/modules/machine-learning/lessons/**` | Modified | WS-A, WS-B, WS-C |
| `src/content/modules/ia/lessons/**` | Modified | WS-A, WS-B, WS-C |
| `src/app/**`, `src/components/**` (UI strings) | Modified | WS-A |
| `src/content/modules/*/lessons/*/notebook.ipynb` | Modified | WS-C |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Merge conflicts between chained PR slices | Med | Per-module isolation; each slice builds on clean base |
| Notebook translation quality drift | Med | Diff review checkpoint per notebook; neutral register enforced |
| Broken cross-references after ethics removal | Med | Grep audit for `ética`, `Etica`, `etica` across all content + UI |
| Review budget blow (400 lines per PR) | High | Auto-chain; each module slice stays under budget |
| Emoji removal in code blocks (false positive) | Low | Protect fenced code and inline code; emoji only in prose |

## Rollback Plan

Each slice is an isolated PR on a feature branch. `git revert <slice-sha>` per module. No DB/schema/behavior state affected — content-only changes.

## Dependencies

None.

## Success Criteria

- [ ] Zero emoji characters in all content files and UI strings (grep-verified).
- [ ] Zero "ética" sections or cross-references in `ia`, `machine-learning`, `estadistica`, `python` modules.
- [ ] All ~37 notebooks contain neutral Spanish prose; code blocks and variable names unchanged.
- [ ] `npm run build` passes after each module slice.
- [ ] No broken internal links (Playwright link audit on rendered pages).
