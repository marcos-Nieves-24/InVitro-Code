---
Module: 2
Lesson Number: 15
Lesson Title: Matplotlib
Estimated Duration: 75 minutes
Prerequisites: L14 — Pandas
Learning Objectives:
  - Create basic plots using pyplot: line, scatter, bar, histogram
  - Customize plots with titles, labels, legends, and colors
  - Use the figure/axes interface for multi-panel plots
  - Save figures to files in various formats
  - Apply different plot styles and color maps
Keywords: Matplotlib, pyplot, figure, axes, plot, scatter, histogram, bar chart
Difficulty: Beginner-Intermediate
Programming Concepts: Data visualization, plotting, customization
Datasets Used: None (synthetic data)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Matplotlib

## Motivation

Visualization is essential for understanding data. A well-chosen plot reveals patterns, outliers, and relationships that are invisible in raw numbers. Matplotlib is the foundational visualization library in Python, and most other visualization tools (Seaborn, Plotly) are built on top of it. In biotechnology, visualizations show gene expression distributions, patient survival curves, and protein structure analyses. In SaaS, they display revenue trends, user growth, and A/B test results.

## Big Picture

In the previous lesson, you learned Pandas for data manipulation. Now you'll learn to visualize that data with Matplotlib. The next lesson on Seaborn builds on Matplotlib to create statistically-focused visualizations with less code. Throughout the ML modules, you'll use Matplotlib daily to understand models, evaluate performance, and present results.

## Theory

### Matplotlib Architecture

Matplotlib has three layers:
1. **Backend**: Renders to screen/file (e.g., Agg, PDF, SVG)
2. **Artist**: Everything you see on the plot (lines, text, axes)
3. **pyplot**: Convenience interface (what you'll use most)

### Two Interfaces

**pyplot (functional) interface:**
```python
import matplotlib.pyplot as plt
plt.plot(x, y)
plt.show()
```

**Object-oriented (OO) interface:**
```python
fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
```

The OO interface is preferred for complex plots.

### Basic Plot Types

```python
plt.plot(x, y)              # Line plot
plt.scatter(x, y)           # Scatter plot
plt.bar(x, height)          # Bar chart
plt.hist(data, bins=10)     # Histogram
plt.boxplot(data)           # Box plot
plt.pie(sizes)              # Pie chart
plt.imshow(image)           # Image display
```

### Customization

```python
plt.title("Title")
plt.xlabel("X Label")
plt.ylabel("Y Label")
plt.legend()
plt.grid(True)
plt.xlim(0, 10)
plt.ylim(0, 100)
plt.colorbar()
```

### Figure and Axes

```python
fig, axes = plt.subplots(2, 3, figsize=(12, 8))
axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)
```

### Saving Figures

```python
plt.savefig("plot.png", dpi=300, bbox_inches="tight")
plt.savefig("plot.pdf")
plt.savefig("plot.svg")
```

## Visual Explanation

```
Matplotlib Figure Structure

┌─────────────────────────────────────────────────┐
│ Figure (the whole window)                        │
│  ┌─────────────────────────────────────────────┐│
│  │ Axes (the actual plot area)                  ││
│  │  ┌───────────────────────────────────────┐   ││
│  │  │ Title                                 │   ││
│  │  │ ──────────────────────────────────── │   ││
│  │  │ │                                    │   ││
│  │  │ │        Plot Area                   │   ││
│  │  │ │                                    │   ││
│  │  │ ──────────────────────────────────── │   ││
│  │  │ X Label                              │   ││
│  │  └───────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────┘│
│  Legend                                          │
└─────────────────────────────────────────────────┘
```

## Python Implementation

```python
import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label="sin(x)", color="blue", linewidth=2)
plt.plot(x, np.cos(x), label="cos(x)", color="red", linestyle="--")
plt.title("Sine and Cosine Functions")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

```python
# Scatter plot
np.random.seed(42)
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6, c="steelblue", edgecolors="white", linewidth=0.5)
plt.title("Scatter Plot with Linear Relationship")
plt.xlabel("Feature X")
plt.ylabel("Target Y")
plt.grid(True, alpha=0.3)
plt.show()
```

```python
# Bar chart
categories = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
values = [2.5, -1.2, 3.8, 0.9, -2.1]
colors = ["green" if v > 0 else "red" for v in values]

plt.figure(figsize=(8, 6))
plt.bar(categories, values, color=colors, alpha=0.7)
plt.title("Gene Expression Fold Changes")
plt.xlabel("Gene")
plt.ylabel("Fold Change")
plt.axhline(y=0, color="black", linewidth=0.5)
plt.show()
```

```python
# Histogram
data = np.random.randn(1000)

plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, edgecolor="white", alpha=0.7, density=True)
plt.title("Distribution of Values (Histogram)")
plt.xlabel("Value")
plt.ylabel("Density")
plt.grid(True, alpha=0.3)
plt.show()
```

```python
# Multiple subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

x = np.linspace(0, 10, 100)
data = np.random.randn(500)

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title("Sine")

axes[0, 1].plot(x, np.cos(x), color="red")
axes[0, 1].set_title("Cosine")

