---
Module: 2
Lesson Number: 13
Lesson Title: NumPy
Estimated Duration: 90 minutos
Prerequisites: L9-L12 — Listas, Tuplas, Diccionarios, Conjuntos
Learning Objectives:
  - Crear arrays de NumPy desde listas de Python y con funciones incorporadas
  - Acceder y modificar elementos de arrays usando indexación y slicing
  - Realizar operaciones elemento a elemento con funciones universales
  - Usar broadcasting para operar sobre arrays de diferentes formas
  - Realizar operaciones básicas de álgebra lineal
Keywords: NumPy, array, ndarray, broadcasting, función universal, álgebra lineal
Difficulty: Beginner-Intermediate
Programming Concepts: Cómputo con arrays, vectorización, broadcasting, álgebra lineal
Mathematical Concepts: Operaciones con matrices, broadcasting, álgebra lineal
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# NumPy

## Motivación

NumPy (Numerical Python) es la base del cómputo científico en Python. Proporciona un objeto array multidimensional de alto rendimiento y herramientas para trabajar con estos arrays. La mayoría de las librerías de ciencia de datos (Pandas, scikit-learn, TensorFlow) están construidas sobre NumPy. En biotecnología, los arrays de NumPy representan matrices de expresión génica, codificaciones de secuencias de ADN y datos de imágenes médicas. En SaaS, almacenan matrices de características, series temporales y vectores de embeddings de usuarios.

## Panorama General

En lecciones anteriores aprendiste las estructuras de datos incorporadas de Python (listas, tuplas, diccionarios, conjuntos). Las listas pueden almacenar datos multidimensionales pero son lentas para operaciones numéricas. Los arrays de NumPy resuelven esto con operaciones vectorizadas que se ejecutan a velocidad C. Esta lección conecta los fundamentos de Python con las librerías de ciencia de datos que vas a usar después: Pandas (construido sobre NumPy), Matplotlib (grafica arrays de NumPy), scikit-learn (entrena sobre arrays de NumPy).

## Teoría

### ¿Qué es NumPy?

NumPy es una librería de Python que provee:
- **ndarray**: Array multidimensional rápido y eficiente en memoria
- **Funciones universales (ufuncs)**: Operaciones elemento a elemento
- **Broadcasting**: Operaciones sobre arrays de diferentes formas
- **Álgebra lineal**: Operaciones con matrices, descomposiciones
- **Generación de números aleatorios**: Varias distribuciones

### Creando Arrays

```python
import numpy as np

# Desde listas
arr1d = np.array([1, 2, 3, 4, 5])
arr2d = np.array([[1, 2, 3], [4, 5, 6]])

# Funciones incorporadas
zeros = np.zeros((3, 4))       # Array 3×4 de ceros
ones = np.ones((2, 3))         # Array 2×3 de unos
eye = np.eye(3)                # Matriz identidad 3×3
full = np.full((2, 2), 7)      # Array 2×2 de 7s
arange = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5) # [0.0, 0.25, 0.5, 0.75, 1.0]
random = np.random.randn(3, 3)  # 3×3 normal aleatoria
```

### Atributos de Arrays

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])
arr.shape      # (2, 3) — dimensiones
arr.ndim       # 2 — cantidad de dimensiones
arr.size       # 6 — total de elementos
arr.dtype      # dtype('int64') — tipo de elemento
arr.itemsize   # 8 — bytes por elemento
```

### Indexación y Slicing

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

arr[0, 1]       # 2 — fila 0, col 1
arr[1]          # [4, 5, 6] — fila 1
arr[:, 1]       # [2, 5, 8] — columna 1
arr[0:2, 0:2]   # [[1, 2], [4, 5]] — submatriz
arr[arr > 3]    # [4, 5, 6, 7, 8, 9] — indexación booleana
```

### Funciones Universales (ufuncs)

```python
arr = np.array([1, 2, 3, 4, 5])

np.sqrt(arr)    # Raíz cuadrada
np.exp(arr)     # Exponencial
np.log(arr)     # Logaritmo natural
np.sin(arr)     # Seno
np.abs(arr)     # Valor absoluto

# Las operaciones elemento a elemento funcionan naturalmente
arr + 10        # [11, 12, 13, 14, 15]
arr * 2         # [2, 4, 6, 8, 10]
arr ** 2        # [1, 4, 9, 16, 25]
```

### Broadcasting

Broadcasting permite operaciones entre arrays de diferentes formas:

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
row_mean = np.mean(arr, axis=1).reshape(-1, 1)  # Vector columna
centered = arr - row_mean  # Broadcasting en acción
```

### Álgebra Lineal

```python
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

