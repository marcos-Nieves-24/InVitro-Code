# Operators — Slide Outline

## Slide 1: Title Slide
- Operators in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Operators Matter
- Perform computations and comparisons
- Every program uses operators
- ML: feature scaling, loss functions, metrics
- Biotech: dose calculations, statistical tests

## Slide 3: Arithmetic Operators
| Op | Name | Example |
|----|------|---------|
| `+` | Addition | `5 + 3 = 8` |
| `-` | Subtraction | `5 - 3 = 2` |
| `*` | Multiplication | `5 * 3 = 15` |
| `/` | Float division | `5 / 3 = 1.667` |
| `//` | Integer division | `5 // 3 = 1` |
| `%` | Modulus | `5 % 3 = 2` |
| `**` | Exponentiation | `5 ** 3 = 125` |

## Slide 4: Integer vs Float Division
- `/` always returns float: `9/4 = 2.25`
- `//` returns integer: `9//4 = 2`
- `%` returns remainder: `9%4 = 1`

## Slide 5: Comparison Operators
| Op | Meaning | Example |
|----|---------|---------|
| `==` | Equal | `5 == 3` → False |
| `!=` | Not equal | `5 != 3` → True |
| `<` | Less than | `5 < 3` → False |
| `>` | Greater than | `5 > 3` → True |
| `<=` | ≤ | `5 <= 5` → True |
| `>=` | ≥ | `5 >= 3` → True |

## Slide 6: Logical Operators
- `and`: True if both True
- `or`: True if at least one True
- `not`: Inverts boolean

Truth table: `True and False = False`, `True or False = True`, `not True = False`

## Slide 7: Short-Circuit Evaluation
- `and`: If first is False, don't evaluate second
- `or`: If first is True, don't evaluate second
- Useful for guards: `x != 0 and 10/x > 2`

## Slide 8: Assignment Operators
```python
x = 5
x += 3   # x = 8
x -= 2   # x = 6
x *= 4   # x = 24
x /= 3   # x = 8.0
x //= 2  # x = 4.0
x %= 3   # x = 1.0
x **= 2  # x = 1.0
```

## Slide 9: Operator Precedence
Highest to lowest:
1. `()` Parentheses
2. `**` Exponentiation
3. `*`, `/`, `//`, `%`
4. `+`, `-`
5. `<`, `<=`, `>`, `>=`, `==`, `!=`
6. `not`
7. `and`
8. `or`

**Tip**: Use parentheses for clarity!

## Slide 10: Precedence Example
```python
result = 5 + 3 * 2 ** 2
# Step 1: 2 ** 2 = 4
# Step 2: 3 * 4 = 12
# Step 3: 5 + 12 = 17
print(result)  # 17
```

## Slide 11: Chained Comparisons
```python
# Python allows this:
if 0 <= x <= 100:
    print("x is between 0 and 100")

# Equivalent to:
if x >= 0 and x <= 100:
    print("x is between 0 and 100")
```

## Slide 12: Biotech Example
- Drug concentration after n half-lives
- Check if in therapeutic range
- `concentration = dose/weight * 0.5^(time/half_life)`

## Slide 13: SaaS Example
- Churn risk assessment
- Combine factors with logical operators
- `high_risk = (low_engagement or multiple_issues) and basic_tier`

## Slide 14: Common Mistakes
- `=` vs `==` (assignment vs comparison)
- `/` vs `//` (forgetting the difference)
- Modulus with negatives
- Float equality checks

## Slide 15: Best Practices
- Use parentheses for clarity
- Use `+=` for cleaner code
- Float comparison: use epsilon
- Chained comparisons: readable
- Test with edge cases

## Slide 16: Summary
- 4 operator categories: arithmetic, comparison, logical, assignment
- Know precedence, use parentheses
- `/` is float, `//` is integer division
- `and`/`or` short-circuit
- Assignment operators update in place
