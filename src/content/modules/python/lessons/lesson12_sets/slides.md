# Sets — Slide Outline

## Slide 1: Title Slide
- Sets in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Sets?
- Unordered collections of unique elements
- Fast membership testing (O(1))
- Mathematical set operations
- Biotech: unique genes, common variants
- SaaS: unique users, feature comparison

## Slide 3: Creating Sets
```python
empty = set()      # NOT {} — that's a dict
fruits = {"apple", "banana", "cherry"}
from_list = set([1, 2, 2, 3])  # {1, 2, 3}
from_string = set("hello")  # {'h', 'e', 'l', 'o'}
```

## Slide 4: Set Properties
- **Unordered** — no index, no order guarantees
- **Unique** — duplicates automatically removed
- **Mutable** — can add/remove elements
- **Hashable elements** — only immutable types

## Slide 5: Set Methods
```python
s.add(4)         # Add element
s.remove(3)      # Remove (error if missing)
s.discard(10)    # Remove (no error)
s.pop()          # Remove arbitrary
s.clear()        # Remove all
```

## Slide 6: Set Operations
| Operation | Symbol | Description |
|-----------|--------|-------------|
| Union | `A \| B` | Elements in either |
| Intersection | `A & B` | Elements in both |
| Difference | `A - B` | In A, not in B |
| Symmetric diff | `A ^ B` | In exactly one |

## Slide 7: Set Relationships
```python
a.issubset(b)      # a ⊆ b?
a.issuperset(b)    # a ⊇ b?
a.isdisjoint(b)    # a ∩ b = ∅?
```

## Slide 8: Frozenset
```python
fs = frozenset([1, 2, 3])
# Immutable, hashable
# Can be used as dict key
```
- Immutable version of set

## Slide 9: Membership Testing
```python
# Set: O(1) — extremely fast
# List: O(n) — slow for large data

if item in my_set:  # Fast!
```
- Use set for large-scale membership tests

## Slide 10: Duplicate Removal
```python
items = [1, 2, 2, 3, 1, 3, 4]
unique = list(set(items))
# [1, 2, 3, 4]
```
- Simplest way to deduplicate

## Slide 11: Biotech Example
- Comparing gene sets across experiments
- Find common genes (intersection)
- Find unique genes (difference)
- Jaccard similarity for comparison

## Slide 12: SaaS Example
- Feature adoption across tiers
- Common features (intersection)
- Premium-only features (difference)
- Check if basic features are subset of premium

## Slide 13: Common Mistakes
- `{}` creates dict, not set
- Can't add lists/dicts to sets
- Assuming set order
- Modifying set while iterating

## Slide 14: Best Practices
- Use for fast membership testing
- Use for removing duplicates
- Use set operations for comparisons
- Use frozenset when immutability needed
- Prefer `discard` over `remove`

## Slide 15: Summary
- Sets: unordered, unique, mutable
- Operations: union, intersection, difference, symmetric diff
- O(1) membership testing
- Frozenset: immutable version
- Great for deduplication and comparison
