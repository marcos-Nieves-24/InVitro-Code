
Module: 2
Lesson Number: 9
Lesson Title: Listas
Estimated Duration: 60 minutos
Prerequisites: L7   Bucles, L8   Condicionales
Learning Objectives:
  Crear listas con varios tipos de datos
  Acceder a elementos usando índices y slicing
  Modificar listas usando métodos incorporados
  Usar list comprehensions para crear listas de forma concisa
  Elegir entre listas y tuplas según el caso de uso
Keywords: lista, índice, slice, append, list comprehension, mutable
Difficulty: Beginner
Programming Concepts: Tipos de secuencia, mutabilidad, indexación, slicing, comprehensions
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# Listas

<Section number={1} title="¿Por qué Listas?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas son la estructura de datos más versátil de Python.",
    "Almacenan colecciones de elementos en un orden específico y se pueden modificar después de creadas.",
    "En ciencia de datos, las listas están en todas partes: vectores de características, nombres de muestras, salidas de predicciones y cómputos intermedios.",
    "En biotecnología, las listas contienen nombres de genes, valores de expresión, IDs de pacientes y fragmentos de secuencias.",
    "Dominar las listas es tu primer paso para trabajar con datasets reales.",
  ]}
/>

<ConceptCard variant="key idea">
Las listas son colecciones ordenadas y **mutables**: puedes cambiar, agregar o quitar elementos después de crearlas.
</ConceptCard>

- En lecciones anteriores aprendiste variables (valores individuales), operadores, funciones, bucles y condicionales.
- Las listas introducen el concepto de **colecciones**   almacenar múltiples valores en una sola estructura.
- Este es tu primer paso para trabajar con datasets; tuplas, diccionarios y conjuntos se basan en los mismos conceptos con características distintas.

</RevealSequence>
</Section>

<Section number={2} title="Creación, Indexación y Slicing" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cómo accedes al tercer gen de una lista de genes?",
    "No lo buscas por nombre todavía (eso es diccionario); primero lo ubicas por posición.",
    "En Python las posiciones empiezan en 0, el famoso 'off by one' que todo programador sufre una vez.",
  ]}
/>

<ConceptCard variant="definition">
Indexación desde 0 y slicing con `[inicio:fin:paso]`, donde `fin` es exclusivo.
</ConceptCard>

Las listas se crean con corchetes `[]`:

```python
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4], [5, 6]]
```

Accede a los elementos por posición (indexación desde 0):

```python
fruits = ["apple", "banana", "cherry", "date"]
fruits[0]    # "apple" (primero)
fruits[-1]   # "date" (último)
fruits[-2]    # "cherry" (penúltimo)
```

Extrae sublistas con `[inicio:fin:paso]`:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers[2:5]     # [2, 3, 4]
numbers[:3]      # [0, 1, 2]
numbers[7:]      # [7, 8, 9]
numbers[::2]     # [0, 2, 4, 6, 8]
numbers[::-1]    # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

Referencia visual de índices:

```python
Indexación de Listas (desde 0):

Índice:   0      1      2      3      4
      ┌──────┬──────┬──────┬──────┬──────┐
      │ "a"  │ "b"  │ "c"  │ "d"  │ "e"  │
      └──────┴──────┴──────┴──────┴──────┘
Índice:  -5     -4     -3     -2     -1

Slicing [inicio:fin]:
  [1:4]  "b", "c", "d"  (fin es exclusivo)
  [:3]   "a", "b", "c"
  [2:]   "c", "d", "e"
```

</RevealSequence>
</Section>

<Section number={3} title="Métodos y List Comprehensions" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas no son solo contenedores pasivos.",
    "Tienen métodos para mutarlas in place: append, insert, remove, pop, sort, reverse.",
    "Y las list comprehensions te dejan construir listas en una línea, casi como una fórmula matemática.",
  ]}
/>

Métodos de listas:

