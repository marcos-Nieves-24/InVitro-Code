# Lab: Tipos de datos en la práctica

## Objetivo

Practicar la identificación, conversión y el trabajo con los tipos de datos primitivos de Python.

## Duración

60 minutos

## Requisitos previos

Lección 3: Variables

## Instrucciones

### Parte 1: Identificación de tipos

Creá una celda de código que cree variables de cada tipo e imprima sus tipos:

```python
a = 42
b = 3.14159
c = "Bioinformatics"
d = True
e = None

for var in [a, b, c, d, e]:
    print(f"{var!r:>10} -> {type(var).__name__}")
```

### Parte 2: Conversión de tipos

```python
# String to number
price_str = "49.99"
price = float(price_str)
quantity = 3
total = price * quantity
print(f"Total: ${total:.2f}")

# Number to string
count = 1500
report = "Samples processed: " + str(count)
print(report)
```

### Parte 3: La trampa del tipo de `input()`

```python
# Wrong:
age = input("Enter age: ")
next_year = age + 1  # TypeError

# Correct:
age = int(input("Enter age: "))
next_year = age + 1
print(f"Next year you will be {next_year}")
```

### Parte 4: Lógica booleana

```python
temperature = 38.5  # Celsius
has_fever = temperature > 37.5
print(f"Temperature: {temperature}°C")
print(f"Has fever: {has_fever}")

is_coughing = True
is_tired = False
should_rest = has_fever or is_coughing or is_tired
print(f"Should rest: {should_rest}")
```

### Parte 5: Precisión de los flotantes

```python
# The famous 0.1 + 0.2 problem
print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False
print(abs((0.1 + 0.2) - 0.3) < 1e-10)  # True (safe comparison)
```

## Entregables

Notebook de Jupyter `data_types_lab.ipynb` con todas las celdas ejecutadas.
