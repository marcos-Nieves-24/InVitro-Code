---
Module: 2
Lesson Number: 2
Lesson Title: Jupyter Notebook
Estimated Duration: 45 minutes
Prerequisites: L1 — Installing Python
Learning Objectives:
  - Launch Jupyter Notebook from the command line
  - Create and edit code cells and markdown cells
  - Execute Python code interactively in a notebook
  - Use keyboard shortcuts to navigate efficiently
  - Export a notebook to HTML or PDF
Keywords: Jupyter, notebook, cell, kernel, markdown, REPL
Difficulty: Beginner
Programming Concepts: Notebook interface, markdown, code execution, kernel
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Jupyter Notebook

## Motivation

Writing Python code in a terminal is functional but not ideal for data analysis. Jupyter Notebook provides an interactive, web-based environment where you can combine code, visualizations, and explanatory text in a single document. This is the standard tool for data scientists worldwide. In biotechnology, Jupyter notebooks are used to document and share research analyses. In SaaS, they are used for exploratory data analysis and reporting.

## Big Picture

In the previous lesson, you installed Python and verified it works. Now you will learn to use Jupyter Notebook — the environment where you will write most of your Python code in this course. The next lessons on variables, data types, and operators will all be practiced inside Jupyter.

## Theory

### What is Jupyter Notebook?

Jupyter Notebook is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text.

**Key components:**
- **Notebook** (`.ipynb`): A document containing cells
- **Cell**: A unit of content (code or markdown)
- **Kernel**: The computational engine that executes code
- **Dashboard**: The file browser interface

### Cell Types

1. **Code cells**: Contain Python code that can be executed. Output appears below the cell.
2. **Markdown cells**: Contain formatted text using Markdown syntax (headings, lists, links, images, LaTeX equations).

### Modes

Jupyter has two keyboard modes:

- **Command mode** (blue border): Keyboard shortcuts act on the notebook level
- **Edit mode** (green border): Typing inserts text into the current cell

### Execution Model

When you run a code cell, the kernel executes the code. Variables and functions defined in one cell are available in subsequent cells. The kernel maintains state until it is restarted.

## Visual Explanation

```
┌────────────────────────────────────────────────────┐
│                  Jupyter Notebook                    │
├────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐│
│  │ [File] [Edit] [View] [Insert] [Cell] [Kernel]  ││
│  ├────────────────────────────────────────────────┤│
│  │ [-] Markdown Cell (Title)                      ││
│  │    # My Analysis                               ││
│  ├────────────────────────────────────────────────┤│
│  │ [ ] Code Cell                                  ││
│  │    import pandas as pd                         ││
│  │    df = pd.read_csv('data.csv')               ││
│  │    df.head()                                   ││
│  │                                                ││
│  │ Out[1]: [table output]                         ││
│  ├────────────────────────────────────────────────┤│
│  │ [-] Markdown Cell (Explanation)                ││
│  │    ## Results                                  ││
│  │    The data shows...                           ││
│  └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

## Python Implementation

### Launching Jupyter

```bash
# Install if not already installed
pip install jupyter

# Launch
jupyter notebook
```

This opens the Jupyter dashboard in your browser at `http://localhost:8888`.

### Creating a New Notebook

1. Click "New" → "Python 3"
2. A new notebook opens with an empty code cell

### Working with Cells

```python
# This is a code cell — press Shift+Enter to run it
print("Hello, Jupyter!")
```

### Markdown Formatting

In a markdown cell, you can write:
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**, *italic text*, `inline code`

- List item 1
- List item 2

