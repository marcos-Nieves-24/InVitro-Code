# Lesson Reader Specification

## Purpose

Render MDX lesson content with next-mdx-remote, provide navigation between lessons, and reflect user progress (completed, locked, available).

## Requirements

### Requirement: MDX Rendering

The system MUST render MDX files from `content/modules/` using `next-mdx-remote`, supporting headings, code blocks, images, and inline Python snippets.

#### Scenario: Lesson renders successfully

- GIVEN a valid MDX file at `content/modules/hola-mundo/intro.mdx`
- WHEN the user navigates to `/learn/hola-mundo/intro`
- THEN the page renders the MDX content with proper formatting and syntax-highlighted code blocks

#### Scenario: Missing lesson returns 404

- GIVEN no MDX file exists for the requested path
- WHEN the user navigates to `/learn/unknown-module/unknown-lesson`
- THEN the app shows a styled 404 page with navigation back to `/learn`

### Requirement: Progress-Aware Navigation

The system MUST show lesson status (locked, available, completed) in the module navigation sidebar.

#### Scenario: Completed lesson shows checkmark

- GIVEN the user has completed `intro` in `hola-mundo`
- WHEN the sidebar renders for that module
- THEN `intro` shows a green checkmark and the next lesson is unlocked

#### Scenario: Unstarted module shows locked

- GIVEN the user has NOT started module `variables`
- WHEN the module list renders on `/learn`
- THEN `variables` shows a lock icon and is not clickable