```python
fruits = ["apple", "banana"]
fruits.append("cherry")     # ["apple", "banana", "cherry"]
fruits.insert(1, "blueberry")  # ["apple", "blueberry", "banana", "cherry"]
fruits.remove("banana")    # Elimina la primera ocurrencia
popped = fruits.pop()      # Elimina y devuelve el último elemento
fruits.sort()              # Ordena in place
fruits.reverse()           # Invierte in place
index = fruits.index("apple")  # Encuentra el índice de un elemento
count = fruits.count("apple")  # Cuenta ocurrencias
```

List comprehension (forma concisa de crear listas):

```python
# Básico
squares = [x ** 2 for x in range(10)]

# Con condición
evens = [x for x in range(20) if x % 2 == 0]

# Anidado
matrix = [[i * j for j in range(3)] for i in range(3)]
```

Las listas son **mutables**   puedes cambiar elementos:

```python
fruits = ["apple", "banana", "cherry"]
fruits[1] = "blueberry"    # ["apple", "blueberry", "cherry"]
```

Operaciones comunes:

```python
len(list)        # Cantidad de elementos
x in list        # Test de pertenencia
list1 + list2    # Concatenación
list * 3         # Repetición
min(list)        # Mínimo
max(list)        # Máximo
sum(list)        # Suma (listas numéricas)
```

<ConceptCard variant="warning">
No confundir `append` (agrega un elemento) con `extend` (agrega elementos de un iterable). Tampoco modificar una lista mientras la iteras.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={4} title="Implementación y Ejemplos" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Teoría lista: ahora a los datos.",
    "Veamos genes, expresión génica y series de transacciones.",
    "Las list comprehensions brillan cuando filtras y transformas datos en un solo paso.",
  ]}
/>

Creando y accediendo a listas:

```python
# Creando y accediendo a listas
genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
print(f"Primer gen: {genes[0]}")
print(f"Último gen: {genes[-1]}")
print(f"Primeros 3 genes: {genes[:3]}")

# Modificando listas
genes.append("ALK")
genes.insert(0, "HER2")
genes.sort()
print(f"Ordenado: {genes}")

# Iterando
for gene in genes:
    print(gene, end=" ")
print()
```

Ejemplos de list comprehension:

```python
# Ejemplos de list comprehension
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Cuadrados
squares = [n ** 2 for n in numbers]
print(f"Cuadrados: {squares}")

# Solo pares
evens = [n for n in numbers if n % 2 == 0]
print(f"Pares: {evens}")

# Expresión condicional
labels = ["par" if n % 2 == 0 else "impar" for n in numbers]
print(f"Etiquetas: {labels}")
```

Listas anidadas (matriz):

```python
# Listas anidadas (matriz)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Acceder a elementos
print(f"Elemento [1][1]: {matrix[1][1]}")

# Suma de cada fila
row_sums = [sum(row) for row in matrix]
print(f"Sumas por fila: {row_sums}")

# Transponer
transpose = [[row[i] for row in matrix] for i in range(3)]
print(f"Transpuesta: {transpose}")
```

Ejemplo de biotecnología   expresión génica:

```python
# Datos de expresión génica (fold changes)
gene_names = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS", "ALK"]
fold_changes = [2.5, -1.2, 3.8, 0.9, -2.1, 1.5]
p_values = [0.001, 0.08, 0.003, 0.45, 0.02, 0.15]

# Encontrar genes significativamente sobreexpresados (fold > 2, p < 0.05)
significant = []
for i in range(len(gene_names)):
    if fold_changes[i] > 2 and p_values[i] < 0.05:
        significant.append(gene_names[i])

print(f"Significativamente sobreexpresados: {significant}")

# Usando list comprehension
significant = [
    gene_names[i]
    for i in range(len(gene_names))
    if fold_changes[i] > 2 and p_values[i] < 0.05
]

# Enfoque con zip
significant = [
    gene for gene, fc, p in zip(gene_names, fold_changes, p_values)
    if fc > 2 and p < 0.05
]
print(f"Significativos (comprehension): {significant}")
```

Ejemplo SaaS   transacciones:

