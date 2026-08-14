# Code Execution Specification

## Purpose

Provide an in-browser Python code editor (Monaco) that executes code via Pyodide in a Web Worker, supporting numpy, pandas, and matplotlib. Show a skeleton loader while Pyodide WASM loads.

## Requirements

### Requirement: Monaco Editor

The system MUST render a Monaco editor on lesson pages with code exercises, showing Python syntax highlighting.

#### Scenario: Editor loads on lesson page

- GIVEN the user is on a lesson page with a code exercise
- WHEN the page renders
- THEN a Monaco editor with pre-loaded starter code and a "Run" button are visible

#### Scenario: Skeleton shown during Pyodide load

- GIVEN Pyodide WASM (~12MB) is still downloading
- WHEN the editor area renders
- THEN a skeleton/pulse placeholder is shown instead of a blank space

### Requirement: Python Execution

The system MUST execute user Python code via Pyodide in a Web Worker and display output (stdout, stderr, plots) below the editor.

#### Scenario: Code runs and shows output

- GIVEN the user has written `print("Hola Mundo")` in the editor
- WHEN they click "Run"
- THEN "Hola Mundo" appears in the output panel within 3 seconds

#### Scenario: Execution error shown

- GIVEN the user writes `x = 1/0`
- WHEN they click "Run"
- THEN the output panel displays a `ZeroDivisionError` traceback

#### Scenario: Import numpy succeeds

- GIVEN the user writes `import numpy as np; print(np.array([1,2,3]).sum())`
- WHEN they click "Run"
- THEN the output shows `6`
