# Lab: Loops and Iteration

## Objective

Practice for loops, while loops, range(), break/continue, and nested loops.

## Duration

60 minutes

## Prerequisites

Lesson 6: Functions

## Instructions

### Part 1: Basic for Loop

```python
# Iterate over a list of fruits
fruits = ["apple", "banana", "cherry", "date"]
for fruit in fruits:
    print(f"I like {fruit}s")
```

### Part 2: range() Practice

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

### Part 3: While Loop

```python
# Countdown with while
count = 10
while count > 0:
    print(count, end=" ")
    count -= 1
print("Blast off!")
```

### Part 4: Break and Continue

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

### Part 5: Nested Loops

```python
# Generate a coordinate grid
print("Coordinate grid (3×4):")
for x in range(3):
    for y in range(4):
        print(f"({x},{y})", end=" ")
    print()
```

### Part 6: Loop with else

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

## Deliverables

Jupyter notebook `loops_lab.ipynb` with all exercises completed.
