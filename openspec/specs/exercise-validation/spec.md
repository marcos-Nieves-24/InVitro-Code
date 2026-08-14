# Exercise Validation Specification

## Purpose

Validate user code exercises client-side via Pyodide for instant feedback, with optional server-side certification via E2B for "ready" submissions. Support random seeds and known test cases.

## Requirements

### Requirement: Client-Side Validation

The system MUST validate exercise solutions using Pyodide in the browser, providing instant pass/fail feedback with hints for incorrect solutions.

#### Scenario: Correct solution passes

- GIVEN the user writes a solution matching the expected test case
- WHEN they click "Validate"
- THEN a green "✓ Correct!" badge appears with no delay beyond execution time

#### Scenario: Incorrect solution shows hint

- GIVEN the user writes a wrong solution
- WHEN they click "Validate"
- THEN a red "✗ Try again" badge appears with a contextual hint (not the full answer)

### Requirement: Server-Side Certification

The system SHOULD offer optional E2B sandbox certification when the user clicks "Estoy listo" ("I'm ready"), running full test suites with random seeds.

#### Scenario: User certifies with E2B

- GIVEN the user has passed client validation
- WHEN they click "Estoy listo"
- THEN the code runs in an E2B sandbox with 3 random test seeds and returns a certification result

#### Scenario: E2B unavailable falls back gracefully

- GIVEN E2B API is unreachable
- WHEN the user clicks "Estoy listo"
- THEN the UI shows "Certification unavailable — try again later" and does NOT block client-side progress
