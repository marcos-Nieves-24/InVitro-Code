```python
# =========================================================================
# LAB 17: Visualizacion interactiva con Plotly
# -------------------------------------------------------------------------
# Repasamos Plotly Express (codigo breve), Graph Objects (control total),
# los subplots con make_subplots y la interactividad (menus y rangos).
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Para empezar con Plotly Express.
# px genera figuras completas con una sola linea de codigo sobre un
# DataFrame. El dataset iris clasifica flores por sepalos y petalos.
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length",
                 color="species", size="petal_length",
                 title="Dataset Iris")
fig.show()

# Grafico de lineas: la esperanza de vida de Argentina a lo largo del tiempo.
df = px.data.gapminder()
fig = px.line(df[df.country == "Argentina"], x="year", y="lifeExp",
              title="Esperanza de vida - Argentina",
              labels={"year": "Ano", "lifeExp": "Esperanza de vida"})
fig.show()

# Grafico de barras: total de cuentas del dataset tips por dia y sexo.
df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex",
             barmode="group", title="Propinas por dia y sexo",
             labels={"total_bill": "Total de la cuenta ($)", "day": "Dia"})
fig.show()

# PASO 2: Tarea resuelta con Plotly Express.
# La tarea pedía un scatter de tips: total en x, propina en y, coloreado
# por momento del dia (time) y tamano del marcador segun comensales (size).
fig = px.scatter(px.data.tips(), x="total_bill", y="tip", color="time",
                 size="size", size_max=25,
                 title="Propina segun total, momento y comensales",
                 labels={"total_bill": "Total de la cuenta ($)", "tip": "Propina ($)"})
fig.show()

# PASO 3: Personalizacion con Graph Objects.
# go.Figure da control total sobre cada trace. Agregamos dos trazas con
# estilos distintos (linea solida y linea discontinua con marcadores).
import plotly.graph_objects as go
import numpy as np

x = np.linspace(0, 10, 100)
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines", name="sin(x)"))
fig.add_trace(go.Scatter(x=x, y=np.cos(x), mode="lines+markers",
                         name="cos(x)", line=dict(dash="dash")))

fig.update_layout(title="Funciones trigonometricas",
                  xaxis_title="x", yaxis_title="y",
                  template="plotly_dark",
                  legend=dict(orientation="h", y=1.1))
fig.show()

# PASO 4: Tarea resuelta con Graph Objects.
# Construimos una figura con tres trazas (dispersion, linea y barras) y
# configuramos titulo, ejes y plantilla "plotly_white" con la notacion
# de guion bajo (title_text, xaxis_title, yaxis_title).
np.random.seed(7)
fig = go.Figure()
fig.add_trace(go.Scatter(x=np.random.randn(30), y=np.random.randn(30),
                         mode="markers", name="Dispersion"))
fig.add_trace(go.Scatter(x=x, y=np.cos(x), mode="lines", name="Linea"))
fig.add_trace(go.Bar(x=["A", "B", "C"], y=[15, 24, 9], name="Barras"))

fig.update_layout(title_text="Tres trazas personalizadas",
                  xaxis_title="Eje X", yaxis_title="Eje Y",
                  template="plotly_white")
fig.show()

# PASO 5: Subplots con make_subplots.
# Dividimos la figura en una cuadricula 2x2 con tipos de grafico
# especificos (scatter, histograma, linea y heatmap de correlaciones).
from plotly.subplots import make_subplots

df = px.data.iris()
x = np.linspace(0, 10, 50)

fig = make_subplots(rows=2, cols=2,
                    subplot_titles=("Dispersion", "Histograma", "Linea", "Heatmap"),
                    specs=[[{"type": "scatter"}, {"type": "xy"}],
                           [{"type": "xy"}, {"type": "heatmap"}]])

fig.add_trace(go.Scatter(x=df.sepal_width, y=df.sepal_length,
                         mode="markers"), row=1, col=1)
fig.add_trace(go.Histogram(x=df.petal_length, nbinsx=20), row=1, col=2)
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines"), row=2, col=1)
corr = df.select_dtypes(include=[np.number]).corr()
fig.add_trace(go.Heatmap(z=corr.values, colorscale="RdBu_r"), row=2, col=2)

fig.update_layout(height=600, width=900, title_text="Panel de graficos 2x2",
                  showlegend=False)
fig.show()

# PASO 6: Tarea resuelta - subplots 1x3 con tips.
# La tarea pedía una disposicion de una fila y tres columnas con scatter,
# barras y box plot sobre el dataset tips.
tips = px.data.tips()
fig = make_subplots(rows=1, cols=3,
                    subplot_titles=("Scatter", "Barras", "Box plot"),
                    specs=[[{"type": "xy"}, {"type": "xy"}, {"type": "xy"}]])

fig.add_trace(go.Scatter(x=tips.total_bill, y=tips.tip, mode="markers",
                         name="Scatter"), row=1, col=1)
fig.add_trace(go.Bar(x=tips.day.value_counts().index,
                     y=tips.day.value_counts().values,
                     name="Barras"), row=1, col=2)
fig.add_trace(go.Box(y=tips.tip, name="Box plot"), row=1, col=3)

fig.update_layout(title_text="Analisis de propinas (1x3)", showlegend=False,
                  xaxis_title="Total", yaxis_title="Propina")
fig.show()

# PASO 7: Interactividad - menu desplegable y rango deslizante.
# Creamos un scatter logaritmico de Gapminder 2007 y agregamos un menu
# para alternar la escala del eje x (log / lineal).
df = px.data.gapminder().query("year == 2007")
fig = px.scatter(df, x="gdpPercap", y="lifeExp", size="pop",
                 color="continent", log_x=True,
                 title="Gapminder 2007",
                 labels={"gdpPercap": "PBI per capita", "lifeExp": "Esperanza de vida"})
fig.update_layout(
    updatemenus=[dict(
        buttons=[
            dict(label="Escala log", method="relayout",
                 args=[{"xaxis.type": "log"}]),
            dict(label="Escala lineal", method="relayout",
                 args=[{"xaxis.type": "linear"}])],
        direction="down")])
fig.show()

# PASO 8: Tarea resuelta - linea con range slider.
# Line chart del PBI de Espana a lo largo del tiempo con un rango
# deslizante (rangeslider) en el eje x para explorar los datos.
df = px.data.gapminder()
pais = "Spain"
fig = px.line(df[df.country == pais], x="year", y="gdpPercap",
              title=f"PBI per capita - {pais}",
              labels={"year": "Ano", "gdpPercap": "PBI per capita"})
fig.update_layout(xaxis=dict(rangeslider=dict(visible=True)))
fig.show()

# PASO 9: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Plotly Express genera figuras con una linea sobre un DataFrame.")
print("Graph Objects permite control total de cada traza y del layout.")
print("make_subplots combina varios paneles y agregamos interactividad.")
```