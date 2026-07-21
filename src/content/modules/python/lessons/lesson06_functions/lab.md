# Lab: Writing Functions

## Objective

Practice defining functions, working with parameters, return values, and scope.

## Duration

60 minutes

## Prerequisites

Lesson 5: Operators

## Instructions

### Part 1: Basic Function

Write a function `celsius_to_fahrenheit(c)` that converts Celsius to Fahrenheit: F = C * 9/5 + 32.

```python
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

print(f"0°C = {celsius_to_fahrenheit(0)}°F")
print(f"37°C = {celsius_to_fahrenheit(37)}°F")
print(f"100°C = {celsius_to_fahrenheit(100)}°F")
```

### Part 2: Multiple Parameters

Write a function `bmi_category(weight, height)` that returns both BMI and category.

```python
def bmi_category(weight, height):
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

bmi, cat = bmi_category(70, 1.75)
print(f"BMI: {bmi:.1f}, Category: {cat}")
```

### Part 3: Default Parameters

```python
def create_report(patient_name, age, blood_type="Unknown"):
    return f"Patient: {patient_name}, Age: {age}, Blood Type: {blood_type}"

print(create_report("Alice", 30, "A+"))
print(create_report("Bob", 25))  # Uses default
```

### Part 4: Lambda Practice

```python
numbers = [5, 2, 8, 1, 9, 3]
sorted_desc = sorted(numbers, key=lambda x: -x)
print(f"Sorted descending: {sorted_desc}")

# Filter even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Evens: {evens}")

# Square each number
squares = list(map(lambda x: x ** 2, numbers))
print(f"Squares: {squares}")
```

### Part 5: Scope Experiment

```python
x = "global"

def test_scope():
    x = "local"
    print(f"Inside function: {x}")

test_scope()
print(f"Outside function: {x}")

# Using global keyword
def modify_global():
    global x
    x = "modified"

modify_global()
print(f"After modification: {x}")
```

## Deliverables

Jupyter notebook `functions_lab.ipynb` with all exercises completed.
