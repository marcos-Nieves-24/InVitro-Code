---
Module: 2
Lesson Number: 4
Lesson Title: Data Types
Estimated Duration: 60 minutes
Prerequisites: L3 — Variables
Learning Objectives:
  - Identify the four basic data types: int, float, str, bool
  - Use type() to inspect variable types
  - Convert between data types using int(), float(), str(), bool()
  - Explain the difference between mutable and immutable types
  - Handle type errors appropriately
Keywords: int, float, str, bool, type conversion, type casting, type()
Difficulty: Beginner
Programming Concepts: Primitive types, type conversion, type checking
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Data Types

## Motivation

Every piece of data in Python has a type that determines what operations are possible. Adding two numbers is arithmetic; adding two strings is concatenation. Understanding types is crucial because type errors are among the most common bugs in Python programs. In biotechnology, you need to distinguish between integer counts (number of cells), float measurements (gene expression ratios), strings (DNA sequences), and booleans (mutation present/absent). In SaaS, you work with integer user counts, float revenue, string customer names, and boolean subscription status.

## Big Picture

In the previous lesson, you learned to store values in variables. Now you will understand the different kinds of values variables can hold. This prepares you for the next lesson on operators, where each data type supports different operations.

## Theory

### The Four Basic Data Types

Python has four primitive data types:

1. **int** (integer): Whole numbers without a decimal point
   - Examples: `42`, `-7`, `0`, `1_000_000`
   - Arbitrary precision (no overflow)

2. **float** (floating-point): Numbers with a decimal point
   - Examples: `3.14`, `-0.001`, `1.5e10`
   - Follows IEEE 754 double-precision standard
   - Limited precision (~15-17 decimal digits)

3. **str** (string): Sequence of characters enclosed in quotes
   - Examples: `"Hello"`, `'DNA'`, `"ATGCTGA"`, `""` (empty string)
   - Can use single quotes, double quotes, or triple quotes for multiline

4. **bool** (boolean): Logical values
   - Only two values: `True` and `False`
   - Internally, `True` = 1 and `False` = 0

### Type Checking with type()

```python
x = 42
print(type(x))       # <class 'int'>

y = 3.14
print(type(y))       # <class 'float'>

z = "Hello"
print(type(z))       # <class 'str'>

w = True
print(type(w))       # <class 'bool'>
```

### Type Conversion (Casting)

You can explicitly convert between types:

```python
# int to float
x = float(42)        # 42.0

# float to int (truncation, not rounding)
y = int(3.99)        # 3

# number to string
s = str(42)          # "42"

# string to number
n = int("42")        # 42
f = float("3.14")    # 3.14

# anything to bool
bool(0)              # False
bool(1)              # True
bool("")             # False (empty string)
bool("hello")        # True (non-empty string)
```

### Mutable vs Immutable Types

- **Immutable**: int, float, bool, str — cannot be changed after creation
- **Mutable**: list, dict, set — can be modified (covered in later lessons)

```python
name = "BRCA1"
name[0] = "A"  # TypeError: 'str' object does not support item assignment
```

### Special Values

- **None**: Represents the absence of a value
- **inf**: Infinity (float)
- **nan**: Not a Number (float)

```python
result = None
infinity = float('inf')
not_a_number = float('nan')
```

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│              Python Primitive Data Types             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  int           float         str           bool     │
│  ┌──────┐     ┌──────┐     ┌──────────┐   ┌────┐   │
│  │ 42   │     │ 3.14 │     │ "Hello"  │   │True│   │
│  │ -7   │     │-0.001│     │ "ATCGT"  │   │False│   │
│  │ 0    │     │ 1e10 │     │ ""       │   └────┘   │
│  └──────┘     └──────┘     └──────────┘            │
│                                                     │
│  Whole          Decimal      Character              │
│  numbers        numbers      sequences              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Python Implementation

```python
# Demonstrating all four types
gene_count = 25000                      # int
mutation_rate = 0.0015                  # float
gene_name = "TP53"                      # str
is_cancer_associated = True             # bool

print(f"Gene count: {gene_count} ({type(gene_count)})\"")
print(f"Mutation rate: {mutation_rate} ({type(mutation_rate)})\"")
print(f"Gene name: {gene_name} ({type(gene_name)})\"")
print(f"Cancer associated: {is_cancer_associated} ({type(is_cancer_associated)})\"")
```

