
Module: 2
Lesson Number: 13
Lesson Title: NumPy
Estimated Duration: 90 minutos
Prerequisites: L9 L12   Listas, Tuplas, Diccionarios, Conjuntos
Learning Objectives:
  Crear arrays de NumPy desde listas de Python y con funciones incorporadas
  Acceder y modificar elementos de arrays usando indexación y slicing
  Realizar operaciones elemento a elemento con funciones universales
  Usar broadcasting para operar sobre arrays de diferentes formas
  Realizar operaciones básicas de álgebra lineal
Keywords: NumPy, array, ndarray, broadcasting, función universal, álgebra lineal
Difficulty: Beginner Intermediate
Programming Concepts: Cómputo con arrays, vectorización, broadcasting, álgebra lineal
Mathematical Concepts: Operaciones con matrices, broadcasting, álgebra lineal
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# NumPy

<Section number={1} title="¿Por qué NumPy?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas de Python son flexibles pero lentas para números: cada elemento es un objeto.",
    "NumPy (Numerical Python) es la base del cómputo científico y la columna vertebral de Pandas, scikit learn y TensorFlow.",
    "En biotecnología los arrays de NumPy representan matrices de expresión génica, codificaciones de secuencias y datos de imágenes médicas.",
    "En SaaS almacenan matrices de features, series temporales y vectores de embeddings de usuarios.",
    "Esta lección conecta los fundamentos de Python con las librerías de ciencia de datos que usarás después.",
  ]}
/>

<ConceptCard variant="key idea">
NumPy provee el ndarray: array multidimensional, rápido, eficiente en memoria y con operaciones vectorizadas a velocidad C.
</ConceptCard>

- En lecciones anteriores aprendiste listas, tuplas, diccionarios y conjuntos.
- Las listas pueden almacenar datos multidimensionales, pero son lentas para operaciones numéricas.
- Los arrays de NumPy resuelven eso con vectorización y broadcasting, y se conectan directamente con Pandas, Matplotlib y scikit learn.

</RevealSequence>
</Section>

<Section number={2} title="Creación y Atributos de Arrays" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "NumPy no es solo 'listas más rápidas': es un objeto ndarray homogéneo con forma, dimensiones y tipo de dato.",
    "Antes de operar, aprende a crear el array y a leer sus atributos: shape, ndim, size, dtype.",
    "Esos atributos son el mapa que consultarás cada vez que una operación falle por formas incompatibles.",
  ]}
/>

<ConceptCard variant="definition">
ndarray: array multidimensional de NumPy, homogéneo y en memoria contigua, con atributos `shape`, `ndim`, `size` y `dtype`.
</ConceptCard>

NumPy es una librería de Python que provee:

- **ndarray**: array multidimensional rápido y eficiente en memoria.
- **Funciones universales (ufuncs)**: operaciones elemento a elemento.
- **Broadcasting**: operaciones sobre arrays de diferentes formas.
- **Álgebra lineal**: operaciones con matrices y descomposiciones.
- **Generación de números aleatorios**: varias distribuciones.

Creando arrays desde listas:

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

Atributos de arrays:

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])
arr.shape      # (2, 3)   dimensiones
arr.ndim       # 2   cantidad de dimensiones
arr.size       # 6   total de elementos
arr.dtype      # dtype('int64')   tipo de elemento
arr.itemsize   # 8   bytes por elemento
```

</RevealSequence>
</Section>

<Section number={3} title="Indexación, Slicing y Funciones Universales" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cómo accedes al gen de la fila 3, columna 2 de una matriz de expresión? Por posición, como en listas, pero con dos dimensiones.",
    "El indexing con `arr[i, j]` y el slicing con `arr[:, 1]` son tu lenguaje diario sobre matrices.",
    "Suma las ufuncs: operaciones elemento a elemento a velocidad C que evitan los bucles de Python.",
  ]}
/>

<ConceptCard variant="key idea">
Indexación desde 0 y slicing `[inicio:fin:paso]` por eje; las ufuncs operan elemento a elemento y son el atajo frente a los bucles.
</ConceptCard>

Indexación y slicing:

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

arr[0, 1]       # 2   fila 0, col 1
arr[1]          # [4, 5, 6]   fila 1
arr[:, 1]       # [2, 5, 8]   columna 1
arr[0:2, 0:2]   # [[1, 2], [4, 5]]   submatriz
arr[arr > 3]    # [4, 5, 6, 7, 8, 9]   indexación booleana
```

