# Lab: Data Types in Practice

## Objective

Practice identifying, converting, and working with Python's primitive data types.

## Duration

60 minutes

## Prerequisites

Lesson 3: Variables

## Instructions

### Part 1: Type Identification

Create a code cell that creates variables of each type and prints their types:

```python
a = 42
b = 3.14159
c = "Bioinformatics"
d = True
e = None

for var in [a, b, c, d, e]:
    print(f"{var!r:>10} -> {type(var).__name__}")
```

### Part 2: Type Conversion

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

### Part 3: The input() Type Trap

```python
# Wrong:
age = input("Enter age: ")
next_year = age + 1  # TypeError

# Correct:
age = int(input("Enter age: "))
next_year = age + 1
print(f"Next year you will be {next_year}")
```

### Part 4: Boolean Logic

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

### Part 5: Float Precision

```python
# The famous 0.1 + 0.2 problem
print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False
print(abs((0.1 + 0.2) - 0.3) < 1e-10)  # True (safe comparison)
```

## Deliverables

Jupyter notebook `data_types_lab.ipynb` with all executed cells.