```python
# Type conversion examples
count_str = "1500"
count_int = int(count_str)
count_float = float(count_int)

print(f"String: {count_str} (type: {type(count_str)})")
print(f"Integer: {count_int} (type: {type(count_int)})")
print(f"Float: {count_float} (type: {type(count_float)})")

# Float to int truncates
print(int(3.999))   # 3
print(int(3.001))   # 3
```

```python
# Boolean conversion
print(bool(1))      # True
print(bool(0))      # False
print(bool(-1))     # True (any non-zero is True)
print(bool(""))     # False
print(bool("abc"))  # True
print(bool([]))     # False (empty list)
print(bool(None))   # False
```

```python
# Common type errors
result = "The answer is " + 42     # TypeError: can only concatenate str
result = "The answer is " + str(42)  # Correct
```

## Biotechnology Example

**Scenario**: Processing gene expression data from a microarray experiment.

```python
gene_name = "EGFR"
expression_ratio = 2.45      # float: fold change
p_value = 0.003              # float: significance
is_significant = p_value < 0.05  # bool
sample_count = 48            # int: number of samples

print(f"Gene: {gene_name}")
print(f"Expression ratio: {expression_ratio:.2f}")
print(f"p-value: {p_value}")
print(f"Significant: {is_significant}")
print(f"Sample size: {sample_count}")

# Type check before analysis
if isinstance(expression_ratio, float):
    print("Valid expression ratio type ✓")
```

## SaaS Example

**Scenario**: Processing customer subscription data.

```python
customer_name = "Acme Corp"
active_users = 342
monthly_revenue = 45900.75
is_premium = True
discount_rate = 0.15

annual_revenue = monthly_revenue * 12
discounted_revenue = annual_revenue * (1 - discount_rate)

print(f"Customer: {customer_name} (premium: {is_premium})")
print(f"Active users: {active_users}")
print(f"Annual revenue: ${annual_revenue:,.2f}")
print(f"After discount: ${discounted_revenue:,.2f}")
```

## Common Mistakes

1. **String concatenation with non-strings**: `"count: " + 5` raises TypeError
2. **Losing precision with float**: `0.1 + 0.2 != 0.3` exactly (floating-point arithmetic)
3. **Integer division in Python 3**: `5 / 2 = 2.5` (float), but `5 // 2 = 2` (integer)
4. **Confusing `=` and `==`**: Assignment vs equality comparison
5. **Forgetting that `input()` returns a string**: Always convert numeric input

## Best Practices

- Use `isinstance()` for type checking rather than `type() ==`
- Convert types explicitly rather than relying on implicit conversion
- Use `//` for integer division, `/` for float division
- Use underscores in large numbers: `1_000_000` instead of `1000000`
- Be aware of floating-point precision limitations

## Summary

- Python has four primitive types: int, float, str, bool
- Use `type()` to check a value's type
- Type conversion uses functions named after the type: `int()`, `float()`, `str()`, `bool()`
- Strings are immutable — they cannot be modified in place
- `None` represents the absence of a value
- Type errors are common and usually involve mixing strings with numbers

## Key Terms

- **int**: Integer type for whole numbers
- **float**: Floating-point type for decimal numbers
- **str**: String type for text
- **bool**: Boolean type for True/False values
- **Type conversion**: Changing a value from one type to another
- **Immutable**: Cannot be changed after creation
- **None**: Python's null value
- **TypeError**: Exception raised when operating on incompatible types

## Exercises

### Level 1: Basic

1. What type does `type(3.0)` return?
2. What is the result of `int(7.9)` and why?
3. What values convert to `False` when passed to `bool()`?

### Level 2: Implementation

4. Write a function that takes a string like "3.14" and returns both the float and the integer part.
5. Ask the user for two numbers, add them, and print the result. Handle the type conversion correctly.

### Level 3: Critical Thinking

6. Why does `0.1 + 0.2` not equal `0.3` in floating-point arithmetic? How would you compare floating-point numbers safely?
7. When would you explicitly use `bool()` instead of relying on truthy/falsy values?

## Coding Challenge

Write a program that:
1. Asks for the user's name (string), age (int), and salary (float)
2. Asks if they are a student (convert answer to bool: "yes"/"no")
3. Stores each value with the correct type
4. Prints a summary: "[Name] is [age] years old, earns $[salary], student: [True/False]"
5. Calculates and prints: "Salary after 10% raise: $[amount]"
6. Handles type conversion errors gracefully
