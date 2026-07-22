---
Module: 2
Lesson Number: 3
Lesson Title: Variables
Estimated Duration: 45 minutos
Prerequisites: L2 — Jupyter Notebook
Learning Objectives:
  - Asignar valores a variables usando el operador de asignación
  - Seguir las convenciones de nomenclatura de Python para variables
  - Explicar el tipado dinámico y la inferencia de tipos
  - Usar entrada/salida básica con print() y input()
  - Reasignar variables y entender el estado mutable
Keywords: variable, asignación, convención de nomenclatura, tipado dinámico, E/S, print
Difficulty: Beginner
Programming Concepts: Asignación de variables, nomenclatura, ámbito, inferencia de tipos
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Variables

## Motivación

Las variables son los bloques fundamentales de cualquier programa. Te permiten almacenar, etiquetar y manipular datos. Sin variables, tendrías que hardcodear cada valor, haciendo que los programas sean inflexibles e ilegibles. En biotecnología, las variables almacenan secuencias de ADN, niveles de expresión génica, edades de pacientes y concentraciones de fármacos. En SaaS, las variables almacenan cantidades de usuarios, cifras de ingresos, tasas de churn y nombres de clientes. Dominar las variables es tu primer paso para escribir programas significativos en Python.

## Panorama General

En la lección anterior aprendiste a ejecutar código Python en Jupyter Notebook. Ahora vas a aprender cómo almacenar y gestionar datos usando variables. Esto te prepara directamente para la próxima lección sobre tipos de datos, donde vas a aprender sobre los distintos tipos de datos que pueden contener las variables.

## Teoría

### ¿Qué es una Variable?

Una **variable** es una ubicación nombrada en memoria que almacena un valor. Pensála como una caja etiquetada donde podés poner datos. La etiqueta es el nombre de la variable y el contenido es el valor.

### Asignación de Variables

En Python, el operador `=` asigna un valor a una variable:

```python
x = 5          # Asigna el entero 5 a la variable x
name = "Alice" # Asigna el string "Alice" a la variable name
pi = 3.14159   # Asigna el float 3.14159 a la variable pi
```

**Probálo vos mismo.** Escribí tres variables: una para el nombre de una especie, otra para el número de cromosomas, y otra para el tamaño del genoma. Después mostralas con `print()`.

<CodeEditor
  defaultValue={`# Asigná tus variables acá
species = "Homo sapiens"
chromosome_count = 46
genome_size = 3.1

# Mostrá cada variable
print(species)
print(chromosome_count)
print(genome_size)`}
/>

### Tipado Dinámico

Python tiene **tipado dinámico** — las variables pueden cambiar de tipo durante la ejecución. El tipo se infiere del valor:

<CodeEditor
  defaultValue={`value = 10
print(value, type(value))

value = 3.14
print(value, type(value))

value = "texto"
print(value, type(value))`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "<class 'int'>", note: "¿El primer type() muestra int?" },
      { input: "", expectedOutput: "<class 'float'>", note: "¿El segundo type() muestra float?" },
      { input: "", expectedOutput: "<class 'str'>", note: "¿El tercer type() muestra str?" },
    ]
  }}
/>

### Convenciones de Nomenclatura

Los nombres de variables en Python deben seguir estas reglas:
- Pueden contener letras (a-z, A-Z), dígitos (0-9) y guiones bajos (_)
- No pueden empezar con un dígito
- Distinguen mayúsculas y minúsculas (`age` ≠ `Age`)
- No pueden ser palabras clave de Python (`if`, `for`, `while`, `class`, etc.)

**Estilo recomendado (PEP 8):** Usá `snake_case` para nombres de variables:
```python
gene_expression = 0.85
max_iterations = 1000
customer_churn_rate = 0.12
```

### Constantes

Por convención, las constantes se escriben en `UPPER_SNAKE_CASE`:
```python
MAX_SPEED = 120
PI = 3.14159
```

### Asignación Múltiple

Podés asignar múltiples variables en una línea:
```python
a, b, c = 1, 2, 3
x = y = z = 0  # Las tres variables reciben el valor 0
```

**Probá el swapping de variables** — una forma pitónica de intercambiar valores:

<CodeEditor
  defaultValue={`# Variable swapping
a = 5
b = 10
print(f"Antes: a={a}, b={b}")

a, b = b, a  # Swap
print(f"Después: a={a}, b={b}")`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "Después: a=10", note: "¿a debería ser 10 después del swap?" },
      { input: "", expectedOutput: "b=5", note: "¿b debería ser 5 después del swap?" },
    ]
  }}
/>

### Entrada/Salida Básica

```python
# Salida
print("Hello, World!")
print("Value:", 42)

# Entrada — siempre devuelve un string
name = input("Enter your name: ")
```

