# Project Notebook Actions Specification

## Purpose

`NotebookActions` MUST appear above content in Proyectos, matching the LabTabs pattern.

## Requirements

### Requirement: REQ-PNA-01 Top placement

`NotebookActions` MUST render above `assignment.md` content.

#### Scenario: Actions above content

- GIVEN a project lesson with `notebook.ipynb`
- WHEN the Proyecto tab renders
- THEN actions appear above the assignment content

### Requirement: REQ-PNA-02 Hidden when notebook absent

Actions MUST be hidden when `notebook.ipynb` does not exist.

#### Scenario: No notebook hides actions

- GIVEN a lesson without `notebook.ipynb`
- WHEN the tab renders
- THEN no action is visible
