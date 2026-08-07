# Lab Page Specification

## Purpose

`/laboratorios/[module]/[lesson]` renders the three practice activities authored per lesson — `lab.md`, `quiz.md`, `assignment.md` — as independent tabs, with the notebook available for download. It revives the 192 dead companion files behind Clerk auth and the existing dashboard shell.

## Requirements

### Requirement: REQ-LABPAGE-01 Authentication Gate

The page MUST be a server component that requires a Clerk session: when `auth()` returns no `userId`, it MUST redirect to `/sign-in`.

#### Scenario: Anonymous visitor redirected

- GIVEN an unauthenticated request to `/laboratorios/python/lesson01_hello`
- WHEN the page resolves
- THEN the response redirects to `/sign-in`

### Requirement: REQ-LABPAGE-02 Lesson Existence

The page MUST call `notFound()` when the lesson directory for `[module]/[lesson]` does not exist under `src/content/modules`.

#### Scenario: Unknown lesson

- GIVEN a request to `/laboratorios/python/lesson99_nonexistent`
- WHEN the page reads the lesson directory
- THEN it returns a 404

### Requirement: REQ-LABPAGE-03 Content Reads

The page MUST read `lab.md`, `quiz.md`, `assignment.md`, and `notebook.ipynb` from the lesson directory by file-name convention. It MUST NOT resolve quiz content from the `Quiz:` frontmatter reference.

#### Scenario: Convention-based reads

- GIVEN an `estadistica` lesson whose frontmatter references a non-existent quiz filename
- WHEN the page loads content
- THEN it reads `quiz.md` from disk regardless of the stale reference

### Requirement: REQ-LABPAGE-04 Tab Structure

The page MUST render a client tab container with three panels — `Laboratorio`, `Cuestionario`, `Proyecto` — that switch without reloading. Tabs MUST be independent activities, not a sequential carousel. The active tab MAY persist in `localStorage`.

#### Scenario: Tab switching

- GIVEN a loaded lesson page
- WHEN the student clicks `Cuestionario`
- THEN the quiz panel renders and the Lab panel unmounts without navigation

### Requirement: REQ-LABPAGE-05 Shell and Language

The page MUST wrap content in `InVitroShell`. UI chrome (tab labels, buttons) MUST be Spanish; rendered content MUST keep its authored language (EN or ES per file).

#### Scenario: Shell wrapped

- GIVEN any lesson page
- WHEN it renders
- THEN it is enclosed in `InVitroShell` with Spanish tab labels

## Out of Scope

- `/proyectos` page and assignment grading
- Persisted quiz attempts or progress writes from the lesson page
- A module index route under `/laboratorios/[module]` (the hub links directly to lessons)
