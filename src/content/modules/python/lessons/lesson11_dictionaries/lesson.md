---
Module: 2
Lesson Number: 11
Lesson Title: Diccionarios
Estimated Duration: 60 minutos
Prerequisites: L9 — Listas
Learning Objectives:
  - Crear diccionarios con pares clave-valor
  - Acceder, agregar, actualizar y eliminar entradas de diccionarios
  - Usar métodos de diccionarios: keys(), values(), items(), get()
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

## Motivación

Los diccionarios almacenan datos como pares clave-valor, permitiéndote buscar valores por una clave significativa en lugar de por un índice numérico. Son la estructura de datos incorporada más importante de Python para ciencia de datos. En biotecnología, los diccionarios mapean nombres de genes a valores de expresión, IDs de pacientes a datos clínicos, y codones a aminoácidos. En SaaS, mapean IDs de usuarios a perfiles, nombres de productos a precios, y nombres de métricas a valores.

## Panorama General

Después de aprender sobre listas (ordenadas, indexadas por posición) y tuplas (inmutables), los diccionarios introducen una nueva forma de organizar datos: por clave en lugar de por posición. Esto se acerca más a cómo funcionan los datos del mundo real — buscás un paciente por ID, no por índice numérico. La próxima lección sobre conjuntos usa tecnología similar basada en hash. Más adelante, vas a usar diccionarios extensivamente con Pandas DataFrames.

## Teoría

### Creando Diccionarios

Los diccionarios se crean con llaves `{}`:

```python
empty = {}
student = {"name": "Alice", "age": 22, "grade": "A"}
scores = dict(Alice=95, Bob=87, Charlie=92)  # Usando dict()
pairs = [("a", 1), ("b", 2)]
from_pairs = dict(pairs)
```

### Accediendo a Valores

```python
student = {"name": "Alice", "age": 22, "grade": "A"}
print(student["name"])       # "Alice"
print(student.get("name"))   # "Alice" (acceso seguro)
print(student.get("gpa"))    # None (sin error)
print(student.get("gpa", 0.0))  # 0.0 (valor por defecto)
```

### Agregar y Actualizar

```python
student = {"name": "Alice"}
student["age"] = 22          # Agregar nuevo par clave-valor
student["name"] = "Bob"      # Actualizar valor existente
student.update({"grade": "A", "year": 2024})  # Múltiples actualizaciones
```

### Eliminar Entradas

```python
del student["grade"]          # Eliminar par clave-valor
popped = student.pop("age")   # Eliminar y devolver valor
student.clear()               # Eliminar todas las entradas
```

### Métodos de Diccionarios

```python
d = {"a": 1, "b": 2, "c": 3}
d.keys()      # dict_keys(['a', 'b', 'c'])
d.values()    # dict_values([1, 2, 3])
d.items()     # dict_items([('a', 1), ('b', 2), ('c', 3)])
d.get("a")    # 1 (acceso seguro)
d.setdefault("d", 4)  # Establecer si la clave no existe
```

### Dictionary Comprehension

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

### Operaciones con Diccionarios

```python
len(d)            # Cantidad de pares clave-valor
"key" in d        # Test de pertenencia sobre claves
"key" not in d    # No pertenencia
d1 | d2           # Fusión (Python 3.9+)
d1 |= d2          # Actualización in-place (Python 3.9+)
```

## Explicación Visual

```
Estructura del Diccionario (Tabla Hash)

Clave      Función Hash    Bucket
┌──────┐   ┌──────────┐   ┌───────┐
│"name"│ → │ hash()   │ → │ Índice│ → "Alice"
├──────┤   └──────────┘   ├───────┤
│"age" │ → │ hash()   │ → │ Índice│ → 22
├──────┤   └──────────┘   ├───────┤
│"grade"│→ │ hash()   │ → │ Índice│ → "A"
└──────┘   └──────────┘   └───────┘

La búsqueda por clave es O(1) — ¡muy rápida!
```

## Implementación en Python

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

```python
# Contando con diccionarios
sequence = "ATCGATCGATCGATCG"
base_counts = {}
for base in sequence:
    base_counts[base] = base_counts.get(base, 0) + 1
print(base_counts)
# {'A': 4, 'T': 4, 'C': 4, 'G': 4}
```

