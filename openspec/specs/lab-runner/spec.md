# Lab Runner Specification

## Purpose

The Lab tab compiles `lab.md` through the existing MDX pipeline and turns every Python code fence into a real executable `PyodideRunner`, superseding the static terminal simulation (`CodeBlock`) and the hardcoded `LabMission` stepper for lab content.

## Requirements

### Requirement: REQ-LABRUN-01 MDX Pipeline

The Lab tab MUST compile `lab.md` with `compileMDX` using `remarkMath`, `remarkGfm`, `rehypeKatex`, and a components map that includes `table: MarkdownTable` so lab tables render styled.

#### Scenario: Lab MDX compiles

- GIVEN a `lab.md` with headings, LaTeX math, and a markdown table
- WHEN the Lab tab compiles it
- THEN headings and math render and the table uses `MarkdownTable`

### Requirement: REQ-LABRUN-02 Python Fences Execute

Every ` ```python ` fenced block in `lab.md` MUST render as a `PyodideRunner` instance with the fence body as `defaultValue`, providing REAL in-browser execution. `CodeBlock` MUST NOT be used for python fences in lab content.

#### Scenario: Fence becomes runner

- GIVEN a lab with a ` ```python ` block
- WHEN the Lab tab renders
- THEN a `PyodideRunner` with the block's code appears, runnable by the student

#### Scenario: Runner executes real code

- GIVEN the runner loaded with `from sklearn.datasets import load_breast_cancer`
- WHEN the student clicks Run
- THEN the worker returns real Python output, not emulated text

### Requirement: REQ-LABRUN-03 Worker Protocol

`PyodideRunner` instances MUST reuse the existing protocol unchanged: post `{type:"init"}` then `{type:"runPython", code}`; read `{type:"ready"}` and `{type:"result"}` messages.

#### Scenario: Protocol preserved

- GIVEN a runner instance in the Lab tab
- WHEN inspected
- THEN it posts and reads the same message shapes as the lesson editor's runner

### Requirement: REQ-LABRUN-04 Lazy Loading

Each `PyodideRunner` MUST load via dynamic import with `ssr: false`; one Pyodide worker per code block is acceptable for MVP. Page render MUST NOT block on Pyodide readiness.

#### Scenario: Page renders while worker loads

- GIVEN a lab with three python fences
- WHEN the Lab tab first renders
- THEN the page paints immediately and each fence shows a loading state until its worker reports `ready`

### Requirement: REQ-LABRUN-05 Compile Failure Fallback

If MDX compilation of `lab.md` fails, the Lab tab MUST NOT crash the page; it MUST render the raw markdown with a notice that the interactive lab is unavailable.

#### Scenario: Malformed lab

- GIVEN a `lab.md` that fails to compile
- WHEN the Lab tab renders
- THEN raw content shows with a "no disponible" notice and the page remains usable

### Requirement: REQ-LABRUN-06 Non-Python Fences

Fenced blocks in languages other than python MAY render statically (e.g. plain `pre` or `CodeBlock`); they MUST NOT spawn a Pyodide worker.

#### Scenario: Bash fence stays static

- GIVEN a ` ```bash ` block in a lab
- WHEN the Lab tab renders
- THEN it renders statically with no worker initialized

## Out of Scope

- A shared `PyodideProvider` singleton (phase 2)
- Exercise/test-case validation wiring inside lab runners
- Editing or saving lab content
