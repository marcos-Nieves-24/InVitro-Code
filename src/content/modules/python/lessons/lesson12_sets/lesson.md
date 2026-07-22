---
Module: 2
Lesson Number: 12
Lesson Title: Conjuntos
Estimated Duration: 30 minutos
Prerequisites: L9 — Listas
Learning Objectives:
  - Crear conjuntos y explicar sus propiedades (sin orden, únicos, hashables)
  - Realizar operaciones de conjuntos: unión, intersección, diferencia, diferencia simétrica
  - Usar conjuntos para eliminar duplicados y prueba de pertenencia
  - Distinguir entre conjuntos y frozensets
  - Elegir entre conjuntos, listas y tuplas según el caso de uso
Keywords: conjunto, frozenset, unión, intersección, diferencia, pertenencia
Difficulty: Beginner
Programming Concepts: Hash sets, unicidad, operaciones de conjuntos
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Conjuntos

## Motivación

Los conjuntos son colecciones sin orden de elementos únicos. Se destacan en dos tareas: eliminar duplicados y prueba de pertenencia rápida. En biotecnología, los conjuntos ayudan a encontrar genes únicos entre experimentos, identificar variantes comunes entre pacientes y eliminar secuencias duplicadas. En SaaS, los conjuntos rastrean usuarios únicos, encuentran características comunes entre planes y filtran duplicados en logs de eventos.

## Panorama General

En lecciones anteriores aprendiste listas (ordenadas, mutables), tuplas (ordenadas, inmutables) y diccionarios (clave-valor). Los conjuntos son otro tipo fundamental de colección, optimizados para unicidad y operaciones matemáticas de conjuntos. Comparten la implementación basada en hash con los diccionarios pero almacenan solo claves. Entender los conjuntos completa tu conocimiento de las estructuras de datos principales de Python.

## Teoría

### Creando Conjuntos

Los conjuntos se crean con llaves `{}` o `set()`:

```python
empty = set()           # Nota: {} crea un dict vacío
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 2, 1])  # {1, 2, 3} — duplicados eliminados
string_set = set("hello")  # {'h', 'e', 'l', 'o'}
```

### Propiedades de los Conjuntos

- **Sin orden**: Los elementos no tienen posición/índice
- **Únicos**: No hay elementos duplicados
- **Mutables**: Se pueden agregar/eliminar elementos
- **Solo elementos hashables**: Los elementos deben ser inmutables (como las claves de dict)

### Operaciones de Conjuntos

```python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

a | b          # Unión: {1, 2, 3, 4, 5, 6, 7, 8}
a & b          # Intersección: {4, 5}
a - b          # Diferencia: {1, 2, 3}
b - a          # Diferencia: {6, 7, 8}
a ^ b          # Diferencia simétrica: {1, 2, 3, 6, 7, 8}
```

### Métodos de Conjuntos

```python
s = {1, 2, 3}
s.add(4)               # Agregar elemento
s.remove(3)            # Eliminar (KeyError si no existe)
s.discard(10)          # Eliminar (sin error si no existe)
s.pop()                # Eliminar y devolver un elemento arbitrario
s.clear()              # Eliminar todos
s.copy()               # Copia superficial

s.union(other)         # Igual que |
s.intersection(other)  # Igual que &
s.difference(other)    # Igual que -
s.symmetric_difference(other)  # Igual que ^

s.issubset(other)      # s ⊆ other?
s.issuperset(other)    # s ⊇ other?
s.isdisjoint(other)    # s ∩ other = ∅?
```

### Frozenset

Una versión inmutable de set — se puede usar como clave de diccionario:

```python
fs = frozenset([1, 2, 3])
# fs.add(4)  # AttributeError: 'frozenset' object has no attribute 'add'
```

### Prueba de Pertenencia

Los conjuntos son mucho más rápidos que las listas para verificaciones con `in`:

```python
# O(1) para set vs O(n) para lista
if item in my_set:  # Rápido
    pass
```

## Explicación Visual

