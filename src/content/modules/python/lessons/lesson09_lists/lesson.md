---
Module: 2
Lesson Number: 9
Lesson Title: Lists
Estimated Duration: 60 minutes
Prerequisites: L7 — Loops, L8 — Conditionals
Learning Objectives:
  - Create lists with various data types
  - Access elements using indexing and slicing
  - Modify lists using built-in methods
  - Use list comprehensions for concise list creation
  - Choose between lists and tuples based on use case
Keywords: list, index, slice, append, list comprehension, mutable
Difficulty: Beginner
Programming Concepts: Sequence types, mutability, indexing, slicing, comprehensions
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Lists

## Motivation

Lists are Python's most versatile data structure. They store collections of items in a specific order and can be modified after creation. In data science, lists are everywhere: feature vectors, sample names, prediction outputs, and intermediate computations. In biotechnology, lists hold gene names, expression values, patient IDs, and sequence fragments. In SaaS, they store user IDs, transaction records, and metric values.

## Big Picture

In previous lessons, you learned variables (single values), operators, functions, loops, and conditionals. Lists introduce the concept of **collections** — storing multiple values in a single structure. This is your first step toward working with datasets. The next lessons on tuples, dictionaries, and sets build on the same concepts with different characteristics.

## Theory

### Creating Lists

Lists are created with square brackets `[]`:

```python
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4], [5, 6]]
```

### Indexing

Access elements by position (0-indexed):

```python
fruits = ["apple", "banana", "cherry", "date"]
fruits[0]    # "apple" (first)
fruits[-1]   # "date" (last)
fruits[-2]   # "cherry" (second to last)
```

### Slicing

Extract sublists with `[start:stop:step]`:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
numbers[2:5]     # [2, 3, 4]
numbers[:3]      # [0, 1, 2]
numbers[7:]      # [7, 8, 9]
numbers[::2]     # [0, 2, 4, 6, 8]
numbers[::-1]    # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

### List Methods

```python
fruits = ["apple", "banana"]
fruits.append("cherry")     # ["apple", "banana", "cherry"]
fruits.insert(1, "blueberry")  # ["apple", "blueberry", "banana", "cherry"]
fruits.remove("banana")     # Remove first occurrence
popped = fruits.pop()       # Remove and return last item
fruits.sort()               # Sort in place
fruits.reverse()            # Reverse in place
index = fruits.index("apple")  # Find index of item
count = fruits.count("apple")  # Count occurrences
```

### List Comprehension

Concise way to create lists:

```python
# Basic
squares = [x ** 2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested
matrix = [[i * j for j in range(3)] for i in range(3)]
```

### Mutability

Lists are **mutable** — you can change elements:

```python
fruits = ["apple", "banana", "cherry"]
fruits[1] = "blueberry"     # ["apple", "blueberry", "cherry"]
```

### Common Operations

```python
len(list)        # Number of elements
x in list        # Membership test
list1 + list2    # Concatenation
list * 3         # Repetition
min(list)        # Minimum
max(list)        # Maximum
sum(list)        # Sum (numeric lists)
```

## Visual Explanation

```
List Indexing (0-indexed):

Index:    0      1      2      3      4
      ┌──────┬──────┬──────┬──────┬──────┐
      │ "a"  │ "b"  │ "c"  │ "d"  │ "e"  │
      └──────┴──────┴──────┴──────┴──────┘
Index:   -5     -4     -3     -2     -1

Slicing [start:stop]:
  [1:4] → "b", "c", "d"  (stop is exclusive)
  [:3]  → "a", "b", "c"
  [2:]  → "c", "d", "e"
```

## Python Implementation

```python
# Creating and accessing lists
genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
print(f"First gene: {genes[0]}")
print(f"Last gene: {genes[-1]}")
print(f"First 3 genes: {genes[:3]}")

# Modifying lists
genes.append("ALK")
genes.insert(0, "HER2")
genes.sort()
print(f"Sorted: {genes}")

# Iterating
for gene in genes:
    print(gene, end=" ")
print()
```

```python
# List comprehension examples
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Squares
squares = [n ** 2 for n in numbers]
print(f"Squares: {squares}")

# Even numbers only
evens = [n for n in numbers if n % 2 == 0]
print(f"Evens: {evens}")

# Conditional expression
labels = ["even" if n % 2 == 0 else "odd" for n in numbers]
print(f"Labels: {labels}")
```

