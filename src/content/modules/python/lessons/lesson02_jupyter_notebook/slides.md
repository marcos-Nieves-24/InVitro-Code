# Jupyter Notebook — Slide Outline

## Slide 1: Title Slide
- Jupyter Notebook
- Module 2: Python Programming Fundamentals

## Slide 2: Why Jupyter?
- Interactive, web-based environment
- Combine code, visualization, text
- Industry standard for data science
- Reproducible research

## Slide 3: What is Jupyter Notebook?
- Open-source web application
- Live code, equations, visualizations, narrative text
- File format: `.ipynb` (JSON)
- Key components: Notebook, Cell, Kernel

## Slide 4: Cell Types
- **Code cells**: Executable Python code
- **Markdown cells**: Formatted text (headings, lists, LaTeX)
- Output appears below code cells

## Slide 5: Launching Jupyter
```bash
pip install jupyter
jupyter notebook
```
- Opens dashboard at http://localhost:8888
- Click "New" → "Python 3"

## Slide 6: Notebook Interface
- Menu bar: File, Edit, View, Insert, Cell, Kernel
- Toolbar: Save, Add Cell, Cut/Copy/Paste, Run
- Cell indicator: `In [ ]` for code, no indicator for markdown

## Slide 7: Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Shift+Enter | Run and select next |
| Ctrl+Enter | Run and stay |
| A / B | Insert cell above / below |
| DD | Delete cell |
| M / Y | Change to markdown / code |

## Slide 8: Modes
- **Command mode** (blue border): Notebook-level actions
- **Edit mode** (green border): Cell editing
- Press `Esc` for command mode, `Enter` for edit mode

## Slide 9: Execution Order
- Cells execute in the order you run them, not their position
- Kernel maintains state
- Best practice: Cell → Run All

## Slide 10: Saving and Exporting
- Save: Ctrl+S
- Export: File → Download as → HTML/PDF/Python
- Share notebooks via GitHub or nbviewer

## Slide 11: Biotech Example
- Gene expression analysis notebook
- Markdown: Research question, methodology
- Code: Data loading, filtering, normalization
- Output: Heatmaps, statistical results

## Slide 12: SaaS Example
- Customer churn analysis notebook
- Markdown: Business context, key findings
- Code: Data exploration, modeling
- Output: Churn rate tables, visualizations

## Slide 13: Common Mistakes
- Running cells out of order
- Not restarting kernel when unexpected errors occur
- Forgetting to save
- Closing terminal (stops server)

## Slide 14: Best Practices
- Document with markdown cells
- Keep cells focused
- Run top-to-bottom
- Clear output before git commit
- Use descriptive filenames

## Slide 15: Summary
- Jupyter = code + text + visuals
- Cells: code or markdown
- Shift+Enter to run
- Kernel maintains state
- Export to share
