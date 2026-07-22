---
Module: 2
Lesson Number: 6
Lesson Title: Funciones
Estimated Duration: 60 minutos
Prerequisites: L5 — Operadores
Learning Objectives:
  - Definir funciones usando la palabra clave def
  - Pasar argumentos y devolver valores desde funciones
  - Distinguir entre ámbito local y global
  - Crear funciones lambda (anónimas)
  - Escribir docstrings siguiendo PEP 257
Keywords: función, parámetro, argumento, retorno, ámbito, lambda, docstring
Difficulty: Beginner
Programming Concepts: Definición de funciones, paso de parámetros, ámbito, expresiones lambda, documentación
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Funciones

## Motivación

Las funciones son bloques de código reutilizables que resuelven una tarea específica. En lugar de escribir el mismo código varias veces, lo definís una vez en una función y la llamás cuando sea necesario. Esta es la base de la programación modular y mantenible. En biotecnología, las funciones encapsulan análisis de secuencias de ADN, tests estadísticos y pasos de preprocesamiento de datos. En SaaS, las funciones calculan métricas, filtran datos y generan reportes.

## Panorama General

En lecciones anteriores aprendiste variables, tipos de datos y operadores. Las funciones combinan estos elementos en unidades reutilizables. Las próximas lecciones sobre bucles y condicionales se van a usar dentro de funciones para crear lógica reutilizable poderosa.

## Teoría

### ¿Qué es una Función?

Una función es un bloque de código con nombre que recibe entradas (parámetros), realiza un cómputo y devuelve una salida. Las funciones promueven el principio DRY (Don't Repeat Yourself).

### Definiendo y Llamando Funciones

```python
def function_name(parameter1, parameter2):
    """Docstring explicando la función."""
    result = parameter1 + parameter2
    return result
```

### Componentes de una Función

1. **Palabra clave def**: Inicia la definición de la función
2. **Nombre de la función**: Sigue las convenciones de nomenclatura (snake_case)
3. **Parámetros**: Variables que reciben los valores de entrada
4. **Dos puntos**: Finalizan el encabezado de la función
5. **Cuerpo**: Bloque de código indentado
6. **return**: Envía la salida de vuelta a quien llamó
7. **Docstring**: String de documentación (opcional pero recomendado)

### Parámetros vs Argumentos

- **Parámetro**: Variable listada en la definición de la función
- **Argumento**: Valor que se pasa a la función al llamarla

### Tipos de Argumentos

```python
# Argumentos posicionales (requeridos, en orden)
def add(x, y):
    return x + y
add(3, 5)  # x=3, y=5

# Argumentos de palabra clave (el orden no importa)
add(y=5, x=3)  # x=3, y=5

# Parámetros con valor por defecto
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
greet("Alice")        # "Hello, Alice!"
greet("Bob", "Hi")    # "Hi, Bob!"

# Argumentos de longitud variable
def sum_all(*args):
    return sum(args)
sum_all(1, 2, 3, 4)  # 10
```

### Valores de Retorno

Las funciones pueden devolver:
- Un solo valor: `return x`
- Múltiples valores: `return x, y` (devuelve una tupla)
- Nada: `return None` (o ninguna declaración return)

### Ámbito (Scope)

- **Ámbito local**: Las variables definidas dentro de una función solo son accesibles allí
- **Ámbito global**: Las variables definidas fuera de cualquier función son accesibles en todas partes

### Funciones Lambda

Las funciones lambda son funciones anónimas de una sola expresión:

```python
# Función regular
def square(x):
    return x ** 2

# Equivalente lambda
square = lambda x: x ** 2

# A menudo se usan en línea
numbers = [1, 2, 3, 4]
squared = list(map(lambda x: x ** 2, numbers))
```

### Docstrings (PEP 257)

```python
def calculate_bmi(weight, height):
    """
    Calculate Body Mass Index.

    Parameters
    ----------
    weight : float
        Weight in kilograms.
    height : float
        Height in meters.

    Returns
    -------
    float
        BMI value.
    """
    return weight / (height ** 2)
```

## Ejercicios interactivos

### Ejercicio 1: Tu primera función

Escribí una función `celsius_to_fahrenheit(c)` que convierta grados Celsius a Fahrenheit usando la fórmula: F = C * 9/5 + 32. Después llamala con 0, 37 y 100.

<CodeEditor
  defaultValue={`# Escribí tu función acá
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

# Probala
print(f"0°C = {celsius_to_fahrenheit(0)}°F")
print(f"37°C = {celsius_to_fahrenheit(37)}°F")
print(f"100°C = {celsius_to_fahrenheit(100)}°F")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "0°C = 32.0°F", note: "0°C debería ser 32°F" },
      { input: "", expectedOutput: "37°C = 98.6°F", note: "37°C debería ser 98.6°F" },
      { input: "", expectedOutput: "100°C = 212.0°F", note: "100°C debería ser 212°F" },
    ]
  }}
/>

### Ejercicio 2: Múltiples parámetros y return

Escribí una función `bmi_category(weight, height)` que calcule el IMC y devuelva tanto el valor como la categoría.

<CodeEditor
  defaultValue={`def bmi_category(weight, height):
    bmi = weight / (height ** 2)
    if bmi < 18.5:
        category = "underweight"
    elif bmi < 25:
        category = "normal"
    elif bmi < 30:
        category = "overweight"
    else:
        category = "obese"
    return bmi, category

# Probala
bmi, cat = bmi_category(70, 1.75)
print(f"BMI: {bmi:.1f}, Category: {cat}")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "BMI: 22.9", note: "70kg / 1.75m² = 22.9" },
      { input: "", expectedOutput: "Category: normal", note: "22.9 está en rango normal" },
    ]
  }}
