# Tuples — Slide Outline

## Slide 1: Title Slide
- Tuples in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Tuples?
- Immutable sequences
- Safe for fixed data
- Hashable → can be dict keys
- Multiple return values from functions

## Slide 3: Creating Tuples
```python
empty = ()
single = (42,)   # comma required!
pair = (1, 2)
triple = 1, 2, 3  # parentheses optional
nested = ((1, 2), (3, 4))
```

## Slide 4: Immutability
```python
t = (1, 2, 3)
t[0] = 99  # TypeError!
```
- Cannot modify after creation
- This is a feature, not a limitation!
- Protects data integrity

## Slide 5: Tuple Unpacking
```python
point = (3, 4)
x, y = point      # x=3, y=4

a, b = b, a       # swap

first, *rest = (1, 2, 3, 4)
# first=1, rest=[2, 3, 4]
```

## Slide 6: Tuple Methods
- Only 2 methods:
```python
t = (1, 2, 3, 1, 2)
t.count(1)  # 2
t.index(2)  # 1 (first occurrence)
```
- Much simpler than lists (by design)

## Slide 7: Tuples as Dictionary Keys
```python
locations = {
    (47.6, -122.3): "Seattle",
    (40.7, -74.0): "New York",
}
```
- Lists cannot be dict keys
- Tuples are hashable
- Great for compound keys

## Slide 8: Multiple Return Values
```python
def min_max(numbers):
    return min(numbers), max(numbers)

result = min_max([3, 1, 7, 2])
mn, mx = result  # unpacking
```
- Functions return tuples by default
- Clean, readable pattern

## Slide 9: Tuple vs List
| Feature | Tuple | List |
|---------|-------|------|
| Mutable | No | Yes |
| Hashable | Yes | No |
| Methods | 2 | Many |
| Syntax | `()` | `[]` |
| Use | Fixed data | Variable data |

## Slide 10: Biotech Example
- Genetic variant records as tuples
- Immutable patient data
- (chrom, pos, ref, alt, qual)
- Ensures data integrity

## Slide 11: Common Mistakes
- `(5)` is an int, not a tuple
- Trying to modify a tuple
- Unpacking with wrong number of variables
- Mutable elements inside tuple

## Slide 12: Best Practices
- Use tuples for fixed data records
- Use unpacking for cleaner code
- Use tuples for dict keys
- Use tuples for function returns
- Prefer tuples when data shouldn't change

## Slide 13: Summary
- Tuples: ordered, immutable
- Created with `()` or without
- Unpacking: elegant multiple assignment
- Hashable → dict keys
- Safer than lists for fixed data
