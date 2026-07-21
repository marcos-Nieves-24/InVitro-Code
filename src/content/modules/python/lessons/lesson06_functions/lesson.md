---
Module: 2
Lesson Number: 6
Lesson Title: Functions
Estimated Duration: 60 minutes
Prerequisites: L5 — Operators
Learning Objectives:
  - Define functions using the def keyword
  - Pass arguments and return values from functions
  - Distinguish between local and global scope
  - Create lambda (anonymous) functions
  - Write docstrings following PEP 257
Keywords: function, parameter, argument, return, scope, lambda, docstring
Difficulty: Beginner
Programming Concepts: Function definition, parameter passing, scope, lambda expressions, documentation
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Functions

## Motivation

Functions are reusable blocks of code that solve a specific task. Instead of writing the same code multiple times, you define it once in a function and call it whenever needed. This is the foundation of modular, maintainable programming. In biotechnology, functions encapsulate DNA sequence analysis, statistical tests, and data preprocessing steps. In SaaS, functions calculate metrics, filter data, and generate reports.

## Big Picture

In previous lessons, you learned variables, data types, and operators. Functions combine these elements into reusable units. The next lessons on loops and conditionals will be used inside functions to create powerful, reusable logic.

## Theory

### What is a Function?

A function is a named block of code that takes inputs (parameters), performs a computation, and returns an output. Functions promote the DRY (Don't Repeat Yourself) principle.

### Defining and Calling Functions

```python
def function_name(parameter1, parameter2):
    """Docstring explaining the function."""
    result = parameter1 + parameter2
    return result
```

### Function Components

1. **def keyword**: Starts the function definition
2. **Function name**: Follows naming conventions (snake_case)
3. **Parameters**: Variables that receive input values
4. **Colon**: Ends the function header
5. **Body**: Indented block of code
6. **return**: Sends output back to the caller
7. **Docstring**: Documentation string (optional but recommended)

### Parameters vs Arguments

- **Parameter**: Variable listed in the function definition
- **Argument**: Value passed to the function when called

### Types of Arguments

```python
# Positional arguments (required, in order)
def add(x, y):
    return x + y
add(3, 5)  # x=3, y=5

# Keyword arguments (order doesn't matter)
add(y=5, x=3)  # x=3, y=5

# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
greet("Alice")        # "Hello, Alice!"
greet("Bob", "Hi")    # "Hi, Bob!"

# Variable-length arguments
def sum_all(*args):
    return sum(args)
sum_all(1, 2, 3, 4)  # 10
```

### Return Values

Functions can return:
- A single value: `return x`
- Multiple values: `return x, y` (returns a tuple)
- Nothing: `return None` (or no return statement)

### Scope

- **Local scope**: Variables defined inside a function are only accessible there
- **Global scope**: Variables defined outside any function are accessible everywhere

### Lambda Functions

Lambda functions are anonymous, single-expression functions:

```python
# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

# Often used inline
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

## Biotechnology Example

**Scenario:** A bioinformatics pipeline for DNA sequence analysis.

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

## Common Mistakes

1. **Forgetting parentheses when calling**: `result = my_func` (references the function) vs `result = my_func()` (calls it)
2. **Modifying global variables inside functions**: Use `global` keyword if needed, but prefer passing parameters
3. **Mutable default arguments**: `def f(x=[])` — the list is shared across calls. Use `def f(x=None)` instead.
4. **Not returning a value**: Functions without `return` return `None`
5. **Shadowing built-in functions**: Don't name variables `list`, `str`, `print`

## Best Practices

- Functions should do one thing well (Single Responsibility Principle)
- Use descriptive names that indicate what the function does
- Write docstrings for all public functions
- Keep functions short (typically < 20-30 lines)
- Use type hints for better readability (Python 3.5+)
- Prefer returning values over printing inside functions

## Summary

- Functions are reusable code blocks defined with `def`
- Parameters receive inputs; `return` sends outputs
- Python supports positional, keyword, default, and variable-length arguments
- Variables inside functions are local; variables outside are global
- Lambda functions are anonymous, single-expression functions
- Docstrings document function purpose and usage

## Key Terms

- **Function**: Named reusable block of code
- **Parameter**: Variable in the function definition
- **Argument**: Value passed when calling a function
- **Return value**: Output sent back to the caller
- **Scope**: Region where a variable is accessible
- **Lambda**: Anonymous inline function
- **Docstring**: Documentation string for functions
- **DRY**: Don't Repeat Yourself principle

## Coding Challenge

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
