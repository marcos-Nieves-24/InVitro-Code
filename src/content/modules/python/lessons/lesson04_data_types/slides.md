# Data Types — Slide Outline

## Slide 1: Title Slide
- Data Types in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Data Types Matter
- Types determine what operations are possible
- Type errors are common bugs
- Critical for ML: feature types, label types
- Biotech: int (counts), float (ratios), str (sequences), bool (status)

## Slide 3: The Four Primitive Types
- **int**: Whole numbers (42, -7, 0)
- **float**: Decimal numbers (3.14, -0.001, 1e10)
- **str**: Text ("DNA", 'Hello')
- **bool**: True / False

## Slide 4: int — Integers
```python
count = 25000
value = -100
large = 10_000_000  # Underscores for readability
```
- Unlimited precision
- Whole numbers only

## Slide 5: float — Floating-Point
```python
pi = 3.14159
rate = 0.0015
scientific = 1.5e10
```
- IEEE 754 double precision
- Precision: ~15-17 digits
- Beware: `0.1 + 0.2 ≠ 0.3`

## Slide 6: str — Strings
```python
gene = "BRCA1"
sequence = "ATCGTAGC"
multiline = """Line 1
Line 2"""
```
- Immutable sequence of characters
- Single, double, or triple quotes

## Slide 7: bool — Boolean
```python
is_active = True
is_complete = False
```
- Only two values: True, False
- Internally: True=1, False=0
- Useful for conditions and flags

## Slide 8: Type Checking
```python
type(42)    # <class 'int'>
type(3.14)  # <class 'float'>
type("hi")  # <class 'str'>
type(True)  # <class 'bool'>
```
- `isinstance(x, int)` preferred over `type(x) == int`

## Slide 9: Type Conversion (Casting)
```python
int(3.99)    # 3 (truncates!)
float(42)    # 42.0
str(123)     # "123"
int("42")    # 42
float("3.14") # 3.14
bool(1)      # True
bool(0)      # False
```

## Slide 10: Truthy and Falsy
```python
bool(0)        # False
bool(0.0)      # False
bool("")       # False
bool(None)     # False
bool([])       # False
# Everything else is True!
```

## Slide 11: Immutability
- int, float, str, bool are **immutable**
- Cannot modify in place
- Operations create new values
```python
s = "hello"
s[0] = "H"  # TypeError!
```

## Slide 12: Common Mistakes
- `"count: " + 5` → TypeError
- `input()` returns string, need conversion
- `0.1 + 0.2 != 0.3` (precision issue)
- `int(3.99) == 3` (truncation, not rounding)

## Slide 13: Best Practices
- Convert types explicitly
- Use `isinstance()` for type checking
- Use `//` for integer division
- Underscores in large numbers
- Safe float comparison: `abs(a-b) < 1e-10`

## Slide 14: Summary
- 4 primitive types: int, float, str, bool
- `type()` to check, `int()` etc. to convert
- input() returns string — convert as needed
- int, float, str, bool are immutable
- Handle float precision carefully
