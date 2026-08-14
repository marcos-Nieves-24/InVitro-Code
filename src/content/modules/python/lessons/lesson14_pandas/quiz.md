# Quiz: Pandas

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué es un DataFrame?
- A) Un array etiquetado 1D
- B) Una estructura de datos etiquetada 2D con filas y columnas
- C) Un tensor 3D
- D) Una lista de arrays de NumPy

**Q2:** ¿Cómo leés un archivo CSV en un DataFrame?
- A) `pd.load_csv()`
- B) `pd.read_csv()`
- C) `pd.csv_to_df()`
- D) `pd.import_csv()`

**Q3:** ¿Cuál es la diferencia entre `loc` e `iloc`?
- A) No hay diferencia
- B) `loc` usa etiquetas, `iloc` usa posiciones enteras
- C) `loc` usa posiciones enteras, `iloc` usa etiquetas
- D) `loc` funciona con columnas, `iloc` funciona con filas

**Q4:** ¿Cómo seleccionás las filas donde la columna "Age" > 30?
- A) `df[df["Age"] > 30]`
- B) `df[Age > 30]`
- C) `df.select("Age" > 30)`
- D) `df.filter("Age" > 30)`

**Q5:** ¿Qué método se usa para consultar las estadísticas de resumen de las columnas numéricas?
- A) `df.summary()`
- B) `df.info()`
- C) `df.describe()`
- D) `df.stats()`

## Respuesta corta (2 preguntas)

**Q6:** Explicá qué hace `groupby()` en Pandas.

**Q7:** ¿Qué es el encadenamiento de métodos y por qué es útil en Pandas?

## Pregunta de código

**Q8:** Escribí código de Pandas para: crear un DataFrame a partir de un diccionario con las columnas "Name" y "Score", y después agregar una columna nueva "Passed" que sea True si Score ≥ 60.

## Clave de respuestas

**Q1:** B) Una estructura de datos etiquetada 2D con filas y columnas

**Q2:** B) `pd.read_csv()`

**Q3:** B) `loc` usa etiquetas, `iloc` usa posiciones enteras

**Q4:** A) `df[df["Age"] > 30]`

**Q5:** C) `df.describe()`

**Q6:** `groupby()` divide el DataFrame en grupos según una o más columnas, aplica una función a cada grupo de forma independiente y combina los resultados. Implementa el patrón "split-apply-combine" para la agregación de datos. Por ejemplo, `df.groupby("Category")["Value"].mean()` calcula la media de Value para cada Category.

**Q7:** El encadenamiento de métodos es llamar varios métodos de forma secuencial sobre el mismo objeto, como `df.dropna().groupby("A").mean().reset_index()`. Es útil porque crea código legible y conciso que se lee como un pipeline de operaciones sin necesidad de variables intermedias.

**Q8:**
```python
import pandas as pd
df = pd.DataFrame({"Name": ["Alice", "Bob", "Charlie"], "Score": [85, 45, 72]})
df["Passed"] = df["Score"] >= 60
print(df)
```
