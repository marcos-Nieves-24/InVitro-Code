# Lab: Trabajando con tuplas

## Objetivo

Practicar la creación de tuplas, el desempaquetado y la comprensión de la inmutabilidad.

## Duración

30 minutos

## Requisitos previos

Lección 9: Listas

## Instrucciones

### Parte 1: Creación y acceso a tuplas

```python
# Create various tuples
empty = ()
single = (42,)
pair = (10, 20)
triple = 1, 2, 3  # parentheses optional
nested = ((1, 2), (3, 4))

print(f"Empty: {empty}, type: {type(empty)}")
print(f"Single: {single}, type: {type(single)}")
print(f"Pair: {pair}")
print(f"Triple: {triple}")
print(f"Nested: {nested}")
```

### Parte 2: Desempaquetado de tuplas

```python
# Basic unpacking
point = (3, 7)
x, y = point
print(f"x={x}, y={y}")

# Swapping
a, b = 10, 20
a, b = b, a
print(f"After swap: a={a}, b={b}")

# Extended unpacking
first, *middle, last = (1, 2, 3, 4, 5)
print(f"first={first}, middle={middle}, last={last}")
```

### Parte 3: Demostración de la inmutabilidad

```python
t = (1, 2, 3)
print(f"Original: {t}")

# This will fail — uncomment to see the error
# t[0] = 99

# But we can create new tuples
t2 = (99,) + t[1:]
print(f"New tuple: {t2}")
```

### Parte 4: Tuplas como claves de diccionarios

```python
# Using tuples as keys for location data
locations = {
    (40.7128, -74.0060): "New York",
    (34.0522, -118.2437): "Los Angeles",
    (41.8781, -87.6298): "Chicago",
}

# Lookup by coordinates
coords = (40.7128, -74.0060)
print(f"Coordinates {coords} → {locations[coords]}")

# List all locations
for coords, city in locations.items():
    print(f"{city}: {coords}")
```

### Parte 5: Múltiples valores de retorno

```python
def analyze(numbers):
    """Return multiple statistics as a tuple."""
    return (
        min(numbers),
        max(numbers),
        sum(numbers) / len(numbers),
        len(numbers)
    )

data = [3, 1, 7, 2, 9, 4]
minimum, maximum, mean, count = analyze(data)
print(f"Data: {data}")
print(f"Min: {minimum}, Max: {maximum}, Mean: {mean:.2f}, Count: {count}")
```

## Entregables

Notebook de Jupyter `tuples_lab.ipynb` con todos los ejercicios.
