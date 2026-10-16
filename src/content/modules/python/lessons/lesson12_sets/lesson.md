---
Module: 2
Lesson Number: 12
Lesson Title: Conjuntos
Estimated Duration: 30 minutos
Prerequisites: L9 — Listas
Learning Objectives:
  - Crear conjuntos y explicar sus propiedades (sin orden, únicos, hashables)
  - "Realizar operaciones de conjuntos: unión, intersección, diferencia, diferencia simétrica"
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

<Section number={1} title="¿Por qué Sets?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas ordenan, las tuplas congelan, los diccionarios asocian — pero ninguna de ellas responde '¿este elemento está aquí?' de forma instantánea.",
    "Los conjuntos existen para dos tareas: eliminar duplicados y prueba de pertenencia rápida.",
    "En biotecnología aparecen al comparar genes únicos entre experimentos, variantes comunes entre pacientes y secuencias duplicadas.",
    "En SaaS sirven para contar usuarios únicos, features comunes entre planes y filtrar eventos duplicados en logs.",
    "Y como plus, traen las operaciones matemáticas de conjuntos: unión, intersección, diferencia y diferencia simétrica.",
  ]}
/>

<ConceptCard variant="key-idea">
Los conjuntos son colecciones **sin orden**, de elementos **únicos** y **hashables**, optimizadas para unicidad y para preguntas del tipo "¿está este elemento?".
</ConceptCard>

- En lecciones anteriores aprendiste listas (ordenadas, mutables), tuplas (ordenadas, inmutables) y diccionarios (clave-valor).
- Los conjuntos comparten la implementación basada en hash con los diccionarios, pero almacenan solo claves.
- Entender los conjuntos completa tu conocimiento de las estructuras de datos principales de Python.

</RevealSequence>
</Section>

<Section number={2} title="Teoría de Conjuntos" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un conjunto responde '¿está?' en tiempo constante O(1) gracias a su tabla hash interna.",
    "Ese truco de la tabla hash es la misma idea que el diccionario sin valores.",
    "Volvamos a los sets en Python: cómo se crean, qué propiedades tienen y qué operaciones traen.",
  ]}
/>

<ConceptCard variant="definition">
Set: colección sin orden de elementos únicos y hashables, creada con `{a, b}` o `set(iterable)`; el vacío se escribe `set()`.
</ConceptCard>

Los conjuntos se crean con llaves o con `set()`. Nota: `{}` crea un diccionario vacío.

```python
empty = set()           # Nota: {} crea un dict vacío
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 2, 1])  # {1, 2, 3} — duplicados eliminados
string_set = set("hello")  # {'h', 'e', 'l', 'o'}
```

Propiedades de los conjuntos:

- **Sin orden**: los elementos no tienen posición ni índice.
- **Únicos**: no hay elementos duplicados.
- **Mutables**: se pueden agregar o eliminar elementos.
- **Solo elementos hashables**: los elementos deben ser inmutables (como las claves de dict).

Operaciones de conjuntos:

```python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

a | b          # Unión: {1, 2, 3, 4, 5, 6, 7, 8}
a & b          # Intersección: {4, 5}
a - b          # Diferencia: {1, 2, 3}
b - a          # Diferencia: {6, 7, 8}
a ^ b          # Diferencia simétrica: {1, 2, 3, 6, 7, 8}
```

Métodos de conjuntos:

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

Frozenset: versión inmutable de set, usable como clave de diccionario:

```python
fs = frozenset([1, 2, 3])
# fs.add(4)  # AttributeError: 'frozenset' object has no attribute 'add'
```

Prueba de pertenencia: los conjuntos son mucho más rápidos que las listas para `in`:

```python
# O(1) para set vs O(n) para lista
if item in my_set:  # Rápido
    pass
```

Diagrama de Venn (ASCII, candidato a player visual):

