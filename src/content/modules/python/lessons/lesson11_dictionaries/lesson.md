---
Module: 2
Lesson Number: 11
Lesson Title: Diccionarios
Estimated Duration: 60 minutos
Prerequisites: L9 — Listas
Learning Objectives:
  - Crear diccionarios con pares clave-valor
  - Acceder, agregar, actualizar y eliminar entradas de diccionarios
  - "Usar métodos de diccionarios: keys(), values(), items(), get()"
  - Escribir dictionary comprehensions
  - Usar diccionarios para agregación y conteo de datos
Keywords: diccionario, clave, valor, mapeo, tabla hash, comprehension
Difficulty: Beginner
Programming Concepts: Pares clave-valor, tablas hash, mapeo
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Diccionarios

<Section number={1} title="¿Por qué Diccionarios?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las listas indexan por posición: el elemento 3 es el tercero.",
    "Pero en la vida real buscas a un paciente por su ID, no por su posición en una fila.",
    "Los diccionarios te dejan buscar por clave: un mapeo directo nombre → valor.",
    "Son la estructura más importante de Python para ciencia de datos.",
  ]}
/>

<ConceptCard variant="key-idea">
Un diccionario almacena pares **clave-valor**. La clave debe ser inmutable y hashable (string, número, tupla); el valor puede ser cualquier cosa.
</ConceptCard>

- Después de listas (ordenadas, indexadas por posición) y tuplas (inmutables), los diccionarios introducen una nueva organización: **por clave** en lugar de por posición.
- Esto se acerca más a cómo funcionan los datos del mundo real.
- Más adelante vas a usar diccionarios extensivamente con Pandas DataFrames.

</RevealSequence>
</Section>

<Section number={2} title="Pares Clave-Valor" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cómo creas uno? Con llaves `{}` y pares `clave: valor` separados por coma.",
    "Accedes con `d[clave]` (inseguro) o `d.get(clave)` (seguro, devuelve None si falta).",
    "Agregar, actualizar y borrar son simples: `d[nueva] = valor`, `del d[clave]`, `d.pop(clave)`.",
  ]}
/>

Los diccionarios se crean con llaves `{}`:

```python
empty = {}
student = {"name": "Alice", "age": 22, "grade": "A"}
scores = dict(Alice=95, Bob=87, Charlie=92)  # Usando dict()
pairs = [("a", 1), ("b", 2)]
from_pairs = dict(pairs)
```

Accediendo a valores:

```python
student = {"name": "Alice", "age": 22, "grade": "A"}
print(student["name"])       # "Alice"
print(student.get("name"))   # "Alice" (acceso seguro)
print(student.get("gpa"))    # None (sin error)
print(student.get("gpa", 0.0))  # 0.0 (valor por defecto)
```

Agregar y actualizar:

```python
student = {"name": "Alice"}
student["age"] = 22          # Agregar nuevo par clave-valor
student["name"] = "Bob"      # Actualizar valor existente
student.update({"grade": "A", "year": 2024})  # Múltiples actualizaciones
```

Eliminar entradas:

```python
del student["grade"]          # Eliminar par clave-valor
popped = student.pop("age")   # Eliminar y devolver valor
student.clear()               # Eliminar todas las entradas
```

Métodos de diccionarios:

```python
d = {"a": 1, "b": 2, "c": 3}
d.keys()      # dict_keys(['a', 'b', 'c'])
d.values()    # dict_values([1, 2, 3])
d.items()     # dict_items([('a', 1), ('b', 2), ('c', 3)])
d.get("a")    # 1 (acceso seguro)
d.setdefault("d", 4)  # Establecer si la clave no existe
```

<ConceptCard variant="warning">
Acceder a una clave inexistente con `d["missing"]` lanza `KeyError`. Usa `d.get("missing")` o `d.get("missing", default)`.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={3} title="Dictionary Comprehensions y Operaciones" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Como las list comprehensions, los diccionarios también tienen su versión compacta.",
    "`{k: v for k, v in iterable}` construye un mapeo en una sola expresión.",
    "Y bajo el capó todo es tabla hash: búsqueda O(1).",
  ]}
/>

Dictionary comprehension:

```python
squares = {x: x ** 2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Con condición
even_squares = {x: x ** 2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Desde dos listas
keys = ["a", "b", "c"]
values = [1, 2, 3]
combined = {k: v for k, v in zip(keys, values)}
```

Operaciones con diccionarios:

```python
len(d)            # Cantidad de pares clave-valor
"key" in d        # Test de pertenencia sobre claves
"key" not in d    # No pertenencia
d1 | d2           # Fusión (Python 3.9+)
d1 |= d2          # Actualización in-place (Python 3.9+)
```

Referencia visual de la tabla hash:

```python
Estructura del Diccionario (Tabla Hash)

Clave      Función Hash    Bucket
┌──────┐   ┌──────────┐   ┌───────┐
│"name"│ → │ hash()   │ → │ Índice│ → "Alice"
├──────┤   └──────────┘   ├───────┤
│"age" │ → │ hash()   │ → │ Índice│ → 22
├──────┤   └──────────┘   ├───────┤
│"grade"│→ │ hash()   │ → │ Índice│ → "A"
└──────┘   └──────────┘   └───────┘

La búsqueda por clave es O(1): muy rápida.
```

</RevealSequence>
</Section>

<Section number={4} title="Implementación y Ejemplos" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Teoría lista; ahora expresión génica y secuencias de ADN.",
    "El patrón contar-con-diccionario es uno de los más útiles en bioinformática.",
    "También verás aggregation por usuario en un log de actividad.",
  ]}
/>

Creando un diccionario de expresión génica:

```python
# Creando un diccionario
gene_expression = {
    "BRCA1": 2.5,
    "TP53": 1.8,
    "EGFR": 3.2,
    "MYC": 0.9,
    "KRAS": -2.1
}

# Accediendo a valores
print(f"Expresión de BRCA1: {gene_expression['BRCA1']}")
print(f"Expresión de TP53: {gene_expression.get('TP53', 'N/A')}")

# Agregando/actualizando
gene_expression["ALK"] = 1.5
gene_expression["MYC"] = 1.2  # Actualizar

# Iterando
for gene, expression in gene_expression.items():
    status = "up" if expression > 0 else "down"
    print(f"{gene}: {expression:.1f} ({status})")
```

Contando bases con diccionarios:

```python
# Contando con diccionarios
sequence = "ATCGATCGATCGATCG"
base_counts = {}
for base in sequence:
    base_counts[base] = base_counts.get(base, 0) + 1
print(base_counts)
# {'A': 4, 'T': 4, 'C': 4, 'G': 4}
```

Invertir un diccionario con comprehension:

```python
# Dictionary comprehension
# Invertir un diccionario
expression = {"BRCA1": 2.5, "TP53": 1.8, "EGFR": 3.2}
inverted = {v: k for k, v in expression.items()}
print(inverted)
# {2.5: 'BRCA1', 1.8: 'TP53', 3.2: 'EGFR'}
```

Agrupar genes con `defaultdict`:

```python
# Default dict para estructuras anidadas
from collections import defaultdict

# Agrupar genes por nivel de expresión
gene_data = [("BRCA1", 2.5), ("TP53", -1.2), ("EGFR", 3.8),
             ("MYC", 0.9), ("KRAS", -2.1), ("ALK", 1.5)]

by_status = defaultdict(list)
for gene, expr in gene_data:
    status = "up" if expr > 0 else "down"
    by_status[status].append(gene)

print(dict(by_status))
# {'up': ['BRCA1', 'EGFR', 'MYC', 'ALK'], 'down': ['TP53', 'KRAS']}
```

Ejemplo de biotecnología — traducción de ADN a proteína:

```python
# Tabla de codones (parcial)
codon_table = {
    "ATG": "M", "TAA": "*", "TAG": "*", "TGA": "*",
    "TTT": "F", "TTC": "F", "TTA": "L", "TTG": "L",
    "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
    "ATT": "I", "ATC": "I", "ATA": "I", "GTT": "V",
    "GTC": "V", "GTA": "V", "GTG": "V",
}

def translate_dna(dna_sequence):
    """Traducir secuencia de ADN a proteína."""
    protein = []
    for i in range(0, len(dna_sequence) - 2, 3):
        codon = dna_sequence[i:i+3].upper()
        amino_acid = codon_table.get(codon, "?")
        protein.append(amino_acid)
        if amino_acid == "*":  # Codón de parada
            break
    return "".join(protein)

dna = "ATGGCCCTTAAGTAATGA"
protein = translate_dna(dna)
print(f"ADN: {dna}")
print(f"Proteína: {protein}")
```

