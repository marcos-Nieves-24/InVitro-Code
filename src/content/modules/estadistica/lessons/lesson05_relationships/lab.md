```python
# =========================================================================
# LAB 5: Relaciones entre variables
# -------------------------------------------------------------------------
# Calculamos covarianza y correlaciones de Pearson y Spearman, aplicamos
# una regresion OLS manual y analizamos el cuarteto de Anscombe (datos muy
# distintos con la misma correlacion). Cada figura termina con fig.show().
# =========================================================================

# PASO 1: Cuarteto de Anscombe embebido (4 series clasicas de 11 puntos).
import numpy as np
import pandas as pd
import plotly.express as px
from scipy.stats import pearsonr, spearmanr

x_ans = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5]
anscombe = [
    (x_ans, [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]),
    (x_ans, [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74]),
    (x_ans, [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]),
    ([8]*10 + [19], [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89]),
]

rows = []
for i, (x, y) in enumerate(anscombe, start=1):
    for xi, yi in zip(x, y):
        rows.append({"serie": f"Grupo {i}", "x": xi, "y": yi})
df = pd.DataFrame(rows)
print("Cuarteto de Anscombe cargado:", df.shape)

# PASO 2: Correlaciones de Pearson para cada grupo.
for i, (x, y) in enumerate(anscombe, start=1):
    r, p = pearsonr(x, y)
    print(f"\nGrupo {i}: r de Pearson = {r:.3f} (p={p:.3f})")

# PASO 3: Scatter de cada grupo con la recta OLS superpuesta.
# OLS manual: la pendiente minimiza el error cuadratico medio de la recta.
print("\nScatter de cada grupo con su recta OLS:")
for i, (x, y) in enumerate(anscombe, start=1):
    pendiente, intercepto = np.polyfit(x, y, 1)
    fig = px.scatter(df[df.serie == f"Grupo {i}"], x="x", y="y",
                     title=f"Grupo {i}: y = {pendiente:.2f}x + {intercepto:.2f}")
    x_linea = np.linspace(min(x), max(x), 50)
    fig.add_scatter(x=x_linea, y=pendiente * x_linea + intercepto,
                    mode="lines", name="OLS")
    fig.show()

# PASO 4: Covarianza y correlaciones sobre el dataset de diabetes.
from sklearn.datasets import load_diabetes

diabetes = load_diabetes(as_frame=True)
dfd = diabetes.data
dfd["target"] = diabetes.target

print("\nCovarianza bmi-target:\n", dfd[["bmi", "target"]].cov())

# PASO 5: Comparar Pearson vs Spearman en pares seleccionados.
print("\nPearson y Spearman para pares seleccionados:")
for a in ["age", "bmi", "bp"]:
    r_p, _ = pearsonr(dfd[a], dfd["target"])
    r_s, _ = spearmanr(dfd[a], dfd["target"])
    print(f"  {a}-target: Pearson={r_p:.3f}, Spearman={r_s:.3f}")

# PASO 6: Heatmap de la matriz de correlacion de Pearson.
print("\nHeatmap de la matriz de correlacion de Pearson:")
corr_pearson = dfd.select_dtypes(include=[np.number]).corr(method="pearson")
fig = px.imshow(corr_pearson, text_auto=".2f", color_continuous_scale="RdBu_r",
                title="Matriz de correlacion de Pearson (diabetes)")
fig.show()

# PASO 7: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Las 4 series de Anscombe tienen casi el mismo r, pero son muy distintas.")
print("Pearson mide linealidad; Spearman mide monotonia; correlacion no es causalidad.")
```