```python
# Nested lists (matrix)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access elements
print(f"Element [1][1]: {matrix[1][1]}")

# Sum of each row
row_sums = [sum(row) for row in matrix]
print(f"Row sums: {row_sums}")

# Transpose
transpose = [[row[i] for row in matrix] for i in range(3)]
print(f"Transpose: {transpose}")
```

## Biotechnology Example

**Scenario**: Processing gene expression data with lists.

```python
# Gene expression data (fold changes)
gene_names = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS", "ALK"]
fold_changes = [2.5, -1.2, 3.8, 0.9, -2.1, 1.5]
p_values = [0.001, 0.08, 0.003, 0.45, 0.02, 0.15]

# Find significantly upregulated genes (fold > 2, p < 0.05)
significant = []
for i in range(len(gene_names)):
    if fold_changes[i] > 2 and p_values[i] < 0.05:
        significant.append(gene_names[i])

print(f"Significantly upregulated: {significant}")

# Using list comprehension
significant = [
    gene_names[i]
    for i in range(len(gene_names))
    if fold_changes[i] > 2 and p_values[i] < 0.05
]

# Zip-based approach
significant = [
    gene for gene, fc, p in zip(gene_names, fold_changes, p_values)
    if fc > 2 and p < 0.05
]
print(f"Significant (comprehension): {significant}")
```

## SaaS Example

**Scenario**: Processing customer transaction data.

```python
# Monthly transaction values
transactions = [1250, 3400, 780, 2100, 5600, 920, 4300, 1500]

# Calculate statistics
total = sum(transactions)
average = total / len(transactions)
max_txn = max(transactions)
min_txn = min(transactions)

# Find transactions above average
high_value = [t for t in transactions if t > average]

# Growth rates
growth_rates = [
    ((transactions[i] - transactions[i-1]) / transactions[i-1]) * 100
    for i in range(1, len(transactions))
]

print(f"Total: ${total:,.2f}")
print(f"Average: ${average:,.2f}")
print(f"High-value transactions (> avg): {high_value}")
print(f"Growth rates: {[f'{g:.1f}%' for g in growth_rates]}")
```

## Common Mistakes

1. **Index out of range**: Accessing index ≥ len(list) raises IndexError
2. **Confusing append and extend**: `append` adds one element; `extend` adds elements from an iterable
3. **Modifying list while iterating**: Creates subtle bugs. Iterate over a copy: `for x in list[:]:`
4. **Shallow copy confusion**: `list2 = list1` doesn't copy; they reference the same object. Use `list2 = list1.copy()` or `list2 = list1[:]`
5. **Off-by-one in slicing**: `list[a:b]` includes a, excludes b

## Best Practices

- Use list comprehensions for simple transformations
- Use `enumerate()` when you need index and value
- Use `zip()` to iterate over multiple lists in parallel
- Prefer `in` for membership testing over manual loops
- Use `copy()` or `[:]` to create independent copies
- Avoid modifying lists while iterating

## Summary

- Lists are ordered, mutable collections created with `[]`
- Indexing: 0-based, negative indexes from the end
- Slicing: `[start:stop:step]` creates sublists
- Methods: append, insert, remove, pop, sort, reverse
- List comprehensions: `[expr for item in iterable if condition]`
- Lists can contain mixed types and nested lists

## Key Terms

- **List**: Ordered, mutable collection
- **Index**: Numeric position of an element (0-based)
- **Slice**: Subset of a list
- **Mutability**: Ability to change after creation
- **List comprehension**: Concise syntax for creating lists
- **Nested list**: List containing lists (multi-dimensional)
- **Shallow copy**: New reference to the same object

## Exercises

### Level 1: Basic

1. What is the result of `[1, 2, 3][::-1]`?
2. What is the difference between `append()` and `extend()`?
3. What does `len([1, [2, 3], 4])` return?

### Level 2: Implementation

4. Write a function `remove_duplicates(items)` that returns a new list with duplicates removed, preserving order.
5. Use a list comprehension to create a list of all even squares (squares of numbers that are even) from 1 to 20.

### Level 3: Critical Thinking

6. Compare the time complexity of list operations: indexing, append, insert, remove, in. Why is `in` on a list slow for large lists?
7. When would you choose a list over a tuple, and vice versa? What are the trade-offs?

## Coding Challenge

Write a program that implements a **rolling window average** calculator:
1. Given a list of numbers and a window size k
2. Compute the average of every consecutive k elements
3. Return a list of these averages
4. Example: `rolling_average([1, 2, 3, 4, 5], 3)` → `[2.0, 3.0, 4.0]`
5. Use list comprehension and slicing
6. Handle edge cases: empty list, k > len(list), k = 1
