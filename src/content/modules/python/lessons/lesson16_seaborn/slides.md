# Seaborn — Slide Outline

## Slide 1: Title Slide
- Seaborn: Statistical Data Visualization
- Module 2: Python Programming Fundamentals

## Slide 2: Why Seaborn?
- Statistical visualization made easy
- Built on Matplotlib
- Professional defaults
- Native Pandas integration
- ML: EDA, feature analysis, model evaluation

## Slide 3: Seaborn vs Matplotlib
| Aspect | Matplotlib | Seaborn |
|--------|------------|---------|
| Level | Low-level | High-level |
| Default style | Basic | Professional |
| Pandas | Manual | Native |
| Stat plots | Manual | Built-in |
| Code | More code | Less code |

## Slide 4: Installation and Setup
```python
import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme()  # Apply Seaborn defaults
```

## Slide 5: Distribution Plots
```python
sns.histplot(data=df, x="col", hue="cat")
sns.kdeplot(data=df, x="col")
sns.ecdfplot(data=df, x="col")
```
- Understand single variable distributions

## Slide 6: Comparison Plots
```python
sns.boxplot(data=df, x="cat", y="value")
sns.violinplot(data=df, x="cat", y="value")
sns.boxenplot(data=df, x="cat", y="value")
```
- Compare distributions across categories

## Slide 7: Relationship Plots
```python
sns.scatterplot(data=df, x="x", y="y", hue="cat", size="size")
sns.lineplot(data=df, x="x", y="y", hue="cat")
sns.regplot(data=df, x="x", y="y")
```

## Slide 8: Multi-Variable Plots
```python
sns.pairplot(data=df, hue="cat")
sns.heatmap(data=corr, annot=True)
sns.clustermap(data)
```
- Explore many variables at once

## Slide 9: Themes and Styles
```python
sns.set_theme()                    # Default
sns.set_style("whitegrid")         # Background
sns.set_palette("viridis")          # Colors
sns.color_palette("husl", 8)       # Custom
```

## Slide 10: Using hue and style
- `hue`: Color by categorical variable
- `size`: Size by numeric variable
- `style`: Line/marker style by categorical
- `col`/`row`: Facet by variable

## Slide 11: Biotech Example
- Gene expression box plots
- Heatmap of expression levels
- Pairplot of biomarker correlations

## Slide 12: Common Mistakes
- Forgetting `plt.show()`
- Conflicting Matplotlib styles
- Not using hue for categorical vars
- Using raw arrays instead of DataFrames

## Slide 13: Best Practices
- Start with `sns.set_theme()`
- Use DataFrames, not raw arrays
- Use hue for color coding
- Combine with Matplotlib for fine-tuning
- Use pairplot for initial EDA

## Slide 14: Summary
- High-level statistical visualization
- Built on Matplotlib
- Box, violin, pairplot, heatmap
- Professional defaults and themes
- Native Pandas integration
- EDA: pairplot + heatmap
- Comparison: boxplot + violinplot
