---
Module: 2
Lesson Number: 3
Lesson Title: Variables
Estimated Duration: 45 minutes
Prerequisites: L2 — Jupyter Notebook
Learning Objectives:
  - Assign values to variables using the assignment operator
  - Follow Python naming conventions for variables
  - Explain dynamic typing and type inference
  - Use basic input/output with print() and input()
  - Reassign variables and understand mutable state
Keywords: variable, assignment, naming convention, dynamic typing, I/O, print
Difficulty: Beginner
Programming Concepts: Variable assignment, naming, scope, type inference
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Variables

## Motivation

Variables are the fundamental building blocks of any program. They allow you to store, label, and manipulate data. Without variables, you would have to hard-code every value, making programs inflexible and unreadable. In biotechnology, variables store DNA sequences, gene expression levels, patient ages, and drug concentrations. In SaaS, variables store user counts, revenue figures, churn rates, and customer names. Mastering variables is your first step toward writing meaningful Python programs.

## Big Picture

In the previous lesson, you learned to execute Python code in Jupyter Notebook. Now you will learn how to store and manage data using variables. This directly prepares you for the next lesson on data types, where you will learn about the different kinds of data variables can hold.

## Theory

### What is a Variable?

A **variable** is a named location in memory that stores a value. Think of it as a labeled box where you can put data. The label is the variable name, and the contents are the value.

### Variable Assignment

In Python, the `=` operator assigns a value to a variable:

```python
x = 5          # Assign integer 5 to variable x
name = "Alice" # Assign string "Alice" to variable name
pi = 3.14159   # Assign float 3.14159 to variable pi
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

### Dynamic Typing

Python is **dynamically typed** — variables can change type during execution. The type is inferred from the value:

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

### Naming Conventions

Python variable names must follow these rules:
- Can contain letters (a-z, A-Z), digits (0-9), and underscores (_)
- Cannot start with a digit
- Are case-sensitive (`age` ≠ `Age`)
- Cannot be Python keywords (`if`, `for`, `while`, `class`, etc.)

**Recommended style (PEP 8):** Use `snake_case` for variable names:
```python
gene_expression = 0.85
max_iterations = 1000
customer_churn_rate = 0.12
```

### Constants

By convention, constants are written in `UPPER_SNAKE_CASE`:
```python
MAX_SPEED = 120
PI = 3.14159
```

### Multiple Assignment

You can assign multiple variables in one line:
```python
a, b, c = 1, 2, 3
x = y = z = 0  # All three variables get the value 0
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

### Basic Input/Output

```python
# Output
print("Hello, World!")
print("Value:", 42)

# Input — always returns a string
name = input("Enter your name: ")
```

> ⚠️ **Nota:** La función `input()` no funciona dentro del editor interactivo de esta plataforma. Cuando ejecutes Python localmente o en Jupyter, sí va a funcionar.

## Python Implementation

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

## Biotechnology Example

**Scenario:** Calculating GC content of a DNA sequence.

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

## Common Mistakes

1. **Using undefined variables**: `print(x)` before `x = 5` raises `NameError`
2. **Misspelling variable names**: `temperature` vs `temperture`
3. **Using reserved keywords**: `if = 10` raises `SyntaxError`
4. **Forgetting to convert input**: `input()` returns a string; use `int()` or `float()` for numbers
5. **Case sensitivity confusion**: `data` and `Data` are different variables

## Best Practices

- Use descriptive, meaningful variable names
- Follow `snake_case` convention
- Avoid single-letter names except for counters (i, j, k)
- Initialize variables before use
- Use constants for fixed values (UPPER_SNAKE_CASE)
- One variable per logical purpose

## Summary

- Variables store values in named memory locations
- Python is dynamically typed — types are inferred
- Use `=` for assignment and `print()` for output
- Variable names must follow rules (letters, digits, underscores)
- PEP 8 recommends `snake_case` naming
- `input()` reads user input as a string

## Key Terms

- **Variable**: Named storage location for a value
- **Assignment**: Using `=` to give a value to a variable
- **Dynamic typing**: Variables can change type at runtime
- **PEP 8**: Python style guide
- **snake_case**: Naming convention using underscores
- **Type inference**: Python deduces the type from the value
- **NameError**: Exception raised when using an undefined variable

## Coding Challenge

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
