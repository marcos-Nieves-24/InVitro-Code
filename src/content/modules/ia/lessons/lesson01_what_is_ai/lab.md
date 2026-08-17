```python
# =========================================================================
# LAB 1: Exploracion de features con Breast Cancer Wisconsin
# -------------------------------------------------------------------------
# Aplicamos los conceptos de features y reconocimiento de patrones a un
# dataset real de diagnostico medico. Cada figura termina con fig.show().
# =========================================================================
# PASO 1: Cargar el dataset y analizar la distribucion de clases.
# Breast Cancer Wisconsin tiene 569 biopsias con 30 features numericas y
# una etiqueta binaria: maligno (0) o benigno (1).
import numpy as np
import pandas as pd
import plotly.express as px
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data
y = data.target
feature_names = data.feature_names
print(f"Dataset: {X.shape[0]} muestras, {X.shape[1]} features")
print(f"Clases: {data.target_names}")
df_classes = pd.DataFrame({
    "clase": data.target_names,
    "cantidad": np.bincount(y),
})
df_classes["porcentaje"] = (df_classes["cantidad"] / len(y) * 100).round(1)
print(df_classes.to_string(index=False))
fig = px.bar(df_classes, x="clase", y="cantidad", color="clase",
             title="Distribucion de clases en Breast Cancer",
             labels={"clase": "Clase", "cantidad": "Muestras"})
fig.show()
# PASO 2: Estadisticas de las features y exploracion con histogramas.
# Comparar la distribucion de una feature entre clases revela si esa
# feature ayuda a separar maligno de benigno.
print("\n--- Estadisticas de las primeras 5 features ---")
for i in range(5):
    col = X[:, i]
    print(f"{feature_names[i]}: media={col.mean():.2f}, std={col.std():.2f}, "
          f"min={col.min():.2f}, max={col.max():.2f}")
df_plot = pd.DataFrame(X[:, [0, 1]], columns=["mean_radius", "mean_texture"])
df_plot["clase"] = data.target_names[y]
fig = px.histogram(df_plot, x="mean_radius", color="clase", nbins=20,
                   barmode="overlay", opacity=0.6,
                   title="Distribucion de mean radius por clase",
                   labels={"mean_radius": "mean radius", "clase": "Clase"})
fig.show()
# PASO 3: Scatter 2D de dos features coloreado por clase.
# Elegimos mean radius y mean texture: la separacion visible entre los
# puntos revela que estas features son utiles para el clasificador.
print("\nGraficando las features mean radius y mean texture por clase.")
fig = px.scatter(df_plot, x="mean_radius", y="mean_texture", color="clase",
                 title="Scatter 2D: mean radius vs mean texture",
                 labels={"mean_radius": "mean radius",
                         "mean_texture": "mean texture", "clase": "Clase"})
fig.show()
# PASO 4: Comparacion estadistica de features entre clases.
# La diferencia relativa de medias identifica las features mas
# discriminativas; las 4 mejores se visualizan con box plots.
mal_mean = X[y == 0].mean(axis=0)
ben_mean = X[y == 1].mean(axis=0)
differences = []
for i, name in enumerate(feature_names):
    pct = abs(mal_mean[i] - ben_mean[i]) / ben_mean[i] * 100
    differences.append((name, pct))
differences.sort(key=lambda t: t[1], reverse=True)
print("\nTop 4 features con mayor diferencia relativa:")
for name, pct in differences[:4]:
    print(f"  {name}: {pct:.1f}%")
top_names = [t[0] for t in differences[:4]]
df_box = pd.DataFrame(X, columns=feature_names)[top_names]
df_box["clase"] = data.target_names[y]
df_melt = df_box.melt(id_vars="clase", var_name="feature", value_name="valor")
fig = px.box(df_melt, x="feature", y="valor", color="clase",
             title="Top 4 features comparadas entre clases",
             labels={"feature": "Feature", "valor": "Valor", "clase": "Clase"})
fig.show()
# PASO 5: Reporte final del laboratorio.
print("\n--- REPORTE FINAL ---")
print("Las features con mayor diferencia entre clases son las mas discriminativas.")
print("Histogramas y box plots muestran clases con poca superposicion.")
print("Esa separacion es la base de lo que aprende un clasificador.")
```