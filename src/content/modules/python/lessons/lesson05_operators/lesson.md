---
Module: 2
Lesson Number: 5
Lesson Title: Operators
Estimated Duration: 45 minutes
Prerequisites: L4 — Data Types
Learning Objectives:
  - Use arithmetic operators for numeric computation
  - Use comparison operators to compare values
  - Use logical operators to combine boolean expressions
  - Use assignment operators to update variables
  - Understand operator precedence
Keywords: arithmetic, comparison, logical, assignment, operator precedence
Difficulty: Beginner
Programming Concepts: Operators, expressions, operator precedence
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Operators

## Motivation

Operators are the tools that let you compute, compare, and combine values. Every program — from a simple calculator to a machine learning model — relies on operators. In biotechnology, you use operators to calculate drug concentrations, compare gene expression levels, and determine significance. In SaaS, you use them to compute revenue, compare user engagement metrics, and evaluate business rules.

## Big Picture

In the previous lesson, you learned about the data types that values can have. Now you will learn how to perform operations on those values. Operators build on your understanding of types because different types support different operators. This prepares you for the next lessons on functions and control flow, where operators are used in conditions and computations.

## Theory

### Arithmetic Operators

Arithmetic operators perform mathematical operations on numeric types (int, float).

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `5 - 3` | `2` |
| `*` | Multiplication | `5 * 3` | `15` |
| `/` | Float division | `5 / 3` | `1.666...` |
| `//` | Integer division | `5 // 3` | `1` |
| `%` | Modulus (remainder) | `5 % 3` | `2` |
| `**` | Exponentiation | `5 ** 3` | `125` |

### Comparison Operators

Comparison operators compare two values and return a boolean.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 3` | `False` |
| `!=` | Not equal to | `5 != 3` | `True` |
| `<` | Less than | `5 < 3` | `False` |
| `>` | Greater than | `5 > 3` | `True` |
| `<=` | Less than or equal | `5 <= 5` | `True` |
| `>=` | Greater than or equal | `5 >= 3` | `True` |

### Logical Operators

Logical operators combine boolean expressions.

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `and` | True if both are True | `True and False` | `False` |
| `or` | True if at least one is True | `True or False` | `True` |
| `not` | Inverts the boolean | `not True` | `False` |

### Assignment Operators

Assignment operators update variables with a computation.

| Operator | Example | Equivalent to |
|----------|---------|---------------|
| `=` | `x = 5` | `x = 5` |
| `+=` | `x += 3` | `x = x + 3` |
| `-=` | `x -= 3` | `x = x - 3` |
| `*=` | `x *= 3` | `x = x * 3` |
| `/=` | `x /= 3` | `x = x / 3` |
| `//=` | `x //= 3` | `x = x // 3` |
| `%=` | `x %= 3` | `x = x % 3` |
| `**=` | `x **= 3` | `x = x ** 3` |

### Operator Precedence

Python follows standard mathematical precedence (PEMDAS):

1. Parentheses `()`
2. Exponentiation `**`
3. Unary `+`, `-`
4. Multiplication `*`, Division `/`, Integer division `//`, Modulus `%`
5. Addition `+`, Subtraction `-`
6. Comparison `<`, `<=`, `>`, `>=`, `==`, `!=`
7. `not`
8. `and`
9. `or`

## Visual Explanation

```
Operator Precedence (highest to lowest)

  ()   →   **   →   *,/,//,%   →   +,-   →   ==,!=,<,>   →   not   →   and   →   or

Example:   5 + 3 * 2 ** 2
           = 5 + 3 * 4       (exponentiation first)
           = 5 + 12           (multiplication next)
           = 17               (addition last)
```

## Python Implementation

```python
# Arithmetic operators
a, b = 10, 3
print(f"a = {a}, b = {b}")
print(f"Addition: {a} + {b} = {a + b}")
print(f"Subtraction: {a} - {b} = {a - b}")
print(f"Multiplication: {a} * {b} = {a * b}")
print(f"Float division: {a} / {b} = {a / b}")
print(f"Integer division: {a} // {b} = {a // b}")
print(f"Modulus: {a} % {b} = {a % b}")
print(f"Exponentiation: {a} ** {b} = {a ** b}")
```

```python
# Comparison operators
x, y = 5, 8
print(f"{x} == {y}: {x == y}")
print(f"{x} != {y}: {x != y}")
print(f"{x} < {y}: {x < y}")
print(f"{x} > {y}: {x > y}")
print(f"{x} <= {y}: {x <= y}")
print(f"{x} >= {y}: {x >= y}")
```

