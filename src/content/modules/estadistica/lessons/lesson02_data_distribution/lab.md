```python
# =========================================================================
# LAB 2: Distribución de datos
# -------------------------------------------------------------------------
# Analizamos distribuciones sinteticas (normal, sesgada y bimodal) y
# columnas reales de diabetes con histogramas, boxplots y estadísticos
# de forma (skewness y curtosis). Cada figura termina con fig.show().
# =========================================================================

# PASO 1: Generar datos sinteticos: normal, sesgada y bimodal.
import numpy as np                         # Operaciones matemáticas
import pandas as pd                        # DataFrames y manipulación
import plotly.express as px                # Gráficos interactivos
from scipy.stats import skew, kurtosis  # Funciones estadísticas

np.random.seed(42)                         # Fijar semilla para reproducibilidad
normal = np.random.normal(100, 15, 2000)                       # simétrica
sesgada = np.random.exponential(10, 2000)                      # sesgo positivo
bimodal = np.concatenate([np.random.normal(40, 8, 1000),
                          np.random.normal(90, 8, 1000)])     # dos modas

print("Muestras generadas:", len(normal), len(sesgada), len(bimodal))

# PASO 2: Histogramas de las tres distribuciones.
print("\nHistogramas de cada distribución:")
for nombre, datos in [("Normal", normal), ("Sesgada", sesgada), ("Bimodal", bimodal)]:
    fig = px.histogram(datos, nbins=40, title=f"Distribución {nombre}")
    fig.show()                                 # Mostrar gráfico interactivo

# PASO 3: Boxplots para comparar forma y dispersión lado a lado.
print("\nBoxplots comparativos de las tres distribuciones:")
df_sintetico = pd.DataFrame({"Normal": normal, "Sesgada": sesgada, "Bimodal": bimodal})
fig = px.box(df_sintetico, title="Comparacion de distribuciones")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 4: Estadísticos de forma con scipy.stats.
for nombre, datos in [("Normal", normal), ("Sesgada", sesgada), ("Bimodal", bimodal)]:
    print(f"\n{nombre}: skew={skew(datos):.3f}, kurtosis={kurtosis(datos):.3f}")

# PASO 5: Analizar columnas reales del dataset de diabetes.
from sklearn.datasets import load_diabetes  # Cargar datasets de ejemplo

diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df["target"] = diabetes.target

for col in ["bmi", "bp"]:
    valores = df[col].dropna()
    print(f"\nColumna {col}: skew={skew(valores):.3f}, kurtosis={kurtosis(valores):.3f}")
    fig = px.histogram(df, x=col, nbins=40, title=f"Distribución de {col}")
    fig.show()                                 # Mostrar gráfico interactivo

# PASO 6: Función distribution_report(series).
# Devuelve un diccionario con medidas centrales, de dispersión y forma.
def distribution_report(series):
    s = pd.Series(series).dropna()
    return {
        "media": s.mean(),
        "mediana": s.median(),
        "std": s.std(),
        "min": s.min(),
        "max": s.max(),
        "skewness": skew(s),
        "kurtosis": kurtosis(s),
        "aproximadamente_normal": abs(skew(s)) < 0.5 and abs(kurtosis(s)) < 0.5,
    }

for nombre, datos in [("Normal", normal), ("Sesgada", sesgada), ("Bimodal", bimodal)]:
    print(f"\n{nombre}: {distribution_report(datos)}")

# PASO 7: Transformacion logaritmica de la distribución sesgada.
log_sesgada = np.log1p(sesgada)
print(f"\nSesgo antes: {skew(sesgada):.3f} -> despues de log1p: {skew(log_sesgada):.3f}")
fig = px.histogram(log_sesgada, nbins=40,
                   title="Distribución sesgada tras transformacion logaritmica")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("El histograma y el boxplot revelan la forma de la distribución.")
print("skew y kurtosis cuantifican la asimetría; log1p reduce el sesgo positivo.")
```