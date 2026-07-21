# Assignment: Exploratory Visualization Dashboard

## Objectives

- Create a variety of plot types for data exploration
- Customize figures with professional styling
- Use subplots to create multi-panel dashboards
- Save figures for reports

## Instructions

Create a Python script `viz_dashboard.py` that generates a multi-panel dashboard figure for a synthetic dataset:

1. **Generate data**: Create a DataFrame with 500 samples and the following columns:
   - `date`: 500 consecutive dates
   - `revenue`: random walk starting at 1000
   - `users`: correlated with revenue + noise
   - `conversion_rate`: between 2% and 5%
   - `category`: A, B, or C

2. **Create a 2×3 dashboard figure**:
   - (1,1) Revenue over time (line plot)
   - (1,2) Users vs Revenue (scatter plot)
   - (1,3) Conversion rate histogram
   - (2,1) Revenue by category (bar chart)
   - (2,2) Revenue distribution (box plot)
   - (2,3) Correlation heatmap of numeric columns

3. **Customization**:
   - Use a professional style (`seaborn-v0_8` or `ggplot`)
   - All axes labeled with appropriate titles
   - Consistent color scheme
   - Grid lines with low alpha
   - `tight_layout()` applied

4. **Save** the dashboard as both PNG and SVG

## Deliverables

- `viz_dashboard.py`
- `dashboard.png` and `dashboard.svg`
- The dashboard figure displayed in the console

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Plot Types | 6 different plot types used correctly | 4-5 plot types | < 4 plot types |
| Customization | Professional styling, all labels | Adequate styling | Minimal customization |
| Subplots | Correct 2×3 layout, all visible | Layout issues | Poor layout |
| Data Generation | Realistic synthetic data | Basic data | Not generated |
| Saving | Both PNG and SVG saved | One format | Not saved |

## Estimated Completion Time

90 minutes
