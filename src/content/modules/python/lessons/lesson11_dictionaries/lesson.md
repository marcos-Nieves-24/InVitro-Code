---
Module: 2
Lesson Number: 11
Lesson Title: Dictionaries
Estimated Duration: 60 minutes
Prerequisites: L9 — Lists
Learning Objectives:
  - Create dictionaries with key-value pairs
  - Access, add, update, and delete dictionary entries
  - Use dictionary methods: keys(), values(), items(), get()
  - Write dictionary comprehensions
  - Use dictionaries for data aggregation and counting
Keywords: dictionary, key, value, mapping, hash table, comprehension
Difficulty: Beginner
Programming Concepts: Key-value pairs, hash tables, mapping
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Dictionaries

## Motivation

Dictionaries store data as key-value pairs, allowing you to look up values by a meaningful key rather than by numeric index. They are Python's most important built-in data structure for data science. In biotechnology, dictionaries map gene names to expression values, patient IDs to clinical data, and codons to amino acids. In SaaS, they map user IDs to profiles, product names to prices, and metric names to values.

## Big Picture

After learning about lists (ordered, indexed by position) and tuples (immutable), dictionaries introduce a new way to organize data: by key instead of position. This is closer to how real-world data works — you look up a patient by ID, not by numeric index. The next lesson on sets uses similar hash-based technology. Later, you'll use dictionaries extensively with Pandas DataFrames.

## Theory

### Creating Dictionaries

Dictionaries are created with curly braces `{}`:

```python
empty = {}
student = {"name": "Alice", "age": 22, "grade": "A"}
scores = dict(Alice=95, Bob=87, Charlie=92)  # Using dict()
pairs = [("a", 1), ("b", 2)]
from_pairs = dict(pairs)
```

### Accessing Values

```python
student = {"name": "Alice", "age": 22, "grade": "A"}
print(student["name"])       # "Alice"
print(student.get("name"))   # "Alice" (safe access)
print(student.get("gpa"))    # None (no error)
print(student.get("gpa", 0.0))  # 0.0 (default value)
```

### Adding and Updating

```python
student = {"name": "Alice"}
student["age"] = 22          # Add new key-value pair
student["name"] = "Bob"      # Update existing value
student.update({"grade": "A", "year": 2024})  # Multiple updates
```

### Deleting Entries

```python
del student["grade"]          # Remove key-value pair
popped = student.pop("age")   # Remove and return value
student.clear()               # Remove all entries
```

### Dictionary Methods

```python
d = {"a": 1, "b": 2, "c": 3}
d.keys()      # dict_keys(['a', 'b', 'c'])
d.values()    # dict_values([1, 2, 3])
d.items()     # dict_items([('a', 1), ('b', 2), ('c', 3)])
d.get("a")    # 1 (safe access)
d.setdefault("d", 4)  # Set if key doesn't exist
```

### Dictionary Comprehension

```python
squares = {x: x ** 2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# With condition
even_squares = {x: x ** 2 for x in range(10) if x % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# From two lists
keys = ["a", "b", "c"]
values = [1, 2, 3]
combined = {k: v for k, v in zip(keys, values)}
```

### Dictionary Operations

```python
len(d)            # Number of key-value pairs
"key" in d        # Membership test on keys
"key" not in d    # Non-membership
d1 | d2           # Merge (Python 3.9+)
d1 |= d2          # Update in place (Python 3.9+)
```

## Visual Explanation

```
Dictionary Structure (Hash Table)

Key        Hash Function    Bucket
┌──────┐   ┌──────────┐   ┌───────┐
│"name"│ → │ hash()   │ → │ Index │ → "Alice"
├──────┤   └──────────┘   ├───────┤
│"age" │ → │ hash()   │ → │ Index │ → 22
├──────┤   └──────────┘   ├───────┤
│"grade"│→ │ hash()   │ → │ Index │ → "A"
└──────┘   └──────────┘   └───────┘

Key lookup is O(1) — very fast!
```

## Python Implementation

```python
# Creating a dictionary
gene_expression = {
    "BRCA1": 2.5,
    "TP53": 1.8,
    "EGFR": 3.2,
    "MYC": 0.9,
    "KRAS": -2.1
}

# Accessing values
print(f"BRCA1 expression: {gene_expression['BRCA1']}")
print(f"TP53 expression: {gene_expression.get('TP53', 'N/A')}")

# Adding/updating
gene_expression["ALK"] = 1.5
gene_expression["MYC"] = 1.2  # Update

# Iterating
for gene, expression in gene_expression.items():
    status = "up" if expression > 0 else "down"
    print(f"{gene}: {expression:.1f} ({status})")
```

```python
# Counting with dictionaries
sequence = "ATCGATCGATCGATCG"
base_counts = {}
for base in sequence:
    base_counts[base] = base_counts.get(base, 0) + 1
print(base_counts)
# {'A': 4, 'T': 4, 'C': 4, 'G': 4}
```

```python
# Dictionary comprehension
# Invert a dictionary
expression = {"BRCA1": 2.5, "TP53": 1.8, "EGFR": 3.2}
inverted = {v: k for k, v in expression.items()}
print(inverted)
# {2.5: 'BRCA1', 1.8: 'TP53', 3.2: 'EGFR'}
```