axes[1, 0].scatter(np.random.randn(50), np.random.randn(50), alpha=0.6)
axes[1, 0].set_title("Scatter")

axes[1, 1].hist(data, bins=20, edgecolor="white")
axes[1, 1].set_title("Histogram")

plt.tight_layout()
plt.show()
```

## Biotechnology Example

**Scenario**: Visualizing gene expression data across conditions.

```python
import matplotlib.pyplot as plt
import numpy as np

# Simulate gene expression data (4 genes, 3 conditions)
np.random.seed(42)
conditions = ["Control", "Treatment_A", "Treatment_B"]
genes = ["BRCA1", "TP53", "EGFR", "MYC"]
expression = np.random.randn(4, 3) * 1.5 + 2

# Grouped bar chart
fig, ax = plt.subplots(figsize=(10, 6))
x = np.arange(len(genes))
width = 0.25
colors = ["steelblue", "coral", "seagreen"]

for i, (cond, color) in enumerate(zip(conditions, colors)):
    offset = (i - 1) * width
    ax.bar(x + offset, expression[:, i], width, label=cond, color=color, alpha=0.8)

ax.set_xlabel("Gene")
ax.set_ylabel("Expression Level")
ax.set_title("Gene Expression by Condition")
ax.set_xticks(x)
ax.set_xticklabels(genes)
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

## SaaS Example

**Scenario**: Visualizing SaaS metrics dashboard.

```python
import matplotlib.pyplot as plt
import numpy as np

# Monthly metrics
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue = np.array([50, 55, 62, 68, 75, 82])
users = np.array([1000, 1100, 1250, 1400, 1550, 1700])
churn = np.array([5.2, 4.8, 4.5, 4.2, 3.9, 3.5])

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Revenue trend
axes[0].plot(months, revenue, marker="o", linewidth=2, color="steelblue")
axes[0].set_title("Monthly Revenue ($K)")
axes[0].set_xlabel("Month")
axes[0].grid(True, alpha=0.3)

# User growth
axes[1].bar(months, users, color="seagreen", alpha=0.7)
axes[1].set_title("Active Users")
axes[1].set_xlabel("Month")
axes[1].grid(True, alpha=0.3)

# Churn rate
axes[2].plot(months, churn, marker="s", linewidth=2, color="coral")
axes[2].set_title("Churn Rate (%)")
axes[2].set_xlabel("Month")
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

## Common Mistakes

1. **Plotting lists without conversion**: Matplotlib can plot lists, but NumPy arrays are faster
2. **Not calling `plt.show()`**: In scripts, plots won't appear without it
3. **Too many plot elements**: Cluttered plots confuse rather than inform
4. **Incompatible shapes**: x and y must have the same length
5. **Forgetting `tight_layout()`**: Labels can be cut off
6. **Using default colors/styles**: Customize for professional-looking plots

## Best Practices

- Use the OO interface (`fig, ax = plt.subplots()`) for complex plots
- Always label axes and include units
- Use colorblind-friendly color schemes
- Set appropriate figure sizes with `figsize`
- Use `alpha` for overlapping elements
- Save as SVG for publications (vector format)
- Add grid lines with low alpha for readability
- Use `tight_layout()` to prevent label clipping

## Summary

- Matplotlib's pyplot provides MATLAB-like plotting
- Two interfaces: pyplot (simple) and OO (flexible)
- Basic plots: line, scatter, bar, histogram
- Customize with titles, labels, legends, colors
- Subplots enable multi-panel figures
- Save in PNG, PDF, SVG formats
- Always label axes and include legends

## Key Terms

- **Figure**: The top-level container (entire window)
- **Axes**: The actual plotting area (one figure can have many)
- **pyplot**: MATLAB-like interface for quick plotting
- **Subplot**: Multiple plots in a single figure
- **Legend**: Labels identifying plot elements
- **Tight layout**: Automatic spacing adjustment
- **Vector format**: SVG/PDF — scalable without quality loss
- **Raster format**: PNG — pixel-based, quality depends on DPI

## Exercises

### Level 1: Basic

1. What is the difference between `plt.plot()` and `plt.scatter()`?
2. How do you save a figure as a PNG file?
3. What does `fig, ax = plt.subplots(2, 3)` create?

### Level 2: Implementation

4. Plot the function f(x) = x² from -10 to 10 with labeled axes and a title.
5. Create a bar chart showing the top 5 most frequent words in a given text.

### Level 3: Critical Thinking

6. When would you choose a line plot over a scatter plot, and vice versa?
7. Why is it important to save figures in vector format (SVG/PDF) for publications?

## Coding Challenge

Create a **comprehensive data report** with the following plots:

1. **Line plot**: Plot 4 different mathematical functions (sin, cos, sin², cos²) on the same axes with different styles and a legend
2. **Scatter plot**: Generate 200 random (x, y) points with a clear linear trend, add a regression line
3. **Bar chart**: Show the distribution of letters in a DNA sequence (count of A, C, G, T)
4. **Histogram**: Plot the distribution of 10,000 random values and overlay a normal distribution curve
5. **Multi-panel figure**: Create a 2×2 subplot combining the above into one figure
6. Style: Use a professional style (`plt.style.use("seaborn-v0_8")` or similar), include grid lines, and save as PDF
