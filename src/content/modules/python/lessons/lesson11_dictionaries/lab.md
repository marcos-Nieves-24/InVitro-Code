# Lab: Dictionaries in Practice

## Objective

Practice creating, accessing, and manipulating dictionaries.

## Duration

60 minutes

## Prerequisites

Lesson 9: Lists

## Instructions

### Part 1: Creating and Accessing Dictionaries

```python
# Contact book
contacts = {
    "Alice": {"phone": "555-0101", "email": "alice@example.com"},
    "Bob": {"phone": "555-0102", "email": "bob@example.com"},
    "Charlie": {"phone": "555-0103", "email": "charlie@example.com"},
}

print(f"Alice's email: {contacts['Alice']['email']}")
print(f"Bob's phone: {contacts['Bob'].get('phone', 'N/A')}")
```

### Part 2: Adding and Updating

```python
contacts["Diana"] = {"phone": "555-0104", "email": "diana@example.com"}
contacts["Alice"]["phone"] = "555-0199"  # Update

print("\nAll contacts:")
for name, info in contacts.items():
    print(f"  {name}: {info['phone']}, {info['email']}")
```

### Part 3: Dictionary Comprehension

```python
# Create dictionary from lists
names = ["Alice", "Bob", "Charlie", "Diana"]
scores = [95, 87, 92, 98]
gradebook = {name: score for name, score in zip(names, scores)}
print(f"Gradebook: {gradebook}")

# Filter by condition
high_scorers = {name: score for name, score in gradebook.items() if score >= 90}
print(f"High scorers: {high_scorers}")
```

### Part 4: Counting with Dictionaries

```python
text = "the quick brown fox jumps over the lazy dog"
word_counts = {}
for word in text.split():
    word_counts[word] = word_counts.get(word, 0) + 1
print(f"Word counts: {word_counts}")

# Alternative with defaultdict
from collections import defaultdict
counts = defaultdict(int)
for word in text.split():
    counts[word] += 1
print(f"DefaultDict: {dict(counts)}")
```

### Part 5: Nested Dictionaries

```python
# Sales data
sales = {
    "Q1": {"product_a": 1200, "product_b": 800, "product_c": 1500},
    "Q2": {"product_a": 1350, "product_b": 750, "product_c": 1600},
    "Q3": {"product_a": 1100, "product_b": 900, "product_c": 1450},
}

# Total sales per product
product_totals = defaultdict(int)
for quarter, products in sales.items():
    for product, amount in products.items():
        product_totals[product] += amount

print(f"Product totals: {dict(product_totals)}")
```

## Deliverables

Jupyter notebook `dicts_lab.ipynb` with all exercises.
