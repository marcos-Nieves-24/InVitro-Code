---
Module: 2
Lesson Number: 10
Lesson Title: Tuples
Estimated Duration: 30 minutes
Prerequisites: L9 — Lists
Learning Objectives:
  - Create tuples and explain their immutability
  - Use tuple unpacking for multiple assignment
  - Compare tuples with lists and choose appropriately
  - Use tuples as dictionary keys
  - Return multiple values from functions using tuples
Keywords: tuple, immutable, unpacking, hashable, sequence
Difficulty: Beginner
Programming Concepts: Immutable sequences, packing/unpacking, hashable types
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Tuples

## Motivation

Tuples are often called "immutable lists" — they store ordered collections like lists but cannot be changed after creation. This immutability makes them useful for fixed data that shouldn't be modified, like database records, coordinates, and function return values. In biotechnology, tuples represent (gene, expression) pairs, (patient_id, diagnosis) records, and DNA codon triplets. In SaaS, they store (user_id, timestamp, event) log entries.

## Big Picture

In the previous lesson, you learned lists — ordered, mutable collections. Tuples are ordered but immutable. Understanding the difference between mutable and immutable data structures is crucial for writing correct and efficient code. This lesson prepares you for dictionaries (next lesson), where tuples are used as keys (lists cannot be dictionary keys).

## Theory

### Creating Tuples

Tuples are created with parentheses `()`:

```python
empty = ()
single = (42,)        # Note: comma required for single-element tuple
pair = (1, 2)
triple = 1, 2, 3      # Parentheses optional
mixed = (1, "hello", 3.14)
nested = ((1, 2), (3, 4))
```

### Immutability

Once created, a tuple cannot be modified:

```python
point = (3, 4)
point[0] = 5  # TypeError: 'tuple' object does not support item assignment
```

### Tuple Unpacking

Assign tuple elements to multiple variables:

```python
point = (3, 4)
x, y = point          # x=3, y=4

# Swapping with unpacking
a, b = 10, 20
a, b = b, a          # a=20, b=10

# Extended unpacking (Python 3)
first, *rest = (1, 2, 3, 4, 5)  # first=1, rest=[2, 3, 4, 5]
```

### Tuple Methods

Tuples have only two methods:

```python
t = (1, 2, 3, 1, 2, 1)
t.count(1)    # 3
t.index(2)    # 1 (first occurrence)
```

### When to Use Tuples

- **Fixed data**: Coordinates, RGB values, database records
- **Multiple return values**: Functions return tuples by default
- **Dictionary keys**: Tuples are hashable, lists are not
- **Immutable requirements**: Data that should not change
- **Performance**: Tuples are slightly faster than lists

### Tuple vs List Comparison

| Feature | Tuple | List |
|---------|-------|------|
| Syntax | `()` | `[]` |
| Mutable | No | Yes |
| Hashable | Yes (if elements hashable) | No |
| Use case | Fixed data | Variable data |
| Methods | count(), index() | Many methods |
| Memory | Slightly less | Slightly more |
| Speed | Slightly faster | Slightly slower |

## Visual Explanation

```
Tuple vs List Memory

Tuple (immutable):          List (mutable):
┌───────────────────┐      ┌───────────────────┐
│ "BRCA1"           │      │ "BRCA1"           │
│ 2.5               │      │ 2.5               │
│ 0.001             │      │ 0.001             │
│                   │      │ ← Can add/remove  │
│ Fixed size        │      │ Variable size     │
└───────────────────┘      └───────────────────┘
```

## Python Implementation

```python
# Creating tuples
gene_data = ("BRCA1", 2.5, 0.001)
coordinates = (47.6, -122.3)
rgb = (255, 128, 0)

# Accessing elements
print(f"Gene: {gene_data[0]}")
print(f"Expression: {gene_data[1]}")
```

```python
# Tuple unpacking
patient = ("P-0042", "John Doe", 45, "Hypertension")
pid, name, age, diagnosis = patient
print(f"{pid}: {name}, {age} yrs, {diagnosis}")

# Return tuple from function
def min_max(numbers):
    return min(numbers), max(numbers)

result = min_max([3, 1, 7, 2, 9, 4])
mn, mx = result
print(f"Min: {mn}, Max: {mx}")
```

