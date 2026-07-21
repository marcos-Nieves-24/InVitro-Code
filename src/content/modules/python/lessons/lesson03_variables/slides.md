# Variables — Slide Outline

## Slide 1: Title Slide
- Variables in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Variables Matter
- Store and label data
- Make programs flexible and reusable
- Foundation of all programming
- Essential for ML: features, labels, parameters

## Slide 3: What is a Variable?
- Named memory location storing a value
- Like a labeled box
- `temperature = 36.6`
- Can hold any type of data

## Slide 4: Variable Assignment
```python
x = 5
name = "Alice"
pi = 3.14159
```
- `=` is the assignment operator
- Right side is evaluated first
- Result stored in left-side variable

## Slide 5: Dynamic Typing
```python
x = 10     # int
x = 3.14   # float (same variable)
x = "text" # str
```
- Type is inferred from value
- Variables can change type
- Use `type()` to check

## Slide 6: Naming Rules
- Letters, digits, underscores
- Cannot start with digit
- Case-sensitive: `age` ≠ `Age`
- Keywords reserved: `if`, `for`, `class`
- PEP 8: `snake_case`

## Slide 7: Good vs Bad Names
| Good | Bad |
|------|-----|
| `gene_expression` | `ge` |
| `customer_count` | `cc` |
| `max_iterations` | `mi` |
| `patient_name` | `pn` |

## Slide 8: Constants
- Convention: UPPER_SNAKE_CASE
```python
PI = 3.14159
MAX_ITERATIONS = 1000
SPEED_OF_LIGHT = 3e8
```

## Slide 9: Multiple Assignment
```python
a, b, c = 1, 2, 3
x = y = z = 0  # same value
a, b = b, a    # swap
```

## Slide 10: Input and Output
```python
print("Hello")
input("Enter: ")  # returns str
```
- `input()` always returns a string
- Convert with `int()`, `float()`
- f-strings for formatting: `f"Value: {x}"`

## Slide 11: Biotech Example
```python
patient_id = "P-0042"
heart_rate = 72
systolic_bp = 120
diagnosis = "Hypertension"
print(f"Patient {patient_id}: BP {systolic_bp}")
```

## Slide 12: SaaS Example
```python
revenue = 125000
users = 15420
churn = 0.035
arpu = revenue / users
print(f"ARPU: ${arpu:.2f}")
```

## Slide 13: Common Mistakes
- Using undefined variables (NameError)
- Misspelling names
- Using keywords as names
- Forgetting to convert input()
- Case sensitivity confusion

## Slide 14: Best Practices
- Descriptive, meaningful names
- snake_case convention
- Initialize before use
- One purpose per variable
- Constants in UPPER_SNAKE_CASE

## Slide 15: Summary
- Variables store values in memory
- Python is dynamically typed
- Use `=` for assignment
- `input()` for user input
- `print()` for output
- Follow naming conventions
