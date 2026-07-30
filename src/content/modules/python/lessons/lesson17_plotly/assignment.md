# Assignment: Interactive Data Exploration Dashboard

## Objectives

- Use Plotly Express for creating interactive visualizations
- Work with real built-in datasets (gapminder)
- Create animated scatter plots with `animation_frame`
- Build multi-level sunburst charts
- Add dropdown interactivity for switching metrics
- Export interactive HTML dashboards

## Instructions

Create a Python script `gapminder_dashboard.py` that:

1. **Load data**: Use `px.data.gapminder()` to get the dataset

2. **Create 3 visualizations**:

   a. **Animated scatter plot**: Use `px.scatter()` with:
      - `x="gdpPercap"`, `y="lifeExp"`, `size="pop"`, `color="continent"`
      - `animation_frame="year"` for animation over years
      - `log_x=True` for log scale on GDP
      - Title: "Evolución Global: GDP vs Esperanza de Vida"

   b. **Histogram of life expectancy**: Use `px.histogram()` with:
      - `x="lifeExp"`, `color="continent"`, `nbins=40`
      - Filter data for `year == 2007`
      - Title: "Distribución de Esperanza de Vida por Continente (2007)"

   c. **Sunburst**: Use `px.sunburst()` with:
      - `path=["continent", "country"]`, `values="pop"`
      - Filter data for `year == 2007`
      - Title: "Población Mundial por Continente y País"

3. **Add dropdown interactivity**:

   Create a line chart showing 4 countries of your choice over time, with a dropdown menu to switch between these metrics:
   - `gdpPercap` (GDP per capita)
   - `lifeExp` (Life expectancy)
   - `pop` (Population)

   Use `fig.update_layout(updatemenus=[...])` to implement the dropdown.

4. **Export**: Save the final dashboard as `exploracion.html`

## Deliverables

- `gapminder_dashboard.py`
- `exploracion.html` (exported from your script)

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Visualizations | 3+ plots with correct data | 2-3 plots | < 2 plots |
| Animation | Scatter with animation_frame works correctly | Animation present but buggy | No animation |
| Interactivity | Dropdown works + hover/zoom | Dropdown works | No interactivity |
| Export | HTML renders standalone, fully interactive | HTML works | No export |
| Code Quality | Clean, well-structured, documented | Readable | Poor structure |

## Estimated Completion Time

90 minutes
