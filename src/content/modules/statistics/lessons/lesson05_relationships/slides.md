# Slides: Relationships Between Variables

## Slide 1: Title
- Relationships Between Variables
- Module 3, Lesson 5

## Slide 2: Learning Objectives
- Compute and interpret covariance
- Compare Pearson vs Spearman correlation
- Create correlation matrix heatmaps

## Slide 3: Why Relationships Matter
- ML models learn relationships
- Feature selection removes redundant features
- Multicollinearity degrades model stability

## Slide 4: Covariance
- How two variables vary together
- Cov(X,Y) = (1/n) Σ (x-mean(x))(y-mean(y))
- Scale-dependent: can't compare across units

## Slide 5: Pearson Correlation
- Normalized covariance: [-1, 1]
- r = 1: perfect positive linear
- r = -1: perfect negative linear
- r = 0: no linear relationship

## Slide 6: Spearman Correlation
- Based on ranks, not raw values
- Measures monotonic relationships
- Robust to outliers
- No normality assumption

## Slide 7: Pearson vs Spearman
- Pearson: linear, sensitive to outliers
- Spearman: monotonic, robust
- Use Spearman when data is skewed or non-linear

## Slide 8: Correlation Matrix
- Square matrix of pairwise correlations
- Diagonal is always 1
- Detects multicollinearity (|r| > 0.8)
- Visualize with heatmap

## Slide 9: Correlation ≠ Causation
- I
- Correlated variables may both be caused by a third
- Always consider confounding variables

## Slide 10: Key Takeaways
- Covariance → Pearson → [-1,1]
- Spearman for non-linear monotonic
- Visualize with scatter plots
- Correlation ≠ causation
- Use heatmaps for feature relationships
