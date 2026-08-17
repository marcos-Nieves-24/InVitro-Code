```python
# =========================================================================
# LAB 15: Visualizacion de datos con Plotly
# -------------------------------------------------------------------------
# El laboratorio original usaba Matplotlib; aqui reescribimos los mismos
# graficos con Plotly para que se muestren de forma INTERACTIVA en la
# consola de visualizacion: lineas, dispersion, barras, histograma y un
# panel de subplots 2x2. Cada figura termina con fig.show().
# =========================================================================

# PASO 1: Grafico de lineas (line plot).
# Graficamos dos ondas senoidales con un desfase. px.line recibe un
# DataFrame, por eso construimos uno con pandas.
import numpy as np
import pandas as pd
import plotly.express as px

x = np.linspace(0, 4 * np.pi, 100)
df_sine = pd.DataFrame({
    "x": x,
    "sin(x)": np.sin(x),
    "sin(x + pi/2)": np.sin(x + np.pi / 2),
})

fig = px.line(df_sine, x="x", y=["sin(x)", "sin(x + pi/2)"],
              title="Ondas senoidales",
              labels={"x": "x", "value": "y", "variable": "Funcion"})
fig.update_layout(legend=dict(orientation="h", y=1.1))
fig.show()

# PASO 2: Grafico de dispersion (scatter).
# Datos con ruido alrededor de una recta y=2x. El color de cada punto
# depende del valor de y (color_continuous_scale = viridis).
np.random.seed(42)
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5
df_scatter = pd.DataFrame({"X": x, "Y": y})

fig = px.scatter(df_scatter, x="X", y="Y", color="Y",
                 color_continuous_scale="viridis",
                 title="Dispersion con mapeo de color",
                 labels={"X": "X", "Y": "Y"})
fig.show()

# PASO 3: Grafico de barras.
# Barras con colores personalizados tomados de una escala continua.
categories = ["A", "B", "C", "D", "E"]
values = [23, 45, 12, 67, 34]
df_bar = pd.DataFrame({"Categoria": categories, "Valor": values})

fig = px.bar(df_bar, x="Categoria", y="Valor", color="Valor",
             color_continuous_scale="viridis",
             title="Grafico de barras con colores personalizados",
             labels={"Categoria": "Categoria", "Valor": "Valor"})
fig.show()

# PASO 4: Histograma.
# px.histogram agrupa los datos en intervalos automaticamente y muestra
# la distribucion. Con histnorm="probability" normalizamos la altura.
data = np.random.randn(1000)
df_hist = pd.DataFrame({"Valor": data})

fig = px.histogram(df_hist, x="Valor", nbins=30, histnorm="probability",
                   title="Distribucion (histograma)",
                   labels={"Valor": "Valor", "probability": "Probabilidad"})
fig.show()

# PASO 5: Panel de subplots 2x2.
# make_subplots crea una cuadricula de paneles y add_trace ubica cada
# grafico con los argumentos row y col. Aqui combinamos linea, barras,
# dispersion e histograma en una sola figura.
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=2, cols=2, subplot_titles=("Seno", "Barras", "Dispersion", "Histograma"))

x = np.linspace(0, 10, 100)
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines", name="Seno"), row=1, col=1)
fig.add_trace(go.Bar(x=["A", "B", "C"], y=[10, 20, 15], name="Barras"), row=1, col=2)
fig.add_trace(go.Scatter(x=np.random.randn(50), y=np.random.randn(50),
                         mode="markers", name="Dispersion"), row=2, col=1)
fig.add_trace(go.Histogram(x=np.random.randn(500), nbinsx=20, name="Histograma"), row=2, col=2)

fig.update_layout(title="Panel de graficos 2x2", height=600,
                  showlegend=False)
fig.show()

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Creamos lineas, dispersion, barras e histogramas con Plotly.")
print("Todo es interactivo: puedes hacer zoom, pan y ver tooltips.")
print("El panel 2x2 combina 4 graficos con make_subplots.")
```