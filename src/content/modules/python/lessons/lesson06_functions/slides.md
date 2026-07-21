# Functions — Slide Outline

## Slide 1: Title Slide
- Functions in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Functions?
- Reusable code blocks
- DRY: Don't Repeat Yourself
- Modular, testable programs
- Encapsulate logic

## Slide 3: Function Anatomy
```python
def function_name(param1, param2):
    """Docstring."""
    result = param1 + param2
    return result
```
- `def` keyword
- Parameters
- Body (indented)
- `return` statement

## Slide 4: Calling Functions
- `result = add(3, 5)` — pass arguments
- Arguments → parameters (by position or keyword)
- Function executes → returns value

## Slide 5: Parameter Types
- **Positional**: `add(3, 5)` → x=3, y=5
- **Keyword**: `add(y=5, x=3)` — order doesn't matter
- **Default**: `def greet(name, greeting="Hello")`
- **Variable**: `def sum_all(*args)`

## Slide 6: Return Values
- Single value: `return x`
- Multiple values: `return x, y` (tuple)
- No return: `return None`
- Can return any type

## Slide 7: Scope
- **Local**: Variables inside functions
- **Global**: Variables outside functions
- Local variables cannot be accessed globally
- Use `global` keyword to modify globals (rarely needed)

## Slide 8: Scope Example
```python
x = 10  # global
def func():
    y = 5  # local
    print(x)  # OK (read global)
    print(y)  # OK (read local)
func()
print(x)  # OK
print(y)  # NameError!
```

## Slide 9: Lambda Functions
- Anonymous, single-expression functions
```python
square = lambda x: x ** 2
print(square(5))  # 25

# Used with map/filter/sorted
evens = filter(lambda x: x%2==0, [1,2,3,4])
```

## Slide 10: Docstrings (PEP 257)
```python
def calculate_bmi(weight, height):
    """Calculate Body Mass Index.
    
    Parameters
    ----------
    weight : float
    height : float
    
    Returns
    -------
    float
    """
    return weight / height ** 2
```
- Triple-quoted string after def line
- Explain purpose, params, returns

## Slide 11: Biotech Example
- `gc_content(sequence)` — calculate GC%
- `reverse_complement(sequence)` — DNA complement
- `translate(sequence)` — DNA to protein
- Modular, reusable analysis tools

## Slide 12: SaaS Example
- `calculate_arpu(revenue, users)` — ARPU
- `churn_rate(lost, start)` — churn %
- `customer_health_score(...)` — composite score
- Functions make metrics reusable

## Slide 13: Common Mistakes
- Forgetting `()` when calling
- Mutable default arguments (`def f(x=[])`)
- Not returning (returns None)
- Modifying globals accidentally
- Shadowing built-in names

## Slide 14: Best Practices
- One function, one purpose
- Descriptive names (verb + noun)
- Write docstrings
- Keep functions short (< 30 lines)
- Return values, don't print
- Use type hints

## Slide 15: Summary
- `def` defines functions
- Parameters → Arguments
- `return` sends output
- Scope: local vs global
- Lambda: anonymous functions
- Docstrings document purpose
