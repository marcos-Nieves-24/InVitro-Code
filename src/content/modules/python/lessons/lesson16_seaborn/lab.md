# Lab: Statistical Visualization with Seaborn

## Objective

Practice creating Seaborn visualizations: box plots, violin plots, pairplots, heatmaps, and distribution plots.

## Duration

60 minutes

## Prerequisites

Lesson 15: Matplotlib

## Instructions

### Part 1: Getting Started

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Load tips dataset
tips = sns.load_dataset("tips")
print(tips.head())
```

### Part 2: Box Plot

```python
# Box plot of total_bill by day
plt.figure(figsize=(10, 6))
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Bill Distribution by Day and Sex")
plt.show()
```

### Part 3: Violin Plot

```python
# Violin plot (shows distribution shape)
plt.figure(figsize=(10, 6))
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True)
plt.title("Bill Distribution (Violin)")
plt.show()
```

### Part 4: Pairplot

```python
# Pairplot of numerical columns
sns.pairplot(data=tips, hue="sex", diag_kind="kde")
plt.suptitle("Pairplot of Tips Data", y=1.02)
plt.show()
```

### Part 5: Heatmap

```python
# Correlation heatmap
numeric = tips.select_dtypes(include=[np.number])
corr = numeric.corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, square=True)
plt.title("Correlation Heatmap")
plt.show()
```

### Part 6: Customization

```python
# Apply theme and customize
sns.set_theme(style="whitegrid")
sns.set_palette("husl")

plt.figure(figsize=(10, 6))
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", size="size", sizes=(20, 200))
plt.title("Tips Analysis with Custom Theme")
plt.show()
```

## Deliverables

Jupyter notebook `seaborn_lab.ipynb` with all plots.
