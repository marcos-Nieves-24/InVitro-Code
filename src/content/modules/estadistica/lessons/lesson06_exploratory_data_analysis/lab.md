```python
# =========================================================================
# LAB 6: Análisis exploratorio de datos (EDA)
# -------------------------------------------------------------------------
# Exploramos el dataset de diabetes: vista general, valores faltantes,
# distribuciones univariadas, relaciones multivariadas y outliers.
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Cargar datos y vista general.
import numpy as np                         # Operaciones matemáticas
import pandas as pd                        # DataFrames y manipulación
import plotly.express as px                # Gráficos interactivos
from sklearn.datasets import load_diabetes  # Cargar datasets de ejemplo

diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df["target"] = diabetes.target

print("Dimensiones:", df.shape)
print("Columnas:", list(df.columns))
print(df.head())

# PASO 2: Valores faltantes (sinteticos para practicar el manejo).
# Simulamos datos faltantes al azar en dos columnas, como en datasets reales.
np.random.seed(1)
df_eda = df.copy()
mascara = np.random.rand(df_eda.shape[0]) < 0.05
df_eda.loc[mascara, "bmi"] = np.nan
mascara = np.random.rand(df_eda.shape[0]) < 0.05
df_eda.loc[mascara, "bp"] = np.nan

faltantes = df_eda.isna().sum()
print("\nValores faltantes por columna:")
print(faltantes)
print("Porcentaje:\n", (faltantes / len(df_eda) * 100).round(2))

# PASO 3: Manejo de valores faltantes con la mediana.
# La mediana es robusta ante valores atípicos y no distorsiona la escala.
df_eda["bmi"] = df_eda["bmi"].fillna(df_eda["bmi"].median())
df_eda["bp"] = df_eda["bp"].fillna(df_eda["bp"].median())
print("\nFaltantes tras imputacion:", int(df_eda.isna().sum().sum()))

# PASO 4: Resumen estadístico univariado.
print("\ndescribe():\n", df_eda.describe().round(3))

# PASO 5: Histogramas de las distribuciones de cada feature.
print("\nHistogramas por feature:")
for col in ["age", "bmi", "bp", "target"]:
    fig = px.histogram(df_eda, x=col, nbins=30, title=f"Distribución de {col}")
    fig.show()                                 # Mostrar gráfico interactivo

# PASO 6: Matriz de dispersión entre columnas seleccionadas.
print("\nMatriz de dispersión:")
sel = ["age", "bmi", "bp", "target"]
fig = px.scatter_matrix(df_eda, dimensions=sel,
                        title="Matriz de dispersión (diabetes)")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 7: Matriz de correlación con heatmap.
print("\nHeatmap de correlaciones:")
corr = df_eda.select_dtypes(include=[np.number]).corr()
fig = px.imshow(corr, text_auto=".2f", color_continuous_scale="RdBu_r",
                title="Matriz de correlación de Pearson")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 8: Valores atípicos con la regla del RIQ.
for col in ["bmi", "bp", "target"]:
    q1 = df_eda[col].quantile(0.25)
    q3 = df_eda[col].quantile(0.75)
    iqr = q3 - q1
    n_out = int(((df_eda[col] < q1 - 1.5 * iqr) | (df_eda[col] > q3 + 1.5 * iqr)).sum())
    print(f"\nColumna {col}: {n_out} valores atípicos (regla del RIQ)")

fig = px.box(df_eda, y="target", title="Boxplot del target")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 9: Hallazgos clave del EDA.
print("\n--- Hallazgos del EDA ---")
print("Las features de diabetes estan normalizadas (medias ~0, std ~1).")
print("El target correlaciona más con bmi y bp que con age.")
print("La imputacion con mediana dejo el dataset sin valores faltantes.")
```