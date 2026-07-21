# Lab: Sets and Set Operations

## Objective

Practice creating sets, performing set operations, and using sets for data analysis.

## Duration

30 minutes

## Prerequisites

Lesson 9: Lists

## Instructions

### Part 1: Creating Sets

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

### Part 2: Set Operations

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

### Part 3: Duplicate Removal

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

### Part 4: Membership Testing

```python
valid_codes = {"A01", "B02", "C03", "D04", "E05"}

test_codes = ["A01", "X99", "C03", "Z12"]
for code in test_codes:
    if code in valid_codes:
        print(f"{code}: VALID")
    else:
        print(f"{code}: INVALID")
```

### Part 5: Set Relationships

```python
a = {1, 2, 3, 4}
b = {1, 2}
c = {5, 6}

print(f"B is subset of A: {b.issubset(a)}")
print(f"A is superset of B: {a.issuperset(b)}")
print(f"A and C are disjoint: {a.isdisjoint(c)}")
```

## Deliverables

Jupyter notebook `sets_lab.ipynb` with all exercises.
