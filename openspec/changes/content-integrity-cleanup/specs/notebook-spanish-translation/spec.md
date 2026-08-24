# Delta for Notebook Spanish Translation

## ADDED Requirements

### Requirement: REQ-NBTRANS-01 Neutral Spanish Translation

All English-dominant notebooks (`notebook.ipynb`) across `python`, `estadistica`, `machine-learning`, `ia` modules MUST have their markdown cells and prose code-cell comments translated to neutral Spanish. Translation MUST use neutral/professional register — no voseo, no regionalisms.

#### Scenario: Markdown cells translated

- GIVEN an English-dominant `notebook.ipynb`
- WHEN the translation pass completes
- THEN all markdown cells contain neutral Spanish text

#### Scenario: Prose comments translated

- GIVEN a code cell with English prose comments explaining steps
- WHEN the translation pass completes
- THEN the prose comments are in neutral Spanish while code logic is unchanged

### Requirement: REQ-NBTRANS-02 Code Integrity

Code identifiers (variable names, function names, function signatures, class names, import paths) and code behaviour MUST remain unchanged after translation. Only prose comments and markdown cells are in scope.

#### Scenario: Variable names preserved

- GIVEN a notebook with variables `X_train`, `y_test`, `model`
- WHEN the translation pass completes
- THEN those identifiers appear exactly as before

#### Scenario: Function signatures unchanged

- GIVEN a notebook calling `train_test_split(X, y, test_size=0.2)`
- WHEN the translation pass completes
- THEN the function call and its arguments are byte-identical

#### Scenario: Code behaviour preserved

- GIVEN a notebook that produces a specific output when executed
- WHEN the translation pass completes and the notebook is re-executed
- THEN the output is identical to the pre-translation run

### Requirement: REQ-NBTRANS-03 Emoji-Free Notebooks

Translated notebooks MUST NOT contain emoji characters in any cell (markdown or code). This aligns with REQ-EMOJI-01.

#### Scenario: No emojis in translated notebooks

- GIVEN a translated `notebook.ipynb`
- WHEN a grep for emoji Unicode ranges is run on all cells
- THEN zero matches are returned

## MODIFIED Requirements

### Requirement: REQ-LABPAGE-06 Notebook Actions

The page MUST render `NotebookActions` (Download + "Abrir en Colab") for its notebook, gated on `hasNotebook`. Notebook content MUST be in neutral Spanish.

(Previously: No language requirement on notebook content.)

#### Scenario: Translated notebook downloadable

- GIVEN a lesson whose directory contains a translated `notebook.ipynb`
- WHEN the lab page renders
- THEN Download and Colab actions appear and the notebook content is neutral Spanish
