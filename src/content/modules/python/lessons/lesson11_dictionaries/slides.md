# Dictionaries — Slide Outline

## Slide 1: Title Slide
- Dictionaries in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Dictionaries?
- Store key-value pairs
- Fast O(1) lookup by key
- Natural for real-world data
- ML: feature names → values
- Biotech: gene → expression
- SaaS: user → profile

## Slide 3: Creating Dictionaries
```python
empty = {}
student = {"name": "Alice", "age": 22}
scores = dict(Alice=95, Bob=87)
pairs = dict([("a", 1), ("b", 2)])
```

## Slide 4: Accessing Values
```python
d["key"]      # KeyError if missing
d.get("key")  # None if missing
d.get("key", default)  # default if missing
```
- Always use `get()` for safe access

## Slide 5: Modifying Dictionaries
```python
d["new_key"] = value    # Add/update
d.update({"k1": 1, "k2": 2})  # Multiple
del d["key"]            # Remove
d.pop("key")            # Remove and return
d.clear()               # Remove all
```

## Slide 6: Dictionary Methods
```python
d.keys()    # All keys
d.values()  # All values
d.items()   # All (key, value) pairs
```
- Use `for k, v in d.items():` to iterate

## Slide 7: Dictionary Comprehension
```python
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

even_sq = {x: x**2 for x in range(10) if x%2==0}
```

## Slide 8: Dictionary Operations
```python
len(d)         # Number of pairs
"key" in d     # Check key exists
d1 | d2        # Merge (3.9+)
```
- Keys must be hashable (immutable)
- Strings, numbers, tuples → OK
- Lists, dicts, sets → NOT OK

## Slide 9: Counting with Dictionaries
```python
# The get() pattern
counts = {}
for item in data:
    counts[item] = counts.get(item, 0) + 1

# Or use collections.Counter
from collections import Counter
counts = Counter(data)
```

## Slide 10: defaultdict
```python
from collections import defaultdict

# Group items
groups = defaultdict(list)
for key, value in pairs:
    groups[key].append(value)

# Count
counts = defaultdict(int)
for item in data:
    counts[item] += 1
```

## Slide 11: Biotech Example
- Codon table: codon → amino acid
- DNA translation with dictionary lookup
- Gene expression: gene → expression value

## Slide 12: SaaS Example
- User activity aggregation
- Count events per user per type
- Nested dictionaries for multi-level data

## Slide 13: Common Mistakes
- `d["missing"]` → KeyError
- Mutable keys (lists)
- Unintentional overwriting
- Confusing `in` for keys vs values

## Slide 14: Best Practices
- Use `get()` for safe access
- Use defaultdict for grouping/counting
- Use comprehensions for conciseness
- Use `items()` for iteration
- Prefer Counter for counting

## Slide 15: Summary
- Dictionaries: key-value mappings
- Fast O(1) lookup with hash tables
- Keys must be hashable
- `get()` for safe access
- Comprehensions for creation
- defaultdict and Counter for specialized needs
