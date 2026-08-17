```python
# =========================================================================
# LAB 16: Visualizacion estadistica con Plotly
# -------------------------------------------------------------------------
# El laboratorio original usaba bibliotecas de graficos estaticos; aqui
# reescribimos las mismas visualizaciones estadisticas con Plotly sobre el
# dataset "tips" (propinas de un restaurante), incluido en plotly.express:
# px.data.tips(). Cada figura termina con fig.show() para la consola.
# =========================================================================

# PASO 1: Cargar el dataset "tips".
# plotly.express trae datasets de ejemplo empaquetados. "tips" registra
# el total de la cuenta, la propina, el dia, el sexo, etc. por cliente.
import plotly.express as px
import pandas as pd
import numpy as np

tips = px.data.tips()
print("Primeras filas del dataset 'tips':")
print(tips.head())
print("\nDimensiones:", tips.shape)

# PASO 2: Box plot.
# El box plot resume la distribucion con cuartiles y valores atipicos.
# Mostramos la cuenta total por dia, separada por sexo (color).
fig = px.box(tips, x="day", y="total_bill", color="sex",
             title="Distribucion de la cuenta por dia y sexo",
             labels={"total_bill": "Total de la cuenta ($)", "day": "Dia"})
fig.show()

# PASO 3: Violin plot.
# El violin agrega la forma completa de la distribucion (densidad) al
# resumen del box plot. Con split=True comparamos ambos sexos en un solo
# violin, como en el original.
import plotly.graph_objects as go

fig = go.Figure()
for sex in ["Male", "Female"]:
    sub = tips[tips["sex"] == sex]
    fig.add_trace(go.Violin(
        x=sub["day"], y=sub["total_bill"], name=sex,
        box_visible=True, meanline_visible=True,
        points="outliers", side="positive" if sex == "Male" else "negative",
        line_color="steelblue" if sex == "Male" else "tomato"
    ))
fig.update_layout(title="Distribucion de la cuenta (violin por sexo)",
                  yaxis_title="Total de la cuenta ($)", violinmode="overlay")
fig.show()

# PASO 4: Matriz de dispersion (pairplot).
# px.scatter_matrix reproduce el pairplot: relacion entre cada par de
# columnas numericas, coloreada por sexo. Los histogramas de la diagonal
# se sustituyen por los valores de cada variable en su propio eje.
fig = px.scatter_matrix(tips, dimensions=["total_bill", "tip", "size"],
                        color="sex",
                        title="Matriz de dispersion de 'tips' por sexo")
fig.show()

# PASO 5: Mapa de calor (heatmap) de correlaciones.
# La correlacion mide la relacion lineal entre pares de variables
# numericas. px.imshow la visualiza con una escala divergente.
numeric = tips.select_dtypes(include=[np.number])
corr = numeric.corr()
fig = px.imshow(corr, text_auto=True, color_continuous_scale="RdBu_r",
                zmin=-1, zmax=1,
                title="Mapa de calor de correlaciones")
fig.show()

# PASO 6: Dispersion personalizada.
# Grafico de total vs propina coloreado por momento del dia (time) y con
# el tamano del marcador proporcional al numero de comensales (size).
fig = px.scatter(tips, x="total_bill", y="tip", color="time", size="size",
                 size_max=30, title="Analisis de propinas",
                 labels={"total_bill": "Total de la cuenta ($)", "tip": "Propina ($)"})
fig.update_layout(legend=dict(orientation="h", y=1.1))
fig.show()

# PASO 7: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Box plot y violin para comparar distribuciones por dia y sexo.")
print("Matriz de dispersion y mapa de calor de correlaciones.")
print("Graficos interactivos de Plotly en lugar de Seaborn/Matplotlib.")
```