---
Module: 2
Lesson Number: 9
Lesson Title: Listas
Estimated Duration: 60 minutos
Prerequisites: L7 — Bucles, L8 — Condicionales
Learning Objectives:
  - Crear listas con varios tipos de datos
  - Acceder a elementos usando índices y slicing
  - Modificar listas usando métodos incorporados
  - Usar list comprehensions para crear listas de forma concisa
  - Elegir entre listas y tuplas según el caso de uso
Keywords: lista, índice, slice, append, list comprehension, mutable
Difficulty: Beginner
Programming Concepts: Tipos de secuencia, mutabilidad, indexación, slicing, comprehensions
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Listas

## Motivación

Las listas son la estructura de datos más versátil de Python. Almacenan colecciones de elementos en un orden específico y se pueden modificar después de creadas. En ciencia de datos, las listas están en todas partes: vectores de características, nombres de muestras, salidas de predicciones y cómputos intermedios. En biotecnología, las listas contienen nombres de genes, valores de expresión, IDs de pacientes y fragmentos de secuencias. En SaaS, almacenan IDs de usuarios, registros de transacciones y valores de métricas.

## Panorama General

En lecciones anteriores aprendiste variables (valores individuales), operadores, funciones, bucles y condicionales. Las listas introducen el concepto de **colecciones** — almacenar múltiples valores en una sola estructura. Este es tu primer paso para trabajar con datasets. Las próximas lecciones sobre tuplas, diccionarios y conjuntos se basan en los mismos conceptos con diferentes características.

## Teoría

### Creando Listas

Las listas se crean con corchetes `[]`:

```python
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4], [5, 6]]
```

### Indexación

Accedé a los elementos por posición (indexación desde 0):

```python
fruits = ["apple", "banana", "cherry", "date"]
fruits[0]    # "apple" (primero)
fruits[-1]   # "date" (último)
fruits[-2]   # "cherry" (penúltimo)
```

### Slicing

Extraé sublistas con `[inicio:fin:paso]`:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers[2:5]     # [2, 3, 4]
numbers[:3]      # [0, 1, 2]
numbers[7:]      # [7, 8, 9]
numbers[::2]     # [0, 2, 4, 6, 8]
numbers[::-1]    # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

### Métodos de Listas

```python
fruits = ["apple", "banana"]
fruits.append("cherry")     # ["apple", "banana", "cherry"]
fruits.insert(1, "blueberry")  # ["apple", "blueberry", "banana", "cherry"]
fruits.remove("banana")     # Elimina la primera ocurrencia
popped = fruits.pop()       # Elimina y devuelve el último elemento
fruits.sort()               # Ordena in-place
fruits.reverse()            # Invierte in-place
index = fruits.index("apple")  # Encuentra el índice de un elemento
count = fruits.count("apple")  # Cuenta ocurrencias
```

### List Comprehension

Forma concisa de crear listas:

```python
# Básico
squares = [x ** 2 for x in range(10)]

# Con condición
evens = [x for x in range(20) if x % 2 == 0]

# Anidado
matrix = [[i * j for j in range(3)] for i in range(3)]
```

### Mutabilidad

Las listas son **mutables** — podés cambiar elementos:

```python
fruits = ["apple", "banana", "cherry"]
fruits[1] = "blueberry"     # ["apple", "blueberry", "cherry"]
```

### Operaciones Comunes

```python
len(list)        # Cantidad de elementos
x in list        # Test de pertenencia
list1 + list2    # Concatenación
list * 3         # Repetición
min(list)        # Mínimo
max(list)        # Máximo
sum(list)        # Suma (listas numéricas)
```

## Explicación Visual

```
Indexación de Listas (desde 0):

Índice:   0      1      2      3      4
      ┌──────┬──────┬──────┬──────┬──────┐
      │ "a"  │ "b"  │ "c"  │ "d"  │ "e"  │
      └──────┴──────┴──────┴──────┴──────┘
Índice:  -5     -4     -3     -2     -1

Slicing [inicio:fin]:
  [1:4] → "b", "c", "d"  (fin es exclusivo)
  [:3]  → "a", "b", "c"
  [2:]  → "c", "d", "e"
```

