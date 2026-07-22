---
Module: 2
Lesson Number: 10
Lesson Title: Tuplas
Estimated Duration: 30 minutos
Prerequisites: L9 — Listas
Learning Objectives:
  - Crear tuplas y explicar su inmutabilidad
  - Usar desempaquetado de tuplas para asignación múltiple
  - Comparar tuplas con listas y elegir apropiadamente
  - Usar tuplas como claves de diccionarios
  - Devolver múltiples valores desde funciones usando tuplas
Keywords: tupla, inmutable, desempaquetado, hashable, secuencia
Difficulty: Beginner
Programming Concepts: Secuencias inmutables, empaquetado/desempaquetado, tipos hashables
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Tuplas

## Motivación

Las tuplas suelen llamarse "listas inmutables" — almacenan colecciones ordenadas como las listas pero no se pueden modificar después de creadas. Esta inmutabilidad las hace útiles para datos fijos que no deberían modificarse, como registros de base de datos, coordenadas y valores de retorno de funciones. En biotecnología, las tuplas representan pares (gen, expresión), registros (id_paciente, diagnóstico) y tripletes de codones de ADN. En SaaS, almacenan entradas de log (id_usuario, timestamp, evento).

## Panorama General

En la lección anterior aprendiste listas — colecciones ordenadas y mutables. Las tuplas son ordenadas pero inmutables. Entender la diferencia entre estructuras de datos mutables e inmutables es crucial para escribir código correcto y eficiente. Esta lección te prepara para los diccionarios (próxima lección), donde las tuplas se usan como claves (las listas no pueden ser claves de diccionarios).

## Teoría

### Creando Tuplas

Las tuplas se crean con paréntesis `()`:

```python
empty = ()
single = (42,)        # Nota: la coma es obligatoria para tuplas de un elemento
pair = (1, 2)
triple = 1, 2, 3      # Los paréntesis son opcionales
mixed = (1, "hello", 3.14)
nested = ((1, 2), (3, 4))
```

### Inmutabilidad

Una vez creada, una tupla no se puede modificar:

```python
point = (3, 4)
point[0] = 5  # TypeError: 'tuple' object does not support item assignment
```

### Desempaquetado de Tuplas

Asigná elementos de una tupla a múltiples variables:

```python
point = (3, 4)
x, y = point          # x=3, y=4

# Swapping con desempaquetado
a, b = 10, 20
a, b = b, a          # a=20, b=10

# Desempaquetado extendido (Python 3)
first, *rest = (1, 2, 3, 4, 5)  # first=1, rest=[2, 3, 4, 5]
```

### Métodos de Tuplas

Las tuplas tienen solo dos métodos:

```python
t = (1, 2, 3, 1, 2, 1)
t.count(1)    # 3
t.index(2)    # 1 (primera ocurrencia)
```

### Cuándo Usar Tuplas

- **Datos fijos**: Coordenadas, valores RGB, registros de base de datos
- **Múltiples valores de retorno**: Las funciones devuelven tuplas por defecto
- **Claves de diccionarios**: Las tuplas son hashables, las listas no
- **Requisitos de inmutabilidad**: Datos que no deberían cambiar
- **Rendimiento**: Las tuplas son ligeramente más rápidas que las listas

### Comparación Tupla vs Lista

| Característica | Tupla | Lista |
|------------|-------|-------|
| Sintaxis | `()` | `[]` |
| Mutable | No | Sí |
| Hashable | Sí (si los elementos son hashables) | No |
| Caso de uso | Datos fijos | Datos variables |
| Métodos | count(), index() | Muchos métodos |
| Memoria | Ligeramente menos | Ligeramente más |
| Velocidad | Ligeramente más rápida | Ligeramente más lenta |

## Explicación Visual

```
Memoria: Tupla vs Lista

Tupla (inmutable):          Lista (mutable):
┌───────────────────┐      ┌───────────────────┐
│ "BRCA1"           │      │ "BRCA1"           │
│ 2.5               │      │ 2.5               │
│ 0.001             │      │ 0.001             │
│                   │      │ ← Puede agregar/eliminar │
│ Tamaño fijo       │      │ Tamaño variable    │
└───────────────────┘      └───────────────────┘
```

## Implementación en Python

```python
# Creando tuplas
gene_data = ("BRCA1", 2.5, 0.001)
coordinates = (47.6, -122.3)
rgb = (255, 128, 0)

# Accediendo a elementos
print(f"Gen: {gene_data[0]}")
print(f"Expresión: {gene_data[1]}")
```

```python
# Desempaquetado de tuplas
patient = ("P-0042", "John Doe", 45, "Hypertension")
pid, name, age, diagnosis = patient
print(f"{pid}: {name}, {age} años, {diagnosis}")

# Devolver tupla desde una función
def min_max(numbers):
    return min(numbers), max(numbers)

result = min_max([3, 1, 7, 2, 9, 4])
mn, mx = result
print(f"Min: {mn}, Max: {mx}")
```

```python
# Tuplas como claves de diccionarios
location_data = {
    (47.6, -122.3): "Seattle",
    (40.7, -74.0): "New York",
    (34.0, -118.2): "Los Angeles"
}
print(location_data[(47.6, -122.3)])
```

