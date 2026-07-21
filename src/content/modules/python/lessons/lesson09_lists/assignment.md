# Assignment: Data Processing with Lists

## Objectives

- Create and manipulate lists effectively
- Use list comprehensions for concise code
- Work with nested lists (matrices)
- Process data using lists and loops

## Instructions

Create a Python script `list_processor.py` that performs the following tasks:

1. **Temperature analysis**: Given a list of daily temperatures, compute min, max, mean, and identify days above the mean.

2. **Matrix transpose**: Given a matrix (list of lists), compute its transpose and matrix multiplication (dot product) with another matrix.

3. **Sequence analysis**: Given a DNA sequence as a string, create a list of all codons (3-base chunks), count occurrences of each codon, and find the most frequent codon.

4. **Moving average**: Implement a `moving_average(data, window_size)` function using list comprehension.

5. **Outlier detection**: Given a list of numbers, identify outliers using the IQR method (Q1 - 1.5*IQR, Q3 + 1.5*IQR).

## Starter Data

```python
temperatures = [36.1, 37.2, 38.5, 36.8, 37.0, 39.1, 36.5, 37.8, 38.0, 36.9]
matrix_a = [[1, 2], [3, 4], [5, 6]]
matrix_b = [[7, 8, 9], [10, 11, 12]]
dna = "ATGCGATCGAATTCGATCGATCGAATTCGATCGA"
data_points = [10, 12, 11, 13, 45, 12, 11, 10, 13, 12, 48, 11, 10, 13]
```

## Deliverables

- `list_processor.py` with all 5 tasks
- Output for each task

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| List Operations | All operations correct and efficient | Most correct | Errors present |
| List Comprehensions | Used appropriately throughout | Used occasionally | Not used |
| Matrix Operations | Correct transpose and multiplication | One correct | Neither correct |
| Functions | Well-defined, reusable | Defined but basic | Missing |
| Code Quality | PEP 8, commented, clean | Acceptable | Poor |

## Estimated Completion Time

90 minutes
