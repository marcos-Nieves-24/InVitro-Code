---
Module: 2
Lesson Number: 8
Lesson Title: Conditionals
Estimated Duration: 45 minutes
Prerequisites: L6 — Functions
Learning Objectives:
  - Write if/elif/else conditional statements
  - Evaluate boolean expressions with comparison and logical operators
  - Use truthy and falsy values in conditions
  - Write nested conditional statements
  - Use conditional expressions (ternary operator)
Keywords: if, elif, else, boolean, truthy, falsy, conditional, ternary
Difficulty: Beginner
Programming Concepts: Control flow, boolean logic, conditional expressions
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Conditionals

## Motivation

Conditionals allow programs to make decisions. Without them, code would execute the same way every time. With conditionals, your program can react differently based on data values, user input, or computed results. In biotechnology, conditionals determine diagnoses based on lab results, classify genetic mutations, and trigger alerts for abnormal values. In SaaS, they control access levels, calculate discounts, and segment customers.

## Big Picture

In the previous lesson, you learned loops (repetition). Now you learn conditionals (decision-making). These two control structures — loops and conditionals — form the backbone of all non-trivial programs. Together with functions and operators, you now have everything needed to write sophisticated data processing logic.

## Theory

### The if Statement

The simplest conditional executes code only when a condition is True:

```python
if condition:
    pass  # code to execute if condition is True
```

### if/else

```python
if condition:
    pass  # code if True
else:
    pass  # code if False
```

### if/elif/else

Chain multiple conditions:

```python
if condition1:
    pass  # condition1 is True
elif condition2:
    pass  # condition1 is False, condition2 is True
elif condition3:
    pass  # condition1 and condition2 are False, condition3 is True
else:
    pass  # all conditions are False
```

### Truthy and Falsy

In Python, values can be "truthy" or "falsy" when used in a condition:

**Falsy values** (evaluate to False):
- `None`
- `False`
- `0`, `0.0`, `0j`
- Empty sequences: `""`, `[]`, `()`, `{}`, `set()`
- Custom objects that return `False` from `__bool__`

**Everything else is truthy.**

### Nested Conditionals

Conditionals inside conditionals:

```python
if condition1:
    if condition2:
        pass  # both True
    else:
        pass  # condition1 True, condition2 False
else:
    pass  # condition1 False
```

### Ternary (Conditional Expression)

One-line conditional:

```python
value = true_value if condition else false_value
```

### Match Statement (Python 3.10+)

Structural pattern matching (similar to switch/case):

```python
match value:
    case 1:
        pass  # handle case 1
    case 2:
        pass  # handle case 2
    case _:
        pass  # default
```

## Visual Explanation

```
if/elif/else Flow:

         ┌───────────┐
         │ Start     │
         └─────┬─────┘
               │
         ┌─────▼──────┐  True  ┌──────────────────┐
         │ condition1 ├───────→│ code block 1     │
         └─────┬──────┘       └────────┬─────────┘
               │ False                 │
         ┌─────▼──────┐  True  ┌──────────────────┐
         │ condition2 ├───────→│ code block 2     │
         └─────┬──────┘       └────────┬─────────┘
               │ False                 │
         ┌─────▼──────┐               │
         │ else       │               │
         │ (default)  │               │
         └─────┬──────┘               │
               │                      │
               └──────┬───────────────┘
                      │
                ┌─────▼─────┐
                │   End     │
                └───────────┘
```

## Python Implementation

```python
# Basic if
temperature = 38.5
if temperature > 37.5:
    print("Patient has a fever")

# if/else
if temperature > 37.5:
    print("Has fever")
else:
    print("Normal temperature")
```

```python
# if/elif/else
bmi = 26.3
if bmi < 18.5:
    category = "Underweight"
elif bmi < 25:
    category = "Normal"
elif bmi < 30:
    category = "Overweight"
else:
    category = "Obese"
print(f"BMI: {bmi:.1f} - {category}")
```

```python
# Truthy/falsy
name = ""
if name:
    print(f"Hello, {name}")
else:
    print("Name is empty")

# None check
result = None
if result is None:
    print("No result available")
```

```python
# Ternary (conditional expression)
age = 20
status = "Adult" if age >= 18 else "Minor"
print(status)
```

```python
# Match statement (Python 3.10+)
def describe_mutation(mutation_type):
    match mutation_type:
        case "missense":
            return "Single amino acid change"
        case "nonsense":
            return "Premature stop codon"
        case "frameshift":
            return "Reading frame shift"
        case "silent":
            return "No amino acid change"
        case _:
            return "Unknown mutation type"

print(describe_mutation("missense"))
```

## Biotechnology Example

**Scenario**: Clinical decision support for patient diagnosis.