> ⚠️ **Nota:** La función `input()` no funciona dentro del editor interactivo de esta plataforma. Cuando ejecutes Python localmente o en Jupyter, sí va a funcionar.

## Implementación en Python

**Ejercicio 1:** Asigná una secuencia de ADN, un conteo de genes, y una tasa de mutación. Mostralos.

<CodeEditor
  defaultValue={`# Variable assignment
dna_sequence = "ATCGATCGATCG"
gene_count = 25000
mutation_rate = 0.001

print(dna_sequence)
print(gene_count)
print(mutation_rate)`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "ATCGATCGATCG", note: "¿Mostrás dna_sequence?" },
      { input: "", expectedOutput: "25000", note: "¿Mostrás gene_count?" },
      { input: "", expectedOutput: "0.001", note: "¿Mostrás mutation_rate?" },
    ]
  }}
/>

**Ejercicio 2:** Demostración de dynamic typing. Creá una variable, mostrá su tipo, reasignala con otro tipo, y volvé a mostrar.

<CodeEditor
  defaultValue={`# Dynamic typing demonstration
data = 42
print(data, type(data))

data = 3.14
print(data, type(data))

data = "DNA"
print(data, type(data))`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "42 <class 'int'>", note: "¿El primer print muestra 42 y <class 'int'>?" },
      { input: "", expectedOutput: "3.14 <class 'float'>", note: "¿El segundo print muestra 3.14 y <class 'float'>?" },
    ]
  }}
/>

## Ejemplo de Biotecnología

**Escenario:** Calculando el contenido GC de una secuencia de ADN.

<CodeEditor
  defaultValue={`sequence_id = "SEQ001"
sequence = "AGCTTCGATCG"
gc_count = sequence.count("G") + sequence.count("C")
gc_percent = (gc_count / len(sequence)) * 100
print(f"{sequence_id}: GC content = {gc_percent:.1f}%")`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "GC content = 50.0%", note: "El GC content de AGCTTCGATCG debería ser 50.0%" },
    ]
  }}
/>

## Errores Comunes

1. **Usar variables no definidas**: `print(x)` antes de `x = 5` lanza `NameError`
2. **Escribir mal los nombres de variables**: `temperature` vs `temperture`
3. **Usar palabras clave reservadas**: `if = 10` lanza `SyntaxError`
4. **Olvidarse de convertir la entrada**: `input()` devuelve un string; usá `int()` o `float()` para números
5. **Confundir mayúsculas y minúsculas**: `data` y `Data` son variables diferentes

## Buenas Prácticas

- Usá nombres de variables descriptivos y significativos
- Seguí la convención `snake_case`
- Evitá nombres de una sola letra excepto para contadores (i, j, k)
- Inicializá las variables antes de usarlas
- Usá constantes para valores fijos (UPPER_SNAKE_CASE)
- Una variable por propósito lógico

## Resumen

- Las variables almacenan valores en ubicaciones de memoria nombradas
- Python tiene tipado dinámico — los tipos se infieren
- Usá `=` para asignación y `print()` para salida
- Los nombres de variables deben seguir reglas (letras, dígitos, guiones bajos)
- PEP 8 recomienda nomenclatura `snake_case`
- `input()` lee la entrada del usuario como string

## Términos Clave

- **Variable**: Ubicación de almacenamiento nombrada para un valor
- **Asignación**: Usar `=` para darle un valor a una variable
- **Tipado dinámico**: Las variables pueden cambiar de tipo en tiempo de ejecución
- **PEP 8**: Guía de estilo de Python
- **snake_case**: Convención de nomenclatura que usa guiones bajos
- **Inferencia de tipos**: Python deduce el tipo a partir del valor
- **NameError**: Excepción que se lanza al usar una variable no definida

## Desafío de Código

Escribí un programa que calcule el **GC content** de una secuencia de ADN más larga. Usá variables para cada paso.

<CodeEditor
  defaultValue={`# Calculá el GC content de esta secuencia
dna = "ATCGGCTAGCTAGCATGCGATCGATCGATCGATCG"

# Paso 1: contá G y C
# Paso 2: calculá el porcentaje
# Paso 3: mostrá el resultado

# Ejemplo:
# gc_count = dna.count("G") + dna.count("C")
# gc_percent = (gc_count / len(dna)) * 100
# print(f"GC content: {gc_percent:.1f}%")
`}
  exercise={{
    lessonId: "lesson03_variables",
    testCases: [
      { input: "", expectedOutput: "GC content:", note: "Mostrá el resultado como 'GC content: X.X%'" },
    ]
  }}
/>

> **Pista:** Usá `dna.count("G")` para contar las guaninas y `dna.count("C")` para las citosinas. La longitud total se obtiene con `len(dna)`.
