---
Module: 2
Lesson Number: 14
Lesson Title: Pandas
Estimated Duration: 90 minutos
Prerequisites: L13 — NumPy
Learning Objectives:
  - Crear y manipular objetos Series y DataFrame
  - Cargar datos desde archivos CSV usando read_csv()
  - Filtrar, seleccionar y subdividir datos usando indexación booleana
  - Usar groupby para agregación de datos
  - Combinar/unir múltiples DataFrames
  - Aplicar funciones a datos con apply() y map()
Keywords: Pandas, DataFrame, Series, groupby, merge, apply, read_csv
Difficulty: Beginner-Intermediate
Programming Concepts: Manipulación de datos, datos tabulares, agregación
Datasets Used: None (datos sintéticos)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Pandas

## Motivación

Pandas es la librería de Python más utilizada para manipulación y análisis de datos. Proporciona el DataFrame — una estructura de datos tabular con filas y columnas etiquetadas que hace intuitiva la limpieza, transformación y análisis de datos. En biotecnología, Pandas maneja datos de ensayos clínicos, tablas de expresión génica y registros de pacientes. En SaaS, procesa bases de datos de clientes, logs de transacciones y resultados de tests A/B. La mayor parte de tu tiempo como científico de datos la vas a pasar manipulando DataFrames.

## Panorama General

En la lección anterior aprendiste NumPy para cómputo numérico. Pandas está construido sobre NumPy y agrega ejes etiquetados, manejo de datos faltantes y operaciones de datos poderosas. Esta lección te prepara directamente para las lecciones de visualización (Matplotlib, Seaborn) y para todo Machine Learning (scikit-learn espera arrays de NumPy que vienen de DataFrames de Pandas).

## Teoría

### ¿Qué es Pandas?

Pandas provee dos estructuras de datos principales:

- **Series**: Array unidimensional etiquetado (como una columna)
- **DataFrame**: Estructura de datos bidimensional etiquetada (como una planilla de cálculo)

### Creando DataFrames

```python
import pandas as pd

# Desde diccionario
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "Salary": [50000, 60000, 70000]
})

# Desde lista de diccionarios
df = pd.DataFrame([
    {"Name": "Alice", "Age": 25},
    {"Name": "Bob", "Age": 30}
])

# Desde array NumPy
df = pd.DataFrame(np.random.randn(5, 3),
                  columns=["A", "B", "C"])
```

### Leyendo Datos

```python
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")
df = pd.read_json("data.json")
```

### Operaciones Básicas

```python
df.head(10)        # Primeras 10 filas
df.tail(5)         # Últimas 5 filas
df.info()          # Tipos de columna, conteos no nulos
df.describe()      # Estadísticas de resumen
df.columns         # Nombres de columnas
df.index           # Etiquetas de filas
df.shape           # (filas, columnas)
df.dtypes          # Tipos de datos de columnas
```

### Seleccionando Datos

```python
# Selección de columna
df["Name"]         # Series
df[["Name", "Age"]]  # DataFrame

# Selección de fila (por etiqueta)
df.loc[0]          # Fila por etiqueta

# Selección de fila (por posición)
df.iloc[0]         # Fila por posición

# Indexación booleana
df[df["Age"] > 30]
```

### Agregar/Eliminar Columnas

```python
df["NewColumn"] = values
df.drop("OldColumn", axis=1, inplace=True)
```

### Operaciones GroupBy

```python
df.groupby("Category")["Value"].mean()
df.groupby("Category").agg({"Value": ["mean", "std"]})
```

### Combinando DataFrames

```python
pd.merge(df1, df2, on="key")
pd.merge(df1, df2, left_on="id1", right_on="id2")
pd.concat([df1, df2], axis=0)  # Apilar filas
```

### Aplicar Funciones

```python
df["Column"].apply(lambda x: x ** 2)
df["Column"].map({"old": "new"})
```

## Explicación Visual

```
Estructura del DataFrame

       Columnas →
       Name    Age  Salary
Fila 0  Alice   25   50000
  ↓ 1  Bob     30   60000
    2  Charlie 35   70000

     Cada columna es una Series
     Cada fila es un registro
     Ejes etiquetados para acceso intuitivo
```

