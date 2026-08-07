# GFM Table Parsing Specification

## Purpose

Six markdown tables in 4 lessons (ia 02/03/04, python 01) render as literal pipes because GFM pipe tables are not CommonMark and `remark-gfm` is absent from the lesson MDX pipeline. The `MarkdownTable` component shipped in PR #29 stays dormant until a parser produces `<table>` elements. This spec activates the parser and fixes the H1 strip regex so 13 python lessons with a leading-newline title no longer drop a block.

## Requirements

### Requirement: REQ-GFM-01 remark-gfm Dependency

The project MUST include `remark-gfm` in `package.json` dependencies.

#### Scenario: Dependency installed

- GIVEN a fresh `npm install`
- WHEN `package.json` is inspected
- THEN `remark-gfm` is listed in `dependencies`

### Requirement: REQ-GFM-02 Plugin Registration

The lesson MDX config (`mdxConfig` in `src/app/learn/[module]/[slug]/page.tsx`) MUST register `remarkGfm` in `remarkPlugins` after `remarkMath`, so math is tokenized into dedicated nodes before GFM transforms run.

#### Scenario: Plugin registered

- GIVEN `mdxConfig` in the lesson page
- WHEN `remarkPlugins` is inspected
- THEN it contains `remarkGfm` after `remarkMath`

### Requirement: REQ-GFM-03 Pipe Tables Parse

The system SHALL parse GFM pipe tables inside lesson `<Section>` blocks into `<table>` elements. Affected tables: ia lesson02 §12, ia lesson03 §7, ia lesson04 §10, python lesson01 §3/§6/§11.

#### Scenario: All six tables render as tables

- GIVEN a lesson section containing a pipe table (e.g. ia lesson02 §12 "Tres regímenes de complejidad")
- WHEN the section compiles and renders
- THEN the output contains a `<table>` element, not a literal-pipe paragraph

### Requirement: REQ-GFM-04 MarkdownTable Styling Applies

Parsed tables MUST render through the existing `MarkdownTable` component: rounded bordered container, `overflow-x-auto`, gray header row, zebra body rows, hover highlight.

#### Scenario: Styled table output

- GIVEN a parsed markdown table
- WHEN the DOM is inspected
- THEN the table sits in a bordered rounded container with header background and zebra rows

### Requirement: REQ-GFM-05 No CommonMark or Math Regression

Enabling GFM MUST NOT alter CommonMark features (lists, headings, bold) or LaTeX math: `$...$`/`$$...$$` MUST still render via KaTeX.

#### Scenario: Existing lesson rendering unchanged

- GIVEN a lesson with lists, headings, bold, and `$$...$$` math (e.g. estadistica)
- WHEN it renders with `remarkGfm` active
- THEN all elements render exactly as before and math renders as KaTeX

### Requirement: REQ-GFM-06 Static Type Gate

The change MUST pass `npm run type-check` with `remark-gfm` registered.

#### Scenario: Type-check passes

- GIVEN dependency installed and plugin registered
- WHEN `npm run type-check` runs
- THEN it exits 0 with no errors

### Requirement: REQ-H1-01 H1 Strip Regex Accepts Leading Whitespace

The H1 strip regex in the lesson page MUST be `/^\s*# .+\n?/` so a `# Title` preceded by a leading newline is stripped.

#### Scenario: Leading-newline H1 stripped

- GIVEN a lesson block starting with a blank line then `# Title`
- WHEN the page strips the H1
- THEN the title line is removed without a stray H1 in the carousel

### Requirement: REQ-H1-02 Python Lessons Keep Rendering

The regex change MUST NOT alter visible output for python lessons 05-17: the header still shows the frontmatter `Lesson Title`, and no dropped block remains.

#### Scenario: Python lesson renders as before

- GIVEN a python lesson (05-17) starting with a leading newline before its H1
- WHEN the lesson page renders with the new regex
- THEN the header shows the lesson title and the carousel contains the expected sections, with no visible change

## Out of Scope

- Converting tables to `ComparisonTable`/`InteractiveTable` props
- `MarkdownTable` component changes or quiz/lab/assignment tables
- Content edits to the 4 lesson files (tables parse unchanged)
- GFM strikethrough/task-list/autolink behavior — none present in content
