# Lab: Data Storytelling

## Objective

Create effective visualizations and a data story from a real dataset.

## Duration

60 minutes

## Dataset

Seaborn's `tips` dataset.

## Instructions

### Part 1: Critique a Visualization (10 min)
```python
tips = sns.load_dataset('tips')
```

1. Create intentionally bad visualizations (3D pie chart, rainbow bar chart, truncated y-axis)
2. In markdown, list what is wrong with each

### Part 2: Redesign (15 min)
For one of the above "bad" visualizations:
1. Redesign it following best practices
2. Use appropriate chart type
3. Use a colorblind-friendly palette
4. Add clear labels, title, annotations

### Part 3: Story-Driven Analysis (20 min)
Create a data story about tipping behavior:
1. Hook: "Waitstaff earn 70% of their income from tips — what factors affect tip amount?"
2. Create 3 visualizations showing relationships:
   - Tip amount by day of week
   - Tip percentage by party size  
   - Tip amount by time (lunch vs dinner) and sex
3. Add annotations and a clear narrative

### Part 4: Mini-Dashboard (15 min)
Create a 2×2 dashboard layout with:
- Total bill distribution (histogram)
- Tip vs total bill (scatter with regression line)
- Average tip by day (bar chart)
- Tip percentage by smoker status (boxplot)

Use consistent colors, clear titles, and a figure-level suptitle.

## Deliverables

- Jupyter notebook with bad/good visualizations, story, and dashboard

## Rubric

| Criteria | Points |
|----------|--------|
| Critique and redesign | 3 |
| Story-driven analysis | 3 |
| Dashboard design | 2 |
| Best practices followed | 2 |
Total: 10 points
