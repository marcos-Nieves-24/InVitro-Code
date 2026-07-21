# Lists — Slide Outline

## Slide 1: Title Slide
- Lists in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Lists?
- Store collections of data
- Ordered, mutable, flexible
- Python's most-used data structure
- ML: feature vectors, sample lists
- Biotech: gene lists, sequence fragments

## Slide 3: Creating Lists
```python
empty = []
numbers = [1, 2, 3]
mixed = [1, "hello", 3.14]
nested = [[1, 2], [3, 4]]
```
- Square brackets
- Can hold any type
- Can be nested

## Slide 4: Indexing (0-based)
```python
fruits = ["a", "b", "c", "d", "e"]
fruits[0]   # "a" (first)
fruits[-1]  # "e" (last)
fruits[-2]  # "d"
```
- First element: index 0
- Last element: index -1

## Slide 5: Slicing
```python
numbers[2:5]    # [2, 3, 4]
numbers[:3]     # [0, 1, 2]
numbers[3:]     # [3, 4, 5, ...]
numbers[::2]    # every other
numbers[::-1]   # reversed
```
- `[start:stop:step]`
- Start inclusive, stop exclusive

## Slide 6: List Methods
| Method | Description |
|--------|-------------|
| `append(x)` | Add to end |
| `insert(i, x)` | Insert at position |
| `remove(x)` | Remove first occurrence |
| `pop()` | Remove and return last |
| `sort()` | Sort in place |
| `reverse()` | Reverse in place |
| `index(x)` | Find first index |

## Slide 7: List Comprehension
```python
# Basic
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x%2==0]

# Nested
matrix = [[i*j for j in range(3)] for i in range(3)]
```
- Concise, Pythonic
- More readable than manual loops

## Slide 8: Mutability
```python
items = [1, 2, 3]
items[1] = 99  # OK — list is mutable
items.append(4)  # OK
```
- Lists can be changed in place
- Important: tuples are immutable

## Slide 9: Common Operations
```python
len(list)      # length
x in list      # membership
list1 + list2  # concatenation
list * 3       # repetition
sum(list)      # sum (numeric)
min(list)      # minimum
max(list)      # maximum
```

## Slide 10: Iterating Over Lists
```python
for item in items:        # direct
for i, item in enumerate(items):  # with index
for a, b in zip(list1, list2):    # parallel
```

## Slide 11: Biotech Example
- Gene expression analysis
- Filter significant genes
- List comprehension with conditions
- Zip over multiple lists

## Slide 12: Common Mistakes
- Index out of range
- append vs extend confusion
- Modifying list while iterating
- Shallow copy vs deep copy
- Off-by-one in slices

## Slide 13: Best Practices
- Use comprehensions over map/filter
- Use `enumerate()` for index+value
- Use `zip()` for parallel iteration
- Copy with `[:]` or `.copy()`
- Don't modify while iterating

## Slide 14: Summary
- Lists: ordered, mutable collections
- Indexing: 0-based, negative for end
- Slicing: `[start:stop:step]`
- Methods: append, insert, remove, pop, sort
- Comprehensions: concise creation syntax
- Mutable: can be changed in place
