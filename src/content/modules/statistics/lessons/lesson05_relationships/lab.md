# Lab: Relationships Between Variables

## Objective

Explore correlations between variables in real datasets and interpret the strength and direction of relationships.

## Duration

60 minutes

## Dataset

The `mpg` dataset from seaborn.

## Instructions

### Part 1: Pairwise Scatter Plots (15 min)

1. Load `mpg` dataset
2. Create scatter plots for: mpg vs horsepower, mpg vs weight, mpg vs displacement
3. For each, describe the relationship (direction, strength, linearity)

### Part 2: Correlation Computation (15 min)

1. Compute Pearson and Spearman correlations for all pairs of numeric variables
2. Create a DataFrame showing both coefficients side-by-side
3. Identify pairs where Pearson and Spearman differ by more than 0.1 — what does this mean?

### Part 3: Correlation Heatmap (10 min)

1. Create a correlation matrix heatmap for the mpg dataset
2. Which features are most correlated with mpg?
3. Which features are most correlated with each other (potential multicollinearity)?

### Part 4: The Anscombe's Quartet Effect (20 min)

The Anscombe dataset shows that very different datasets can have identical correlations.

```python
anscombe = sns.load_dataset('anscombe')
```

1. Compute Pearson correlation for each group (I, II, III, IV)
2. Create a scatter plot for each group with the correlation in the title
3. Explain why identical correlations don't imply identical relationships

## Deliverables

- Jupyter notebook with all visualizations and interpretations
- Written answer identifying the most important features for predicting mpg

## Rubric

| Criteria | Points |
|----------|--------|
| Scatter plots with interpretations | 3 |
| Pearson vs Spearman comparison | 2 |
| Correlation heatmap | 2 |
| Anscombe analysis | 3 |
Total: 10 points
