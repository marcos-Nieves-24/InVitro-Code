# Lesson08 MDX Compile Specification

## Purpose

`machine-learning/lesson08_gradient_boosting` 500s at build and request time because `lesson.md:90` contains an unescaped `<` followed by a digit in prose (`Para datasets <10,000 filas`) inside a `<CalloutInfo>`. MDX parses `<` as the start of a JSX tag and fails with "Unexpected character `1`". Escaping the `<` as `\<` lets the lesson compile while preserving the author's wording.

## Requirements

### Requirement: REQ-L08-01 Lesson Compiles Without Error

The lesson08 gradient boosting page MUST compile without MDX errors and MUST render instead of returning a 500. The unescaped `<` in `lesson.md:90` MUST be escaped (`<10,000` → `\<10,000`).

#### Scenario: Lesson08 page loads

- GIVEN `machine-learning/lesson08_gradient_boosting/lesson.md` with `<10,000` escaped at line 90
- WHEN the lesson page is requested
- THEN it renders 200 with the gradient boosting content, not a 500

#### Scenario: Remaining unescaped comparisons safe

- GIVEN other `<`-with-digit occurrences in lesson10 (JSX prop string) and lesson14 (code block)
- WHEN those lessons compile
- THEN they remain untouched and render as before

### Requirement: REQ-L08-02 Meaning Preserved

The escaped text MUST render as the literal `<10,000`, which readers understand as "less than 10,000", and the rest of the `<CalloutInfo>` prose MUST be unchanged.

#### Scenario: Callout text reads correctly

- GIVEN the escaped `<10,000` inside the `<CalloutInfo>`
- WHEN the rendered page is inspected
- THEN the callout displays "Para datasets <10,000 filas..." with the comparison meaning intact and no raw backslash visible

## Out of Scope

- Rewording the lesson content or altering its framing
- Other lesson08 content beyond line 90
- `lesson10` and `lesson14` content (already valid MDX)