```python
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

</RevealSequence>
</Section>

<Section number={3} title="Implementación en Python" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Crear conjuntos, operar sobre ellos y medir la velocidad de la pertenencia: los tres movimientos clave.",
    "Observa el ejemplo de rendimiento: el mismo `in` sobre lista y sobre set con un millón de elementos.",
    "La diferencia de tiempo es la razón por la que conviene mover consultas repetidas a un set.",
  ]}
/>

<ConceptCard variant="key-idea">
Primero datos únicos, luego operaciones, luego la pregunta "¿está?" — esa es la receta típica de sets en código real.
</ConceptCard>

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

</RevealSequence>
</Section>

<Section number={4} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Dos escenarios: comparar conjuntos de genes entre experimentos y analizar adopción de features en SaaS.",
    "En ambos, la traza mental es la misma: unión para 'todo', intersección para 'comunes', diferencia para 'exclusivos'.",
    "Intenta predecir el resultado antes de ejecutar el código.",
  ]}
/>

**Escenario biotecnología** — comparando conjuntos de genes entre diferentes experimentos:

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

**Escenario SaaS** — analizando adopción de funcionalidades por usuarios:

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

</RevealSequence>
</Section>

<Section number={5} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los errores con sets son silenciosos porque `{}` parece inocente pero crea un dict.",
    "Otros clásicos: asumir orden, meter mutables, modificar mientras iteras.",
    "La buena noticia: son fáciles de evitar si sabes qué preguntar antes de escribir.",
  ]}
/>

Erros comunes:

- **Usar `{}` para conjunto vacío**: crea un dict vacío, no un conjunto — usa `set()`.
- **Asumir orden en conjuntos**: no tienen orden, no confíes en el orden de los elementos.
- **Agregar elementos mutables**: no se pueden agregar listas o dicts a un conjunto.
- **Modificar un conjunto mientras se itera**: mismo problema que con listas.
- **Confundir `add` y `update`**: `add` agrega un elemento; `update` agrega elementos de un iterable.

Buenas prácticas:

- Usa conjuntos para prueba de pertenencia rápida (`in` es O(1)).
- Usa conjuntos para eliminar duplicados de secuencias.
- Usa operaciones de conjuntos (unión, intersección, diferencia) para análisis.
- Usa `frozenset` cuando necesites un conjunto inmutable y hashable (por ejemplo, como clave de dict).
- Prefiere `discard` sobre `remove` cuando no estés seguro de que el elemento exista.

</RevealSequence>
</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
Un set es una colección sin orden de elementos únicos y hashables con pertenencia O(1); sus operaciones (unión, intersección, diferencia) comparan conjuntos y `frozenset` permite usarlos como claves.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "conjunto", label: "Conjunto", detail: "Colección sin orden de elementos únicos y hashables." },
    { id: "creacion", label: "Creación", detail: "Se crea con `{1, 2, 3}` o `set([1, 2, 3])`; conjunto vacío con `set()`." },
    { id: "operaciones", label: "Operaciones", detail: "Unión (`|`), intersección (`&`), diferencia (`-`), diferencia simétrica (`^`)." },
    { id: "metodos", label: "Métodos", detail: "add, remove, discard, pop, clear." },
    { id: "frozenset", label: "frozenset", detail: "Versión inmutable y hashable." },
    { id: "pertenencia", label: "Pertenencia O(1)", detail: "Mucho más rápida que en listas." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss-conjunto", label: "Conjunto", detail: "Colección sin orden de elementos únicos." },
    { id: "gloss-frozenset", label: "Frozenset", detail: "Versión inmutable de un conjunto." },
    { id: "gloss-union", label: "Unión", detail: "Todos los elementos de ambos conjuntos." },
    { id: "gloss-interseccion", label: "Intersección", detail: "Elementos comunes a ambos conjuntos." },
    { id: "gloss-diferencia", label: "Diferencia", detail: "Elementos en un conjunto pero no en el otro." },
    { id: "gloss-simetrica", label: "Diferencia simétrica", detail: "Elementos en exactamente uno de los conjuntos." },
    { id: "gloss-hashable", label: "Hashable", detail: "Se puede usar como elemento (tipos inmutables)." },
    { id: "gloss-prueba", label: "Prueba de pertenencia", detail: "Verificar si un elemento está (O(1))." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué operación devuelve todos los elementos presentes en A o en B?"
  moduleSlug="python"
  lessonSlug="lesson12_sets"
  blockId="choice-python-l12-resumen-1"
  allowContinueOnIncorrect
  explanation="La unión (`|` o `union()`) reúne todos los elementos de ambos conjuntos."
  options={[
    { id: "a", label: "Unión (|)", correct: true, feedback: "¡Exacto! A | B incluye todo lo de A y B." },
    { id: "b", label: "Intersección (&)", correct: false, feedback: "Esa da sólo los elementos comunes." },
    { id: "c", label: "Diferencia (-)", correct: false, feedback: "Esa da los de A que no están en B." },
    { id: "d", label: "Diferencia simétrica (^)", correct: false, feedback: "Esa da los que están en uno u otro, pero no en ambos." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Sets dominados! Ya comparás colecciones sin orden — NumPy del próximo bloque lleva estas ideas a arreglos numéricos.
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
    "Recuerda que un set vacío se escribe `set()` y que el orden no importa.",
  ]}
/>

Nivel 1 — Básico:

1. ¿Cómo creas un conjunto vacío?
2. ¿Cuál es la salida de `set([1, 2, 2, 3, 1, 3])`?
3. ¿Cuál es la diferencia entre `add()` y `update()` para conjuntos?

Nivel 2 — Implementación:

4. Escribe una función `unique_words(texto)` que devuelva un conjunto de palabras únicas en un string.
5. Dadas dos listas (por ejemplo, usuarios que vieron una página y usuarios que compraron), encuentra los usuarios que vieron pero no compraron.

Nivel 3 — Pensamiento Crítico:

6. ¿Por qué la prueba de pertenencia es O(1) para conjuntos pero O(n) para listas? ¿Cómo es la implementación subyacente?
7. ¿Cómo encontrarías elementos que aparecen en al menos k de n conjuntos sin usar Counter?

Desafío de Código — similitud de Jaccard:

1. Similitud de Jaccard = |A ∩ B| / |A ∪ B| (tamaño de intersección / tamaño de unión).
2. Escribe `jaccard_similarity(conjunto1, conjunto2)` que devuelva un valor entre 0 y 1.
3. Dada una lista de conjuntos de genes (cada uno un conjunto de nombres de genes), encuentra el par con la mayor similitud de Jaccard.
4. También encuentra el par con la menor similitud de Jaccard.
5. Prueba con al menos 5 conjuntos de genes de diferentes tamaños.

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Cuál es la salida de `set([1, 2, 2, 3, 1, 3])`?"
  moduleSlug="python"
  lessonSlug="lesson12_sets"
  blockId="choice-python-l12-conjuntos-1"
  allowContinueOnIncorrect
  explanation="Los conjuntos eliminan duplicados y el orden no importa, por lo que el resultado es {1, 2, 3}."
  options={[
    { id: "a", label: "{1, 2, 3}", correct: true, feedback: "¡Correcto! Los duplicados se eliminan." },
    { id: "b", label: "[1, 2, 2, 3, 1, 3]", correct: false, feedback: "Eso sería la lista original, no un set." },
    { id: "c", label: "{1, 1, 2, 2, 3, 3}", correct: false, feedback: "Los sets no conservan duplicados." },
    { id: "d", label: "Error de tipo", correct: false, feedback: "No lanza error; set acepta cualquier iterable." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué construye la expresión `{}` en Python?"
  moduleSlug="python"
  lessonSlug="lesson12_sets"
  blockId="choice-python-l12-operaciones-2"
  allowContinueOnIncorrect
  explanation="Los literales vacíos con llaves crean un diccionario; para un set vacío usa `set()`."
  options={[
    { id: "a", label: "Un dict vacío", correct: true, feedback: "¡Correcto! {} es un dict, no un set." },
    { id: "b", label: "Un set vacío", correct: false, feedback: "Para un set vacío se usa set()." },
    { id: "c", label: "Un error de sintaxis", correct: false, feedback: "La expresión es válida y crea un dict." },
    { id: "d", label: "Un frozenset vacío", correct: false, feedback: "frozenset() requiere llamada explícita." },
  ]}
/>

</RevealSequence>
</Section>