```python
# Tuples as dictionary keys
location_data = {
    (47.6, -122.3): "Seattle",
    (40.7, -74.0): "New York",
    (34.0, -118.2): "Los Angeles"
}
print(location_data[(47.6, -122.3)])
```

```python
# Nested tuples
matrix = ((1, 2, 3), (4, 5, 6), (7, 8, 9))
print(f"Row 1, Col 2: {matrix[0][1]}")
```

## Biotechnology Example

**Scenario**: Representing genetic data as immutable records.

```python
# Each variant is a tuple: (chromosome, position, ref_base, alt_base, quality)
variants = [
    ("chr1", 123456, "A", "G", 99),
    ("chr1", 789012, "C", "T", 85),
    ("chrX", 345678, "G", "A", 92),
]

# Unpack and analyze
for chrom, pos, ref, alt, qual in variants:
    if qual > 90:
        print(f"High-quality variant: {chrom}:{pos} {ref}→{alt} (Q{qual})")

# Tuples ensure variant data cannot be accidentally modified
```

```python
# Codon table as tuple-based lookups
codons = [
    ("ATG", "M", "Start"),
    ("TAA", "*", "Stop"),
    ("TAG", "*", "Stop"),
    ("TGA", "*", "Stop"),
]

# Find codon function
def lookup_codon(codon):
    for c, aa, note in codons:
        if c == codon:
            return aa, note
    return None, "Unknown"

aa, note = lookup_codon("ATG")
print(f"ATG → {aa} ({note})")
```

## SaaS Example

**Scenario**: Storing event log entries as immutable records.

```python
# Each event: (timestamp, user_id, event_type, metadata_tuple)
events = [
    (1700000000, "user_001", "login", ("127.0.0.1", "Chrome")),
    (1700000050, "user_042", "purchase", ("premium", 49.99)),
    (1700000100, "user_001", "logout", (120, "active")),
]

for ts, uid, event_type, meta in events:
    if event_type == "purchase":
        product, amount = meta
        print(f"Purchase: {uid} bought {product} for ${amount:.2f}")
```

## Common Mistakes

1. **Forgetting comma for single-element tuple**: `(5)` is an int, `(5,)` is a tuple
2. **Trying to modify a tuple**: Creates TypeError
3. **Using tuple when list is needed**: If you need to modify data, use a list
4. **Unpacking mismatch**: Number of variables must match tuple length
5. **Using mutable elements in tuple**: Tuple with a list inside is not immutable overall

## Best Practices

- Use tuples for fixed, structured data (like database records)
- Use tuples for multiple return values from functions
- Use tuple unpacking for cleaner code
- Use tuples as dictionary keys when you need compound keys
- Prefer tuples over lists for data that shouldn't change

## Summary

- Tuples are ordered, immutable sequences created with `()`
- Single-element tuples require a trailing comma: `(42,)`
- Tuple unpacking assigns elements to multiple variables
- Tuples are hashable and can be used as dictionary keys
- Tuples protect data from accidental modification
- Use tuples for fixed records and multiple return values

## Key Terms

- **Tuple**: Immutable ordered sequence
- **Immutable**: Cannot be changed after creation
- **Unpacking**: Assigning tuple elements to multiple variables
- **Hashable**: Can be used as a dictionary key (tuple yes, list no)
- **Packing**: Creating a tuple from multiple values

## Exercises

### Level 1: Basic

1. How do you create a tuple with a single element?
2. What happens if you try to change a tuple element?
3. What is the output of `a, b, *rest = (1, 2, 3, 4, 5)`?

### Level 2: Implementation

4. Write a function `divide_and_remainder(a, b)` that returns a tuple (quotient, remainder) and use unpacking to print both values.
5. Create a list of tuples representing (name, score) pairs for 5 students. Find the student with the highest score.

### Level 3: Critical Thinking

6. Why can tuples be used as dictionary keys but lists cannot? What property of tuples enables this?
7. Under what circumstances would the immutability of tuples be a liability rather than an asset?

## Coding Challenge

Write a program that manages **inventory items** as tuples:
1. Each item is a tuple: `(item_id, name, quantity, price)`
2. Create a list of at least 5 inventory items
3. Write a function `total_value(inventory)` that returns the total value (sum of quantity * price for all items)
4. Write a function `find_item(inventory, item_id)` that searches by item_id
5. Write a function `sort_by_value(inventory)` that returns items sorted by total value (quantity * price), using tuples
6. Demonstrate all functions with your inventory
