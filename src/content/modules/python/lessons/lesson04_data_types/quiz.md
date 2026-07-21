# Quiz: Data Types

## Multiple Choice (5 questions)

**Q1:** What is the type of `3.0` in Python?
- A) int
- B) float
- C) str
- D) bool

**Q2:** What does `int(7.9)` return?
- A) 8
- B) 7
- C) 7.9
- D) Error

**Q3:** Which of the following converts to False with `bool()`?
- A) 1
- B) "False"
- C) 0
- D) -1

**Q4:** What type does `input()` always return?
- A) int
- B) float
- C) str
- D) Depends on what the user types

**Q5:** What exception is raised when you try `"Hello" + 5`?
- A) ValueError
- B) NameError
- C) TypeError
- D) SyntaxError

## Short Answer (2 questions)

**Q6:** Explain the difference between `/` and `//` in Python.

**Q7:** What does immutable mean, and which of the primitive types are immutable?

## Coding Question

**Q8:** Write code that:
1. Creates a string `"42"`
2. Converts it to an integer, then to a float
3. Adds 10.5 to the float
4. Converts the result back to a string
5. Prints the final string

## Answer Key

**Q1:** B) float

**Q2:** B) 7

**Q3:** C) 0

**Q4:** C) str

**Q5:** C) TypeError

**Q6:** `/` performs float division and always returns a float (e.g., `5 / 2 = 2.5`). `//` performs integer division (floor division) and returns the integer quotient (e.g., `5 // 2 = 2`).

**Q7:** Immutable means the value cannot be changed after creation. All primitive types (int, float, str, bool) are immutable. Any operation that appears to modify them actually creates a new value.

**Q8:**
```python
s = "42"
n = int(s)
f = float(n)
result = f + 10.5
result_str = str(result)
print(result_str)
```
