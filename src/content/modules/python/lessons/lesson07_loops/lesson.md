---
Module: 2
Lesson Number: 7
Lesson Title: Loops
Estimated Duration: 60 minutes
Prerequisites: L6 — Functions
Learning Objectives:
  - Use for loops to iterate over sequences
  - Use while loops for conditional iteration
  - Use range() to generate numeric sequences
  - Control loop flow with break and continue
  - Write nested loops for multi-dimensional data
Keywords: for, while, range, break, continue, nested loop, iteration
Difficulty: Beginner
Programming Concepts: Iteration, loop control, nested loops
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Loops

## Motivation

Loops allow you to repeat operations efficiently. Instead of writing the same code for each item in a dataset, you write a loop that processes all items automatically. In biotechnology, loops process thousands of genes, DNA sequences, or patient records. In SaaS, they iterate over user transactions, log entries, and feature calculations. Without loops, data analysis at scale would be impossible.

## Big Picture

In the previous lesson, you learned functions — reusable code blocks. Loops add repetition to your toolkit. Combined with conditionals (next lesson), loops enable you to build complex data processing pipelines. After this lesson, you will understand lists (Lesson 9) better because loops are the primary way to process list elements.

## Theory

### The for Loop

The `for` loop iterates over a sequence (string, list, tuple, etc.):

```python
for variable in sequence:
    pass  # code to repeat
```

### The range() Function

`range()` generates sequences of numbers:

```python
range(stop)       # 0, 1, 2, ..., stop-1
range(start, stop)  # start, start+1, ..., stop-1
range(start, stop, step)  # start, start+step, ...
```

### The while Loop

The `while` loop repeats as long as a condition is True:

```python
while condition:
    pass  # code to repeat
```

### Break and Continue

- **break**: Exits the loop immediately
- **continue**: Skips the rest of the current iteration, goes to the next

### Nested Loops

Loops inside loops — used for multi-dimensional data:

```python
for i in range(3):
    for j in range(3):
        print(i, j)
```

### The else Clause in Loops

Python loops can have an `else` clause that executes when the loop completes normally (no `break`):

```python
for x in range(5):
    print(x)
else:
    print("Loop completed without break")
```

## Visual Explanation

```
For Loop Flow:
┌─────────┐     ┌──────────────┐     ┌─────────┐
│ Start   │ ──→ │ More items?  │ ──→ │ Execute │
│         │     │ in sequence  │     │ Block   │
└─────────┘     └──────┬───────┘     └────┬────┘
                       │ No               │ Yes
                       ↓                  ↓
                    ┌─────────┐          Next item
                    │  Done   │
                    └─────────┘

While Loop Flow:
┌─────────┐     ┌──────────┐     ┌─────────┐
│ Start   │ ──→ │Condition?│ ──→ │ Execute │
│         │     │          │     │ Block   │
└─────────┘     └────┬─────┘     └────┬────┘
                     │ False          │ True
                     ↓                ↓
                  ┌─────────┐      Update
                  │  Done   │    condition
                  └─────────┘
```

## Python Implementation

```python
# For loop with a list
genes = ["BRCA1", "TP53", "EGFR", "MYC"]
for gene in genes:
    print(f"Analyzing {gene}...")
```

```python
# Range examples
for i in range(5):
    print(i, end=" ")
# Output: 0 1 2 3 4

for i in range(2, 8):
    print(i, end=" ")
# Output: 2 3 4 5 6 7

for i in range(0, 10, 2):
    print(i, end=" ")
# Output: 0 2 4 6 8
```

```python
# While loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1
```

```python
# Break and continue
for i in range(10):
    if i == 3:
        continue  # skip 3
    if i == 7:
        break     # stop at 7
    print(i, end=" ")
# Output: 0 1 2 4 5 6
```

```python
# Nested loops — multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} × {j} = {i * j:2d}", end="  ")
    print()
```

## Biotechnology Example

**Scenario**: Processing a list of DNA sequences to find those with high GC content.

