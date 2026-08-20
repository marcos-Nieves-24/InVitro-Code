# Assignment Content Cleanup Specification

## Purpose

Remove three redundant meta-sections from every `assignment.md` so the remaining content is focused on the project instructions.

## Requirements

### Requirement: REQ-CLEAN-01 Strip redundant sections

Every `assignment.md` MUST NOT contain the `## Entregables`, `## Rúbrica*`, or `## Tiempo estimado*` sections.

#### Scenario: Sections removed

- GIVEN all 48 `assignment.md` files
- WHEN they are inspected
- THEN none contain an `Entregables`, `Rúbrica`, or `Tiempo estimado` heading

### Requirement: REQ-CLEAN-02 Preserve core sections

Every `assignment.md` MUST retain the `## Entrega` section and the core sections (`Objetivos`, `Instrucciones`, `Dataset`, `Escenario`, `Código inicial`).

#### Scenario: Core content intact

- GIVEN a cleaned `assignment.md`
- WHEN it is inspected
- THEN `Entrega`, `Objetivos`, `Instrucciones`, `Dataset`, `Escenario`, and `Código inicial` sections remain

### Requirement: REQ-CLEAN-03 Scope isolation

Cleanup MUST modify only `assignment.md` files; it MUST NOT alter `lesson.md`, `quiz.md`, `lab.md`, or `notebook.ipynb`.

#### Scenario: Other files untouched

- GIVEN the lesson content tree
- WHEN cleanup runs
- THEN only `assignment.md` files change