## Implementación en Python

```python
import pandas as pd
import numpy as np

# Crear DataFrame desde diccionario
data = {
    "Gene": ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"],
    "Expression": [2.5, -1.2, 3.8, 0.9, -2.1],
    "P_Value": [0.001, 0.08, 0.003, 0.45, 0.02],
    "Chromosome": [17, 17, 7, 8, 12]
}
df = pd.DataFrame(data)
print(df)
```

```python
# Exploración básica
print(df.head())
print(df.info())
print(df.describe())
print(df["Expression"].mean())
print(df[df["P_Value"] < 0.05])
```

```python
# Agregando columnas calculadas
df["Significant"] = df["P_Value"] < 0.05
df["Abs_Expression"] = df["Expression"].abs()
print(df)
```

```python
# Agregación con GroupBy
# Crear datos de ventas de ejemplo
sales = pd.DataFrame({
    "Product": ["A", "B", "A", "C", "B", "A"],
    "Region": ["North", "South", "South", "North", "North", "South"],
    "Revenue": [100, 200, 150, 300, 250, 120]
})

print(sales.groupby("Product")["Revenue"].sum())
print(sales.groupby(["Product", "Region"])["Revenue"].mean())
```

```python
# Combinando DataFrames
customers = pd.DataFrame({
    "CustomerID": [1, 2, 3],
    "Name": ["Alice", "Bob", "Charlie"]
})
orders = pd.DataFrame({
    "OrderID": [101, 102, 103],
    "CustomerID": [1, 1, 3],
    "Amount": [50, 75, 100]
})

merged = pd.merge(customers, orders, on="CustomerID")
print(merged)
```

```python
# Aplicar funciones
df["Expression_Rounded"] = df["Expression"].apply(lambda x: round(x, 1))
print(df)
```

## Ejemplo de Biotecnología

**Escenario**: Analizando datos de ensayos clínicos.

```python
import pandas as pd
import numpy as np

# Simular datos de ensayo clínico
np.random.seed(42)
n_patients = 100

clinical = pd.DataFrame({
    "PatientID": [f"P-{i:04d}" for i in range(1, n_patients + 1)],
    "Age": np.random.randint(18, 85, n_patients),
    "Sex": np.random.choice(["M", "F"], n_patients),
    "Treatment": np.random.choice(["Drug", "Placebo"], n_patients),
    "Biomarker_Level": np.random.randn(n_patients) * 2 + 5,
    "Response": np.random.choice(["Responder", "Non-responder"], n_patients, p=[0.6, 0.4]),
    "Survival_Months": np.random.exponential(24, n_patients).astype(int)
})

print(clinical.head())
print(clinical.info())

# Análisis
print("\nGrupos de tratamiento:")
print(clinical.groupby("Treatment")["Survival_Months"].mean())

print("\nRespuesta por sexo:")
print(clinical.groupby("Sex")["Response"].value_counts())

# Análisis de biomarcador
high_biomarker = clinical[clinical["Biomarker_Level"] > 5]
print(f"\nPacientes con biomarcador alto: {len(high_biomarker)}")

# Grupos etarios
clinical["Age_Group"] = pd.cut(clinical["Age"], bins=[0, 30, 50, 65, 100],
                                labels=["<30", "30-50", "51-65", ">65"])
print("\nSupervivencia por grupo etario:")
print(clinical.groupby("Age_Group")["Survival_Months"].agg(["mean", "std", "count"]))
```

## Ejemplo SaaS

**Escenario**: Analizando datos de churn de clientes.

```python
import pandas as pd
import numpy as np

# Simular datos de clientes
np.random.seed(42)
n_customers = 200

customers = pd.DataFrame({
    "CustomerID": range(1, n_customers + 1),
    "Tenure_Months": np.random.randint(1, 60, n_customers),
    "Monthly_Spend": np.random.uniform(10, 200, n_customers).round(2),
    "Support_Tickets": np.random.poisson(0.5, n_customers),
    "Subscription": np.random.choice(["Basic", "Pro", "Enterprise"], n_customers,
                                      p=[0.5, 0.3, 0.2]),
    "Churned": np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

print(customers.head())

# Análisis de churn
print("\nTasa de churn por suscripción:")
print(customers.groupby("Subscription")["Churned"].mean().round(3))

print("\nGasto promedio (churned vs activo):")
print(customers.groupby("Churned")["Monthly_Spend"].mean())

# Segmento de alto riesgo
high_risk = customers[(customers["Support_Tickets"] > 3) &
                       (customers["Tenure_Months"] < 12)]
print(f"\nClientes de alto riesgo: {len(high_risk)}")
```

