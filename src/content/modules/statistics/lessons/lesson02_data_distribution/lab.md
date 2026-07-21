# Lab: Data Distribution

## Objective

Analyze the distribution of real-world data using histograms, density plots, and shape statistics.

## Duration

60 minutes

## Dataset

Seaborn's `diamonds` dataset.

```python
import seaborn as sns
diamonds = sns.load_dataset('diamonds')
```

## Instructions

### Part 1: Univariate Distribution (15 min)

For the `price` column:
1. Create a histogram with 30 bins
2. Overlay a KDE plot
3. Report skewness and kurtosis
4. Describe the shape (symmetric, skewed, etc.)

### Part 2: Log Transformation (15 min)

1. Log-transform the `price` column using `np.log1p()`
2. Plot histogram with KDE of the transformed data
3. Compare skewness before and after
4. Interpret: did the distribution become more normal?

### Part 3: Comparing Distributions by Category (15 min)

1. Create a faceted histogram of `price` grouped by `cut` (use `sns.histplot` with `hue`)
2. Create a separate density plot for each cut quality
3. Which cut has the widest price distribution?

### Part 4: Distribution Summary (15 min)

Write a function `distribution_report(series)` that returns a dictionary with:
- Mean, median, std, min, max
- Skewness, kurtosis
- Whether the distribution is approximately normal (|skewness| < 0.5 and |kurtosis| < 0.5)

## Deliverables

- Jupyter notebook with all code, plots, and interpretations
- A markdown section summarizing findings about price distribution

## Rubric

| Criteria | Points |
|----------|--------|
| Histograms and KDE plots | 3 |
| Log-transformation analysis | 2 |
| Grouped comparisons | 3 |
| Distribution report function | 2 |
Total: 10 points