```python
sequences = [
    "ATCGATCGATCG",
    "GGGGCCCCCAAAA",
    "ATATATATATAT",
    "CGCGCGCGCGCG",
    "AAAAAATTTTTT"
]

high_gc = []
for seq in sequences:
    gc = (seq.count("G") + seq.count("C")) / len(seq) * 100
    if gc > 50:
        high_gc.append(seq)
        print(f"High GC: {seq} ({gc:.1f}%)")

print(f"\nFound {len(high_gc)} high-GC sequences")
```

```python
# Using break to find a target sequence
target = "CGCGCGCGCGCG"
for i, seq in enumerate(sequences):
    if seq == target:
        print(f"Found target {target} at index {i}")
        break
else:
    print(f"Target {target} not found")
```

## SaaS Example

**Scenario**: Processing monthly transaction data for churn analysis.

```python
# Simulated monthly user activity
monthly_activity = [
    {"month": "Jan", "active_users": 1200, "churned": 45},
    {"month": "Feb", "active_users": 1250, "churned": 38},
    {"month": "Mar", "active_users": 1300, "churned": 52},
    {"month": "Apr", "active_users": 1280, "churned": 41},
    {"month": "May", "active_users": 1350, "churned": 35},
]

total_churned = 0
for month in monthly_activity:
    churn_pct = (month["churned"] / month["active_users"]) * 100
    print(f"{month['month']}: {churn_pct:.1f}% churn")
    total_churned += month["churned"]

print(f"\nTotal churned: {total_churned}")
print(f"Avg monthly churn: {total_churned / len(monthly_activity):.0f}")
```

## Common Mistakes

1. **Infinite while loops**: Forgetting to update the condition variable
2. **Modifying a list while iterating**: Can cause skipped items or errors. Iterate over a copy instead
3. **Off-by-one errors**: `range(n)` gives 0 to n-1, not 1 to n
4. **Using `range(len(list))` instead of iterating directly**: Pythonic style prefers direct iteration
5. **Forgetting colon and indentation**: Required syntax for loop blocks

## Best Practices

- Prefer `for` loops over `while` when iterating over sequences
- Use `enumerate()` when you need both index and value
- Use `zip()` to iterate over multiple sequences in parallel
- Keep loop bodies short — extract complex logic into functions
- Use descriptive loop variable names (not just `i`, `j` for complex cases)

```python
# Pythonic patterns
for i, gene in enumerate(genes):
    print(f"{i}: {gene}")

for gene, expression in zip(genes, expressions):
    print(f"{gene}: {expression}")
```

## Summary

- `for` loops iterate over sequences (lists, strings, ranges)
- `while` loops repeat while a condition is True
- `range(start, stop, step)` generates number sequences
- `break` exits the loop; `continue` skips to the next iteration
- Nested loops handle multi-dimensional data
- Loops can have `else` clauses that execute on normal completion

## Key Terms

- **Iteration**: One execution of the loop body
- **Iterable**: Object that can be looped over (list, str, range, etc.)
- **Loop variable**: Variable that takes each value in the sequence
- **Infinite loop**: Loop that never terminates
- **Nested loop**: Loop inside another loop
- **enumerate()**: Built-in that yields (index, value) pairs

## Exercises

### Level 1: Basic

1. What is the output of `for i in range(3): print(i)`?
2. What is the difference between `break` and `continue`?
3. What happens if the condition in a `while` loop never becomes False?

### Level 2: Implementation

4. Write a for loop that calculates the sum of numbers from 1 to 100.
5. Write a while loop that prints the Fibonacci sequence up to 100 (each number is the sum of the previous two: 0, 1, 1, 2, 3, 5, 8...).

### Level 3: Critical Thinking

6. Compare `for` loops and `while` loops. When would you choose one over the other?
7. Why is modifying a list while iterating over it problematic? Show an example and the correct approach.

## Coding Challenge

Write a program that implements the **Sieve of Eratosthenes** to find all prime numbers up to a given limit `n`:
1. Create a list of booleans from 0 to n, initially all True
2. For each number from 2 to sqrt(n), mark multiples as False
3. The remaining True indices are prime numbers
4. Use nested loops and `break`/`continue` appropriately
5. Print all primes found
