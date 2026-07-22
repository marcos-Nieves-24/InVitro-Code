# Slides: Descriptive Statistics

## Slide 1: Title
- Descriptive Statistics for Machine Learning
- Module 3, Lesson 1

## Slide 2: Learning Objectives
- Compute and interpret mean, median, mode
- Compute and interpret variance, std, range, IQR
- Detect outliers using IQR method
- Choose appropriate summary statistics

## Slide 3: Why Descriptive Statistics?
- Condense thousands of numbers into meaningful summaries
- Essential for data understanding before ML modeling

## Slide 4: Measures of Central Tendency
- Mean: sum / count (balance point)
- Median: middle value (robust to outliers)
- Mode: most frequent value
- Analogy: different ways to describe "center"

## Slide 5: Mean vs Median
- Symmetric data: mean ≈ median
- Skewed data: median is preferred
- Example: income distribution

## Slide 6: Measures of Dispersion
- Range: max - min (sensitive to outliers)
- Variance: average squared deviation from mean
- Standard deviation: sqrt(variance), in original units
- IQR: Q3 - Q1 (robust to outliers)

## Slide 7: Visualizing Dispersion
- Boxplot: shows min, Q1, median, Q3, max, outliers
- Whiskers extend to 1.5×IQR

## Slide 8: Outlier Detection
- IQR rule: points beyond Q1 - 1.5×IQR or Q3 + 1.5×IQR
- Outliers may be errors, rare events, or interesting discoveries

## Slide 9: Python Demo
- `np.mean()`, `np.median()`, `np.std()`, `np.percentile()`
- `pd.Series.describe()` for quick summary
- `plt.boxplot()` for visualization

## Slide 10: Key Takeaways
- Mean + std for symmetric data
- Median + IQR for skewed data
- Always visualize before summarizing
- Context matters for interpretation
