# Lab: Conditionals and Decision Making

## Objective

Practice if/elif/else, truthy/falsy, ternary expressions, and match statements.

## Duration

45 minutes

## Prerequisites

Lesson 6: Functions

## Instructions

### Part 1: Basic if/else

```python
# Check if a number is positive, negative, or zero
num = float(input("Enter a number: "))
if num > 0:
    print(f"{num} is positive")
elif num < 0:
    print(f"{num} is negative")
else:
    print(f"{num} is zero")
```

### Part 2: Truthy/Falsy

```python
# Test various values for truthiness
test_values = [0, 1, "", "hello", [], [1, 2], None, False, True]
for val in test_values:
    if val:
        print(f"Truthy: {val!r}")
    else:
        print(f"Falsy:  {val!r}")
```

### Part 3: Ternary

```python
# Convert ternary to if/else and vice versa
age = 17
can_vote = "Yes" if age >= 18 else "No"
print(f"Can vote: {can_vote}")

# Equivalent if/else
if age >= 18:
    can_vote = "Yes"
else:
    can_vote = "No"
print(f"Can vote: {can_vote}")
```

### Part 4: Match Statement

```python
# Python 3.10+ match statement
def get_day_type(day):
    match day.lower():
        case "monday" | "tuesday" | "wednesday" | "thursday" | "friday":
            return "Weekday"
        case "saturday" | "sunday":
            return "Weekend"
        case _:
            return "Invalid day"

print(get_day_type("Monday"))
print(get_day_type("Sunday"))
print(get_day_type("Funday"))
```

### Part 5: Nested Conditionals

```python
# Login system with nested conditions
username = input("Username: ")
password = input("Password: ")

if username == "admin":
    if password == "secret123":
        print("Welcome, admin!")
    else:
        print("Wrong password")
elif username == "guest":
    print("Welcome, guest (limited access)")
else:
    print("Unknown user")
```

## Deliverables

Jupyter notebook `conditionals_lab.ipynb` with all exercises.