```
Operaciones de Conjuntos (Diagrama de Venn)

    Set A          Set B
  ┌────────┐    ┌────────┐
  │  1 2 3 │    │  4 5 6 │
  │    4 5 │    │    4 5 │
  │        │    │  7 8   │
  └────────┘    └────────┘

  Unión (A ∪ B):   Intersección (A ∩ B):
  ┌────────────┐  ┌────────┐
  │ 1 2 3 4 5  │  │  4 5   │
  │ 6 7 8      │  └────────┘
  └────────────┘

  Diferencia (A - B):  Diff. Simétrica (A △ B):
  ┌────────┐           ┌────────────────┐
  │ 1 2 3  │           │ 1 2 3 6 7 8    │
  └────────┘           └────────────────┘
```

## Implementación en Python

```python
# Creando conjuntos
unique_genes = {"BRCA1", "TP53", "EGFR", "MYC", "BRCA1", "TP53"}
print(f"Genes únicos: {unique_genes}")  # Duplicados eliminados

# Conjunto desde lista
all_genes = ["BRCA1", "TP53", "EGFR", "BRCA1", "MYC", "TP53"]
unique = set(all_genes)
print(f"Únicos desde lista: {unique}")
```

```python
# Operaciones de conjuntos
expressed = {"BRCA1", "TP53", "EGFR", "ALK"}
mutated = {"TP53", "KRAS", "EGFR", "MYC"}

print(f"Todos los genes: {expressed | mutated}")
print(f"Expresados y mutados: {expressed & mutated}")
print(f"Expresados pero no mutados: {expressed - mutated}")
print(f"En exactamente uno: {expressed ^ mutated}")

# Verificar relaciones
print(f"Es subconjunto: {expressed.issubset(mutated)}")
print(f"Disjuntos: {expressed.isdisjoint({'GATA2', 'FOXA1'})}")
```

```python
# Prueba de pertenencia
valid_genes = {"BRCA1", "TP53", "EGFR", "MYC", "KRAS", "ALK"}
test_gene = "BRCA1"
print(f"¿{test_gene} es válido? {test_gene in valid_genes}")

# Comparación de rendimiento
import time
data_list = list(range(1000000))
data_set = set(data_list)

start = time.time()
for _ in range(1000):
    999999 in data_list
list_time = time.time() - start

start = time.time()
for _ in range(1000):
    999999 in data_set
set_time = time.time() - start

print(f"Pertenencia en lista: {list_time:.4f}s")
print(f"Pertenencia en conjunto: {set_time:.4f}s")
print(f"El conjunto es {list_time/set_time:.0f}x más rápido!")
```

## Ejemplo de Biotecnología

**Escenario**: Comparando conjuntos de genes entre diferentes experimentos.

```python
# Conjuntos de genes de diferentes experimentos
experiment_1 = {"BRCA1", "TP53", "EGFR", "MYC", "KRAS"}
experiment_2 = {"TP53", "EGFR", "ALK", "ROS1", "KRAS"}
experiment_3 = {"BRCA1", "MYC", "ALK", "GATA2", "FOXA1"}

# Genes comunes en todos los experimentos
common = experiment_1 & experiment_2 & experiment_3
print(f"Comunes en los 3: {common if common else 'None'}")

# Genes en al menos 2 experimentos
from collections import Counter
all_genes = experiment_1 | experiment_2 | experiment_3
in_at_least_2 = {g for g in all_genes
                  if sum(g in exp for exp in [experiment_1, experiment_2, experiment_3]) >= 2}
print(f"En al menos 2 experimentos: {in_at_least_2}")

# Únicos de cada experimento
unique_to_1 = experiment_1 - experiment_2 - experiment_3
print(f"Únicos del experimento 1: {unique_to_1}")
```

## Ejemplo SaaS

**Escenario**: Analizando adopción de funcionalidades por usuarios.