## Errores Comunes

1. **Encadenar `[]` en lugar de `loc`**: `df["A"][0]` funciona pero genera advertencia. Usá `df.loc[0, "A"]`
2. **Modificar una vista vs copia**: `SettingWithCopyWarning` — usá `.copy()` explícitamente
3. **Olvidar el parámetro `axis=`**: `drop("col")` usa axis=0 por defecto (filas). Usá `axis=1` para columnas
4. **Operaciones inplace**: Muchos métodos tienen `inplace=True`, pero el encadenamiento suele ser más limpio
5. **Combinar sin especificar clave**: Puede crear un producto cartesiano

## Buenas Prácticas

- Usá `loc` e `iloc` para selección explícita
- Usá `query()` para filtrado complejo
- Usá encadenamiento de métodos para legibilidad
- Usá `pd.cut()` y `pd.qcut()` para discretización
- Usá `to_datetime()` para columnas de fecha
- Perfilá el rendimiento: las operaciones vectorizadas son más rápidas que `apply()`

## Resumen

- Pandas provee Series (1D) y DataFrame (2D) para análisis de datos
- Leé datos con `read_csv()`, explorá con `head()`, `info()`, `describe()`
- Seleccioná datos con `loc`, `iloc`, indexación booleana
- Agrupá y agregá con `groupby()` y `agg()`
- Combiná DataFrames con `merge()` y `concat()`
- Aplicá funciones con `apply()` y `map()`

## Términos Clave

- **DataFrame**: Estructura de datos 2D etiquetada (filas × columnas)
- **Series**: Array 1D etiquetado (columna individual)
- **Índice**: Etiquetas de filas (default: 0, 1, 2...)
- **GroupBy**: Operaciones de dividir-aplicar-combinar
- **Merge**: Combinar DataFrames sobre columnas comunes
- **Tabla dinámica**: Agregación multidimensional
- **Indexación booleana**: Filtrado con condiciones True/False
- **Encadenamiento de métodos**: Aplicar múltiples operaciones secuencialmente

## Ejercicios

### Nivel 1: Básico

1. ¿Cómo leés un archivo CSV en un DataFrame?
2. ¿Cuál es la diferencia entre `loc` e `iloc`?
3. ¿Cómo verificás si hay valores faltantes en un DataFrame?

### Nivel 2: Implementación

4. Cargá un CSV y calculá la media de cada columna numérica agrupada por una columna categórica.
5. Dado un DataFrame con datos de clientes, creá una nueva columna "Segment" que etiquete clientes como "High Value" (gasto > 100) o "Standard" (caso contrario).

### Nivel 3: Pensamiento Crítico

6. Compará y contrastá el rendimiento de `apply()` vs operaciones vectorizadas en Pandas. ¿Cuándo necesitarías usar `apply()`?
7. ¿Cómo manejarías valores faltantes en un dataset? Compará `dropna()`, `fillna()` y métodos de interpolación.

## Desafío de Código

Creá un **análisis de segmentación de clientes** usando Pandas:

1. Generá un dataset sintético con 500 clientes, incluyendo características: `age`, `income`, `spending_score`, `purchase_frequency`, `last_purchase_days`
2. Limpiá los datos (manejá valores faltantes, eliminá outliers)
3. Creá segmentos:
   - Por grupo etario (Young/Middle/Senior)
   - Por valor (Low/Medium/High spender basado en percentiles de spending_score)
   - Por recencia (Active/At Risk/Lost basado en last_purchase_days)
4. Analizá cada segmento: calculá ingreso promedio, gasto y frecuencia de compra
5. Encontrá el top 10% de clientes por un puntaje compuesto (20% income + 50% spending_score + 30% purchase_frequency, normalizado)
6. Generá un reporte resumen con todos los hallazgos
