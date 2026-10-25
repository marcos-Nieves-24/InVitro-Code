
Module: 2
Lesson Number: 10
Lesson Title: Tuplas
Estimated Duration: 30 minutos
Prerequisites: L9   Listas
Learning Objectives:
  Crear tuplas y explicar su inmutabilidad
  Usar desempaquetado de tuplas para asignación múltiple
  Comparar tuplas con listas y elegir apropiadamente
  Usar tuplas como claves de diccionarios
  Devolver múltiples valores desde funciones usando tuplas
Keywords: tupla, inmutable, desempaquetado, hashable, secuencia
Difficulty: Beginner
Programming Concepts: Secuencias inmutables, empaquetado/desempaquetado, tipos hashables
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# Tuplas

<Section number={1} title="¿Por qué Tuplas?" eyebrow="INICIO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El laboratorio guarda un registro por muestra: (gen, posición, cambio de base).",
    "Ese registro no debería cambiar nunca: es una muestra inmutable.",
    "En Python, una tupla agrupa datos fijos y los protege de cambios accidentales.",
  ]}
/>

<ConceptCard variant="key idea">
Una tupla es una secuencia ordenada e inmutable: ideal para registros fijos, coordenadas y valores de retorno múltiples.
</ConceptCard>

<ChoiceQuestion
  question="¿Qué elegirías para guardar la posición de un gen sin que nadie la altere?"
  moduleSlug="python"
  lessonSlug="lesson10_tuples"
  blockId="choice python l10 s1 a 1"
  allowContinueOnIncorrect
  explanation="La tupla es inmutable; una lista podría modificarse por accidente."
  options={[
    { id: "a", label: "tuple", correct: true, feedback: "¡Correcto! La tupla protege el dato de cambios." },
    { id: "b", label: "list", correct: false, feedback: "Las listas se pueden modificar, arriesgando el registro." },
    { id: "c", label: "dict", correct: false, feedback: "Es útil para pares clave valor, no para un registro ordenado fijo." },
    { id: "d", label: "set", correct: false, feedback: "Los sets no mantienen orden ni protegen por posición." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={2} title="Creación, Inmutabilidad y Desempaquetado" eyebrow="CONCEPTO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El laboratorio firma un registro de variante: gen, posición, alelo de referencia y alelo alternativo.",
    "Ese registro no puede editarse en caliente: si cambia, el hash y la trazabilidad se rompen.",
    "Las listas sirven para colectar; las tuplas, para certificar un dato que debe quedar fijo.",
    "Elegir mal la estructura aquí significa pérdida silenciosa de integridad en un análisis downstream.",
  ]}
/>

</RevealSequence>

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

Asigna elementos de una tupla a múltiples variables:

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

<ConceptCard variant="key idea">
Tupla o lista, elegí por inmutabilidad: datos fijos y claves  tupla `()`; datos que cambian  lista `[]`. Las tuplas son hashables (sirven de clave); las listas no.
</ConceptCard>

### Explicación Visual

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

</Section>

<Section number={3} title="Implementación y Ejemplos" eyebrow="APLICACIÓN">

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
patient = ("P 0042", "John Doe", 45, "Hypertension")
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
        print(f"Variante de alta calidad: {chrom}:{pos} {ref}{alt} (Q{qual})")

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
print(f"ATG  {aa} ({note})")
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

<RevealSequence>

<ChoiceQuestion
  question="Un registro de variante es `(cromosoma, posicion, base_ref, base_alt, calidad)`. ¿Qué estructura debes usar si otra parte del pipeline necesita usarlo como clave de diccionario y garantizar que no se modifique?"
  moduleSlug="python"
  lessonSlug="lesson10_tuples"
  blockId="choice python l10 dens 1"
  allowContinueOnIncorrect
  explanation="Las tuplas son inmutables y hashables (si sus elementos lo son), por eso sirven como clave; las listas no."
  options={[
    { id: "a", label: "Tupla", correct: true, feedback: "¡Correcto! Inmutable y hashable: ideal para claves." },
    { id: "b", label: "Lista", correct: false, feedback: "Las listas son mutables y no hashables, no pueden ser clave." },
    { id: "c", label: "Diccionario", correct: false, feedback: "Un dict es mutable y tampoco es hashable." },
    { id: "d", label: "Set", correct: false, feedback: "Un set no mantiene orden posicional ni sirve como clave compuesta." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={4} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">

<RevealSequence>

1. **Olvidar la coma en tuplas de un elemento**: `(5)` es un int, `(5,)` es una tupla
2. **Intentar modificar una tupla**: Lanza TypeError
3. **Usar tupla cuando se necesita lista**: Si necesitas modificar datos, usa una lista
4. **Desajuste en desempaquetado**: La cantidad de variables debe coincidir con el largo de la tupla
5. **Usar elementos mutables en una tupla**: Una tupla con una lista adentro no es realmente inmutable

- Usa tuplas para datos fijos y estructurados (como registros de base de datos)
- Usa tuplas para múltiples valores de retorno de funciones
- Usa desempaquetado de tuplas para código más limpio
- Usa tuplas como claves de diccionarios cuando necesites claves compuestas
- Prefiere tuplas sobre listas para datos que no deberían cambiar

</RevealSequence>

</Section>

<Section number={5} title="Resumen y Conceptos Clave" eyebrow="CIERRE">

<RevealSequence>

<ConceptCard variant="key idea">
Las tuplas son secuencias ordenadas e **inmutables**: el contenedor ideal para registros fijos y valores de retorno múltiples. Una tupla de un solo elemento lleva coma: `(42,)`.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "tupla", label: "Tupla", detail: "Secuencia ordenada inmutable creada con (). Protege los datos de modificaciones accidentales." },
    { id: "inmutable", label: "Inmutable", detail: "No se puede cambiar después de creada   a diferencia de las listas." },
    { id: "desempaquetado", label: "Desempaquetado", detail: "Asigna elementos de una tupla a múltiples variables de una vez." },
    { id: "hashable", label: "Hashable", detail: "Se puede usar como clave de diccionario (tupla sí, lista no)." },
    { id: "empaquetado", label: "Empaquetado", detail: "Crea una tupla a partir de múltiples valores." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué devuelve esta función: return (gen, posicion)?"
  moduleSlug="python"
  lessonSlug="lesson10_tuples"
  blockId="choice python l10 resumen 1"
  allowContinueOnIncorrect
  explanation="Devuelve una tupla con dos valores: el patrón clásico de retorno múltiple."
  options={[
    { id: "a", label: "Una tupla con dos valores", correct: true, feedback: "¡Exacto! Empaquetado + retorno múltiple." },
    { id: "b", label: "Una lista", correct: false, feedback: "Los paréntesis () crean tupla, no lista." },
    { id: "c", label: "Un error", correct: false, feedback: "Es válido: Python empaqueta los valores automáticamente." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Tuplas dominadas! Ya distinguís mutable de inmutable   la base de diccionarios, la próxima lección.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={6} title="Ejercicios y Desafío de Código" eyebrow="EVALUACIÓN">

## Ejercicios

### Nivel 1: Básico

1. ¿Cómo creas una tupla con un solo elemento?
2. ¿Qué pasa si intentas cambiar un elemento de una tupla?
3. ¿Cuál es la salida de `a, b, *rest = (1, 2, 3, 4, 5)`?

### Nivel 2: Implementación

4. Escribe una función `divide_y_resto(a, b)` que devuelva una tupla (cociente, resto) y usa desempaquetado para imprimir ambos valores.
5. Crea una lista de tuplas que representen pares (nombre, puntaje) para 5 estudiantes. Encuentra al estudiante con el puntaje más alto.

### Nivel 3: Pensamiento Crítico

6. ¿Por qué las tuplas se pueden usar como claves de diccionarios pero las listas no? ¿Qué propiedad de las tuplas lo permite?
7. ¿En qué circunstancias la inmutabilidad de las tuplas sería una desventaja en lugar de una ventaja?

## Desafío de Código

Escribe un programa que administre **ítems de inventario** como tuplas:
1. Cada ítem es una tupla: `(item_id, nombre, cantidad, precio)`
2. Crea una lista de al menos 5 ítems de inventario
3. Escribe una función `total_value(inventario)` que devuelva el valor total (suma de cantidad * precio de todos los ítems)
4. Escribe una función `find_item(inventario, item_id)` que busque por item_id
5. Escribe una función `sort_by_value(inventario)` que devuelva los ítems ordenados por valor total (cantidad * precio), usando tuplas
6. Demuestra todas las funciones con tu inventario

</Section>