np.dot(a, b)        # Multiplicación de matrices
a @ b               # Igual (Python 3.5+)
np.linalg.inv(a)    # Inversa de matriz
np.linalg.det(a)    # Determinante
np.linalg.eig(a)    # Autovalores y autovectores
```

## Explicación Visual

```
Disposición de Memoria de Arrays NumPy

Lista de Python:           Array NumPy:
┌──────┬──────┬──────┐      ┌──────────────────┐
│ 1    │ 2    │ 3    │      │ 1  2  3          │
├──────┼──────┼──────┤      │ 4  5  6          │
│ 4    │ 5    │ 6    │      │ 7  8  9          │
└──────┴──────┴──────┘      └──────────────────┘
                            Memoria contigua
Cada elemento es un         Tipo homogéneo
objeto Python → lento       → cómputo rápido
```

## Implementación en Python

```python
import numpy as np

# Creación de arrays
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(f"Array:\n{arr}")
print(f"Shape: {arr.shape}")
print(f"Dimensiones: {arr.ndim}")
print(f"Tamaño: {arr.size}")
print(f"Dtype: {arr.dtype}")
```

```python
# Indexación y slicing
matrix = np.arange(9).reshape(3, 3)
print(f"Matriz:\n{matrix}")
print(f"Elemento [1,2]: {matrix[1, 2]}")
print(f"Primera fila: {matrix[0]}")
print(f"Última columna: {matrix[:, -1]}")
print(f"Submatriz:\n{matrix[:2, :2]}")
```

```python
# Funciones universales
arr = np.array([1, 2, 3, 4, 5])
print(f"Original: {arr}")
print(f"Raíz: {np.sqrt(arr)}")
print(f"Exp: {np.exp(arr):.2f}")
print(f"Log: {np.log(arr):.3f}")
print(f"Sen: {np.sin(arr):.3f}")
```

```python
# Broadcasting
prices = np.array([10, 20, 30, 40])
discount = np.array([0.9, 0.85, 0.8, 0.75])
print(f"Con descuento: {prices * discount}")

# Broadcasting con escalar
print(f"Todos + 5: {prices + 5}")
print(f"Todos * 1.1: {prices * 1.1}")
```

```python
# Operaciones estadísticas
data = np.random.randn(1000)
print(f"Media: {data.mean():.3f}")
print(f"Desvío std: {data.std():.3f}")
print(f"Mín: {data.min():.3f}")
print(f"Máx: {data.max():.3f}")
print(f"Mediana: {np.median(data):.3f}")
print(f"Percentiles: {np.percentile(data, [25, 50, 75])}")
```

```python
# Álgebra lineal
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

print(f"A:\n{a}")
print(f"B:\n{b}")
print(f"A @ B:\n{a @ b}")
print(f"A invertida:\n{np.linalg.inv(a)}")
print(f"Determinante: {np.linalg.det(a):.1f}")
```

## Ejemplo de Biotecnología

**Escenario**: Analizando datos de expresión génica como matriz de NumPy.

```python
import numpy as np

# Simular datos de expresión génica (5 genes × 4 muestras)
np.random.seed(42)
expression = np.random.randn(5, 4) * 2 + 5  # Media 5, std 2
gene_names = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
sample_names = ["Sample_A", "Sample_B", "Sample_C", "Sample_D"]

print("Matriz de expresión:\n")
print(f"{'Gen':>8}", end=" ")
for s in sample_names:
    print(f"{s:>10}", end=" ")
print()
for i, gene in enumerate(gene_names):
    print(f"{gene:>8}", end=" ")
    for val in expression[i]:
        print(f"{val:>10.2f}", end=" ")
    print()

# Normalizar: z-score por gen
means = expression.mean(axis=1).reshape(-1, 1)
stds = expression.std(axis=1).reshape(-1, 1)
z_scores = (expression - means) / stds

print(f"\nExpresión normalizada (z-score):\n{z_scores}")

# Encontrar genes altamente expresados (z-score > 1.5)
high_expr = np.where(z_scores > 1.5)
print(f"\nÍndices de alta expresión: {list(zip(high_expr[0], high_expr[1]))}")
```

## Ejemplo SaaS

**Escenario**: Analizando métricas de engagement de usuarios.

```python
import numpy as np

# Simular usuarios activos diarios (7 días × 3 productos)
np.random.seed(42)
dau = np.random.randint(1000, 5000, size=(7, 3))
products = ["Dashboard", "Analytics", "Reports"]

print("Usuarios Activos Diarios (7 días):")
print(f"{'Día':>5}", end=" ")
for p in products:
    print(f"{p:>12}", end=" ")