[Link text](https://example.com)

$$ E = mc^2 $$
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Shift+Enter | Run cell and select next |
| Ctrl+Enter | Run cell and stay |
| Alt+Enter | Run cell and insert below |
| A | Insert cell above (command mode) |
| B | Insert cell below (command mode) |
| DD | Delete cell (command mode) |
| M | Change to markdown cell (command mode) |
| Y | Change to code cell (command mode) |
| Ctrl+S | Save notebook |
| Z | Undo cell deletion |

### Saving and Exporting

- **Save**: File → Save and Checkpoint (or Ctrl+S)
- **Export**: File → Download as → HTML, PDF, Python script, etc.

## Biotechnology Example

**Scenario**: A researcher is analyzing gene expression data and wants to document the analysis steps.

The notebook structure would be:
- **Cell 1 (Markdown)**: Title and research question
- **Cell 2 (Code)**: Load expression data with Pandas
- **Cell 3 (Markdown)**: Data cleaning methodology
- **Cell 4 (Code)**: Filter and normalize data
- **Cell 5 (Markdown)**: Results interpretation
- **Cell 6 (Code)**: Generate heatmap with Seaborn

This notebook can be shared with collaborators who can reproduce the analysis.

## SaaS Example

**Scenario**: A data analyst at a SaaS company needs to explore customer churn data and share findings.

The notebook structure:
- **Cell 1 (Markdown)**: Churn analysis for Q1 report
- **Cell 2 (Code)**: Load customer data
- **Cell 3 (Code)**: Calculate churn rate by cohort
- **Cell 4 (Markdown)**: Key findings
- **Cell 5 (Code)**: Visualization of churn trends
- **Cell 6 (Markdown)**: Recommendations

The notebook can be exported to HTML and shared with the product team.

## Common Mistakes

1. **Running cells out of order**: Variables defined later may not be available. Use "Run All" (Cell → Run All) to execute sequentially.
2. **Not restarting the kernel**: When code behaves unexpectedly, restart the kernel (Kernel → Restart & Run All).
3. **Forgetting to save**: Jupyter autosaves, but manually save before closing.
4. **Using print() excessively**: The last expression in a cell is automatically displayed.
5. **Closing the terminal**: The Jupyter server runs in the terminal. Closing it stops the server.

## Best Practices

- Use markdown cells to document your analysis
- Keep cells focused on a single task
- Run cells in order from top to bottom
- Restart and run all before sharing a notebook
- Use meaningful filenames (e.g., `gene_expression_analysis.ipynb`)
- Clear output before committing notebooks to version control

## Summary

- Jupyter Notebook is a web-based interactive environment for data analysis
- Notebooks contain code and markdown cells
- Code cells execute Python code; markdown cells display formatted text and images
- The kernel maintains state between cell executions
- Keyboard shortcuts speed up workflow
- Export notebooks to share results

## Key Terms

- **Notebook** (`.ipynb`): JSON document containing code, text, and outputs
- **Cell**: Individual unit of content (code or markdown)
- **Kernel**: Python engine executing code cells
- **Command mode**: Blue-bordered mode for notebook-level actions
- **Edit mode**: Green-bordered mode for editing cell content
- **Dashboard**: Jupyter file browser interface
- **Shift+Enter**: Run current cell and move to the next

## Exercises

### Level 1: Basic

1. What is the difference between a code cell and a markdown cell?
2. What does `Shift+Enter` do in Jupyter?
3. How do you create a new cell below the current one?

### Level 2: Implementation

4. Create a notebook with at least one markdown cell (with a heading and bullet list) and one code cell that prints "Jupyter is working!"
5. Export your notebook as HTML.

### Level 3: Critical Thinking

6. Why is it important to run cells in order from top to bottom? What problems can occur when cells are run out of order?
7. In a collaborative research setting, what advantages does a Jupyter notebook offer over a traditional Python script?

## Coding Challenge

Create a Jupyter notebook called `my_first_notebook.ipynb` that:
1. Has a title cell (Markdown H1): "My First Notebook"
2. A markdown cell explaining what the notebook does
3. A code cell that creates a list of your 5 favorite things
4. A code cell that prints each item with a number
5. A markdown cell with a conclusion
Export the notebook as HTML.
