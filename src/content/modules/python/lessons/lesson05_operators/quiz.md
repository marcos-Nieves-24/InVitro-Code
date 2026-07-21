# Quiz: Operators

## Multiple Choice (5 questions)

**Q1:** What is the result of `15 // 4`?
- A) 3.75
- B) 3
- C) 4
- D) 0

**Q2:** What does `15 % 4` return?
- A) 3
- B) 4
- C) 0
- D) 1

**Q3:** Which operator checks if two values are equal?
- A) `=`
- B) `!=`
- C) `==`
- D) `:=`

**Q4:** What is the result of `not (True and False)`?
- A) True
- B) False
- C) None
- D) Error

**Q5:** After `x = 5; x *= 3`, what is the value of `x`?
- A) 5
- B) 3
- C) 15
- D) 8

## Short Answer (2 questions)

**Q6:** Explain the difference between `/` and `//` in Python.

**Q7:** What is operator precedence and why is it important?

## Coding Question

**Q8:** Write code that checks if a number entered by the user is between 0 and 100 (inclusive). Use comparison operators and logical operators. Print "In range" or "Out of range".

## Answer Key

**Q1:** B) 3

**Q2:** A) 3

**Q3:** C) `==`

**Q4:** A) True

**Q5:** C) 15

**Q6:** `/` is float division that always returns a float (e.g., `9/4 = 2.25`). `//` is integer (floor) division that returns the integer quotient, discarding the remainder (e.g., `9//4 = 2`).

**Q7:** Operator precedence defines the order in which operations are evaluated in an expression. For example, in `3 + 4 * 2`, multiplication has higher precedence than addition, so the result is `11`, not `14`. Understanding precedence prevents calculation errors.

**Q8:**
```python
num = float(input("Enter a number: "))
if 0 <= num <= 100:
    print("In range")
else:
    print("Out of range")
```
