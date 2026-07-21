---
Module: 2
Lesson Number: 6
Lesson Title: Functions
Estimated Duration: 60 minutes
Prerequisites: L5 — Operators
Learning Objectives:
  - Define functions using the def keyword
  - Pass arguments and return values from functions
  - Distinguish between local and global scope
  - Create lambda (anonymous) functions
  - Write docstrings following PEP 257
Keywords: function, parameter, argument, return, scope, lambda, docstring
Difficulty: Beginner
Programming Concepts: Function definition, parameter passing, scope, lambda expressions, documentation
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Functions

## Motivation

Functions are reusable blocks of code that solve a specific task. Instead of writing the same code multiple times, you define it once in a function and call it whenever needed. This is the foundation of modular, maintainable programming. In biotechnology, functions encapsulate DNA sequence analysis, statistical tests, and data preprocessing steps. In SaaS, functions calculate metrics, filter data, and generate reports.

## Big Picture

In previous lessons, you learned variables, data types, and operators. Functions combine these elements into reusable units. The next lessons on loops and conditionals will be used inside functions to create powerful, reusable logic.

## Theory

### What is a Function?

A function is a named block of code that takes inputs (parameters), performs a computation, and returns an output. Functions promote the DRY (Don't Repeat Yourself) principle.

### Defining and Calling Functions

```python
def function_name(parameter1, parameter2):
    """Docstring explaining the function."""
    result = parameter1 + parameter2
    return result
```

### Function Components

1. **def keyword**: Starts the function definition
2. **Function name**: Follows naming conventions (snake_case)
3. **Parameters**: Variables that receive input values
4. **Colon**: Ends the function header
5. **Body**: Indented block of code
6. **return**: Sends output back to the caller
7. **Docstring**: Documentation string (optional but recommended)

### Parameters vs Arguments

- **Parameter**: Variable listed in the function definition
- **Argument**: Value passed to the function when called

### Types of Arguments

```python
# Positional arguments (required, in order)
def add(x, y):
    return x + y
add(3, 5)  # x=3, y=5

# Keyword arguments (order doesn't matter)
add(y=5, x=3)  # x=3, y=5

# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
greet("Alice")        # "Hello, Alice!"
greet("Bob", "Hi")    # "Hi, Bob!"

# Variable-length arguments
def sum_all(*args):
    return sum(args)
sum_all(1, 2, 3, 4)  # 10
```

### Return Values

Functions can return:
- A single value: `return x`
- Multiple values: `return x, y` (returns a tuple)
- Nothing: `return None` (or no return statement)

### Scope

- **Local scope**: Variables defined inside a function are only accessible there
- **Global scope**: Variables defined outside any function are accessible everywhere

```python
x = 10  # global

def my_func():
    y = 5  # local
    print(x)  # can access global
    print(y)  # can access local

my_func()
print(x)  # works
print(y)  # NameError
```

### Lambda Functions

Lambda functions are anonymous, single-expression functions:

```python
# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

# Often used inline
numbers = [1, 2, 3, 4]
squared = list(map(lambda x: x ** 2, numbers))
```

### Docstrings (PEP 257)

```python
def calculate_bmi(weight, height):
    """
    Calculate Body Mass Index.

    Parameters
    ----------
    weight : float
        Weight in kilograms.
    height : float
        Height in meters.

    Returns
    -------
    float
        BMI value.
    """
    return weight / (height ** 2)
```

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│                    Function Flow                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Caller: result = add(3, 5)                         │
│                                                     │
│         ┌──────────────────────────────────┐         │
│  3 ────→│ def add(x, y):                  │         │
│         │     """Add two numbers."""      │         │
│  5 ────→│     return x + y                │──→ 8    │
│         └──────────────────────────────────┘         │
│                                                     │
│  Parameters: x=3, y=5    Return: 8                  │
└─────────────────────────────────────────────────────┘
```

## Python Implementation

```python
# Basic function
def calculate_gc_content(dna_sequence):
    """Calculate the GC content of a DNA sequence."""
    sequence = dna_sequence.upper()
    gc_count = sequence.count("G") + sequence.count("C")
    return (gc_count / len(sequence)) * 100

# Call the function
gc = calculate_gc_content("ATCGGCTAGCTAGCATCG")
print(f"GC content: {gc:.1f}%")
```

```python
# Function with multiple parameters and default values
def analyze_sequence(sequence, min_length=10, gc_threshold=50.0):
    """Analyze a DNA sequence for quality."""
    seq_len = len(sequence)
    gc = (sequence.count("G") + sequence.count("C")) / seq_len * 100
    is_long = seq_len >= min_length
    is_gc_ok = gc >= gc_threshold
    
    return {
        "length": seq_len,
        "gc_content": gc,
        "passes_quality": is_long and is_gc_ok
    }

result = analyze_sequence("ATCGATCGATCG")
print(result)
```

```python
# Lambda functions in practice
sequences = ["ATCG", "GGCC", "AATT", "CGAT"]
sorted_by_gc = sorted(sequences, key=lambda seq: seq.count("G") + seq.count("C"))
print(sorted_by_gc)
```

## Biotechnology Example

**Scenario**: A bioinformatics pipeline for quality-checking DNA sequences.

```python
def reverse_complement(sequence):
    """Return the reverse complement of a DNA sequence."""
    complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
    return "".join(complement[base] for base in reversed(sequence.upper()))

def has_restriction_site(sequence, enzyme_site="GAATTC"):
    """Check if a restriction enzyme site exists in the sequence."""
    return enzyme_site in sequence.upper()

# Usage
dna = "ATGAATTCGCTAGCTAGCTAG"
rc = reverse_complement(dna)
has_site = has_restriction_site(dna)

print(f"Original: {dna}")
print(f"Reverse complement: {rc}")
print(f"Contains EcoRI site (GAATTC): {has_site}")
```

## SaaS Example

**Scenario**: Customer metrics calculation for a SaaS dashboard.

```python
def calculate_arpu(revenue, active_users):
    """Calculate Average Revenue Per User."""
    if active_users == 0:
        return 0.0
    return revenue / active_users

def churn_rate(lost_customers, start_customers):
    """Calculate customer churn rate as a percentage."""
    if start_customers == 0:
        return 0.0
    return (lost_customers / start_customers) * 100

def customer_health_score(logins, support_tickets, days_active):
    """Calculate a composite customer health score (0-100)."""
    login_score = min(logins * 10, 50)
    ticket_penalty = min(support_tickets * 5, 30)
    activity_score = min(days_active / 30 * 50, 50)
    return max(login_score + activity_score - ticket_penalty, 0)

# Usage
revenue = 125000
users = 15420
lost = 540
health = customer_health_score(logins=45, support_tickets=2, days_active=180)
print(f"ARPU: ${calculate_arpu(revenue, users):.2f}")
print(f"Churn: {churn_rate(lost, users):.1f}%")
print(f"Health Score: {health}/100")
```

## Common Mistakes

1. **Forgetting parentheses when calling**: `result = my_func` (references the function) vs `result = my_func()` (calls it)
2. **Modifying global variables inside functions**: Use `global` keyword if needed, but prefer passing parameters
3. **Mutable default arguments**: `def f(x=[])` — the list is shared across calls. Use `def f(x=None)` instead.
4. **Not returning a value**: Functions without `return` return `None`
5. **Shadowing built-in functions**: Don't name variables `list`, `str`, `print`

## Best Practices

- Functions should do one thing well (Single Responsibility Principle)
- Use descriptive names that indicate what the function does
- Write docstrings for all public functions
- Keep functions short (typically < 20-30 lines)
- Use type hints for better readability (Python 3.5+)
- Prefer returning values over printing inside functions

## Summary

- Functions are reusable code blocks defined with `def`
- Parameters receive inputs; `return` sends outputs
- Python supports positional, keyword, default, and variable-length arguments
- Variables inside functions are local; variables outside are global
- Lambda functions are anonymous, single-expression functions
- Docstrings document function purpose and usage

## Key Terms

- **Function**: Named reusable block of code
- **Parameter**: Variable in the function definition
- **Argument**: Value passed when calling a function
- **Return value**: Output sent back to the caller
- **Scope**: Region where a variable is accessible
- **Lambda**: Anonymous inline function
- **Docstring**: Documentation string for functions
- **DRY**: Don't Repeat Yourself principle

## Exercises

### Level 1: Basic

1. What is the difference between a parameter and an argument?
2. What does a function return if it has no `return` statement?
3. What is the purpose of a docstring?

### Level 2: Implementation

4. Write a function `is_palindrome(s)` that checks if a string is a palindrome (reads the same forward and backward).
5. Write a function `mean(numbers)` that calculates the mean of a list of numbers without using `statistics.mean()`.

### Level 3: Critical Thinking

6. Why are mutable default arguments (like `def f(x=[])`) dangerous? What is the recommended alternative?
7. Compare and contrast functions in Python with functions in mathematics. How are they similar? How are they different?

## Coding Challenge

Write a module `sequence_tools.py` with these functions:
1. `gc_content(sequence)` — calculates GC percentage
2. `reverse_complement(sequence)` — returns reverse complement
3. `has_motif(sequence, motif)` — checks if a motif exists
4. `filter_sequences(sequences, min_gc=40, max_gc=60)` — filters a list of sequences by GC content range

Include docstrings for each function and a `if __name__ == "__main__":` block that demonstrates usage.