Funciones universales (ufuncs):

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

</RevealSequence>
</Section>

<Section number={4} title="Broadcasting y Álgebra Lineal" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Broadcasting es la regla que permite operar sobre arrays de distintas formas sin copiar datos.",
    "Álgebra lineal es el otro pilar: multiplicación de matrices, inversa, determinante y autovalores.",
    "Ambas herramientas aparecen en casi todo modelo de ML, desde regresión hasta PCA.",
  ]}
/>

<ConceptCard variant="definition">
Broadcasting: reglas para operar sobre arrays con diferentes formas sin copiar datos; álgebra lineal con `@`, `np.linalg.inv`, `np.linalg.eig`.
</ConceptCard>

Broadcasting permite operaciones entre arrays de diferentes formas:

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
row_mean = np.mean(arr, axis=1).reshape(-1, 1)  # Vector columna
centered = arr row_mean  # Broadcasting en acción
```

Álgebra lineal:

```python
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

np.dot(a, b)        # Multiplicación de matrices
a @ b               # Igual (Python 3.5+)
np.linalg.inv(a)    # Inversa de matriz
np.linalg.det(a)    # Determinante
np.linalg.eig(a)    # Autovalores y autovectores
```

Disposición de memoria de arrays NumPy (candidato a player visual):

```python
Disposición de Memoria de Arrays NumPy

Lista de Python:           Array NumPy:
┌──────┬──────┬──────┐      ┌──────────────────┐
│ 1    │ 2    │ 3    │      │ 1  2  3          │
├──────┼──────┼──────┤      │ 4  5  6          │
│ 4    │ 5    │ 6    │      │ 7  8  9          │
└──────┴──────┴──────┘      └──────────────────┘
                            Memoria contigua
Cada elemento es un         Tipo homogéneo
objeto Python  lento        cómputo rápido
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
    "Creación de arrays, atributos, indexación, ufuncs, broadcasting y estadísticas rápidas.",
    "Ejecuta cada bloque y verifica la forma y el dtype antes de asumir nada.",
    "El hábito: imprime `shape` y `dtype` al depurar código numérico.",
  ]}
/>

<ConceptCard variant="key idea">
Imprimir shape y dtype es el equivalente del print debug para arrays: barato y evita la mayoría de los errores de operación.
</ConceptCard>

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

</RevealSequence>
</Section>

<Section number={6} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Dos casos reales: normalizar una matriz de expresión génica con z score y analizar engagement de usuarios en SaaS.",
    "Ambos usan los mismos bloques: creación, operación vectorizada, broadcasting por eje y estadísticas resumen.",
    "Observa cómo `reshape(-1, 1)` convierte una media en vector columna para broadcasting.",
  ]}
/>

**Escenario biotecnología**   analizando datos de expresión génica como matriz de NumPy:

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

# Normalizar: z score por gen
means = expression.mean(axis=1).reshape(-1, 1)
stds = expression.std(axis=1).reshape(-1, 1)
z_scores = (expression means) / stds

print(f"\nExpresión normalizada (z score):\n{z_scores}")

