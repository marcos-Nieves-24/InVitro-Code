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

<Section number={1} title="¿Por qué Pandas?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Pandas es la librería de Python más usada para manipular y analizar datos tabulares.",
    "Su estructura central, el DataFrame, es como una planilla con filas y columnas etiquetadas.",
    "En biotecnología maneja ensayos clínicos, expresión génica y registros de pacientes.",
    "En SaaS procesa clientes, logs de transacciones y resultados A/B.",
    "La mayor parte de tu tiempo como científico de datos la vas a pasar transformando DataFrames.",
  ]}
/>

<ConceptCard variant="key-idea">
Pandas está construido sobre NumPy y agrega ejes etiquetados, manejo de datos faltantes y operaciones de datos poderosas. Esta lección te prepara directamente para las lecciones de visualización (Matplotlib, Seaborn) y para todo Machine Learning (scikit-learn espera arrays NumPy que vienen de DataFrames de Pandas).
</ConceptCard>

- En la lección anterior aprendiste NumPy para cómputo numérico.
- Pandas extiende NumPy con índices y columnas con nombre.
- Dependerás de DataFrames hasta el cierre de cada pipeline de ML.

</RevealSequence>
</Section>

<Section number={2} title="Estructuras de Datos en Pandas" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Pandas ofrece dos estructuras: Series (una columna) y DataFrame (la tabla completa).",
    "Aprender su anatomía antes de operar evita la mayoría de los errores de código.",
    "Casi todo lo demás son métodos sobre estas estructuras.",
  ]}
/>

<ConceptCard variant="definition">
**Series**: array unidimensional etiquetado (equivalente a una columna). **DataFrame**: estructura bidimensional etiquetada estilo planilla de cálculo (filas × columnas).
</ConceptCard>

**Creando DataFrames**

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

**Leyendo Datos**

```python
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")
df = pd.read_json("data.json")
```

**Estructura del DataFrame** (candidato a player visual):

```text
Estructura del DataFrame

       Columnas →
       Name    Age  Salary
Fila 0  Alice   25   50000
  ↓  1  Bob     30   60000
     2  Charlie 35   70000

     Cada columna es una Series
     Cada fila es un registro
     Ejes etiquetados para acceso intuitivo
```

</RevealSequence>
</Section>

<Section number={3} title="Selección y Manipulación de Datos" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Seleccionar datos es el 80% del trabajo con Pandas: .loc por etiqueta, .iloc por posición y filtros booleanos.",
    "Confundir filas con columnas o etiquetas con posiciones es el error inicial más común.",
    "Ver la tabla de descriptivos antes de filtrar te ahorra horas.",
  ]}
/>

**Operaciones Básicas**

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

**Seleccionando Datos**

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

**Agregar/Eliminar Columnas**

```python
df["NewColumn"] = values
df.drop("OldColumn", axis=1, inplace=True)
```

</RevealSequence>
</Section>

<Section number={4} title="GroupBy, Merge y Apply" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "GroupBy implementa el patrón dividir-aplicar-combinar: agrupa, calcula, recombina.",
    "Merge y concat unen tablas como en SQL o Excel, pero tipado y reproducible.",
    "Apply y map aplican funciones por elemento o por columna; úsalos cuando la vectorización no alcanza.",
  ]}
/>

**Operaciones GroupBy**

```python
df.groupby("Category")["Value"].mean()
df.groupby("Category").agg({"Value": ["mean", "std"]})
```

**Combinando DataFrames**

```python
pd.merge(df1, df2, on="key")
pd.merge(df1, df2, left_on="id1", right_on="id2")
pd.concat([df1, df2], axis=0)  # Apilar filas
```

**Aplicar Funciones**

```python
df["Column"].apply(lambda x: x ** 2)
df["Column"].map({"old": "new"})
```

</RevealSequence>
</Section>

<Section number={5} title="Implementación en Python" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Creación, exploración y agregación con datos reales de laboratorio.",
    "Ejecuta cada bloque y verifica con .head(), .info() y .describe() antes de avanzar.",
    "El hábito de Pandas: inspecciona la tabla antes de transformarla.",
  ]}
/>

<ConceptCard variant="key-idea">
Inspeccionar shape y dtypes antes de operar es el print-debug de Pandas; barato y evita la mayoría de los errores de unión o filtrado.
</ConceptCard>

**Creación de DataFrame y exploración**

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

</RevealSequence>
</Section>

<Section number={6} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Dos casos end to end: ensayo clínico con groupby y segmentación de clientes con churn.",
    "Ambos repiten el mismo ciclo: crear, explorar, filtrar, agregar y derivar columnas.",
    "Fíjate en pd.cut y en el filtrado booleano compuesto con &.",
  ]}
/>

**Escenario biotecnología** — analizando datos de ensayos clínicos:

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

**Escenario SaaS** — analizando datos de churn de clientes:

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

</RevealSequence>
</Section>

<Section number={7} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Casi todos los bugs en Pandas vienen de encadenar índices, copias vs vistas y merges mal definidos.",
    "El encadenamiento de métodos es más legible, pero exige entender el orden de ejecución.",
    "Prefiere vectorización antes que apply() cuando la operación lo permita.",
  ]}
/>

**Errores comunes**

