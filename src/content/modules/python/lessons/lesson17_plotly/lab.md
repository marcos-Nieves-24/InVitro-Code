# Lab: Visualización interactiva con Plotly

## Objetivo

Practicar la creación de visualizaciones interactivas con Plotly Express, la personalización con Graph Objects, la construcción de subplots y el agregado de interactividad.

## Duración

75 minutos

## Requisitos previos

Lección 16: Seaborn

## Instrucciones

### Parte 1: Para empezar con Plotly Express

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

**Tarea**: Creá un scatter plot usando `px.data.tips()` con `total_bill` en el eje x, `tip` en el eje y, coloreado por `time`, con marcadores cuyo tamaño dependa de `size`. Agregá un título.

### Parte 2: Personalización con Graph Objects

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

**Tarea**: Construí una figura con 3 traces: un scatter, una línea y una barra usando datos sintéticos. Usá `update_layout()` para configurar el título, las etiquetas de los ejes y la plantilla "plotly_white". Usá la notación mágica de guion bajo para configurar `title_text`, `xaxis_title` y `yaxis_title`.

### Parte 3: Subplots con make_subplots

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

**Tarea**: Creá una disposición de subplots 1×3 con un scatter, una barra y un box plot usando datos de `px.data.tips()`. Configurá títulos apropiados para cada subplot.

### Parte 4: Interactividad y exportación

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

**Tarea**: Creá un line chart del PBI de un país a lo largo del tiempo usando `px.data.gapminder()`. Agregá un range slider al eje x. Agregá un menú desplegable para alternar entre las vistas "PBI", "Esperanza de vida" y "Población". Exportá el resultado a `dashboard.html`.

## Entregables

Notebook de Jupyter `plotly_lab.ipynb` con todos los gráficos visibles e interactivos.
