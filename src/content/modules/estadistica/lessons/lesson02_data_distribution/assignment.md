# Assignment: Data Distribution Analysis

## Objectives

- Analyze the distribution of real-world data
- Apply log-transformation for normalization
- Interpret skewness and kurtosis in context

## Instructions

1. Load the `diamonds` dataset from seaborn
2. For the `price` column:
   - Create a histogram with KDE overlay
   - Compute and interpret skewness and kurtosis
   - Apply log transformation and repeat the analysis
3. For each `cut` category, create a density plot of `price` (overlaid)
4. For `carat`, `depth`, and `table` columns:
   - Create a 2×2 grid of histograms
   - Report shape statistics
   - Identify which columns are approximately normal
5. Write a summary (3-4 paragraphs) addressing:
   - Why diamond prices are right-skewed
   - How log transformation helps
   - Which features might need transformation before ML modeling

## Deliverables

- Jupyter notebook with code, plots, and written summary

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Histograms/KDE | All correctly created | Minor issues | Missing elements | Poor quality |
| Shape statistics | Correctly computed and interpreted | Correct but brief | Some errors | Missing/incomplete |
| Log-transformation | Properly done with comparison | Done but no comparison | Incomplete | Missing |
| Written summary | Insightful, well-structured | Good analysis | Superficial | Missing |

**Total: 16 points**

## Estimated Time

2 hours