/>

### Ejercicio 3: Parámetros con valor default

<CodeEditor
  defaultValue={`def create_report(patient_name, age, blood_type="Unknown"):
    return f"Patient: {patient_name}, Age: {age}, Blood Type: {blood_type}"

# Probá con y sin el tercer parámetro
print(create_report("Alice", 30, "A+"))
print(create_report("Bob", 25))`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "Blood Type: A+", note: "Alice debería tener tipo A+" },
      { input: "", expectedOutput: "Blood Type: Unknown", note: "Bob debería tener el default Unknown" },
    ]
  }}
/>

### Ejercicio 4: Lambda functions

Usá lambda para ordenar una lista, filtrar pares, y elevar al cuadrado.

<CodeEditor
  defaultValue={`numbers = [5, 2, 8, 1, 9, 3]

# Orden descendente
sorted_desc = sorted(numbers, key=lambda x: -x)
print(f"Sorted descending: {sorted_desc}")

# Filtrar pares
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Evens: {evens}")

# Elevar al cuadrado
squares = list(map(lambda x: x ** 2, numbers))
print(f"Squares: {squares}")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "Sorted descending: [9, 8, 5, 3, 2, 1]", note: "Orden descendente de mayor a menor" },
      { input: "", expectedOutput: "Evens: [2, 8]", note: "Números pares: 2 y 8" },
    ]
  }}
/>

### Ejercicio 5: Scope (ámbito de variables)

<CodeEditor
  defaultValue={`x = "global"

def test_scope():
    x = "local"
    print(f"Inside function: {x}")

test_scope()
print(f"Outside function: {x}")

def modify_global():
    global x
    x = "modified"

modify_global()
print(f"After modification: {x}")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "Inside function: local", note: "Dentro de la función, x es 'local'" },
      { input: "", expectedOutput: "Outside function: global", note: "Afuera, x sigue siendo 'global'" },
      { input: "", expectedOutput: "After modification: modified", note: "Después de usar global, x cambia" },
    ]
  }}
/>

## Ejemplo de Biotecnología

**Escenario:** Un pipeline de bioinformática para análisis de secuencias de ADN.