print()
for day in range(7):
    print(f"{day+1:>5}", end=" ")
    for prod in range(3):
        print(f"{dau[day, prod]:>12,}", end=" ")
    print()

# Estadísticas semanales
print(f"\nPromedios semanales:")
for i, p in enumerate(products):
    print(f"  {p}: {dau[:, i].mean():.0f} ± {dau[:, i].std():.0f}")

# Tasa de crecimiento (día contra día)
growth = np.diff(dau, axis=0) / dau[:-1] * 100
print(f"\nTasas de crecimiento (%):\n{growth}")

# Correlación entre productos
corr = np.corrcoef(dau.T)
print(f"\nMatriz de correlación:\n{corr}")
```

## Errores Comunes

1. **Confundir np.array() con listas de Python**: Los arrays soportan operaciones elemento a elemento; las listas no
2. **Precisión de coma flotante**: `np.float64` tiene precisión limitada como los floats de Python
3. **Confundir copia vs vista**: El slicing devuelve una vista, no una copia. Usá `.copy()` para datos independientes
4. **Errores de broadcasting**: Formas incompatibles lanzan ValueError. Verificá las formas con `.shape`
5. **Usar `==` con floats**: Mismos problemas de precisión que Python; usá `np.isclose()`
6. **Olvidar el dtype**: Tipos mixtos en lista → dtype string (todos los elementos se vuelven strings)

## Buenas Prácticas

- Usá `np.array()` con dtype explícito cuando sea necesario
- Usá operaciones vectorizadas en lugar de bucles de Python (mucho más rápido)
- Usá `.copy()` cuando necesites modificar un slice de forma independiente
- Usá `np.isclose()` para comparaciones de coma flotante
- Usá el parámetro `axis=` para operaciones por fila/columna
- Perfilá el código: NumPy vectorizado es 10-100x más rápido que bucles de Python

## Resumen

- NumPy provee el ndarray: rápido, eficiente en memoria, multidimensional
- Creá arrays con `np.array()`, `np.zeros()`, `np.ones()`, `np.arange()`, etc.
- Indexación y slicing similares a listas, pero con capacidades multidimensionales
- Las funciones universales (ufuncs) operan elemento a elemento a velocidad C
- Broadcasting permite operaciones sobre arrays de diferentes formas
- Álgebra lineal: `@`, `np.linalg.inv`, `np.linalg.eig`
- Siempre preferí operaciones vectorizadas sobre bucles de Python

## Términos Clave

- **ndarray**: Objeto array multidimensional de NumPy
- **Shape**: Tupla de las dimensiones del array
- **Eje**: Dimensión de un array (0=filas, 1=columnas)
- **Vectorización**: Usar operaciones de arrays en lugar de bucles
- **Broadcasting**: Reglas para operar sobre arrays con diferentes formas
- **Función universal (ufunc)**: Función elemento a elemento sobre arrays
- **Dtype**: Tipo de dato de los elementos del array
- **Vista**: Acceso alternativo a los mismos datos (sin copia)
- **Fancy indexing**: Indexación con arrays booleanos o listas de enteros

## Ejercicios

### Nivel 1: Básico

1. Creá un array 4×4 de ceros. ¿Cómo crearías su versión de matriz identidad?
2. ¿Cuál es la diferencia entre `arr[1]` y `arr[:, 1]` para un array 2D?
3. ¿Qué devuelve `np.arange(2, 10, 3)`?

### Nivel 2: Implementación

4. Escribí una función que normalice una matriz para que tenga media=0 y std=1 en cada columna.
5. Implementá multiplicación de matrices manualmente (con bucles) y luego con `@`. Compará el rendimiento en matrices de 100×100.

### Nivel 3: Pensamiento Crítico

6. ¿Cómo logra NumPy su ventaja de velocidad sobre las listas de Python? ¿Cuál es el rol de la memoria contigua y la vectorización?
7. ¿Cuándo fallaría el broadcasting? Dá un ejemplo de formas incompatibles y explicá cómo solucionarlo.

## Desafío de Código

Escribí un programa que implemente **Análisis de Componentes Principales (PCA)** desde cero usando NumPy:
1. Generá un dataset aleatorio (100 muestras, 5 características)
2. Centrá los datos (restá la media de cada columna)
3. Calculá la matriz de covarianza
4. Calculá autovalores y autovectores de la matriz de covarianza
5. Ordená los autovectores por autovalores (descendente)
6. Proyectá los datos sobre las primeras 2 componentes principales
7. Verificá tu resultado comparando con el error de reconstrucción (reconstruí el original desde los datos reducidos)
8. Usá solo NumPy — nada de scikit-learn