```python
# Valores de transacciones mensuales
transactions = [1250, 3400, 780, 2100, 5600, 920, 4300, 1500]

# Calcular estadísticas
total = sum(transactions)
average = total / len(transactions)
max_txn = max(transactions)
min_txn = min(transactions)

# Encontrar transacciones por encima del promedio
high_value = [t for t in transactions if t > average]

# Tasas de crecimiento
growth_rates = [
    ((transactions[i] transactions[i 1]) / transactions[i 1]) * 100
    for i in range(1, len(transactions))
]

print(f"Total: ${total:,.2f}")
print(f"Promedio: ${average:,.2f}")
print(f"Transacciones de alto valor (> prom.): {high_value}")
print(f"Tasas de crecimiento: {[f'{g:.1f}%' for g in growth_rates]}")
```

</RevealSequence>
</Section>

<Section number={5} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas son poderosas, pero tienen trampas.",
    "La más cara: modificar la lista mientras iteras y corromper el índice.",
    "La segunda: creer que `lista2 = lista1` copia; no, ambas apuntan al mismo objeto.",
  ]}
/>

<ConceptCard variant="warning">
Errores comunes:
- Índice fuera de rango: acceder a un índice ≥ `len(lista)` lanza `IndexError`.
- Confundir `append` y `extend`: `append` agrega un elemento; `extend` agrega elementos de un iterable.
- Modificar la lista mientras se itera: crea bugs sutiles. Itera sobre una copia: `for x in lista[:]:`.
- Confusión con copia superficial: `lista2 = lista1` no copia; usan el mismo objeto. Usa `lista2 = lista1.copy()` o `lista2 = lista1[:]`.
- Error off by one en slicing: `lista[a:b]` incluye `a`, excluye `b`.
</ConceptCard>

