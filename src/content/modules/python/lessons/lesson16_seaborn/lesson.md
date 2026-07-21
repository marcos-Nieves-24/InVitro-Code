---
Module: 2
Lesson Number: 16
Lesson Title: Seaborn
Estimated Duration: 60 minutes
Prerequisites: L15 — Matplotlib
Learning Objectives:
  - Create statistical visualizations using Seaborn
  - Use pairplot and heatmap for multi-variable exploration
  - Create box plots and violin plots for distribution comparison
  - Apply Seaborn themes and color palettes
  - Customize Seaborn plots with Matplotlib integration
Keywords: Seaborn, pairplot, heatmap, boxplot, violinplot, palette, theme
Difficulty: Beginner-Intermediate
Programming Concepts: Statistical visualization, data exploration
Datasets Used: None (synthetic data)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Seaborn

## Motivation

Seaborn is a statistical visualization library built on Matplotlib that makes it easy to create informative, attractive plots with minimal code. It is designed specifically for exploring and understanding data. While Matplotlib gives you complete control, Seaborn gives you smart defaults and statistical plot types. In biotechnology, Seaborn creates publication-ready heatmaps of gene expression, box plots comparing treatment groups, and pair plots for biomarker discovery. In SaaS, it visualizes customer segments, correlation analyses, and A/B test results.

## Big Picture

In the previous lesson, you learned Matplotlib — the foundation for Python visualization. Seaborn builds on Matplotlib to provide higher-level, statistically-focused plots. Combined with Pandas for data manipulation, these three libraries (Pandas, Matplotlib, Seaborn) form the core data science toolkit. Throughout the ML modules, you'll use Seaborn for EDA and result visualization.

## Theory

### What is Seaborn?

Seaborn provides:
- **Statistical plot types**: box, violin, swarm, pair, heatmap
- **Automatic aggregation**: computes statistics for you
- **Smart color mapping**: categorical and continuous palettes
- **Themes**: Professional default styles
- **Pandas integration**: Works directly with DataFrames

### Installation and Import

```bash
pip install seaborn
```

```python
import seaborn as sns
```

### Seaborn vs Matplotlib

| Feature | Matplotlib | Seaborn |
|---------|------------|---------|
| Level | Low-level | High-level |
| Default style | Basic | Professional |
| Pandas support | Manual | Native |
| Statistical plots | Manual | Built-in |
| Customization | Complete | Good, with Matplotlib access |

### Key Plot Types

```python
sns.scatterplot(data=df, x="col1", y="col2", hue="category")
sns.lineplot(data=df, x="x", y="y")
sns.barplot(data=df, x="cat", y="value")
sns.boxplot(data=df, x="cat", y="value")
sns.violinplot(data=df, x="cat", y="value")
sns.histplot(data=df, x="col")
sns.kdeplot(data=df, x="col")
sns.pairplot(data=df, hue="category")
sns.heatmap(data=correlation_matrix, annot=True)
sns.clustermap(data)
```

### Themes and Palettes

```python
sns.set_theme()  # Default Seaborn theme
sns.set_style("whitegrid")  # Styles: darkgrid, whitegrid, dark, white, ticks
sns.set_palette("viridis")  # Palettes: deep, muted, pastel, bright, dark, colorblind
sns.color_palette("husl", 8)  # Custom palette
```

## Visual Explanation

```
Seaborn Plot Types for Different Data

Relationship:              Distribution:
┌──────────────────┐     ┌──────────────────┐
│ Scatterplot      │     │ Histplot         │
│ ·  ·    ·        │     │ ▓▓▓▓░░░░         │
│   ·  ·    ·  ·   │     │ ▓▓▓▓▓░░░         │
│     ·  ·   ·     │     │ ▓▓▓▓▓▓░░         │
└──────────────────┘     └──────────────────┘

Comparison:                Multi-variable:
┌──────────────────┐     ┌──────────────────┐
│ Boxplot          │     │ Pairplot         │
│ ┌──┐  ┌──┐       │     │ ╔══╤══╤══╗       │
│ │  │  │  │       │     │ ║· │ │ │║       │
│ └──┘  └──┘       │     │ ╟──┼──┼──╢       │
└──────────────────┘     │ ║· │· │ │║       │
                         │ ╚══╧══╧══╝       │
Correlation:              └──────────────────┘
┌──────────────────┐
│ Heatmap          │
│ ████░░ ░░████    │
│ ░░████ ████░░    │
│ ████░░ ░░████    │
└──────────────────┘
```

