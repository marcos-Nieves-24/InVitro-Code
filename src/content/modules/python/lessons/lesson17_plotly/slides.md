# Plotly — Slide Outline

## Slide 1: Title Slide
- Plotly: Interactive Data Visualization
- Module 2: Python Programming Fundamentals
- Plotly v6.x — The Modern Way to Visualize Data

## Slide 2: Why Plotly?
- Interactive by default (hover, zoom, pan)
- Generates web-based visualizations (HTML+JS)
- Three layers: Express → Graph Objects → Plotly.js
- Ecosystem: Plotly → Dash → Dash Bio
- Biotech: interactive volcano plots, 3D molecules, genomic dashboards

## Slide 3: Plotly Architecture
| Layer | API | Use Case |
|-------|-----|----------|
| Plotly Express | `px.scatter()`, `px.bar()` | Rapid exploration |
| Graph Objects | `go.Figure()`, `go.Scatter()` | Full control |
| Plotly.js | Browser renderer | Rendering |

Figure = data[] (traces) + layout (title, axes, template)

## Slide 4: Plotly Express
```python
px.scatter(df, x="col1", y="col2", color="cat", size="val")
px.line(df, x="year", y="value")
px.bar(df, x="cat", y="val", color="group")
px.histogram(df, x="col", color="cat")
px.sunburst(df, path=["cat1", "cat2"], values="val")
```
- One call = complete interactive figure

## Slide 5: Graph Objects
```python
import plotly.graph_objects as go
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=y, mode="lines", name="data"))
fig.update_layout(title="My Plot",
                  template="plotly_white")
fig.show()
```
- Build trace by trace
- Full control over every element

## Slide 6: Built-in Datasets
```python
px.data.iris()       # Iris flower dataset
px.data.tips()       # Restaurant tips
px.data.gapminder()  # World development indicators
```
- Real data, ready to use
- No need to download anything

## Slide 7: Subplots with make_subplots
```python
from plotly.subplots import make_subplots
fig = make_subplots(rows=2, cols=2)
fig.add_trace(trace, row=1, col=1)
fig.add_trace(trace, row=1, col=2)
```
- Create multi-panel dashboards
- Specify types per cell with `specs`

## Slide 8: Interactivity
- **Hover template**: `hovertemplate="<b>%{x}</b>"`
- **Dropdown menu**: `updatemenus=[dict(buttons=[...])]`
- **Range slider**: `rangeslider=dict(visible=True)`
- **Animation**: `animation_frame="year"` in Plotly Express

## Slide 9: Export
```python
fig.write_html("output.html")     # Interactive HTML
fig.write_image("output.png")     # Static PNG (needs kaleido)
fig.write_image("output.svg")     # Vector SVG
```
- HTML is standalone, no server needed
- Install `pip install kaleido` for image export

## Slide 10: Biotech Example — Volcano Plot
- Scatter of log2FC vs -log10(p-value)
- Color by significance
- Hover shows gene names
- Threshold lines with `add_hline()` / `add_vline()`
- Interactive exploration of differential expression

## Slide 11: SaaS Example — Metrics Dashboard
```python
px.line(df, x="Mes", y="Valor", color="Métrica", markers=True)
fig.update_layout(hovermode="x unified")
```
- Multi-metric line chart with hover
- Dropdowns to switch views
- Export to HTML for sharing

## Slide 12: Common Mistakes
- Forgetting `fig.show()` in scripts
- No Kaleido for PNG export → install `pip install kaleido`
- Too many points → browser crash → use sampling
- Mixing px and go without understanding Figure is shared

## Slide 13: Best Practices
- Start with `px`, migrate to `go` when needed
- Use templates: `"plotly_white"`, `"plotly_dark"`
- Set `hovermode="x unified"` for time series
- Export HTML for sharing interactive results
- Use `fig.update_layout(margin=dict(...))` for clean layout

## Slide 14: Summary
- Plotly Express: fast, high-level interactive charts
- Graph Objects: full control, custom dashboards
- make_subplots: multi-panel figures
- Interactivity: hover, dropdowns, sliders, animation
- Export: HTML (interactive) and PNG/SVG (static)
- Next up: Dash for web applications
