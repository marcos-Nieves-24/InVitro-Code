# Notebook Actions Specification

## Purpose

A shared `NotebookActions` component provides one-click notebook access: download the `notebook.ipynb` and open it in Google Colab. It is reused by the lab page and the project detail route.

## Requirements

### Requirement: REQ-NB-01 Download and Colab actions

The component MUST render two actions: a Download button and an "Abrir en Colab" link. Download MUST request `GET /api/notebook/[module]/[lesson]` and save the file; Colab MUST link to `https://colab.research.google.com/github/marcos-Nieves-24/InVitro-Code/blob/main/src/content/modules/{module}/lessons/{lesson}/notebook.ipynb`.

#### Scenario: Both actions shown

- GIVEN a lesson whose directory contains `notebook.ipynb`
- WHEN the component renders
- THEN a Download button and an "Abrir en Colab" link are both visible

#### Scenario: Download works

- GIVEN the Download button for `python/lesson01_hello`
- WHEN the student clicks it
- THEN `notebook.ipynb` downloads from `/api/notebook/python/lesson01_hello`

#### Scenario: Colab link targets the notebook

- GIVEN the Colab link for `python/lesson01_hello`
- WHEN the student opens it
- THEN it points at the GitHub notebook URL built from the module and lesson slugs

### Requirement: REQ-NB-02 Notebook presence gate

The component MUST be hidden or disabled when `hasNotebook` is false.

#### Scenario: Notebook missing

- GIVEN a lesson without `notebook.ipynb`
- WHEN the component renders
- THEN no Download or Colab action is shown (or both are disabled)

### Requirement: REQ-NB-03 Slug-derived URL

The Colab URL MUST be built from the module and lesson slugs; it MUST NOT hardcode a single notebook path.

#### Scenario: Slug-derived

- GIVEN two lessons with different slugs
- WHEN their Colab links are inspected
- THEN each link embeds its own module and lesson slugs

### Requirement: REQ-NB-04 Spanish labels

UI labels MUST be Spanish (e.g. "Descargar notebook", "Abrir en Colab").

#### Scenario: Spanish UI

- GIVEN the component rendering
- WHEN a student reads it
- THEN the action labels are in Spanish