<CodeEditor
  defaultValue={`def reverse_complement(sequence):
    """Return the reverse complement of a DNA sequence."""
    complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
    return "".join(complement[base] for base in reversed(sequence.upper()))

def has_restriction_site(sequence, enzyme_site="GAATTC"):
    """Check if a restriction enzyme site exists."""
    return enzyme_site in sequence.upper()

# Usage
dna = "ATGAATTCGCTAGCTAGCTAG"
rc = reverse_complement(dna)
has_site = has_restriction_site(dna)

print(f"Original: {dna}")
print(f"Reverse complement: {rc}")
print(f"Contains EcoRI site (GAATTC): {has_site}")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "Reverse complement: CTAGCTAGCTAGCGAATTCAT", note: "El complemento reverso de ATGAATTCGCTAGCTAGCTAG" },
      { input: "", expectedOutput: "Contains EcoRI site (GAATTC): True", note: "La secuencia original contiene GAATTC" },
    ]
  }}
/>

## Errores Comunes

1. **Olvidar los paréntesis al llamar**: `result = my_func` (referencia a la función) vs `result = my_func()` (la llama)
2. **Modificar variables globales dentro de funciones**: Usá la palabra clave `global` si es necesario, pero preferí pasar parámetros
3. **Argumentos mutables por defecto**: `def f(x=[])` — la lista se comparte entre llamadas. Usá `def f(x=None)` en su lugar.
4. **No devolver un valor**: Las funciones sin `return` devuelven `None`
5. **Sombrear funciones incorporadas**: No nombres variables `list`, `str`, `print`

## Buenas Prácticas

- Las funciones deberían hacer una sola cosa bien (Principio de Responsabilidad Única)
- Usá nombres descriptivos que indiquen lo que hace la función
- Escribí docstrings para todas las funciones públicas
- Mantené las funciones cortas (típicamente < 20-30 líneas)
- Usá type hints para mejor legibilidad (Python 3.5+)
- Preferí devolver valores en lugar de imprimir dentro de las funciones

## Resumen

- Las funciones son bloques de código reutilizables definidos con `def`
- Los parámetros reciben entradas; `return` envía salidas
- Python soporta argumentos posicionales, de palabra clave, con valor por defecto y de longitud variable
- Las variables dentro de funciones son locales; las variables fuera son globales
- Las funciones lambda son funciones anónimas de una sola expresión
- Los docstrings documentan el propósito y uso de la función

## Términos Clave

- **Función**: Bloque de código reutilizable con nombre
- **Parámetro**: Variable en la definición de la función
- **Argumento**: Valor pasado al llamar una función
- **Valor de retorno**: Salida enviada de vuelta a quien llamó
- **Ámbito**: Región donde una variable es accesible
- **Lambda**: Función anónima en línea
- **Docstring**: String de documentación para funciones
- **DRY**: Principio Don't Repeat Yourself

## Desafío de Código

Escribí una función `gc_content(sequence)` que calcule el porcentaje de GC de una secuencia de ADN. Incluí un docstring y probala con diferentes secuencias.

<CodeEditor
  defaultValue={`# Escribí tu función acá
def gc_content(sequence):
    \"\"\"Calculate GC content percentage of a DNA sequence.\"\"\"
    seq = sequence.upper()
    gc = seq.count("G") + seq.count("C")
    return (gc / len(seq)) * 100

# Probala
print(f"GC: {gc_content('ATCGATCG'):.1f}%")
print(f"GC: {gc_content('GGGGCCCC'):.1f}%")
print(f"GC: {gc_content('AAAAATTT'):.1f}%")`}
  exercise={{
    lessonId: "lesson06_functions",
    testCases: [
      { input: "", expectedOutput: "GC: 50.0%", note: "ATCGATCG tiene 50% GC" },
      { input: "", expectedOutput: "GC: 100.0%", note: "GGGGCCCC tiene 100% GC" },
      { input: "", expectedOutput: "GC: 0.0%", note: "AAAAATTT tiene 0% GC" },
    ]
  }}
/>
