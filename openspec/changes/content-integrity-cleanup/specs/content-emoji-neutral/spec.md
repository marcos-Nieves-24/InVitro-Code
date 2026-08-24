# Delta for Content Emoji Neutral

## ADDED Requirements

### Requirement: REQ-EMOJI-01 Emoji-Free Content

All content files (`lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`) and UI component strings MUST NOT contain any emoji characters (Unicode ranges U+1F000–U+1FFFF, U+2600–U+27BF, U+FE00–U+FE0F, U+200D). Code blocks and inline code are exempt — only prose text is in scope.

#### Scenario: Content files are emoji-free

- GIVEN all content files across `python`, `estadistica`, `machine-learning`, `ia` modules
- WHEN a grep for emoji Unicode ranges is run on non-code content
- THEN zero matches are returned

#### Scenario: UI strings are emoji-free

- GIVEN all UI component files under `src/components/` and `src/app/`
- WHEN a grep for emoji Unicode ranges is run on string literals
- THEN zero matches are returned

#### Scenario: Code blocks are protected

- GIVEN a `lesson.md` containing a fenced Python code block with an emoji in a comment
- WHEN the emoji strip pass runs
- THEN the emoji inside the code fence remains unchanged

### Requirement: REQ-EMOJI-02 Neutral Spanish Register

All Spanish text in content files and UI strings MUST use neutral/professional register. Text MUST NOT contain voseo forms (e.g., "vos tenés", "podés"), Argentine regionalisms (e.g., "che", "pibe", "bondi"), or other region-specific colloquialisms.

#### Scenario: No voseo in content

- GIVEN all `assignment.md` and `lesson.md` files in Spanish modules
- WHEN a scan for voseo verb conjugations is run
- THEN zero matches are returned

#### Scenario: No regionalisms in UI

- GIVEN all UI component string literals
- WHEN a scan for known regionalism keywords is run
- THEN zero matches are returned

## MODIFIED Requirements

### Requirement: REQ-CLEAN-01 Strip redundant sections

Every `assignment.md` MUST NOT contain the `## Entregables`, `## Rúbrica*`, `## Tiempo estimado*`, or any `## Ética` / `## Etica` sections.

(Previously: Only `Entregables`, `Rúbrica`, `Tiempo estimado` were stripped.)

#### Scenario: Ethics sections removed from assignments

- GIVEN all `assignment.md` files across modules
- WHEN they are inspected
- THEN none contain an `Ética` or `Etica` heading

#### Scenario: Original sections still removed

- GIVEN all `assignment.md` files
- WHEN they are inspected
- THEN none contain `Entregables`, `Rúbrica`, or `Tiempo estimado` headings

### Requirement: REQ-LABPAGE-05 Shell and Language

The page MUST wrap content in `InVitroShell`. UI chrome (tab labels, buttons) MUST be Spanish in neutral register. Rendered content MUST keep its authored language and MUST be emoji-free.

(Previously: UI chrome Spanish; no emoji or neutral-register requirement.)

#### Scenario: Neutral Spanish in shell

- GIVEN any lab page
- WHEN UI strings are inspected
- THEN all Spanish text uses neutral register with no regionalisms
