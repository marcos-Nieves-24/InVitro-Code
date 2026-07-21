# Quiz: Jupyter Notebook

## Multiple Choice (5 questions)

**Q1:** What file extension do Jupyter notebooks use?
- A) `.py`
- B) `.json`
- C) `.ipynb`
- D) `.nb`

**Q2:** What does the kernel in Jupyter do?
- A) Manages file storage
- B) Executes Python code
- C) Renders markdown
- D) Connects to the internet

**Q3:** Which keyboard shortcut runs a cell and selects the next cell?
- A) Ctrl+Enter
- B) Alt+Enter
- C) Shift+Enter
- D) Tab+Enter

**Q4:** How do you change a cell to markdown type in command mode?
- A) Press M
- B) Press Y
- C) Press D
- D) Press A

**Q5:** What command launches Jupyter Notebook from the terminal?
- A) `jupyter start`
- B) `jupyter notebook`
- C) `jupyter launch`
- D) `python jupyter`

## Short Answer (2 questions)

**Q6:** Explain the difference between command mode and edit mode in Jupyter.

**Q7:** Why should you restart the kernel and run all cells before sharing a notebook?

## Coding Question

**Q8:** Write a markdown cell that displays:
- A level-2 heading reading "Results"
- A bullet list with three items
- The text "p-value < 0.05" formatted as inline code

## Answer Key

**Q1:** C) `.ipynb`

**Q2:** B) Executes Python code

**Q3:** C) Shift+Enter

**Q4:** A) Press M

**Q5:** B) `jupyter notebook`

**Q6:** Command mode (blue border) allows notebook-level actions like adding/deleting cells and changing cell types. Edit mode (green border) allows typing and editing the content of the current cell.

**Q7:** Restarting and running all ensures the notebook executes in the correct order from a clean state, revealing any hidden errors caused by running cells out of order or using stale variables.

**Q8:**
```markdown
## Results

- Experiment 1 showed significant effects
- Experiment 2 was inconclusive
- Experiment 3 requires follow-up

The `p-value < 0.05` threshold was used.
```