## Python Implementation

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Load a built-in dataset
tips = sns.load_dataset("tips")
print(tips.head())
```

```python
# Scatter plot with hue
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", size="size")
plt.title("Tips by Total Bill")
plt.show()
```

```python
# Box plot
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Bill Distribution by Day and Sex")
plt.show()
```

```python
# Violin plot
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True)
plt.title("Violin Plot of Bills")
plt.show()
```

```python
# Pairplot
sns.pairplot(data=tips, hue="sex", diag_kind="kde")
plt.show()
```

```python
# Heatmap
numeric_cols = tips.select_dtypes(include=[np.number])
corr = numeric_cols.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
plt.title("Correlation Heatmap")
plt.show()
```

```python
# Distribution plot
sns.histplot(data=tips, x="total_bill", hue="time", kde=True)
plt.show()
```

```python
# Count plot
sns.countplot(data=tips, x="day", hue="sex")
plt.title("Number of Parties by Day")
plt.show()
```

## Biotechnology Example

**Scenario**: Visualizing gene expression data from an experiment.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Simulate gene expression data
np.random.seed(42)
genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"] * 20
conditions = np.random.choice(["Control", "Drug_A", "Drug_B"], 100)
expression = np.random.randn(100) * 2 + 5

# Add some group effects
for i in range(len(expression)):
    if conditions[i] == "Drug_A":
        expression[i] += 1.5 if genes[i] in ["EGFR", "MYC"] else -1.0
    elif conditions[i] == "Drug_B":
        expression[i] += 2.0 if genes[i] in ["BRCA1", "TP53"] else -0.5

df = pd.DataFrame({
    "Gene": genes,
    "Condition": conditions,
    "Expression": expression
})

# Box plot
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x="Gene", y="Expression", hue="Condition")
plt.title("Gene Expression by Condition")
plt.show()

# Heatmap (pivot table)
pivot = df.pivot_table(index="Gene", columns="Condition", values="Expression", aggfunc="mean")
plt.figure(figsize=(8, 6))
sns.heatmap(pivot, annot=True, cmap="viridis", fmt=".1f")
plt.title("Mean Expression Levels")
plt.show()
```

## SaaS Example

**Scenario**: Analyzing customer engagement metrics.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Simulate customer data
np.random.seed(42)
n_customers = 200

df = pd.DataFrame({
    "Plan": np.random.choice(["Basic", "Pro", "Enterprise"], n_customers, p=[0.5, 0.3, 0.2]),
    "Tenure": np.random.randint(1, 60, n_customers),
    "Monthly_Spend": np.random.uniform(10, 200, n_customers),
    "Support_Tickets": np.random.poisson(0.5, n_customers),
    "Satisfaction": np.random.uniform(1, 10, n_customers).round(1),
    "Churned": np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

# Pairplot colored by churn
sns.pairplot(data=df, hue="Churned", vars=["Tenure", "Monthly_Spend", "Satisfaction"])
plt.show()

# Box plot of spend by plan and churn
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="Plan", y="Monthly_Spend", hue="Churned")
plt.title("Monthly Spend by Plan and Churn Status")
plt.show()

# Correlation heatmap
plt.figure(figsize=(8, 6))
numeric = df.select_dtypes(include=[np.number])
sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm", center=0)
plt.title("Customer Metrics Correlation")
plt.show()
```

## Common Mistakes

1. **Forgetting to import matplotlib**: Seaborn needs `plt.show()` to display plots
2. **Overriding Seaborn's styles**: Setting Matplotlib styles after seaborn imports can conflict
3. **Using Seaborn for everything**: Some plots (like line charts with many lines) are better with pure Matplotlib
4. **Ignoring `hue` and `style` parameters**: These make Seaborn powerful — use them!
5. **Not using Pandas DataFrames**: Seaborn works best with DataFrames; using raw arrays loses functionality

## Best Practices

- Use `sns.set_theme()` at the start for consistent styling
- Use `hue` for categorical coloring and `size` for continuous values
- Use `col` and `row` parameters for faceted plots
- Use `sns.color_palette()` to create custom color schemes
- Combine Seaborn plots with Matplotlib's `plt.subplots()` for complex layouts
- Use `sns.heatmap()` with `annot=True` for correlation matrices

## Summary

- Seaborn provides high-level statistical visualizations
- Key plots: scatterplot, boxplot, violinplot, pairplot, heatmap
- Native Pandas integration — works directly with DataFrames
- Professional default themes and color palettes
- Built-in statistical aggregation (confidence intervals, etc.)
- Easily customized with Matplotlib functions

## Key Terms

- **Seaborn**: Statistical data visualization library
- **Hue**: Color-coded categorical variable
- **Pairplot**: Matrix of scatter plots for all variable pairs
- **Heatmap**: Color-coded matrix of values
- **Box plot**: Statistical distribution summary (quartiles, outliers)
- **Violin plot**: Box plot + kernel density estimation
- **Facet**: Subplot based on variable values
- **Palette**: Color scheme for categorical or continuous data

## Exercises

### Level 1: Basic

1. What is the main advantage of Seaborn over Matplotlib?
2. How do you add color coding for a categorical variable in a Seaborn plot?
3. What does `sns.pairplot()` show?

### Level 2: Implementation

4. Using the tips dataset, create a box plot of total_bill grouped by day and sex.
5. Create a heatmap of the correlation matrix of numeric columns in any dataset.

### Level 3: Critical Thinking

6. When would you choose a violin plot over a box plot? What additional information does the violin plot provide?
7. How would you customize a Seaborn plot (e.g., change title, axis labels, figure size) that doesn't have those parameters directly?

## Coding Challenge

Create a **comprehensive EDA report** of a synthetic customer dataset using Seaborn:

1. Generate a dataset with 300 customers and features: `age`, `income`, `spending_score` (1-100), `membership_years`, `num_purchases`, `avg_order_value`, `region` (4 regions), `segment` (Low/Medium/High)

2. Create the following visualizations:
   - Pairplot of numerical variables colored by segment
   - Heatmap of correlations between all numerical variables
   - Box plots of spending_score across regions
   - Violin plot of income by segment
   - Count plot of segments by region
   - Histogram of age with KDE overlay, colored by segment

3. Apply a professional Seaborn theme and custom color palette

4. Arrange multiple plots in a single figure using `plt.subplots()` with Seaborn axes

5. Save the final figure as `eda_report.png`