- **Encadenar `[]` en lugar de `loc`**: `df["A"][0]` funciona pero genera advertencia. Usa `df.loc[0, "A"]`
- **Modificar una vista vs copia**: `SettingWithCopyWarning` — usa `.copy()` explícitamente
- **Olvidar el parámetro `axis=`**: `drop("col")` usa axis=0 por defecto (filas). Usa `axis=1` para columnas
- **Operaciones inplace**: muchos métodos tienen `inplace=True`, pero el encadenamiento suele ser más limpio
- **Combinar sin especificar clave**: puede crear un producto cartesiano

**Buenas prácticas**

- Usa `loc` e `iloc` para selección explícita
- Usa `query()` para filtrado complejo
- Usa encadenamiento de métodos para legibilidad
- Usa `pd.cut()` y `pd.qcut()` para discretización
- Usa `to_datetime()` para columnas de fecha
- Perfila el rendimiento: las operaciones vectorizadas son más rápidas que `apply()`

</RevealSequence>
</Section>

<Section number={8} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Pandas es el paso de entrada a cualquier análisis de datos en Python.",
    "Series y DataFrame, loc/iloc, booleanos, groupby, merge y apply cubren el 90% de los casos.",
    "La próxima lección visualiza estos resultados con Matplotlib y Seaborn.",
  ]}
/>

- Pandas provee Series (1D) y DataFrame (2D) para análisis de datos
- Lee datos con `read_csv()`, explora con `head()`, `info()`, `describe()`
- Selecciona datos con `loc`, `iloc`, indexación booleana
- Agrupa y agrega con `groupby()` y `agg()`
- Combina DataFrames con `merge()` y `concat()`
- Aplica funciones con `apply()` y `map()`

**Términos clave**

- **DataFrame**: estructura de datos 2D etiquetada (filas × columnas)
- **Series**: array 1D etiquetado (columna individual)
- **Índice**: etiquetas de filas (default: 0, 1, 2...)
- **GroupBy**: operaciones de dividir-aplicar-combinar
- **Merge**: combinar DataFrames sobre columnas comunes
- **Tabla dinámica**: agregación multidimensional
- **Indexación booleana**: filtrado con condiciones True/False
- **Encadenamiento de métodos**: aplicar múltiples operaciones secuencialmente

</RevealSequence>
</Section>

<Section number={9} title="Evaluación" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

**Ejercicios**

Nivel 1 — Básico:
1. ¿Cómo lees un archivo CSV en un DataFrame?
2. ¿Cuál es la diferencia entre `loc` e `iloc`?
3. ¿Cómo verificas si hay valores faltantes en un DataFrame?

Nivel 2 — Implementación:
4. Carga un CSV y calcula la media de cada columna numérica agrupada por una columna categórica.
5. Dado un DataFrame con datos de clientes, crea una nueva columna "Segment" que etiquete clientes como "High Value" (gasto > 100) o "Standard" (caso contrario).

Nivel 3 — Pensamiento Crítico:
6. Compara y contrasta el rendimiento de `apply()` vs operaciones vectorizadas en Pandas. ¿Cuándo necesitarías usar `apply()`?
7. ¿Cómo manejarías valores faltantes en un dataset? Compara `dropna()`, `fillna()` y métodos de interpolación.

**Desafío de Código**

Crea un **análisis de segmentación de clientes** usando Pandas:
1. Genera un dataset sintético con 500 clientes, incluyendo características: `age`, `income`, `spending_score`, `purchase_frequency`, `last_purchase_days`
2. Limpia los datos (maneja valores faltantes, elimina outliers)
3. Crea segmentos (por grupo etario, por valor, por recencia)
4. Analiza cada segmento (ingreso promedio, gasto y frecuencia de compra)
5. Encuentra el top 10% de clientes por un puntaje compuesto
6. Genera un reporte resumen con todos los hallazgos

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Qué devuelve df.loc[0, 'Age']?"
  moduleSlug="python"
  lessonSlug="lesson14_pandas"
  blockId="choice-python-l14-tema-1"
  allowContinueOnIncorrect
  explanation="`.loc` selecciona por etiqueta de fila y nombre de columna; devuelve el valor de 'Age' en la fila con etiqueta 0."
  options={[
    { id: "a", label: "La fila completa con índice 0", correct: false, feedback: "Eso sería df.loc[0] sin columna." },
    { id: "b", label: "El valor de 'Age' en la fila etiquetada 0", correct: true, feedback: "¡Correcto! loc usa etiquetas." },
    { id: "c", label: "La columna 'Age' completa", correct: false, feedback: "Eso sería df['Age']." },
    { id: "d", label: "Error: loc no acepta dos argumentos", correct: false, feedback: "loc acepta (fila, columna)." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es el propósito de groupby() en Pandas?"
  moduleSlug="python"
  lessonSlug="lesson14_pandas"
  blockId="choice-python-l14-tema-2"
  allowContinueOnIncorrect
  explanation="groupby() divide las filas en grupos y permite aplicar agregaciones como mean o sum a cada grupo."
  options={[
    { id: "a", label: "Ordenar el DataFrame por una columna", correct: false, feedback: "Para ordenar se usa sort_values()." },
    { id: "b", label: "Dividir filas en grupos y agregar cada grupo", correct: true, feedback: "¡Exacto! Es el patrón split-apply-combine." },
    { id: "c", label: "Eliminar filas duplicadas", correct: false, feedback: "Para eso se usa drop_duplicates()." },
    { id: "d", label: "Combinar dos DataFrames", correct: false, feedback: "Para eso se usa merge() o concat()." },
  ]}
/>

</RevealSequence>
</Section>