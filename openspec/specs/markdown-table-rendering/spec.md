# Markdown Table Rendering Specification

## Purpose

Markdown tables in lessons render as plain HTML with only prose styling — no borders, header background, zebra rows, or overflow handling — so wide tables (e.g. ia lesson02's 3-column "Tres regímenes de complejidad") overflow the carousel slide. A `MarkdownTable` server component overrides the `table` element in the lesson MDX components map, styling every markdown table globally with zero content changes.

## Requirements

### Requirement: REQ-TBL-01 MarkdownTable Component

The system MUST provide a `MarkdownTable` server component in `src/components/lesson/` accepting `children: React.ReactNode` and rendering them inside a styled HTML `table`. It MUST be pure presentational — no `"use client"`, no state, no interactivity.

#### Scenario: Renders markdown table children

- GIVEN a lesson section with a markdown table
- WHEN the section compiles
- THEN the children render in a styled `<table>`

### Requirement: REQ-TBL-02 MDX Mapping and Barrel Export

The system MUST map `table` → `MarkdownTable` in the lesson page MDX `components` map (`src/app/learn/[module]/[slug]/page.tsx`, shared by carousel and fallback paths) and MUST export it from `src/components/lesson/index.ts`.

#### Scenario: Both render paths styled

- GIVEN the map registers `table: MarkdownTable`
- WHEN a lesson renders
- THEN every markdown table uses `MarkdownTable`

### Requirement: REQ-TBL-03 Styled Container

`MarkdownTable` MUST wrap the table in a rounded bordered container (`rounded-lg border border-gray-200`) with `shadow-sm` and `overflow-x-auto`; the table MUST be full-width.

#### Scenario: Bordered rounded container

- GIVEN a rendered markdown table
- WHEN the DOM is inspected
- THEN the table sits in a rounded bordered container, `shadow-sm`

### Requirement: REQ-TBL-04 Horizontal Overflow

The container MUST scroll horizontally so wide tables scroll instead of breaking the layout.

#### Scenario: Wide table scrolls on mobile

- GIVEN a table wider than the viewport
- WHEN rendered at a narrow width
- THEN the table scrolls without breaking the layout

### Requirement: REQ-TBL-05 Header Row Styling

The header row MUST use `bg-gray-50` with `border-b border-gray-200`; header cells MUST be uppercase mono small gray (`font-mono text-[11px] uppercase text-gray-500`) with `px-4 py-3`.

#### Scenario: Styled header row

- GIVEN a markdown table with a header row
- WHEN the table renders
- THEN the header has a gray background, bottom border, uppercase mono cells

### Requirement: REQ-TBL-06 Body Cell Styling

Body cells MUST use `text-sm text-gray-700`, `px-4 py-3` padding, left alignment.

#### Scenario: Readable body cells

- GIVEN a rendered table body
- WHEN body cells are inspected
- THEN cells are small gray-700 text, padded, left-aligned

### Requirement: REQ-TBL-07 Zebra Striping and Hover

Body rows MUST alternate backgrounds (`bg-white` / `bg-gray-50/50`) and MUST show a hover state (`hover:bg-blue-50/40` with `transition-colors`).

#### Scenario: Zebra rows with hover

- GIVEN a table with several body rows
- WHEN rows render
- THEN backgrounds alternate and hover highlights a row

### Requirement: REQ-TBL-08 Component Isolation

The `table` override MUST NOT alter existing mapped components: `ComparisonTable` and `InteractiveTable` keep their own behavior.

#### Scenario: Existing components unaffected

- GIVEN a lesson using `<ComparisonTable>` or `<InteractiveTable>`
- WHEN it renders with the `table` mapping active
- THEN they render as before (sort/search intact)

### Requirement: REQ-TBL-09 Zero Content Changes

The styling MUST require no content edits: tables in `lesson.md` MUST remain standard markdown, never transcribed to props.

#### Scenario: Global restyle without content edits

- GIVEN the change applied
- WHEN ia lesson02/03/04 and python lesson01 lesson.md files are inspected
- THEN content unchanged; tables render styled

### Requirement: REQ-TBL-10 Build Gates

The change MUST pass `npm run type-check` and `npm run build`.

#### Scenario: Static gates pass

- GIVEN component, export, and mapping in place
- WHEN `npm run type-check` and `npm run build` run
- THEN both succeed with no errors

## Out of Scope

- ia lesson01's table inside `<Section title="Resumen">` — filtered by design
- Tables in `lab.md`, `assignment.md`, `quiz.md`, `README.md` — no consumer
- Content changes or transcription to `ComparisonTable`/`InteractiveTable` props
- Sort/search — handled by `InteractiveTable`
