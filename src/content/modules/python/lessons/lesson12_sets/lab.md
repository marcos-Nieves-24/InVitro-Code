# Lab: Conjuntos y operaciones de conjuntos

## Objetivo

Practicar la creación de conjuntos, la realización de operaciones de conjuntos y el uso de conjuntos para el análisis de datos.

## Duración

30 minutos

## Requisitos previos

Lección 9: Listas

## Instrucciones

### Parte 1: Creación de conjuntos

```python
# Various ways to create sets
empty = set()
from_list = set([1, 2, 2, 3, 3, 4])
from_string = set("hello world")
literal = {5, 6, 7, 8, 9}

print(f"Empty: {empty}")
print(f"From list (duplicates removed): {from_list}")
print(f"From string: {from_string}")
print(f"Literal: {literal}")
```

### Parte 2: Operaciones de conjuntos

```python
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(f"A: {a}")
print(f"B: {b}")
print(f"Union: {a | b}")
print(f"Intersection: {a & b}")
print(f"Difference (A-B): {a - b}")
print(f"Difference (B-A): {b - a}")
print(f"Symmetric diff: {a ^ b}")
```

### Parte 3: Eliminación de duplicados

```python
# Practical use: remove duplicates
user_ids = [101, 102, 103, 101, 104, 105, 102, 106]
unique_users = set(user_ids)
print(f"Original: {user_ids}")
print(f"Unique: {unique_users}")

# Convert back to list if needed
unique_list = list(unique_users)
print(f"Unique (sorted): {sorted(unique_list)}")
```

### Parte 4: Prueba de pertenencia

```python
valid_codes = {"A01", "B02", "C03", "D04", "E05"}

test_codes = ["A01", "X99", "C03", "Z12"]
for code in test_codes:
    if code in valid_codes:
        print(f"{code}: VALID")
    else:
        print(f"{code}: INVALID")
```

### Parte 5: Relaciones entre conjuntos

```python
a = {1, 2, 3, 4}
b = {1, 2}
c = {5, 6}

print(f"B is subset of A: {b.issubset(a)}")
print(f"A is superset of B: {a.issuperset(b)}")
print(f"A and C are disjoint: {a.isdisjoint(c)}")
```

## Entregables

Notebook de Jupyter `sets_lab.ipynb` con todos los ejercicios.
