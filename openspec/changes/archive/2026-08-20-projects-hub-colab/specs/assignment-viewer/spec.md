# Delta for Assignment Viewer

## MODIFIED Requirements

### Requirement: REQ-ASGN-01 MDX Render

The assignment viewer MUST compile `assignment.md` with the same plugins as lessons (`remarkMath`, `remarkGfm`, `rehypeKatex`) and the same components map, including `table: MarkdownTable` and `pre: LabCodeBlock`.
(Previously: it rendered only in the lab "Proyecto" tab with no `LabCodeBlock` consoles.)

#### Scenario: Assignment compiles

- GIVEN an `assignment.md` with headings, inline code, and code blocks
- WHEN the viewer renders
- THEN prose renders with lesson styling and code blocks render as interactive consoles

### Requirement: REQ-ASGN-03 Notebook Actions

The viewer MUST render `NotebookActions` (Download + "Abrir en Colab"). When `notebook.ipynb` is absent, the actions MUST be disabled or hidden.
(Previously: a download-only control via `NotebookDownloadButton`.)

#### Scenario: Actions available

- GIVEN a lesson whose directory contains `notebook.ipynb`
- WHEN the viewer renders
- THEN Download and "Abrir en Colab" actions are shown

#### Scenario: Notebook missing

- GIVEN a lesson without `notebook.ipynb`
- WHEN the viewer renders
- THEN the notebook actions are disabled or hidden

## REMOVED Requirements

### Requirement: REQ-ASGN-02 Rubric Styling

(Reason: `Rúbrica` sections are stripped from `assignment.md` by the assignment-content-cleanup change; no rubric tables remain to style.)
(Migration: `MarkdownTable` stays in the components map for other tables; no consumer change required.)
