# Lab: Trabajando con listas

## Objetivo

Practicar la creación, el acceso, la modificación y la comprensión de listas.

## Duración

60 minutos

## Requisitos previos

Lecciones 7 (Bucles), 8 (Condicionales)

## Instrucciones

### Parte 1: Operaciones básicas con listas

```python
# Create a list of 10 numbers
numbers = [3, 7, 1, 9, 4, 6, 8, 2, 5, 0]
print(f"Original: {numbers}")
print(f"First: {numbers[0]}, Last: {numbers[-1]}")
print(f"First 5: {numbers[:5]}")
print(f"Every other: {numbers[::2]}")
print(f"Reversed: {numbers[::-1]}")

numbers.sort()
print(f"Sorted: {numbers}")
```

### Parte 2: Métodos de listas

```python
tasks = []
tasks.append("Learn Python")
tasks.append("Practice lists")
tasks.append("Build a project")
tasks.insert(0, "Install Python")
print(f"Tasks: {tasks}")

completed = tasks.pop()
print(f"Completed: {completed}")
print(f"Remaining: {tasks}")

print(f"Index of 'Learn Python': {tasks.index('Learn Python')}")
```

### Parte 3: List comprehension

```python
# Create lists with comprehension
celsius = [0, 10, 20, 30, 40]
fahrenheit = [(c * 9/5) + 32 for c in celsius]
print(f"C: {celsius}")
print(f"F: {fahrenheit}")

# Filtering
numbers = range(-5, 6)
positive = [n for n in numbers if n > 0]
negative = [n for n in numbers if n < 0]
print(f"Positive: {positive}")
print(f"Negative: {negative}")
```

### Parte 4: Operaciones con matrices

```python
# Create a 3x3 matrix
matrix = [[i * 3 + j + 1 for j in range(3)] for i in range(3)]
print("Matrix:")
for row in matrix:
    print(row)

# Sum of each column
cols = [sum(matrix[i][j] for i in range(3)) for j in range(3)]
print(f"Column sums: {cols}")
```

### Parte 5: Zip y enumerate

```python
genes = ["BRCA1", "TP53", "EGFR"]
expressions = [2.5, 1.8, 3.2]
p_values = [0.001, 0.08, 0.003]

for i, (gene, expr, p) in enumerate(zip(genes, expressions, p_values)):
    status = "significant" if p < 0.05 else "not significant"
    print(f"{i}. {gene}: expr={expr}, p={p} ({status})")
```

## Entregables

Notebook de Jupyter `lists_lab.ipynb` con todas las celdas ejecutadas.