# Encontrar genes altamente expresados (z score > 1.5)
high_expr = np.where(z_scores > 1.5)
print(f"\nÍndices de alta expresión: {list(zip(high_expr[0], high_expr[1]))}")
```

**Escenario SaaS**   analizando métricas de engagement de usuarios:

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

</RevealSequence>
</Section>

<Section number={7} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los errores con NumPy casi siempre son de forma: una matriz que esperabas (3,4) y recibiste (3,).",
    "Los slicing devuelven vistas, no copias, y comparar floats con `==` es un clásico de laboratorio.",
    "La regla de oro: verifica `.shape` y `.dtype` antes de operar.",
  ]}
/>

Errores comunes:

- **Confundir `np.array()` con listas de Python**: los arrays soportan operaciones elemento a elemento; las listas no.
- **Precisión de coma flotante**: `np.float64` tiene precisión limitada como los floats de Python.
- **Confundir copia vs vista**: el slicing devuelve una vista, no una copia   usa `.copy()` para datos independientes.
- **Errores de broadcasting**: formas incompatibles lanzan ValueError; verifica las formas con `.shape`.
- **Usar `==` con floats**: mismos problemas de precisión que Python; usa `np.isclose()`.
- **Olvidar el dtype**: tipos mixtos en lista  dtype string (todos los elementos se vuelven strings).

Buenas prácticas:

- Usa `np.array()` con dtype explícito cuando sea necesario.
- Usa operaciones vectorizadas en lugar de bucles de Python (mucho más rápido).
- Usa `.copy()` cuando necesites modificar un slice de forma independiente.
- Usa `np.isclose()` para comparaciones de coma flotante.
- Usa el parámetro `axis=` para operaciones por fila/columna.
- Perfila el código: NumPy vectorizado es 10 a 100x más rápido que bucles de Python.

</RevealSequence>
</Section>

<Section number={8} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "NumPy es el vocabulario común de la ciencia de datos en Python: ndarray, shape, broadcasting, ufuncs, linalg.",
    "Si los dominas, la transición a Pandas y scikit learn será natural.",
    "Nunca subestimes un buen `.shape` impreso en pantalla.",
  ]}
/>

<ConceptCard variant="key idea">
NumPy es el vocabulario común de la ciencia de datos en Python: un solo paquete que combina `ndarray` multidimensional, broadcasting, ufuncs y álgebra lineal con rendimiento cercano a C.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "ndarray", label: "ndarray", detail: "Array multidimensional rápido y eficiente en memoria: la estructura central de NumPy." },
    { id: "creacion", label: "Creación", detail: "Crea arrays con np.array(), np.zeros(), np.ones(), np.arange(), etc." },
    { id: "indexacion", label: "Indexación", detail: "Slicing similar a listas, pero con capacidades multidimensionales." },
    { id: "ufuncs", label: "Ufuncs", detail: "Funciones universales que operan elemento a elemento a velocidad C." },
    { id: "broadcasting", label: "Broadcasting", detail: "Reglas para operar sobre arrays con diferentes formas." },
    { id: "algebra lineal", label: "Álgebra lineal", detail: "Operador @ y np.linalg.inv, np.linalg.eig para matrices." },
    { id: "vectorizacion", label: "Vectorización", detail: "Preferir operaciones vectorizadas sobre bucles de Python." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "ndarray g", label: "ndarray", detail: "Objeto array multidimensional de NumPy." },
    { id: "shape", label: "Shape", detail: "Tupla de las dimensiones del array." },
    { id: "eje", label: "Eje", detail: "Dimensión de un array (0=filas, 1=columnas)." },
    { id: "vectorizacion g", label: "Vectorización", detail: "Usar operaciones de arrays en lugar de bucles." },
    { id: "broadcasting g", label: "Broadcasting", detail: "Reglas para operar sobre arrays con diferentes formas." },
    { id: "ufunc", label: "Función universal (ufunc)", detail: "Función elemento a elemento sobre arrays." },
    { id: "dtype", label: "Dtype", detail: "Tipo de dato de los elementos del array." },
    { id: "vista", label: "Vista", detail: "Acceso alternativo a los mismos datos (sin copia)." },
    { id: "fancy indexing", label: "Fancy indexing", detail: "Indexación con arrays booleanos o listas de enteros." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué devuelve np.array([10, 20, 30]).shape?"
  moduleSlug="python"
  lessonSlug="lesson13_numpy"
  blockId="choice python l13 resumen 1"
  allowContinueOnIncorrect
  explanation="`.shape` devuelve la tupla de dimensiones: un array de 3 elementos tiene forma (3,)."
  options={[
    { id: "a", label: "(3,)", correct: true, feedback: "¡Exacto! Es una tupla con un solo elemento (la coma es obligatoria)." },
    { id: "b", label: "3", correct: false, feedback: "Eso sería len(array); shape devuelve una tupla." },
    { id: "c", label: "(1, 3)", correct: false, feedback: "Esa forma corresponde a una matriz 1×3, no a un vector 1D." },
    { id: "d", label: "3.0", correct: false, feedback: "shape no es un número flotante ni un escalar." },
  ]}
/>

<MascotMessage mood="celebrating">
¡NumPy dominado! Los arrays son la base de Pandas y scikit learn   la próxima lección los envuelve en DataFrames.
</MascotMessage>

</RevealSequence>
</Section>

<Section number={9} title="Ejercicios y Desafío de Código" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Hora de practicar con arrays, slicing e índice booleano.",
    "Los ejercicios buscan que predigas formas antes de ejecutar.",
  ]}
/>

Nivel 1   Básico:

1. Crea un array 4×4 de ceros. ¿Cómo crearías su versión de matriz identidad?
2. ¿Cuál es la diferencia entre `arr[1]` y `arr[:, 1]` para un array 2D?
3. ¿Qué devuelve `np.arange(2, 10, 3)`?

Nivel 2   Implementación:

4. Escribe una función que normalice una matriz para que tenga media=0 y std=1 en cada columna.
5. Implementa multiplicación de matrices manualmente (con bucles) y luego con `@`. Compara el rendimiento en matrices de 100×100.

Nivel 3   Pensamiento Crítico:

6. ¿Cómo logra NumPy su ventaja de velocidad sobre las listas de Python? ¿Cuál es el rol de la memoria contigua y la vectorización?
7. ¿Cuándo fallaría el broadcasting? Da un ejemplo de formas incompatibles y explica cómo solucionarlo.

Desafío de Código   PCA desde cero con NumPy:

1. Genera un dataset aleatorio (100 muestras, 5 características).
2. Centra los datos (resta la media de cada columna).
3. Calcula la matriz de covarianza.
4. Calcula autovalores y autovectores de la matriz de covarianza.
5. Ordena los autovectores por autovalores (descendente).
6. Proyecta los datos sobre las primeras 2 componentes principales.
7. Verifica tu resultado comparando con el error de reconstrucción (reconstruye el original desde los datos reducidos).
8. Usa solo NumPy   nada de scikit learn.

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Qué devuelve `np.arange(2, 10, 3)`?"
  moduleSlug="python"
  lessonSlug="lesson13_numpy"
  blockId="choice python l13 arrays 1"
  allowContinueOnIncorrect
  explanation="`arange(inicio, fin, paso)` genera valores desde 2 hasta (sin incluir) 10 con paso 3: 2, 5, 8."
  options={[
    { id: "a", label: "array([2, 5, 8])", correct: true, feedback: "¡Correcto! El fin (10) es exclusivo." },
    { id: "b", label: "array([2, 5, 8, 11])", correct: false, feedback: "11 supera el límite fin=10." },
    { id: "c", label: "array([2, 3, 4, 5, 6, 7, 8, 9])", correct: false, feedback: "Eso sería paso 1, no 3." },
    { id: "d", label: "Error de sintaxis", correct: false, feedback: "La llamada es válida." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué las operaciones vectorizadas de NumPy son más rápidas que los bucles de Python?"
  moduleSlug="python"
  lessonSlug="lesson13_numpy"
  blockId="choice python l13 broadcasting 2"
  allowContinueOnIncorrect
  explanation="Porque operan sobre memoria contigua con código compilado (C/Fortran) y evitan la sobrecarga de objetos Python por elemento."
  options={[
    { id: "a", label: "Por memoria contigua y código compilado", correct: true, feedback: "¡Correcto! Esa es la clave de la velocidad C." },
    { id: "b", label: "Porque Python es interpretado y NumPy no", correct: false, feedback: "Python también ejecuta; NumPy delega a C." },
    { id: "c", label: "Por usar listas internas de Python", correct: false, feedback: "NumPy no usa listas; usa ndarray." },
    { id: "d", label: "Por paralelización automática en GPU", correct: false, feedback: "No automática; es vectorización en CPU." },
  ]}
/>

</RevealSequence>
</Section>