# Quiz: Functions

## Multiple Choice (5 questions)

**Q1:** What keyword is used to define a function in Python?
- A) `function`
- B) `def`
- C) `define`
- D) `func`

**Q2:** What does a function return if no `return` statement is present?
- A) 0
- B) False
- C) None
- D) Error

**Q3:** Which type of argument allows you to specify which parameter receives the value?
- A) Positional argument
- B) Keyword argument
- C) Default argument
- D) Variable argument

**Q4:** What is a lambda function?
- A) A function that takes no arguments
- B) A function defined with `def`
- C) An anonymous single-expression function
- D) A function that returns None

**Q5:** Where is a variable created inside a function accessible?
- A) Everywhere in the program
- B) Only inside the function
- C) Only in the main program
- D) Only in other functions

## Short Answer (2 questions)

**Q6:** Explain the difference between `return` and `print()` inside a function.

**Q7:** What is the problem with `def append_to(item, target=[])` and how do you fix it?

## Coding Question

**Q8:** Write a function `is_even(n)` that returns `True` if `n` is even and `False` otherwise. Then write a lambda that does the same thing.

## Answer Key

**Q1:** B) `def`

**Q2:** C) None

**Q3:** B) Keyword argument

**Q4:** C) An anonymous single-expression function

**Q5:** B) Only inside the function

**Q6:** `return` sends a value back to the caller and exits the function. `print()` displays output to the console but does not return a value to the caller. A function can `print` without `return`ing (returns None), or `return` without `print`ing.

**Q7:** The default list `[]` is created once when the function is defined, not each time it's called. All calls share the same list. Fix: use `def append_to(item, target=None)` and create a new list inside: `if target is None: target = []`.

**Q8:**
```python
def is_even(n):
    return n % 2 == 0

is_even_lambda = lambda n: n % 2 == 0

print(is_even(4))     # True
print(is_even_lambda(5))  # False
```
