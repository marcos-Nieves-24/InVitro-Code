# Assignment: Data Processing with Loops

## Objectives

- Apply for and while loops to real-world data
- Use break and continue for flow control
- Implement nested loops for multi-dimensional processing
- Use enumerate() and zip() for Pythonic iteration

## Instructions

Create a Python script `data_processor.py` that:

1. **Gene expression analysis**: Given a list of gene expression values and a threshold, count how many are above the threshold using a for loop.

2. **Quality filtering**: Given a list of DNA sequences, filter out those shorter than a minimum length. Track how many were filtered.

3. **Running average**: Using a while loop, compute the running average of a list of numbers until a negative number is encountered (then stop with break).

4. **Matrix operations**: Given a 3×3 matrix (list of lists), compute the sum of each row and each column using nested loops.

5. **Cumulative metrics**: Given monthly revenue data, compute cumulative revenue and month-over-month growth rates.

## Starter Data

```python
gene_expression = [2.5, 0.8, 3.2, 1.1, 4.0, 0.3, 2.1, 1.8]
dna_sequences = ["ATCG", "GCTA", "T", "GGCC", "A", "CGATCG", "TT"]
running_data = [10, 15, 20, 25, 30, -1, 40, 50]
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
monthly_revenue = [12000, 13500, 12800, 14200, 15100, 14800]
```

## Deliverables

- `data_processor.py` with all 5 tasks implemented
- Output showing the results of each task

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| For Loops | Correct iteration and accumulation | Minor issues | Major errors |
| While Loops | Proper condition and termination | Runs but imperfect | Infinite loop or wrong logic |
| Break/Continue | Used appropriately | Used but not optimal | Not used |
| Nested Loops | Correct multi-dimensional processing | Basic but works | Incorrect |
| Pythonic Style | Uses enumerate/zip, clean code | Mostly clean | UnPythonic |

## Estimated Completion Time

90 minutes
