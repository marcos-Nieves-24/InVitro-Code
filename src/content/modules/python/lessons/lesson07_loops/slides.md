# Loops — Slide Outline

## Slide 1: Title Slide
- Loops in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Loops?
- Automate repetitive tasks
- Process large datasets
- Essential for data analysis
- ML: iterate over epochs, features, samples

## Slide 3: The for Loop
```python
for item in sequence:
    # do something
```
- Iterates over any iterable (list, str, range, etc.)

## Slide 4: range() Function
```python
range(5)          # 0, 1, 2, 3, 4
range(2, 7)       # 2, 3, 4, 5, 6
range(1, 10, 2)   # 1, 3, 5, 7, 9
range(10, 0, -1)  # 10, 9, ..., 1
```

## Slide 5: The while Loop
```python
while condition:
    # do something
```
- Repeats while condition is True
- Must update condition to avoid infinite loops

## Slide 6: Break and Continue
```python
for i in range(10):
    if i == 3:
        continue  # skip 3
    if i == 8:
        break     # stop at 8
    print(i)
# Output: 0 1 2 4 5 6 7
```

## Slide 7: Nested Loops
```python
for row in range(3):
    for col in range(4):
        print(row, col)
```
- Outer loop runs once per inner loop completion
- Used for 2D data (matrices, images, grids)

## Slide 8: Loop else Clause
```python
for x in data:
    if condition(x):
        break
else:
    print("Not found")
```
- `else` runs if no `break` occurred

## Slide 9: enumerate() and zip()
```python
for i, val in enumerate(items):
    print(i, val)

for a, b in zip(list1, list2):
    print(a, b)
```

## Slide 10: Biotech Example
- DNA sequence processing
- Filter sequences by GC content
- Use for loop to analyze thousands of sequences

## Slide 11: SaaS Example
- Monthly churn analysis
- Iterate over months
- Accumulate totals, calculate rates

## Slide 12: Common Mistakes
- Infinite while loops (forgot to update)
- Modifying list while iterating
- Off-by-one with range()
- `for i in range(len(list))` instead of direct iteration

## Slide 13: Best Practices
- Prefer for over while for sequences
- Keep loop bodies short
- Use enumerate() for index+value
- Use zip() for parallel iteration
- Never modify list while iterating

## Slide 14: Summary
- `for` loops over sequences
- `while` loops on conditions
- `range()` generates numbers
- `break` exits, `continue` skips
- Nested loops for 2D data
- `else` runs if no break