## Implementación en Python

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

## Ejemplo de Biotecnología

**Escenario**: Procesando datos de expresión génica con listas.

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

## Ejemplo SaaS

**Escenario**: Procesando datos de transacciones de clientes.

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
    ((transactions[i] - transactions[i-1]) / transactions[i-1]) * 100
    for i in range(1, len(transactions))
]

print(f"Total: ${total:,.2f}")
print(f"Promedio: ${average:,.2f}")
print(f"Transacciones de alto valor (> prom.): {high_value}")
print(f"Tasas de crecimiento: {[f'{g:.1f}%' for g in growth_rates]}")
```

## Errores Comunes

1. **Índice fuera de rango**: Acceder a un índice ≥ len(lista) lanza IndexError
2. **Confundir append y extend**: `append` agrega un elemento; `extend` agrega elementos de un iterable
3. **Modificar la lista mientras se itera**: Crea bugs sutiles. Iterá sobre una copia: `for x in lista[:]:`
4. **Confusión con copia superficial**: `lista2 = lista1` no copia; referencian al mismo objeto. Usá `lista2 = lista1.copy()` o `lista2 = lista1[:]`
5. **Error de off-by-one en slicing**: `lista[a:b]` incluye a, excluye b

## Buenas Prácticas

- Usá list comprehensions para transformaciones simples
- Usá `enumerate()` cuando necesites índice y valor
- Usá `zip()` para iterar sobre múltiples listas en paralelo
- Preferí `in` para pruebas de pertenencia sobre bucles manuales
- Usá `copy()` o `[:]` para crear copias independientes
- Evitá modificar listas mientras iterás

## Resumen

- Las listas son colecciones ordenadas y mutables creadas con `[]`
- Indexación: desde 0, índices negativos desde el final
- Slicing: `[inicio:fin:paso]` crea sublistas
- Métodos: append, insert, remove, pop, sort, reverse
- List comprehensions: `[expr for item in iterable if condition]`
- Las listas pueden contener tipos mixtos y listas anidadas

## Términos Clave

- **Lista**: Colección ordenada y mutable
- **Índice**: Posición numérica de un elemento (desde 0)
- **Slice**: Subconjunto de una lista
- **Mutabilidad**: Capacidad de cambiar después de creada
- **List comprehension**: Sintaxis concisa para crear listas
- **Lista anidada**: Lista que contiene listas (multidimensional)
- **Copia superficial**: Nueva referencia al mismo objeto

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es el resultado de `[1, 2, 3][::-1]`?
2. ¿Cuál es la diferencia entre `append()` y `extend()`?
3. ¿Qué devuelve `len([1, [2, 3], 4])`?

### Nivel 2: Implementación

4. Escribí una función `remove_duplicates(items)` que devuelva una nueva lista sin duplicados, preservando el orden.
5. Usá un list comprehension para crear una lista de todos los cuadrados pares (cuadrados de números pares) del 1 al 20.

### Nivel 3: Pensamiento Crítico

6. Compará la complejidad temporal de las operaciones con listas: indexación, append, insert, remove, in. ¿Por qué `in` en una lista es lento para listas grandes?
7. ¿Cuándo elegirías una lista sobre una tupla, y viceversa? ¿Cuáles son los trade-offs?

## Desafío de Código

Escribí un programa que implemente un calculador de **promedio móvil con ventana**:
1. Dada una lista de números y un tamaño de ventana k
2. Calculá el promedio de cada k elementos consecutivos
3. Devolvé una lista de estos promedios
4. Ejemplo: `rolling_average([1, 2, 3, 4, 5], 3)` → `[2.0, 3.0, 4.0]`
5. Usá list comprehension y slicing
6. Manejá casos borde: lista vacía, k > len(lista), k = 1
