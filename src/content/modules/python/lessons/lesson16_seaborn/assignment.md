# Assignment: Customer Segmentation Visualization

## Objectives

- Use Seaborn to create statistical visualizations
- Explore multi-variable relationships with pairplots and heatmaps
- Customize Seaborn themes and palettes
- Create a comprehensive EDA report

## Instructions

Create a Python script `customer_segmentation_viz.py` that:

1. **Generate synthetic data**: 300 customers with:
   - `age`: 18-70
   - `income`: 20k-150k
   - `spending_score`: 1-100
   - `membership_years`: 0-10
   - `region`: North, South, East, West
   - `segment`: Low, Medium, High (based on spending_score percentiles)

2. **Create visualizations**:
   - Pairplot of numerical features colored by segment (use `sns.pairplot`)
   - Correlation heatmap of all numerical features
   - Box plot of spending_score by region, colored by segment
   - Violin plot of income by segment
   - Count plot of segments by region (use `sns.countplot`)
   - Histogram of age with KDE, colored by segment (use `sns.histplot`)
   - 3D-like scatter of income vs spending_score with hue=segment and size=membership_years

3. **Customization**:
   - Apply `sns.set_theme(style="whitegrid")`
   - Use a custom color palette: `sns.color_palette("viridis", 3)`
   - All plots should have titles and appropriate axis labels

4. **Layout**: Arrange at least 4 plots in a 2×2 subplot figure

5. **Save** the combined figure as `segmentation_analysis.png`

## Deliverables

- `customer_segmentation_viz.py`
- `segmentation_analysis.png`

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Plot Types | 6+ different Seaborn plots | 4-5 plots | < 4 plots |
| Data Generation | Realistic, well-structured data | Basic data | Poor data |
| Customization | Theme + palette + titles | Some customization | Minimal |
| Layout | Organized 2×2 subplot | Basic layout | No layout |
| Insight | Visualizations reveal clear patterns | Some insight | No clear findings |

## Estimated Completion Time

90 minutes