Ejemplo SaaS — agregación de actividad de usuarios:

```python
# Log de actividad de usuarios
activity_log = [
    ("user_001", "login"), ("user_002", "purchase"),
    ("user_001", "view"), ("user_003", "login"),
    ("user_002", "logout"), ("user_001", "purchase"),
]

# Contar eventos por usuario
user_events = {}
for user, event in activity_log:
    if user not in user_events:
        user_events[user] = {}
    user_events[user][event] = user_events[user].get(event, 0) + 1

print("Resumen de actividad de usuarios:")
for user, events in sorted(user_events.items()):
    total = sum(events.values())
    print(f"  {user}: {total} eventos - {events}")
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
    "Los diccionarios son seguros, pero la trampa está en las claves.",
    "Acceder a una clave inexistente lanza `KeyError`; por eso `get()` es tu aliado.",
    "Las listas no pueden ser claves: recuerda que deben ser hashables.",
  ]}
/>

<ConceptCard variant="warning">
Errores comunes:
- Acceder a una clave inexistente directamente: `d["missing"]` lanza `KeyError`. Usa `d.get("missing")`.
- Claves mutables: las listas no pueden ser claves de diccionarios. Usa tuplas.
- Sobrescribir claves sin querer: cada clave solo puede aparecer una vez; asignar a una clave existente la sobrescribe.
- Asumir orden en diccionarios: Python 3.7+ preserva el orden de inserción, pero no confíes en versiones anteriores.
- Confundir `in` para claves vs valores: `"key" in d` verifica claves, no valores.
</ConceptCard>

<ConceptCard variant="key-idea">
Buenas prácticas:
- Usa `get()` con valores por defecto para acceso seguro.
- Usa `defaultdict` para diccionarios anidados o de conteo.
- Usa dictionary comprehensions para creación concisa.
- Usa `items()` cuando iteres sobre claves y valores.
- Usa `setdefault()` para inserción condicional.
- Prefiere `collections.Counter` para tareas de conteo.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
Un diccionario mapea claves hashables a valores con búsqueda O(1): accedé con seguridad usando `get()`, recorré con `items()` y generá con comprehensions; `defaultdict` y `Counter` cubren conteos y claves faltantes.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "diccionario", label: "Diccionario", detail: "Almacena pares clave-valor usando `{}`." },
    { id: "acceso", label: "Acceso", detail: "`d[clave]` es inseguro; `d.get(clave)` es seguro." },
    { id: "claves", label: "Claves", detail: "Deben ser inmutables y hashables (strings, números, tuplas)." },
    { id: "metodos", label: "Métodos", detail: "`keys()`, `values()`, `items()`, `get()`, `update()`, `pop()`." },
    { id: "comprehension", label: "Dictionary comprehension", detail: "`{k: v for k, v in iterable}`." },
    { id: "o1", label: "Búsqueda O(1)", detail: "Los diccionarios tienen búsqueda muy rápida." },
    { id: "especializados", label: "Especializados", detail: "Usa `defaultdict` y `Counter` para necesidades especializadas." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss-diccionario", label: "Diccionario", detail: "Mapeo de claves a valores (sin orden, ordenado por inserción en 3.7+)." },
    { id: "gloss-clave", label: "Clave", detail: "Identificador inmutable usado para búsqueda." },
    { id: "gloss-valor", label: "Valor", detail: "Dato asociado a una clave." },
    { id: "gloss-hash", label: "Tabla hash", detail: "Estructura de datos subyacente de los diccionarios." },
    { id: "gloss-keyerror", label: "KeyError", detail: "Excepción al acceder a una clave inexistente." },
    { id: "gloss-defaultdict", label: "defaultdict", detail: "Diccionario que provee valores por defecto para claves faltantes." },
    { id: "gloss-counter", label: "Counter", detail: "Subclase de diccionario para contar objetos hashables." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué devuelve {'a': 1}.get('b', 0)?"
  moduleSlug="python"
  lessonSlug="lesson11_dictionaries"
  blockId="choice-python-l11-resumen-1"
  allowContinueOnIncorrect
  explanation="get() devuelve el valor por defecto 0 cuando la clave no existe, sin lanzar KeyError."
  options={[
    { id: "a", label: "0", correct: true, feedback: "¡Exacto! 'b' no existe, así que devuelve 0." },
    { id: "b", label: "KeyError", correct: false, feedback: "get() no lanza excepción; devuelve el default." },
    { id: "c", label: "None", correct: false, feedback: "Sería None solo si no pasás default." },
    { id: "d", label: "'b'", correct: false, feedback: "get() devuelve el valor asociado, no la clave." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Diccionarios dominados! Ya mapeás claves a valores — los sets del próximo bloque completan las colecciones.
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
    "ejercicios y un desafío de código.",
    "Piensa en cuándo una clave inexistente aparece y cómo manejarla.",
  ]}
/>

Nivel 1 — Básico:
1. ¿Qué pasa si intentas acceder a una clave que no existe usando `d["missing"]`?
2. ¿Qué tipos se pueden usar como claves de diccionarios?
3. ¿Qué devuelve `d.get("key", default)` si `"key"` no está en el diccionario?

Nivel 2 — Implementación:
4. Escribe una función `word_count(texto)` que devuelva un diccionario contando frecuencias de palabras en un string.
5. Dado un diccionario de calificaciones de estudiantes, escribe una función que devuelva el estudiante con el promedio más alto.

Nivel 3 — Pensamiento Crítico:
6. ¿Cómo logran los diccionarios de Python un tiempo de búsqueda O(1)? ¿Qué es una colisión de hash y cómo se resuelve?
7. ¿Cuándo usarías un `defaultdict` en lugar de un diccionario común con `get()`? Proporciona un ejemplo concreto.

Desafío de Código — almacén clave-valor en memoria:
1. Empieza con un diccionario vacío.
2. Implementa funciones: `put(key, value)`, `get(key)`, `delete(key)`, `keys()`, `values()`, `search(campo, valor)`.
3. Almacena datos estructurados: cada valor debe ser un diccionario con campos como `{"name": "...", "age": ..., "city": "..."}`.
4. Implementa `search(campo, valor)` que devuelva todas las entradas donde `entrada[campo] == valor`.
5. Demuestra con al menos 10 registros y 3 búsquedas.
6. Usa un `defaultdict` para indexar datos por campos para búsqueda más rápida.

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question={"¿Qué devuelve d.get(\"missing\", 0) si la clave no existe?"}
  moduleSlug="python"
  lessonSlug="lesson11_dictionaries"
  blockId="choice-python-l11-diccionarios-1"
  allowContinueOnIncorrect
  explanation="`get` devuelve el valor por defecto (0) sin lanzar KeyError cuando la clave no existe."
  options={[
    { id: "a", label: "0", correct: true, feedback: "¡Correcto! `get` no lanza KeyError." },
    { id: "b", label: "KeyError", correct: false, feedback: "Eso pasaría con `d[\"missing\"]`, no con `get`." },
    { id: "c", label: "None", correct: false, feedback: "Solo si no pasas valor por defecto." },
    { id: "d", label: "False", correct: false, feedback: "No, el valor por defecto es el que indicas." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál de estos tipos NO puede ser clave de un diccionario?"
  moduleSlug="python"
  lessonSlug="lesson11_dictionaries"
  blockId="choice-python-l11-diccionarios-2"
  allowContinueOnIncorrect
  explanation="Las claves deben ser hashables e inmutables; las listas son mutables y no hashables."
  options={[
    { id: "a", label: "Lista", correct: true, feedback: "¡Correcto! Las listas son mutables y no hashables." },
    { id: "b", label: "String", correct: false, feedback: "Los strings son claves válidas." },
    { id: "c", label: "Tupla", correct: false, feedback: "Las tuplas son hashables." },
    { id: "d", label: "Número entero", correct: false, feedback: "Los enteros son hashables." },
  ]}
/>

</RevealSequence>
</Section>