```python
def assess_patient(systolic_bp, diastolic_bp, heart_rate, glucose):
    """
    Assess patient status based on vital signs.
    
    Returns a tuple of (status, recommendations).
    """
    # Blood pressure classification
    if systolic_bp < 120 and diastolic_bp < 80:
        bp_status = "Normal"
    elif systolic_bp < 130 and diastolic_bp < 80:
        bp_status = "Elevated"
    elif systolic_bp < 140 or diastolic_bp < 90:
        bp_status = "Stage 1 Hypertension"
    else:
        bp_status = "Stage 2 Hypertension"
    
    # Heart rate assessment
    if heart_rate < 60:
        hr_status = "Bradycardia"
    elif heart_rate <= 100:
        hr_status = "Normal"
    else:
        hr_status = "Tachycardia"
    
    # Glucose assessment
    if glucose < 70:
        glucose_status = "Hypoglycemia"
    elif glucose <= 126:
        glucose_status = "Normal"
    else:
        glucose_status = "Hyperglycemia"
    
    # Overall alert
    is_emergency = (
        bp_status == "Stage 2 Hypertension"
        or hr_status in ("Bradycardia", "Tachycardia")
        or glucose_status in ("Hypoglycemia", "Hyperglycemia")
    )
    
    return bp_status, hr_status, glucose_status, is_emergency

# Test
result = assess_patient(145, 95, 110, 140)
bp, hr, glu, emergency = result
print(f"BP: {bp}")
print(f"HR: {hr}")
print(f"Glucose: {glu}")
print(f"Emergency: {emergency}")
```

## SaaS Example

**Scenario**: Customer tier assignment and discount calculation.

```python
def calculate_discount(customer_tier, annual_spend, years_active):
    """
    Calculate discount percentage based on customer profile.
    """
    # Determine discount from tier
    if customer_tier == "enterprise":
        base_discount = 0.20
    elif customer_tier == "professional":
        base_discount = 0.10
    elif customer_tier == "starter":
        base_discount = 0.05
    else:
        base_discount = 0.00
    
    # Loyalty bonus
    if years_active >= 3:
        loyalty_bonus = 0.05
    elif years_active >= 1:
        loyalty_bonus = 0.02
    else:
        loyalty_bonus = 0.00
    
    # Volume bonus
    if annual_spend > 50000:
        volume_bonus = 0.10
    elif annual_spend > 10000:
        volume_bonus = 0.05
    else:
        volume_bonus = 0.00
    
    total_discount = min(base_discount + loyalty_bonus + volume_bonus, 0.30)
    return total_discount

# Usage
discount = calculate_discount("professional", 25000, 4)
print(f"Discount: {discount:.0%}")
```

## Common Mistakes

1. **Using `=` instead of `==`**: `if x = 5:` assigns 5 to x and is always True
2. **Forgetting colon**: `if x > 5` without `:` raises SyntaxError
3. **Indentation errors**: Inconsistent indentation breaks conditionals
4. **Comparing None with `==`**: Use `is None` instead of `== None`
5. **Checking boolean with `== True`**: Redundant — just use `if condition:`
6. **Deep nesting**: More than 3 levels of nesting suggests refactoring

## Best Practices

- Use `elif` instead of nested `if` for mutually exclusive conditions
- Keep conditions simple — extract complex logic into boolean variables
- Use truthy/falsy checks naturally: `if items:` rather than `if len(items) > 0:`
- Avoid deep nesting (max 3 levels)
- Use guard clauses (early returns) to reduce nesting
- Use `in` for multiple comparisons: `if x in (1, 2, 3):`

## Summary

- `if` executes code when a condition is True
- `elif` checks additional conditions
- `else` handles the default case
- Values are truthy (True) or falsy (False, None, 0, empty sequences)
- Ternary: `x if condition else y`
- Match statement (3.10+) for pattern matching
- Avoid deep nesting; use guard clauses

## Key Terms

- **Conditional**: Statement that executes code based on a condition
- **Boolean expression**: Expression that evaluates to True or False
- **Truthy**: Value that evaluates to True in a boolean context
- **Falsy**: Value that evaluates to False in a boolean context
- **Ternary operator**: Conditional expression for inline if/else
- **Guard clause**: Early return to avoid nesting
- **Match statement**: Python 3.10+ structural pattern matching

## Exercises

### Level 1: Basic

1. What is the output of `if 0: print("yes") else: print("no")`?
2. What is the difference between `=` and `==`?
3. What values are considered falsy in Python?

### Level 2: Implementation

4. Write a function that takes a temperature in Celsius and returns "Cold" (< 15), "Mild" (15-25), "Hot" (> 25).
5. Write a function that takes a year and returns whether it is a leap year (divisible by 400, or divisible by 4 but not by 100).

### Level 3: Critical Thinking

6. Why is `if x == True:` considered bad style? What is the Pythonic alternative?
7. Compare and contrast if/elif/else chains with match statements. When would you use each?

## Coding Challenge

Write a **credit scoring** system that:
1. Takes income, credit history length (years), outstanding debt, and missed payments count
2. Calculates a credit score (0-100) using a weighted formula
3. Assigns a rating: Excellent (≥ 80), Good (60-79), Fair (40-59), Poor (< 40)
4. Applies modifiers: if debt > income → -20 points; if missed payments > 3 → -15 points; if credit history > 10 years → +10 points
5. Uses `match` for the rating assignment
6. Prints the final score, rating, and approval status (Excellent/Good → Approved, otherwise → Review Required)