<ConceptCard variant="key idea">
Buenas prácticas:
- Usa list comprehensions para transformaciones simples.
- Usa `enumerate()` cuando necesites índice y valor.
- Usa `zip()` para iterar sobre múltiples listas en paralelo.
- Prefiere `in` para pruebas de pertenencia sobre bucles manuales.
- Usa `copy()` o `[:]` para crear copias independientes.
- Evita modificar listas mientras iteras.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<ConceptCard variant="key idea">
Una lista es una secuencia ordenada y mutable: indexás desde 0, recortás con slices, modificás con métodos y la generás con comprehensions; copias independientes evitan efectos secundarios.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "lista", label: "Lista", detail: "Colección ordenada y mutable creada con `[]`." },
    { id: "indice", label: "Índice", detail: "Posición desde 0; índices negativos desde el final." },
    { id: "slicing", label: "Slicing", detail: "`[inicio:fin:paso]` crea sublistas." },
    { id: "metodos", label: "Métodos", detail: "`append`, `insert`, `remove`, `pop`, `sort`, `reverse`." },
    { id: "comprehension", label: "List comprehension", detail: "`[expr for item in iterable if condition]`." },
    { id: "tipos mixtos", label: "Tipos mixtos", detail: "Puede contener tipos mixtos y listas anidadas." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss lista", label: "Lista", detail: "Colección ordenada y mutable." },
    { id: "gloss indice", label: "Índice", detail: "Posición numérica de un elemento (desde 0)." },
    { id: "gloss slice", label: "Slice", detail: "Subconjunto de una lista." },
    { id: "gloss mutabilidad", label: "Mutabilidad", detail: "Capacidad de cambiar después de creada." },
    { id: "gloss comprehension", label: "List comprehension", detail: "Sintaxis concisa para crear listas." },
    { id: "gloss anidada", label: "Lista anidada", detail: "Lista que contiene listas (multidimensional)." },
    { id: "gloss copia", label: "Copia superficial", detail: "Nueva referencia al mismo objeto." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué devuelve [1, 2, 3][1:]?"
  moduleSlug="python"
  lessonSlug="lesson09_lists"
  blockId="choice python l09 resumen 1"
  allowContinueOnIncorrect
  explanation="El slice omite el inicio (arranca en índice 1) y llega al final: [2, 3]."
  options={[
    { id: "a", label: "[2, 3]", correct: true, feedback: "¡Exacto! índices 1 y 2 hasta el final." },
    { id: "b", label: "[1, 2]", correct: false, feedback: "Eso sería [:2], no [1:]." },
    { id: "c", label: "[2]", correct: false, feedback: "Falta el resto del slice hasta el final." },
    { id: "d", label: "Error", correct: false, feedback: "El slice es válido aunque el inicio se omita." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Listas dominadas! Ya gestionás colecciones mutables   las tuplas del próximo bloque son su versión inmutable.
</MascotMessage>

</RevealSequence>
</Section>

<Section number={7} title="Ejercicios y Desafío de Código" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Hora de practicar: ejercicios y un desafío de código.",
    "Lee cada pregunta antes de responder; muchas apuntan al detalle de 'fin exclusivo'.",
  ]}
/>

Nivel 1   Básico:
1. ¿Cuál es el resultado de `[1, 2, 3][::-1]`?
2. ¿Cuál es la diferencia entre `append()` y `extend()`?
3. ¿Qué devuelve `len([1, [2, 3], 4])`?

Nivel 2   Implementación:
4. Escribe una función `remove_duplicates(items)` que devuelva una nueva lista sin duplicados, preservando el orden.
5. Usa un list comprehension para crear una lista de todos los cuadrados pares (cuadrados de números pares) del 1 al 20.

Nivel 3   Pensamiento Crítico:
6. Compara la complejidad temporal de las operaciones con listas: indexación, `append`, `insert`, `remove`, `in`. ¿Por qué `in` en una lista es lento para listas grandes?
7. ¿Cuándo elegirías una lista sobre una tupla, y viceversa? ¿Cuáles son los trade offs?

Desafío de Código   promedio móvil con ventana:
1. Dada una lista de números y un tamaño de ventana `k`.
2. Calcula el promedio de cada `k` elementos consecutivos.
3. Devuelve una lista de estos promedios.
4. Ejemplo: `rolling_average([1, 2, 3, 4, 5], 3)`  `[2.0, 3.0, 4.0]`.
5. Usa list comprehension y slicing.
6. Maneja casos borde: lista vacía, `k > len(lista)`, `k = 1`.

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Cuál es el resultado de `[1, 2, 3][::-1]`?"
  moduleSlug="python"
  lessonSlug="lesson09_lists"
  blockId="choice python l09 listas 1"
  allowContinueOnIncorrect
  explanation="El slicing `[::-1]` invierte la secuencia, produciendo `[3, 2, 1]`."
  options={[
    { id: "a", label: "[3, 2, 1]", correct: true, feedback: "¡Correcto! El paso -1 recorre la lista en reversa." },
    { id: "b", label: "[1, 2, 3]", correct: false, feedback: "No, eso sería sin invertir." },
    { id: "c", label: "[2, 3]", correct: false, feedback: "Eso sería un slice con índice de inicio." },
    { id: "d", label: "Error de índice", correct: false, feedback: "No lanza error: el slicing es tolerante a rangos fuera de límite." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre `append` y `extend` en una lista?"
  moduleSlug="python"
  lessonSlug="lesson09_lists"
  blockId="choice python l09 listas 2"
  allowContinueOnIncorrect
  explanation="`append` agrega un único elemento; `extend` agrega cada elemento de un iterable."
  options={[
    { id: "a", label: "`append` agrega un elemento; `extend` agrega los elementos de un iterable", correct: true, feedback: "¡Correcto!" },
    { id: "b", label: "No hay diferencia; son alias", correct: false, feedback: "Son métodos distintos." },
    { id: "c", label: "`append` es más rápido siempre", correct: false, feedback: "No es la diferencia conceptual." },
    { id: "d", label: "`extend` solo acepta listas", correct: false, feedback: "`extend` acepta cualquier iterable." },
  ]}
/>

</RevealSequence>
</Section>