```python
# Default dict for nested structures
from collections import defaultdict

# Group genes by expression level
gene_data = [("BRCA1", 2.5), ("TP53", -1.2), ("EGFR", 3.8),
             ("MYC", 0.9), ("KRAS", -2.1), ("ALK", 1.5)]

by_status = defaultdict(list)
for gene, expr in gene_data:
    status = "up" if expr > 0 else "down"
    by_status[status].append(gene)

print(dict(by_status))
# {'up': ['BRCA1', 'EGFR', 'MYC', 'ALK'], 'down': ['TP53', 'KRAS']}
```

## Biotechnology Example

**Scenario**: Mapping genetic codons to amino acids for protein translation.

```python
# Codon table (partial)
codon_table = {
    "ATG": "M", "TAA": "*", "TAG": "*", "TGA": "*",
    "TTT": "F", "TTC": "F", "TTA": "L", "TTG": "L",
    "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
    "ATT": "I", "ATC": "I", "ATA": "I", "GTT": "V",
    "GTC": "V", "GTA": "V", "GTG": "V",
}

def translate_dna(dna_sequence):
    """Translate DNA sequence to protein."""
    protein = []
    for i in range(0, len(dna_sequence) - 2, 3):
        codon = dna_sequence[i:i+3].upper()
        amino_acid = codon_table.get(codon, "?")
        protein.append(amino_acid)
        if amino_acid == "*":  # Stop codon
            break
    return "".join(protein)

dna = "ATGGCCCTTAAGTAATGA"
protein = translate_dna(dna)
print(f"DNA: {dna}")
print(f"Protein: {protein}")
```

## SaaS Example

**Scenario**: Aggregating user activity data.

```python
# User activity log
activity_log = [
    ("user_001", "login"), ("user_002", "purchase"),
    ("user_001", "view"), ("user_003", "login"),
    ("user_002", "logout"), ("user_001", "purchase"),
]

# Count events per user
user_events = {}
for user, event in activity_log:
    if user not in user_events:
        user_events[user] = {}
    user_events[user][event] = user_events[user].get(event, 0) + 1

print("User activity summary:")
for user, events in sorted(user_events.items()):
    total = sum(events.values())
    print(f"  {user}: {total} events - {events}")
```

## Common Mistakes

1. **Accessing non-existent key directly**: `d["missing"]` raises KeyError. Use `d.get("missing")`
2. **Mutable keys**: Lists cannot be dictionary keys. Use tuples instead
3. **Overwriting keys unintentionally**: Each key can only appear once; assigning to existing key overwrites
4. **Assuming dictionary order**: Python 3.7+ preserves insertion order, but don't rely on it for earlier versions
5. **Confusing `in` for keys vs values**: `"key" in d` checks keys, not values

## Best Practices

- Use `get()` with defaults for safe access
- Use `defaultdict` for nested or counting dictionaries
- Use dictionary comprehensions for concise creation
- Use `items()` when iterating over both keys and values
- Use `setdefault()` for conditional insertion
- Prefer `collections.Counter` for counting tasks

## Summary

- Dictionaries store key-value pairs using `{}`
- Access values with `d[key]` (unsafe) or `d.get(key)` (safe)
- Keys must be immutable and hashable (strings, numbers, tuples)
- Methods: keys(), values(), items(), get(), update(), pop()
- Dictionary comprehensions: `{k: v for k, v in iterable}`
- Dictionaries are O(1) for lookups — very fast
- Use defaultdict and Counter for specialized needs

## Key Terms

- **Dictionary**: Unordered (but insertion-ordered in 3.7+) mapping of keys to values
- **Key**: Immutable identifier used for lookup
- **Value**: Data associated with a key
- **Hash table**: Underlying data structure for dictionaries
- **KeyError**: Exception when accessing a missing key
- **defaultdict**: Dictionary that provides default values for missing keys
- **Counter**: Dictionary subclass for counting hashable objects

## Exercises

### Level 1: Basic

1. What happens if you try to access a key that doesn't exist using `d["missing"]`?
2. What types can be used as dictionary keys?
3. What does `d.get("key", default)` return if "key" is not in the dictionary?

### Level 2: Implementation

4. Write a function `word_count(text)` that returns a dictionary counting word frequencies in a string.
5. Given a dictionary of student grades, write a function that returns the student with the highest average grade.

### Level 3: Critical Thinking

6. How do Python dictionaries achieve O(1) lookup time? What is a hash collision and how is it resolved?
7. When would you use a defaultdict instead of a regular dictionary with `get()`? Provide a concrete example.

## Coding Challenge

Write a program that implements an **in-memory key-value store** (like a simple database):
1. Start with an empty dictionary
2. Implement functions: `put(key, value)`, `get(key)`, `delete(key)`, `keys()`, `values()`, `search(field, value)`
3. Store structured data: each value should be a dictionary with fields like `{"name": "...", "age": ..., "city": "..."}`
4. Implement `search(field, value)` that returns all entries where `entry[field] == value`
5. Demonstrate with at least 10 records and 3 searches
6. Use a `defaultdict` to index data by fields for faster searching
