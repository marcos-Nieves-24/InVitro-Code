# Matplotlib — Slide Outline

## Slide 1: Title Slide
- Matplotlib: Data Visualization
- Module 2: Python Programming Fundamentals

## Slide 2: Why Visualization?
- Reveals patterns invisible in raw numbers
- Essential for EDA and model evaluation
- Communicates findings effectively
- Foundation for all Python visualization

## Slide 3: Matplotlib Architecture
- **Figure**: Top-level container (the window)
- **Axes**: The plot area (one figure can have many)
- **pyplot**: Convenient MATLAB-like interface
- Two ways to use: pyplot (simple) or OO (flexible)

## Slide 4: Basic Plot Types
| Plot | Function | Use Case |
|------|----------|----------|
| Line | `plt.plot()` | Trends, time series |
| Scatter | `plt.scatter()` | Relationships |
| Bar | `plt.bar()` | Comparisons |
| Histogram | `plt.hist()` | Distributions |
| Box | `plt.boxplot()` | Distributions |

## Slide 5: Customization
```python
plt.title("Title")
plt.xlabel("X Label")
plt.ylabel("Y Label")
plt.legend()
plt.grid(True, alpha=0.3)
plt.xlim(0, 10)
plt.ylim(0, 100)
```
- Labels, legends, grid, limits

## Slide 6: Colors and Styles
```python
plt.plot(x, y, color="steelblue", linestyle="--", linewidth=2)
plt.scatter(x, y, c=y, cmap="viridis")
plt.style.use("seaborn-v0_8")  # Professional style
```
- Named colors, hex codes, colormaps

## Slide 7: Subplots (Multi-Panel)
```python
fig, axes = plt.subplots(2, 3, figsize=(12, 8))
axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)
plt.tight_layout()
```
- Create multiple plots in one figure

## Slide 8: Saving Figures
```python
plt.savefig("plot.png", dpi=300, bbox_inches="tight")
plt.savefig("plot.pdf")
plt.savefig("plot.svg")
```
- Raster: PNG (for web)
- Vector: SVG, PDF (for publications)

## Slide 9: Biotech Example
- Gene expression grouped bar chart
- Multiple conditions, multiple genes
- Error bars for variability

## Slide 10: Common Mistakes
- Not calling `plt.show()` in scripts
- Forgetting axis labels
- Cluttered plots (too many elements)
- Incompatible array shapes
- Not using `tight_layout()`

## Slide 11: Best Practices
- Use OO interface for complex plots
- Always label axes with units
- Use colorblind-friendly palettes
- Appropriate figure size with `figsize`
- Save as SVG for publications
- Use alpha for overlapping points

## Slide 12: Summary
- Figure: container, Axes: plot area
- pyplot: quick, OO: flexible
- Line, scatter, bar, histogram
- Customize with labels, colors, legends
- Subplots for multi-panel figures
- Save as PNG, PDF, SVG
