# Assignment Viewer Specification

## Purpose

The Proyecto tab compiles `assignment.md` through the MDX pipeline so instructions, deliverables, and the evaluation rubric render readably — rubric tables styled by `MarkdownTable` — and offers the lesson notebook as a download via the notebook API.

## Requirements

### Requirement: REQ-ASGN-01 MDX Render

The Proyecto tab MUST compile `assignment.md` with the same plugins as lessons (`remarkMath`, `remarkGfm`, `rehypeKatex`) and the same components map, including `table: MarkdownTable`.

#### Scenario: Assignment compiles

- GIVEN an `assignment.md` with headings and inline code
- WHEN the Proyecto tab renders
- THEN content renders with the lesson prose styling

### Requirement: REQ-ASGN-02 Rubric Styling

Rubric tables in `assignment.md` MUST render through `MarkdownTable` (bordered container, header row, zebra rows) with zero content changes.

#### Scenario: Rubric styled

- GIVEN an `assignment.md` with a 4-level rubric table and `**Total: 16 puntos**`
- WHEN the Proyecto tab renders
- THEN the table renders as a styled `MarkdownTable` and the total line shows as authored

### Requirement: REQ-ASGN-03 Notebook Download

The tab MUST render a Spanish download control that requests `GET /api/notebook/[module]/[lesson]` and saves the returned file. When `notebook.ipynb` is absent, the control MUST be disabled or hidden.

#### Scenario: Download available

- GIVEN a lesson whose directory contains `notebook.ipynb`
- WHEN the student clicks "Descargar notebook"
- THEN a `notebook.ipynb` file downloads from the API route

#### Scenario: Notebook missing

- GIVEN a lesson without `notebook.ipynb`
- WHEN the Proyecto tab renders
- THEN the download control is disabled or hidden

### Requirement: REQ-ASGN-04 Compile Failure Fallback

If compilation fails, the tab MUST render raw markdown with a notice and MUST NOT crash the page.

#### Scenario: Malformed assignment

- GIVEN an `assignment.md` that fails to compile
- WHEN the Proyecto tab renders
- THEN raw content shows with a "no disponible" notice

## Out of Scope

- Submission or grading of assignments (phase 2)
- Editing assignment content
- Live notebook rendering (phase 3; download only)