```python
# Funcionalidades usadas por diferentes segmentos de clientes
basic_users = {"login", "view", "search", "logout"}
premium_users = {"login", "view", "search", "export", "api", "analytics", "logout"}
enterprise_users = {"login", "view", "search", "export", "api", "analytics",
                    "admin", "sso", "audit", "logout"}

# Funcionalidades comunes a todos los niveles
common_features = basic_users & premium_users & enterprise_users
print(f"Funcionalidades comunes: {common_features}")

# Funcionalidades solo de premium
premium_only = premium_users - basic_users
print(f"Solo premium: {premium_only}")

# Funcionalidades que faltan en basic
missing_from_basic = premium_users | enterprise_users - basic_users
print(f"Faltan en basic: {missing_from_basic}")

# Verificar si un conjunto de funcionalidades es subconjunto
print(f"¿Basic es subconjunto de premium? {basic_users.issubset(premium_users)}")
```

## Errores Comunes

1. **Usar `{}` para conjunto vacío**: Crea un dict vacío, no un conjunto. Usá `set()`
2. **Asumir orden en conjuntos**: Los conjuntos no tienen orden — no confíes en el orden de los elementos
3. **Agregar elementos mutables**: No se pueden agregar listas o dicts a un conjunto
4. **Modificar un conjunto mientras se itera**: Mismo problema que con listas
5. **Confundir `add` y `update`**: `add` agrega un elemento; `update` agrega elementos de un iterable

## Buenas Prácticas

- Usá conjuntos para prueba de pertenencia rápida (`in` es O(1))
- Usá conjuntos para eliminar duplicados de secuencias
- Usá operaciones de conjuntos (unión, intersección, diferencia) para análisis
- Usá `frozenset` cuando necesites un conjunto inmutable y hashable (ej. como clave de dict)
- Preferí `discard` sobre `remove` cuando no estés seguro de que el elemento exista

## Resumen

- Los conjuntos son colecciones sin orden de elementos únicos y hashables
- Se crean con `{1, 2, 3}` o `set([1, 2, 3])`; conjunto vacío con `set()`
- Operaciones: unión (`|`), intersección (`&`), diferencia (`-`), diferencia simétrica (`^`)
- Métodos: add, remove, discard, pop, clear
- Frozenset es inmutable y hashable
- La prueba de pertenencia es O(1) — mucho más rápida que en listas

## Términos Clave

- **Conjunto**: Colección sin orden de elementos únicos
- **Frozenset**: Versión inmutable de un conjunto
- **Unión**: Todos los elementos de ambos conjuntos
- **Intersección**: Elementos comunes a ambos conjuntos
- **Diferencia**: Elementos en un conjunto pero no en el otro
- **Diferencia simétrica**: Elementos en exactamente uno de los conjuntos
- **Hashable**: Se puede usar como elemento de un conjunto (tipos inmutables)
- **Prueba de pertenencia**: Verificar si un elemento está en un conjunto (O(1))

## Ejercicios

### Nivel 1: Básico

1. ¿Cómo creás un conjunto vacío?
2. ¿Cuál es la salida de `set([1, 2, 2, 3, 1, 3])`?
3. ¿Cuál es la diferencia entre `add()` y `update()` para conjuntos?

### Nivel 2: Implementación

4. Escribí una función `unique_words(texto)` que devuelva un conjunto de palabras únicas en un string.
5. Dadas dos listas (ej. usuarios que vieron una página y usuarios que compraron), encontrá los usuarios que vieron pero no compraron.

### Nivel 3: Pensamiento Crítico

6. ¿Por qué la prueba de pertenencia es O(1) para conjuntos pero O(n) para listas? ¿Cómo es la implementación subyacente?
7. ¿Cómo encontrarías elementos que aparecen en al menos k de n conjuntos sin usar Counter?

## Desafío de Código

Escribí un programa que implemente un calculador de **similitud de Jaccard**:
1. Similitud de Jaccard = |A ∩ B| / |A ∪ B| (tamaño de intersección / tamaño de unión)
2. Escribí `jaccard_similarity(conjunto1, conjunto2)` que devuelva un valor entre 0 y 1
3. Dada una lista de conjuntos de genes (cada uno un conjunto de nombres de genes), encontrá el par con la mayor similitud de Jaccard
4. También encontrá el par con la menor similitud de Jaccard
5. Probá con al menos 5 conjuntos de genes de diferentes tamaños