```python
# Logical operators
has_glucose = True
has_insulin = False

print(has_glucose and has_insulin)  # False
print(has_glucose or has_insulin)   # True
print(not has_glucose)              # False
```

```python
# Assignment operators
count = 0
count += 5   # count = 5
count *= 2   # count = 10
count -= 3   # count = 7
count //= 2  # count = 3
print(f"Final count: {count}")
```

## Biotechnology Example

**Scenario**: Analyzing drug dose-response data.

```python
# Drug dose-response calculation
dose_mg = 50
weight_kg = 70
half_life_hours = 6
time_hours = 24

# Calculate concentration after n half-lives
concentration = dose_mg / weight_kg * (0.5) ** (time_hours / half_life_hours)

# Check if concentration is in therapeutic range
therapeutic_min = 0.1
therapeutic_max = 1.0
in_range = therapeutic_min <= concentration <= therapeutic_max

print(f"Dose: {dose_mg} mg")
print(f"Patient weight: {weight_kg} kg")
print(f"Concentration after {time_hours}h: {concentration:.3f} mg/kg")
print(f"In therapeutic range: {in_range}")
```

## SaaS Example

**Scenario**: Evaluating customer churn risk.

```python
# Customer churn risk assessment
days_since_login = 45
support_tickets = 3
subscription_tier = "basic"  # basic, premium, enterprise
monthly_spend = 29.99

# Churn risk factors
low_engagement = days_since_login > 30
multiple_issues = support_tickets >= 3
is_basic_tier = subscription_tier == "basic"
high_churn_risk = (low_engagement or multiple_issues) and is_basic_tier

print(f"Low engagement: {low_engagement}")
print(f"Multiple issues: {multiple_issues}")
print(f"Basic tier: {is_basic_tier}")
print(f"High churn risk: {high_churn_risk}")
```

## Common Mistakes

1. **Using `=` instead of `==` for comparison**: `if x = 5:` is assignment, not comparison
2. **Integer division when float needed**: `5/2 = 2.5` (Python 3), but `5//2 = 2`
3. **Chaining comparisons incorrectly**: Python allows `a < b < c`, which is `a < b and b < c`
4. **Operator precedence confusion**: `3 + 4 * 2 = 11`, not `14`
5. **Modulus with negative numbers**: `-5 % 3 = 1` (not -2)

## Best Practices

- Use parentheses to make precedence explicit
- Use `+=` and similar operators for cleaner code
- Use `==` with caution for float comparison; use `abs(a-b) < epsilon`
- Leverage Python's chained comparisons: `0 <= x <= 100`
- Use `not` sparingly — rewrite conditions for readability

## Summary

- Arithmetic: `+`, `-`, `*`, `/`, `//`, `%`, `**`
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=` (return bool)
- Logical: `and`, `or`, `not`
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`
- Precedence: `()` → `**` → `*,/` → `+,-` → comparisons → `not` → `and` → `or`
- Use parentheses for clarity

## Key Terms

- **Operator**: Symbol that performs an operation on operands
- **Operand**: Value on which an operator acts
- **Expression**: Combination of operators and operands that evaluates to a value
- **Precedence**: Rules determining the order of evaluation
- **Modulus**: Remainder after division
- **Short-circuit evaluation**: `and`/`or` stop evaluating when the result is determined

## Exercises

### Level 1: Basic

1. What is the result of `15 // 4` and `15 % 4`?
2. What is the value of `3 + 4 * 2 ** 3`?
3. What does `not (True and False)` evaluate to?

### Level 2: Implementation

4. Write code that checks if a number is even (use `%`) and prints "even" or "odd".
5. Write a BMI calculator: weight (kg) / height² (m). Categorize as underweight (< 18.5), normal (18.5-24.9), overweight (25-29.9), obese (≥ 30).

### Level 3: Critical Thinking

6. Why does `0.1 + 0.2 == 0.3` return False? How would you compare floating-point results safely?
7. Short-circuit evaluation: What does `False and print("hello")` output? Why?

## Coding Challenge

Write a program that:
1. Asks for the number of DNA samples, the cost per sample, and the available budget
2. Calculates the total cost and whether it's within budget
3. Applies a 15% discount if the number of samples > 100
4. Calculates the remaining budget after the purchase
5. Uses at least one operator from each category (arithmetic, comparison, logical, assignment)
6. Prints a formatted summary of all calculations
