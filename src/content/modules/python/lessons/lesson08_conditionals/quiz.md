# Quiz: Conditionals

## Multiple Choice (5 questions)

**Q1:** What is the output of `if 0: print("yes") else: print("no")`?
- A) yes
- B) no
- C) Error
- D) Nothing

**Q2:** Which of the following values is truthy?
- A) 0
- B) ""
- C) []
- D) "False"

**Q3:** What does `x = "Adult" if age >= 18 else "Minor"` do?
- A) Assigns "Adult" if age ≥ 18 else "Minor"
- B) Checks if "Adult" equals age
- C) Raises a syntax error
- D) Both A and B are assigned

**Q4:** What is the correct way to check if x is None?
- A) `if x == None`
- B) `if x is None`
- C) `if x = None`
- D) `if equals(x, None)`

**Q5:** What keyword is used to add an additional condition after `if`?
- A) `else if`
- B) `elif`
- C) `elseif`
- D) `elsif`

## Short Answer (2 questions)

**Q6:** Explain the difference between truthy and falsy values in Python.

**Q7:** What is a ternary conditional expression and when would you use it?

## Coding Question

**Q8:** Write a function `grade_score(score)` that returns "Pass" if score ≥ 60 and "Fail" otherwise. Then rewrite it as a lambda.

## Answer Key

**Q1:** B) no

**Q2:** D) "False"

**Q3:** A) Assigns "Adult" if age ≥ 18 else "Minor"

**Q4:** B) `if x is None`

**Q5:** B) `elif`

**Q6:** Truthy values evaluate to True in a boolean context (e.g., non-empty strings, non-zero numbers, non-empty containers). Falsy values evaluate to False (e.g., 0, "", [], None, False). This allows concise conditions like `if name:` instead of `if name != "":`.

**Q7:** A ternary conditional expression is a one-line if/else: `value_if_true if condition else value_if_false`. Use it for simple, single-expression conditions where it improves readability over a full if/else block.

**Q8:**
```python
def grade_score(score):
    return "Pass" if score >= 60 else "Fail"

grade_lambda = lambda score: "Pass" if score >= 60 else "Fail"

print(grade_score(75))  # Pass
print(grade_lambda(45))  # Fail
```
