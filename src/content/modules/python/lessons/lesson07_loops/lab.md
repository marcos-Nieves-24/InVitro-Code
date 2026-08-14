# Lab: Bucles e iteración

## Objetivo

Practicar bucles for, bucles while, `range()`, break/continue y bucles anidados.

## Duración

60 minutos

## Requisitos previos

Lección 6: Funciones

## Instrucciones

### Parte 1: Bucle for básico

```python
# Iterate over a list of fruits
fruits = ["apple", "banana", "cherry", "date"]
for fruit in fruits:
    print(f"I like {fruit}s")
```

### Parte 2: Práctica con range()

```python
# Print even numbers from 2 to 20
for i in range(2, 21, 2):
    print(i, end=" ")
print()

# Countdown from 10 to 1
for i in range(10, 0, -1):
    print(i, end=" ")
print("Liftoff!")
```

### Parte 3: Bucle while

```python
# Countdown with while
count = 10
while count > 0:
    print(count, end=" ")
    count -= 1
print("Blast off!")
```

### Parte 4: Break y continue

```python
# Find first number divisible by 7 and 3
for i in range(1, 100):
    if i % 7 == 0 and i % 3 == 0:
        print(f"Found: {i}")
        break

# Print all numbers except multiples of 3
for i in range(1, 20):
    if i % 3 == 0:
        continue
    print(i, end=" ")
```

### Parte 5: Bucles anidados

```python
# Generate a coordinate grid
print("Coordinate grid (3×4):")
for x in range(3):
    for y in range(4):
        print(f"({x},{y})", end=" ")
    print()
```

### Parte 6: Bucle con else

```python
# Search with else clause
search_for = 7
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
for num in numbers:
    if num == search_for:
        print(f"Found {search_for}!")
        break
else:
    print(f"{search_for} not found")
```

## Entregables

Notebook de Jupyter `loops_lab.ipynb` con todos los ejercicios completados.
