```python
# =========================================================================
# LAB 1: Estadística descriptiva con el dataset de diabetes
# -------------------------------------------------------------------------
# Calculamos medidas de tendencia central y dispersión, detectamos valores
# atípicos con la regla del RIQ y construimos una función summarize().
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Cargar el dataset de diabetes de sklearn.
# load_diabetes devuelve los datos y el target listos para analizar.
import numpy as np                         # Operaciones matemáticas
import pandas as pd                        # DataFrames y manipulación
import plotly.express as px                # Gráficos interactivos
from sklearn.datasets import load_diabetes  # Cargar datasets de ejemplo

diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df["target"] = diabetes.target

print(df.head())
print(df.info())

# PASO 2: Tendencia central y dispersión con describe().
# describe() resume media, desvio, minimo, cuartiles y maximo por columna.
print("\nResumen descriptivo:")
print(df.describe())

# PASO 3: Varianza, desviación estandar y rango por columna.
varianza = df.var(numeric_only=True)
desvio = df.std(numeric_only=True)
rango = df.max(numeric_only=True) - df.min(numeric_only=True)
print("\nVarianza:\n", varianza)
print("\nDesvio estandar:\n", desvio)
print("\nRango:\n", rango)

# PASO 4: RIQ y deteccion de valores atípicos en la columna bmi.
# Regla del RIQ: un valor es atípico si queda fuera de
# [Q1 - 1.5*RIQ, Q3 + 1.5*RIQ].
col = "bmi"
q1 = df[col].quantile(0.25)
q3 = df[col].quantile(0.75)
iqr = q3 - q1
lim_inf = q1 - 1.5 * iqr
lim_sup = q3 + 1.5 * iqr
atípicos = df[(df[col] < lim_inf) | (df[col] > lim_sup)]
print(f"\nQ1={q1:.3f}, Q3={q3:.3f}, RIQ={iqr:.3f}")
print(f"Limites: [{lim_inf:.3f}, {lim_sup:.3f}]")
print(f"Cantidad de valores atípicos en bmi: {len(atípicos)}")

# PASO 5: Boxplot del bmi para visualizar los valores atípicos.
print(f"\nBoxplot del bmi con {len(atípicos)} valores atípicos:") 
fig = px.box(df, y=col, title="Boxplot del indice de masa corporal (bmi)")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 6: Histograma del bmi con la media y la mediana marcadas.
print("\nHistograma del bmi con la media y la mediana marcadas:")
media = df[col].mean()
mediana = df[col].median()
fig = px.histogram(df, x=col, nbins=30, title="Distribución del bmi")
fig.add_vline(x=media, line_dash="dash", line_color="red", annotation_text="media")
fig.add_vline(x=mediana, line_dash="dot", line_color="green", annotation_text="mediana")
fig.show()                                 # Mostrar gráfico interactivo

# PASO 7: Función summarize(df) que resume cada columna numerica.
# Devuelve media, mediana, desvio, minimo, maximo, cuartiles, RIQ y
# la cantidad de valores atípicos detectados con la regla del RIQ.
def summarize(df):
    registros = []
    for c in df.select_dtypes(include=[np.number]).columns:
        q1 = df[c].quantile(0.25)
        q3 = df[c].quantile(0.75)
        iqr = q3 - q1
        lim_inf = q1 - 1.5 * iqr
        lim_sup = q3 + 1.5 * iqr
        n_atip = int(((df[c] < lim_inf) | (df[c] > lim_sup)).sum())
        registros.append({
            "columna": c,
            "media": df[c].mean(),
            "mediana": df[c].median(),
            "std": df[c].std(),
            "min": df[c].min(),
            "max": df[c].max(),
            "q1": q1,
            "q3": q3,
            "riq": iqr,
            "atípicos": n_atip,
        })
    return pd.DataFrame(registros)

resumen = summarize(df)
print("\nInforme resumido por columna:")
print(resumen.to_string(index=False))

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("La regla del RIQ detecta valores atípicos por columna.")
print("El boxplot y el histograma muestran forma y dispersión de los datos.")
```