```python
# Tuplas anidadas
matrix = ((1, 2, 3), (4, 5, 6), (7, 8, 9))
print(f"Fila 1, Col 2: {matrix[0][1]}")
```

## Ejemplo de Biotecnología

**Escenario**: Representando datos genéticos como registros inmutables.

```python
# Cada variante es una tupla: (cromosoma, posición, base_ref, base_alt, calidad)
variants = [
    ("chr1", 123456, "A", "G", 99),
    ("chr1", 789012, "C", "T", 85),
    ("chrX", 345678, "G", "A", 92),
]

# Desempaquetar y analizar
for chrom, pos, ref, alt, qual in variants:
    if qual > 90:
        print(f"Variante de alta calidad: {chrom}:{pos} {ref}→{alt} (Q{qual})")

# Las tuplas aseguran que los datos de variantes no se modifiquen accidentalmente
```

```python
# Tabla de codones como búsquedas basadas en tuplas
codons = [
    ("ATG", "M", "Start"),
    ("TAA", "*", "Stop"),
    ("TAG", "*", "Stop"),
    ("TGA", "*", "Stop"),
]

# Función de búsqueda de codones
def lookup_codon(codon):
    for c, aa, note in codons:
        if c == codon:
            return aa, note
    return None, "Unknown"

aa, note = lookup_codon("ATG")
print(f"ATG → {aa} ({note})")
```

## Ejemplo SaaS

**Escenario**: Almacenando registros de eventos como datos inmutables.

```python
# Cada evento: (timestamp, user_id, tipo_evento, metadatos_tupla)
events = [
    (1700000000, "user_001", "login", ("127.0.0.1", "Chrome")),
    (1700000050, "user_042", "purchase", ("premium", 49.99)),
    (1700000100, "user_001", "logout", (120, "active")),
]

for ts, uid, event_type, meta in events:
    if event_type == "purchase":
        product, amount = meta
        print(f"Compra: {uid} compró {product} por ${amount:.2f}")
```

## Errores Comunes

1. **Olvidar la coma en tuplas de un elemento**: `(5)` es un int, `(5,)` es una tupla
2. **Intentar modificar una tupla**: Lanza TypeError
3. **Usar tupla cuando se necesita lista**: Si necesitás modificar datos, usá una lista
4. **Desajuste en desempaquetado**: La cantidad de variables debe coincidir con el largo de la tupla
5. **Usar elementos mutables en una tupla**: Una tupla con una lista adentro no es realmente inmutable

## Buenas Prácticas

- Usá tuplas para datos fijos y estructurados (como registros de base de datos)
- Usá tuplas para múltiples valores de retorno de funciones
- Usá desempaquetado de tuplas para código más limpio
- Usá tuplas como claves de diccionarios cuando necesites claves compuestas
- Preferí tuplas sobre listas para datos que no deberían cambiar

## Resumen

- Las tuplas son secuencias ordenadas e inmutables creadas con `()`
- Las tuplas de un solo elemento requieren una coma al final: `(42,)`
- El desempaquetado asigna elementos a múltiples variables
- Las tuplas son hashables y se pueden usar como claves de diccionarios
- Las tuplas protegen los datos de modificaciones accidentales
- Usá tuplas para registros fijos y múltiples valores de retorno

## Términos Clave

- **Tupla**: Secuencia ordenada inmutable
- **Inmutable**: No se puede cambiar después de creada
- **Desempaquetado**: Asignar elementos de una tupla a múltiples variables
- **Hashable**: Se puede usar como clave de diccionario (tupla sí, lista no)
- **Empaquetado**: Crear una tupla a partir de múltiples valores

## Ejercicios

### Nivel 1: Básico

1. ¿Cómo creás una tupla con un solo elemento?
2. ¿Qué pasa si intentás cambiar un elemento de una tupla?
3. ¿Cuál es la salida de `a, b, *rest = (1, 2, 3, 4, 5)`?

### Nivel 2: Implementación

4. Escribí una función `divide_y_resto(a, b)` que devuelva una tupla (cociente, resto) y usá desempaquetado para imprimir ambos valores.
5. Creá una lista de tuplas que representen pares (nombre, puntaje) para 5 estudiantes. Encontrá al estudiante con el puntaje más alto.

### Nivel 3: Pensamiento Crítico

6. ¿Por qué las tuplas se pueden usar como claves de diccionarios pero las listas no? ¿Qué propiedad de las tuplas lo permite?
7. ¿En qué circunstancias la inmutabilidad de las tuplas sería una desventaja en lugar de una ventaja?

## Desafío de Código

Escribí un programa que administre **ítems de inventario** como tuplas:
1. Cada ítem es una tupla: `(item_id, nombre, cantidad, precio)`
2. Creá una lista de al menos 5 ítems de inventario
3. Escribí una función `total_value(inventario)` que devuelva el valor total (suma de cantidad * precio de todos los ítems)
4. Escribí una función `find_item(inventario, item_id)` que busque por item_id
5. Escribí una función `sort_by_value(inventario)` que devuelva los ítems ordenados por valor total (cantidad * precio), usando tuplas
6. Demostrá todas las funciones con tu inventario
