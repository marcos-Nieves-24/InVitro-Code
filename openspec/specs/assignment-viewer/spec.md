# Assignment Viewer Specification

## Purpose

The assignment viewer compiles `assignment.md` through the MDX pipeline so instructions and deliverables render readably — tables styled by `MarkdownTable`, code blocks as interactive `LabCodeBlock` consoles — and offers the lesson notebook via `NotebookActions` (download + "Abrir en Colab"). It is used by the project detail route and by the lab page when the lesson has a notebook.

## Requirements

### Requirement: REQ-ASGN-01 MDX Render

The assignment viewer MUST compile `assignment.md` with the same plugins as lessons (`remarkMath`, `remarkGfm`, `rehypeKatex`) and the same components map, including `table: MarkdownTable` and `pre: LabCodeBlock`.

#### Scenario: Assignment compiles

- GIVEN an `assignment.md` with headings, inline code, and code blocks
- WHEN the viewer renders
- THEN prose renders with lesson styling and code blocks render as interactive consoles

### Requirement: REQ-ASGN-03 Notebook Actions

The viewer MUST render `NotebookActions` (Download + "Abrir en Colab"). When `notebook.ipynb` is absent, the actions MUST be disabled or hidden.

#### Scenario: Actions available

- GIVEN a lesson whose directory contains `notebook.ipynb`
- WHEN the viewer renders
- THEN Download and "Abrir en Colab" actions are shown

#### Scenario: Notebook missing

- GIVEN a lesson without `notebook.ipynb`
- WHEN the viewer renders
- THEN the notebook actions are disabled or hidden

### Requirement: REQ-ASGN-04 Compile Failure Fallback

If compilation fails, the tab MUST render raw markdown with a notice and MUST NOT crash the page.

#### Scenario: Malformed assignment

- GIVEN an `assignment.md` that fails to compile
- WHEN the Proyecto tab renders
- THEN raw content shows with a "no disponible" notice

## Out of Scope

- Submission or grading of assignments (phase 2)
- Editing assignment content
- Live notebook rendering (phase 3; download and Colab open only)
