# Lab: Operators in Action

## Objective

Practice using arithmetic, comparison, logical, and assignment operators.

## Duration

45 minutes

## Prerequisites

Lesson 4: Data Types

## Instructions

### Part 1: Arithmetic Operators

```python
# Experiment with each arithmetic operator
a, b = 20, 7
print(f"a + b = {a + b}")
print(f"a - b = {a - b}")
print(f"a * b = {a * b}")
print(f"a / b = {a / b:.4f}")
print(f"a // b = {a // b}")
print(f"a % b = {a % b}")
print(f"a ** b = {a ** b}")
```

### Part 2: Even or Odd Checker

```python
num = int(input("Enter a number: "))
if num % 2 == 0:
    print(f"{num} is even")
else:
    print(f"{num} is odd")
```

### Part 3: Logical Operator Truth Table

```python
print("Truth Table:")
print(f"True  and True  = {True and True}")
print(f"True  and False = {True and False}")
print(f"False and True  = {False and True}")
print(f"False and False = {False and False}")
print()
print(f"True  or True   = {True or True}")
print(f"True  or False  = {True or False}")
print(f"False or True   = {False or True}")
print(f"False or False  = {False or False}")
print(f"not True       = {not True}")
print(f"not False      = {not False}")
```

### Part 4: Assignment Operators

```python
x = 10
print(f"Initial: x = {x}")
x += 5
print(f"After x += 5: x = {x}")
x *= 2
print(f"After x *= 2: x = {x}")
x -= 7
print(f"After x -= 7: x = {x}")
x //= 3
print(f"After x //= 3: x = {x}")
```

### Part 5: Compound Condition

```python
temperature = float(input("Enter temperature (C): "))
humidity = float(input("Enter humidity (%): "))

is_hot = temperature > 30
is_humid = humidity > 70
is_uncomfortable = is_hot and is_humid
is_pleasant = not is_hot and not is_humid

print(f"Hot: {is_hot}, Humid: {is_humid}")
print(f"Uncomfortable: {is_uncomfortable}")
print(f"Pleasant: {is_pleasant}")
```

## Deliverables

Jupyter notebook `operators_lab.ipynb` with all results visible.
