# Delta for Ethics Section Removal

## ADDED Requirements

### Requirement: REQ-ETHICS-01 Remove Ethics Sections from Labs

Every `lab.md` file in `python`, `estadistica`, `machine-learning`, `ia` modules MUST NOT contain any section headed `## Ética`, `## Etica`, `## Ética aplicada`, or any heading containing "ética" (case-insensitive). Removed sections MUST NOT leave orphaned content or broken anchor links.

#### Scenario: Ethics sections removed from labs

- GIVEN all `lab.md` files in the four target modules
- WHEN a grep for headings containing "ética" (case-insensitive) is run
- THEN zero matches are returned

#### Scenario: No orphaned content after removal

- GIVEN a `lab.md` that previously had an ethics section
- WHEN the section is removed
- THEN the file has no dangling internal anchors or orphaned content fragments

### Requirement: REQ-ETHICS-02 Remove Ethics Sections from Notebooks

All notebook cells (markdown and code) in `notebook.ipynb` files across the four target modules MUST NOT contain ethics content. Markdown cells headed "Ética" or "Etica" MUST be removed entirely. Code cells with ethics-related prose comments MUST be cleaned.

#### Scenario: Ethics cells removed from notebooks

- GIVEN all `notebook.ipynb` files in the four target modules
- WHEN each notebook is inspected for markdown cells containing "ética" in the heading
- THEN zero such cells exist

#### Scenario: Ethics comments cleaned from code cells

- GIVEN a code cell containing a comment block about ethics
- WHEN the notebook is cleaned
- THEN the ethics comment block is removed and surrounding code is intact

### Requirement: REQ-ETHICS-03 No Broken Cross-References

Removal of ethics sections MUST NOT break any internal links, tab references, navigation index entries, or cross-references that pointed to those sections. All orphaned references MUST be removed or redirected.

#### Scenario: No broken internal links

- GIVEN the content tree after ethics removal
- WHEN a link audit is run checking all internal markdown links
- THEN every link resolves to an existing section or file

#### Scenario: No orphaned nav references

- GIVEN module index files and navigation components
- WHEN they are inspected for references to ethics sections
- THEN no references to removed ethics sections remain

## MODIFIED Requirements

### Requirement: REQ-CLEAN-01 Strip redundant sections

Every `assignment.md` MUST NOT contain the `## Entregables`, `## Rúbrica*`, `## Tiempo estimado*`, or any `## Ética` / `## Etica` sections.

(Previously: Only `Entregables`, `Rúbrica`, `Tiempo estimado` were stripped; ethics sections were not in scope.)

#### Scenario: Ethics sections removed from assignments

- GIVEN all `assignment.md` files across modules
- WHEN they are inspected
- THEN none contain an `Ética` or `Etica` heading

#### Scenario: Original sections still removed

- GIVEN all `assignment.md` files
- WHEN they are inspected
- THEN none contain `Entregables`, `Rúbrica`, or `Tiempo estimado` headings

### Requirement: REQ-LABRUN-02 Python Fences Execute

Every ` ```python ` fenced block in `lab.md` MUST render as a `PyodideRunner` instance with the fence body as `defaultValue`, providing REAL in-browser execution. `CodeBlock` MUST NOT be used for python fences in lab content. Lab content MUST NOT contain ethics sections.

(Previously: No ethics-section constraint on lab content.)

#### Scenario: Ethics-free lab fences execute

- GIVEN a `lab.md` with ethics sections removed
- WHEN the Lab tab renders
- THEN all remaining python fences become `PyodideRunner` instances
