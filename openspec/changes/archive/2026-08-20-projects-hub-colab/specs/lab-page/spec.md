# Delta for Lab Page

## MODIFIED Requirements

### Requirement: REQ-LABPAGE-03 Content Reads

The page MUST read `lab.md`, `quiz.md`, and `notebook.ipynb` from the lesson directory by file-name convention. It MUST NOT read `assignment.md`. It MUST NOT resolve quiz content from the `Quiz:` frontmatter reference.
(Previously: it also read `assignment.md`.)

#### Scenario: Convention-based reads

- GIVEN an `estadistica` lesson whose frontmatter references a non-existent quiz filename
- WHEN the page loads content
- THEN it reads `quiz.md` from disk regardless of the stale reference and does not read `assignment.md`

### Requirement: REQ-LABPAGE-04 Tab Structure

The page MUST render a client tab container with two panels — `Laboratorio` and `Cuestionario` — that switch without reloading. Tabs MUST be independent activities, not a sequential carousel. The active tab MAY persist in `localStorage`.
(Previously: it rendered three panels including `Proyecto`.)

#### Scenario: Tab switching

- GIVEN a loaded lesson page
- WHEN the student clicks `Cuestionario`
- THEN the quiz panel renders and the Lab panel unmounts without navigation

## ADDED Requirements

### Requirement: REQ-LABPAGE-06 Notebook Actions

The page MUST render `NotebookActions` (Download + "Abrir en Colab") for its notebook, gated on `hasNotebook`.

#### Scenario: Actions shown

- GIVEN a lesson whose directory contains `notebook.ipynb`
- WHEN the lab page renders
- THEN Download and Colab actions appear

#### Scenario: Actions hidden

- GIVEN a lesson without `notebook.ipynb`
- WHEN the lab page renders
- THEN no notebook actions appear
