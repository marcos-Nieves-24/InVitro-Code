---
Module: 2
Lesson Number: 3
Lesson Title: Variables
Estimated Duration: 45 minutes
Prerequisites: L2 — Jupyter Notebook
Learning Objectives:
  - Assign values to variables using the assignment operator
  - Follow Python naming conventions for variables
  - Explain dynamic typing and type inference
  - Use basic input/output with print() and input()
  - Reassign variables and understand mutable state
Keywords: variable, assignment, naming convention, dynamic typing, I/O, print
Difficulty: Beginner
Programming Concepts: Variable assignment, naming, scope, type inference
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Variables

## Motivation

Variables are the fundamental building blocks of any program. They allow you to store, label, and manipulate data. Without variables, you would have to hard-code every value, making programs inflexible and unreadable. In biotechnology, variables store DNA sequences, gene expression levels, patient ages, and drug concentrations. In SaaS, variables store user counts, revenue figures, churn rates, and customer names. Mastering variables is your first step toward writing meaningful Python programs.

## Big Picture

In the previous lesson, you learned to execute Python code in Jupyter Notebook. Now you will learn how to store and manage data using variables. This directly prepares you for the next lesson on data types, where you will learn about the different kinds of data variables can hold.

## Theory

### What is a Variable?

A **variable** is a named location in memory that stores a value. Think of it as a labeled box where you can put data. The label is the variable name, and the contents are the value.

### Variable Assignment

In Python, the `=` operator assigns a value to a variable:

```python
x = 5          # Assign integer 5 to variable x
name = "Alice" # Assign string "Alice" to variable name
pi = 3.14159   # Assign float 3.14159 to variable pi
```

### Dynamic Typing

Python is **dynamically typed** — variables can change type during execution. The type is inferred from the value:

```python
value = 10     # value is an int
value = 3.14   # now value is a float
value = "text" # now value is a string
```

### Naming Conventions

Python variable names must follow these rules:
- Can contain letters (a-z, A-Z), digits (0-9), and underscores (_)
- Cannot start with a digit
- Are case-sensitive (`age` ≠ `Age`)
- Cannot be Python keywords (`if`, `for`, `while`, `class`, etc.)

**Recommended style (PEP 8):** Use `snake_case` for variable names:
```python
gene_expression = 0.85
max_iterations = 1000
customer_churn_rate = 0.12
```

### Constants

By convention, constants are written in `UPPER_SNAKE_CASE`:
```python
MAX_SPEED = 120
PI = 3.14159
```

### Multiple Assignment

You can assign multiple variables in one line:
```python
a, b, c = 1, 2, 3
x = y = z = 0  # All three variables get the value 0
```

### Basic Input/Output

```python
# Output
print("Hello, World!")
print("Value:", 42)

# Input — always returns a string
name = input("Enter your name: ")
```

## Visual Explanation

```
┌─────────────────────────────────────────────────────────┐
│                    Variable in Memory                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Variable Name:  temperature                           │
│   Memory Address: 0x7f8a2b3c4d5e                        │
│   Value:          36.6                                  │
│   Type:           float                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

Assignment Flow:
┌─────────┐     ┌──────────────┐     ┌─────────────────┐
│ Value   │ ──→ │ = Operator   │ ──→ │ Variable in     │
│ 36.6    │     │ temperature  │     │ Memory          │
└─────────┘     └──────────────┘     └─────────────────┘
```

## Python Implementation

```python
# Variable assignment
dna_sequence = "ATCGATCGATCG"
gene_count = 25000
mutation_rate = 0.001

print(dna_sequence)
print(gene_count)
print(mutation_rate)
```

```python
# Dynamic typing demonstration
data = 42
print(type(data))  # <class 'int'>

data = 3.14
print(type(data))  # <class 'float'>

data = "DNA"
print(type(data))  # <class 'str'>
```

```python
# Input and output
name = input("Enter patient name: ")
age = int(input("Enter age: "))  # Convert string to int
temperature = float(input("Enter body temperature: "))

print(f"Patient: {name}")
print(f"Age: {age}")
print(f"Temperature: {temperature}°C")
```

```python
# Swapping variables
a = 5
b = 10
a, b = b, a  # Swap — very Pythonic!
print(a, b)   # 10 5
```

## Biotechnology Example

**Scenario**: Tracking patient vital signs in a clinical trial.

```python
patient_id = "P-0042"
age = 45
heart_rate = 72
systolic_bp = 120
diastolic_bp = 80
diagnosis = "Hypertension"

print(f"Patient {patient_id}: Age {age}, HR {heart_rate}, BP {systolic_bp}/{diastolic_bp}")
print(f"Diagnosis: {diagnosis}")
```

## SaaS Example

**Scenario**: Tracking SaaS business metrics.

```python
company_name = "DataCloud Inc."
monthly_revenue = 125000
active_users = 15420
churn_rate = 0.035  # 3.5%
average_revenue_per_user = monthly_revenue / active_users

print(f"Company: {company_name}")
print(f"Monthly Revenue: ${monthly_revenue:,.2f}")
print(f"Active Users: {active_users:,}")
print(f"Churn Rate: {churn_rate:.1%}")
print(f"ARPU: ${average_revenue_per_user:.2f}")
```

## Common Mistakes

1. **Using undefined variables**: `print(x)` before `x = 5` raises `NameError`
2. **Misspelling variable names**: `temperature` vs `temperture`
3. **Using reserved keywords**: `if = 10` raises `SyntaxError`
4. **Forgetting to convert input**: `input()` returns a string; use `int()` or `float()` for numbers
5. **Case sensitivity confusion**: `data` and `Data` are different variables

## Best Practices

- Use descriptive, meaningful variable names
- Follow `snake_case` convention
- Avoid single-letter names except for counters (i, j, k)
- Initialize variables before use
- Use constants for fixed values (UPPER_SNAKE_CASE)
- One variable per logical purpose

## Summary

- Variables store values in named memory locations
- Python is dynamically typed — types are inferred
- Use `=` for assignment and `print()` for output
- Variable names must follow rules (letters, digits, underscores)
- PEP 8 recommends `snake_case` naming
- `input()` reads user input as a string

## Key Terms

- **Variable**: Named storage location for a value
- **Assignment**: Using `=` to give a value to a variable
- **Dynamic typing**: Variables can change type at runtime
- **PEP 8**: Python style guide
- **snake_case**: Naming convention using underscores
- **Type inference**: Python deduces the type from the value
- **NameError**: Exception raised when using an undefined variable

## Exercises

### Level 1: Basic

1. Which of the following are valid Python variable names? `2nd_place`, `my_var`, `class`, `_count`, `user-name`
2. What is the type of `x` after `x = "3.14"`?
3. What does `print()` do?

### Level 2: Implementation

4. Write a program that asks for the user's height in meters and weight in kilograms, then calculates and prints BMI (weight / height²).
5. Create three variables with different types and use `type()` to verify each.

### Level 3: Critical Thinking

6. Why is dynamic typing both a strength and a weakness of Python? Provide an example of a bug that dynamic typing could cause.
7. In large codebases, why is using descriptive variable names more important than writing short code?

## Coding Challenge

Write a program that:
1. Asks for a gene name, expression level, and p-value
2. Stores these values in variables
3. Prints a formatted summary: "Gene: [name], Expression: [level], p-value: [p]"
4. Determines if the result is significant (p-value < 0.05) and stores the boolean result
5. Prints "Significant: True/False"
