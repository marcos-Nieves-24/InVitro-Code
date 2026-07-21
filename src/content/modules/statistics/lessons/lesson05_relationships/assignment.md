# Assignment: Correlation Analysis

## Objectives

- Compute and interpret Pearson and Spearman correlations
- Create correlation matrix visualizations
- Detect multicollinearity and spurious correlations

## Instructions

1. **Correlation Comparison**: Load the `mpg` dataset.
   - Compute Pearson and Spearman correlations between all numeric pairs
   - Find pairs where |Pearson - Spearman| > 0.1 and explain why
   - Create scatter plots for the 3 most correlated pairs

2. **Correlation Matrix**: Create a styled correlation matrix heatmap with:
   - All numeric variables
   - Annotations showing correlation values
   - Red-blue diverging colormap centered at 0
   - Highlight correlations > 0.8 (potential multicollinearity)

3. **Anscombe's Quartet Analysis**: 
   - Load `anscombe` dataset
   - For each of the 4 groups, compute Pearson correlation, mean of x, mean of y, and regression line
   - Show that summary statistics are identical but visualizations reveal very different patterns
   - Create a 2×2 scatter plot with regression lines

4. **Spurious Correlations**: Find an example of two variables from the datasets that are correlated but have no plausible causal relationship. Explain why the correlation exists despite no causation.

## Deliverables

- Jupyter notebook with code, visualizations, and written interpretations

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Pearson vs Spearman | Correct comparison | Minor issues | Partial | Missing |
| Correlation matrix | Clear, informative | Good but basic | Missing elements | Poor quality |
| Anscombe analysis | Complete with insight | Good analysis | Basic | Missing |
| Spurious correlations | Plausible, well-explained | Acceptable | Weak | Missing |

**Total: 16 points**

## Estimated Time

2 hours