```python
# Dictionary comprehension
# Invertir un diccionario
expression = {"BRCA1": 2.5, "TP53": 1.8, "EGFR": 3.2}
inverted = {v: k for k, v in expression.items()}
print(inverted)
# {2.5: 'BRCA1', 1.8: 'TP53', 3.2: 'EGFR'}
```

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

## Ejemplo de Biotecnología

**Escenario**: Mapeando codones genéticos a aminoácidos para traducción de proteínas.

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

## Ejemplo SaaS

**Escenario**: Agregando datos de actividad de usuarios.

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

## Errores Comunes

1. **Acceder a una clave inexistente directamente**: `d["missing"]` lanza KeyError. Usá `d.get("missing")`
2. **Claves mutables**: Las listas no pueden ser claves de diccionarios. Usá tuplas en su lugar
3. **Sobrescribir claves sin querer**: Cada clave solo puede aparecer una vez; asignar a una clave existente la sobrescribe
4. **Asumir orden en diccionarios**: Python 3.7+ preserva el orden de inserción, pero no confíes en eso para versiones anteriores
5. **Confundir `in` para claves vs valores**: `"key" in d` verifica claves, no valores

## Buenas Prácticas

- Usá `get()` con valores por defecto para acceso seguro
- Usá `defaultdict` para diccionarios anidados o de conteo
- Usá dictionary comprehensions para creación concisa
- Usá `items()` cuando iteres sobre claves y valores
- Usá `setdefault()` para inserción condicional
- Preferí `collections.Counter` para tareas de conteo

## Resumen

- Los diccionarios almacenan pares clave-valor usando `{}`
- Accedé a valores con `d[clave]` (inseguro) o `d.get(clave)` (seguro)
- Las claves deben ser inmutables y hashables (strings, números, tuplas)
- Métodos: keys(), values(), items(), get(), update(), pop()
- Dictionary comprehensions: `{k: v for k, v in iterable}`
- Los diccionarios tienen búsqueda O(1) — muy rápida
- Usá defaultdict y Counter para necesidades especializadas

## Términos Clave

- **Diccionario**: Mapeo de claves a valores (sin orden, pero ordenado por inserción en 3.7+)
- **Clave**: Identificador inmutable usado para búsqueda
- **Valor**: Dato asociado a una clave
- **Tabla hash**: Estructura de datos subyacente de los diccionarios
- **KeyError**: Excepción al acceder a una clave inexistente
- **defaultdict**: Diccionario que provee valores por defecto para claves faltantes
- **Counter**: Subclase de diccionario para contar objetos hashables

## Ejercicios

### Nivel 1: Básico

1. ¿Qué pasa si intentás acceder a una clave que no existe usando `d["missing"]`?
2. ¿Qué tipos se pueden usar como claves de diccionarios?
3. ¿Qué devuelve `d.get("key", default)` si "key" no está en el diccionario?

### Nivel 2: Implementación

4. Escribí una función `word_count(texto)` que devuelva un diccionario contando frecuencias de palabras en un string.
5. Dado un diccionario de calificaciones de estudiantes, escribí una función que devuelva el estudiante con el promedio más alto.

### Nivel 3: Pensamiento Crítico

6. ¿Cómo logran los diccionarios de Python un tiempo de búsqueda O(1)? ¿Qué es una colisión de hash y cómo se resuelve?
7. ¿Cuándo usarías un defaultdict en lugar de un diccionario común con `get()`? Proporcioná un ejemplo concreto.

## Desafío de Código

Escribí un programa que implemente un **almacén clave-valor en memoria** (como una base de datos simple):
1. Empezá con un diccionario vacío
2. Implementá funciones: `put(key, value)`, `get(key)`, `delete(key)`, `keys()`, `values()`, `search(campo, valor)`
3. Almacená datos estructurados: cada valor debe ser un diccionario con campos como `{"name": "...", "age": ..., "city": "..."}`
4. Implementá `search(campo, valor)` que devuelva todas las entradas donde `entrada[campo] == valor`
5. Demostrá con al menos 10 registros y 3 búsquedas
6. Usá un `defaultdict` para indexar datos por campos para búsqueda más rápida
