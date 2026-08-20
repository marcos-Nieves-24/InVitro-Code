# Projects Hub Specification

## Purpose

`/proyectos` becomes a content-driven hub mirroring `LabHub`, grouping lesson project cards by module, with a detail route `/proyectos/[module]/[lesson]` that renders `assignment.md` with interactive code consoles and notebook actions.

## Requirements

### Requirement: REQ-PROJ-01 Auth and shell

The hub and detail routes MUST be server components requiring a Clerk session (`redirect('/sign-in')` without `userId`) and MUST wrap content in `InVitroShell`.

#### Scenario: Anonymous redirected

- GIVEN an unauthenticated request to `/proyectos`
- WHEN the page resolves
- THEN the response redirects to `/sign-in`

### Requirement: REQ-PROJ-02 Content-driven grouping

The hub MUST list modules from `getModules()` sorted by `module.json` order, with lessons sorted by directory name, grouped by module (mirroring `LabHub`/`LabCard`). Completion state MAY be shown.

#### Scenario: Modules grouped

- GIVEN the content tree with 5 modules
- WHEN the hub renders
- THEN all modules appear in order, each with its lesson project cards grouped

### Requirement: REQ-PROJ-03 Card links

Each project card MUST link to `/proyectos/{module}/{lesson}` using the lesson directory slug.

#### Scenario: Card navigates

- GIVEN a card for `python/lesson01_hello`
- WHEN the student clicks it
- THEN the app navigates to `/proyectos/python/lesson01_hello`

### Requirement: REQ-PROJ-04 Detail route existence

The detail route MUST call `notFound()` when the lesson directory for `[module]/[lesson]` does not exist.

#### Scenario: Unknown lesson

- GIVEN a request to `/proyectos/python/lesson99_nonexistent`
- WHEN the page reads the lesson directory
- THEN it returns a 404

### Requirement: REQ-PROJ-05 Assignment rendering

The detail route MUST compile `assignment.md` through the assignment viewer with `pre: LabCodeBlock` (interactive consoles) and MUST render `NotebookActions` gated on `hasNotebook`.

#### Scenario: Assignment with consoles

- GIVEN an `assignment.md` with code blocks
- WHEN the detail route renders
- THEN code blocks render as interactive `LabCodeBlock` consoles and notebook actions appear when a notebook exists

### Requirement: REQ-PROJ-06 Supersede hardcoded page

`/proyectos` MUST NOT render the hardcoded Wine-Quality challenge; its main content MUST be data-driven.

#### Scenario: No hardcoded demo

- GIVEN the hub rendering
- WHEN its content is inspected
- THEN no hardcoded Wine challenge appears
