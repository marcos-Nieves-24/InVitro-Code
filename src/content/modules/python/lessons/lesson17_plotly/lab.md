# Lab: Interactive Visualization with Plotly

## Objective

Practice creating interactive visualizations with Plotly Express, customizing with Graph Objects, building subplots, and adding interactivity.

## Duration

75 minutes

## Prerequisites

Lesson 16: Seaborn

## Instructions

### Part 1: Getting Started with Plotly Express

```python
import plotly.express as px

# Scatter plot
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length",
                 color="species", size="petal_length",
                 title="Iris Dataset")
fig.show()

# Line plot
df = px.data.gapminder()
fig = px.line(df[df.country == "Argentina"], x="year", y="lifeExp",
              title="Life Expectancy - Argentina")
fig.show()

# Bar chart
df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex",
             barmode="group", title="Tips by Day and Sex")
fig.show()
```

**Task**: Create a scatter plot using `px.data.tips()` with `total_bill` on x-axis, `tip` on y-axis, colored by `time`, with markers sized by `size`. Add a title.

### Part 2: Customization with Graph Objects

```python
import plotly.graph_objects as go
import numpy as np

x = np.linspace(0, 10, 100)
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines", name="sin(x)"))
fig.add_trace(go.Scatter(x=x, y=np.cos(x), mode="lines+markers",
                          name="cos(x)", line=dict(dash="dash")))

fig.update_layout(title="Trigonometric Functions",
                  xaxis_title="x", yaxis_title="y",
                  template="plotly_dark",
                  legend=dict(orientation="h", y=1.1))
fig.show()
```

**Task**: Build a figure with 3 traces: a scatter, a line, and a bar trace using synthetic data. Use `update_layout()` to set title, axis labels, and template "plotly_white". Use magic underscore notation to set `title_text`, `xaxis_title`, and `yaxis_title`.

### Part 3: Subplots with make_subplots

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=2, cols=2,
                    subplot_titles=("Scatter", "Histogram", "Line", "Heatmap"),
                    specs=[[{"type": "scatter"}, {"type": "xy"}],
                           [{"type": "xy"}, {"type": "heatmap"}]])

df = px.data.iris()
x = np.linspace(0, 10, 50)

fig.add_trace(go.Scatter(x=df.sepal_width, y=df.sepal_length,
              mode="markers"), row=1, col=1)
fig.add_trace(go.Histogram(x=df.petal_length, nbinsx=20), row=1, col=2)
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines"), row=2, col=1)
corr = df.select_dtypes(include=[np.number]).corr()
fig.add_trace(go.Heatmap(z=corr.values, colorscale="RdBu_r"), row=2, col=2)

fig.update_layout(height=600, width=900, title_text="Multi-Panel Dashboard",
                  showlegend=False)
fig.show()
```

**Task**: Create a 1×3 subplot layout with a scatter, bar, and box plot using data from `px.data.tips()`. Set appropriate titles for each subplot.

### Part 4: Interactivity and Export

```python
# Dropdown menu
df = px.data.gapminder().query("year == 2007")
fig = px.scatter(df, x="gdpPercap", y="lifeExp", size="pop",
                 color="continent", log_x=True,
                 title="Gapminder 2007")
fig.update_layout(
    updatemenus=[dict(
        buttons=[
            dict(label="2007", method="relayout",
                 args=[{"xaxis.type": "log"}]),
            dict(label="Linear", method="relayout",
                 args=[{"xaxis.type": "linear"}])],
        direction="down")])
fig.show()

# Range slider
fig.update_layout(xaxis=dict(rangeslider=dict(visible=True)))

# Export
fig.write_html("gapminder_2007.html")
fig.write_image("gapminder_2007.png")
```

**Task**: Create a line chart of a country's GDP over time from `px.data.gapminder()`. Add a range slider to the x-axis. Add a dropdown menu to toggle between "GDP", "Life Exp", and "Population" views. Export the result to `dashboard.html`.

## Deliverables

Jupyter notebook `plotly_lab.ipynb` with all plots visible and interactive.
