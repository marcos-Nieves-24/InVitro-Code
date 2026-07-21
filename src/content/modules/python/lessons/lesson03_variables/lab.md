# Lab: Working with Variables

## Objective

Practice variable assignment, naming conventions, dynamic typing, and basic I/O.

## Duration

45 minutes

## Prerequisites

Lesson 2: Jupyter Notebook

## Instructions

### Part 1: Basic Assignment

In a Jupyter notebook cell, assign the following and print each:
- A variable `species` with "Homo sapiens"
- A variable `chromosome_count` with 46
- A variable `genome_size` with 3.1 (billion base pairs)

### Part 2: Dynamic Typing

```python
value = 100
print(type(value))
value = 100.0
print(type(value))
value = "one hundred"
print(type(value))
```

### Part 3: User Input

```python
name = input("Enter your name: ")
year = int(input("Enter birth year: "))
age = 2026 - year
print(f"Hello {name}, you are about {age} years old.")
```

### Part 4: Variable Swapping

Demonstrate variable swapping using tuple unpacking:
```python
x = 5
y = 10
x, y = y, x
print(f"x={x}, y={y}")
```

### Part 5: Biotechnology Context

Write code that stores information about a DNA sequence:
```python
sequence_id = "SEQ001"
sequence = "AGCTTCGATCG"
gc_count = sequence.count("G") + sequence.count("C")
gc_percent = (gc_count / len(sequence)) * 100
print(f"{sequence_id}: GC content = {gc_percent:.1f}%")
```

## Deliverables

A Jupyter notebook (`variables_lab.ipynb`) with all cells executed and outputs visible.
