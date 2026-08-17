```python
# =========================================================================
# LAB 14: Manipulacion de datos con Pandas
# -------------------------------------------------------------------------
# Practicamos la creacion de DataFrames, la exploracion de datos, el
# filtrado, el groupby, la fusion (merge) y la aplicacion de funciones.
# =========================================================================

# PASO 1: Creacion de DataFrames.
# Pandas organiza datos tabulares en DataFrames (filas x columnas).
import pandas as pd
import numpy as np

# Desde un diccionario: cada clave es una columna.
df1 = pd.DataFrame({
    "Product": ["A", "B", "C", "D"],
    "Price": [10, 20, 15, 25],
    "Quantity": [100, 150, 120, 80]
})
print("Desde un diccionario:")
print(df1)

# Desde una lista de diccionarios: cada diccionario es una fila.
df2 = pd.DataFrame([
    {"City": "NY", "Temp": 72},
    {"City": "LA", "Temp": 85},
    {"City": "CHI", "Temp": 65},
])
print("\nDesde una lista de diccionarios:")
print(df2)

# PASO 2: Exploracion de datos.
# Generamos datos de muestra reproducibles con una semilla fija.
np.random.seed(42)
df = pd.DataFrame({
    "Category": np.random.choice(["A", "B", "C"], 50),
    "Value": np.random.randn(50) * 10 + 50,
    "Score": np.random.randint(0, 100, 50),
})

print("\nPrimeras 5 filas:")
print(df.head())
print("\nResumen estadistico:")
print(df.describe().round(2))

# PASO 3: Filtrado y seleccion.
# Combinamos condiciones con & (y) sobre los datos.
high_score = df[df["Score"] > 70]
category_a = df[df["Category"] == "A"]
high_value = df[(df["Value"] > 50) & (df["Score"] > 60)]

print(f"\nPuntaje alto (>70): {len(high_score)} filas")
print(f"Categoria A: {len(category_a)} filas")
print(f"Valor alto + puntaje alto: {len(high_value)} filas")

# PASO 4: GroupBy.
# Agrupamos por categoria y agregamos con funciones de estadistica.
grouped = df.groupby("Category")
print("\nMedia por categoria:")
print(grouped[["Value", "Score"]].mean().round(2))

print("\nAgregaciones multiples:")
print(grouped.agg({
    "Value": ["mean", "std", "count"],
    "Score": ["min", "max"]
}).round(2))

# PASO 5: Fusion (merge).
# Combinamos dos tablas sobre una clave comun, como en SQL.
left = pd.DataFrame({"ID": [1, 2, 3], "Name": ["A", "B", "C"]})
right = pd.DataFrame({"ID": [1, 2, 4], "Score": [95, 87, 92]})

merged = pd.merge(left, right, on="ID", how="left")
print("\nMerge izquierdo (left):")
print(merged)

# PASO 6: Aplicacion de funciones.
# apply() aplica una funcion (o lambda) a cada valor de una columna.
df["Value_Rounded"] = df["Value"].apply(lambda x: round(x, 1))
df["Score_Group"] = df["Score"].apply(
    lambda x: "High" if x >= 70 else ("Medium" if x >= 40 else "Low")
)
print("\nDatos transformados (primeras 10 filas):")
print(df.head(10))

# PASO 7: Visualizacion con Plotly (grafico de barras por categoria).
# Plotly se carga bajo demanda en Pyodide. Graficamos el valor medio de
# cada categoria: el codigo termina con fig.show() para que la consola
# de visualizacion capture la figura.
import plotly.express as px

means = df.groupby("Category")["Value"].mean().reset_index()
fig = px.bar(means, x="Category", y="Value", color="Category",
             title="Valor medio por categoria",
             labels={"Value": "Valor medio", "Category": "Categoria"})
fig.show()

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Creamos DataFrames desde diccionarios y listas.")
print("Filtramos con condiciones booleanas y agrupamos con groupby.")
print("Fusionamos tablas con merge y transformamos columnas con apply.")
```