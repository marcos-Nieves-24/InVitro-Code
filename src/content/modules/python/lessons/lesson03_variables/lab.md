# Lab: Trabajando con variables

## Objetivo

Practicar la asignación de variables, las convenciones de nombres, el tipado dinámico y la entrada/salida (I/O) básica.

## Duración

45 minutos

## Requisitos previos

Lección 2: Jupyter Notebook

## Instrucciones

### Parte 1: Asignación básica

En una celda de un notebook de Jupyter, asigná lo siguiente e imprimí cada uno:
- Una variable `species` con "Homo sapiens"
- Una variable `chromosome_count` con 46
- Una variable `genome_size` con 3.1 (miles de millones de pares de bases)

### Parte 2: Tipado dinámico

```python
value = 100
print(type(value))
value = 100.0
print(type(value))
value = "one hundred"
print(type(value))
```

### Parte 3: Entrada del usuario

```python
name = input("Enter your name: ")
year = int(input("Enter birth year: "))
age = 2026 - year
print(f"Hello {name}, you are about {age} years old.")
```

### Parte 4: Intercambio de variables

Demostrá el intercambio de variables usando tuple unpacking:
```python
x = 5
y = 10
x, y = y, x
print(f"x={x}, y={y}")
```

### Parte 5: Contexto de biotecnología

Escribí código que almacene información sobre una secuencia de ADN:
```python
sequence_id = "SEQ001"
sequence = "AGCTTCGATCG"
gc_count = sequence.count("G") + sequence.count("C")
gc_percent = (gc_count / len(sequence)) * 100
print(f"{sequence_id}: GC content = {gc_percent:.1f}%")
```

## Entregables

Un notebook de Jupyter (`variables_lab.ipynb`) con todas las celdas ejecutadas y las salidas visibles.
