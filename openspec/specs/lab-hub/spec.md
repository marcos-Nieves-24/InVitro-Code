# Lab Hub Specification

## Purpose

`/laboratorios` becomes a content-driven hub: modules grouped in order with collapsible cards, each card showing the lesson's title, difficulty, and prerequisites plus the user's completion state. It replaces the hardcoded `LabMission` stepper as the page's main content.

## Requirements

### Requirement: REQ-HUB-01 Auth and Shell

The hub MUST be a server component requiring a Clerk session (`redirect('/sign-in')` without `userId`) and MUST wrap itself in `InVitroShell`, matching the existing dashboard pattern (the `(dashboard)` group has no layout).

#### Scenario: Authenticated hub

- GIVEN an authenticated user at `/laboratorios`
- WHEN the page renders
- THEN it shows inside `InVitroShell`

### Requirement: REQ-HUB-02 Module Grouping

The hub MUST list every module from `getModules()` sorted by `module.json` `order`, with lessons sorted by directory name, inside collapsible groups.

#### Scenario: All modules listed

- GIVEN the content tree with 5 modules
- WHEN the hub renders
- THEN all 5 modules appear in `order`, each with its lessons inside a collapsible group

### Requirement: REQ-HUB-03 Card Metadata

Each lesson card MUST show `Lesson Title`, `Difficulty`, and `Prerequisites` from `lesson.md` frontmatter, falling back to a slug-derived title when frontmatter is missing. The card MUST NOT show `Estimated Duration`.

#### Scenario: Card from frontmatter

- GIVEN a lesson with frontmatter metadata
- WHEN the hub renders its card
- THEN title, difficulty, and prereqs are displayed and no duration row appears

### Requirement: REQ-HUB-04 Completion State

Each card MUST reflect completion from the `progress` table (`user_id`, `module_slug`, `lesson_slug`, `completed: true`) read via `createAdminClient()`; completed lessons MUST be visually distinct.

#### Scenario: Completed lesson marked

- GIVEN a user with `progress` rows for two lessons
- WHEN the hub renders
- THEN those two cards show a completed state and the rest show pending

### Requirement: REQ-HUB-05 Lesson Links

Each card MUST link to `/laboratorios/{module}/{lesson}` using the lesson directory slug.

#### Scenario: Card navigates

- GIVEN a card for `python/lesson01_hello`
- WHEN the student clicks it
- THEN the app navigates to `/laboratorios/python/lesson01_hello`

### Requirement: REQ-HUB-06 Content-Driven, Superseding LabMission

The hub's main content MUST be data-driven; it MUST NOT render the hardcoded wine-quality stepper. `LabMission` MUST be removed from the page, and `/proyectos` MUST remain untouched.

#### Scenario: No hardcoded mission

- GIVEN the hub rendering
- WHEN its content is inspected
- THEN no hardcoded regression stepper appears and `/proyectos` renders as before

## Out of Scope

- A module index route under `/laboratorios/[module]`
- Sorting, filtering, or searching lessons beyond module grouping
- Writing progress or quiz attempts from the hub
