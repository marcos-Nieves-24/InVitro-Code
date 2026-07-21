# Quiz: Loops

## Multiple Choice (5 questions)

**Q1:** What does `for i in range(3): print(i)` output?
- A) 1 2 3
- B) 0 1 2
- C) 0 1 2 3
- D) 1 2

**Q2:** What keyword exits a loop immediately?
- A) exit
- B) stop
- C) break
- D) return

**Q3:** What does `range(2, 8, 3)` generate?
- A) 2, 3, 4, 5, 6, 7
- B) 2, 5
- C) 2, 5, 8
- D) 2, 5

**Q4:** What happens when a `while` loop condition never becomes False?
- A) Python stops the program
- B) An infinite loop occurs
- C) The loop runs once
- D) Python crashes

**Q5:** Which function provides both the index and value during iteration?
- A) `index()`
- B) `enumerate()`
- C) `zip()`
- D) `range()`

## Short Answer (2 questions)

**Q6:** Explain the difference between `break` and `continue`.

**Q7:** What is the purpose of the `else` clause in a loop?

## Coding Question

**Q8:** Write a for loop that sums all even numbers from 1 to 50 and prints the result. Use `continue` to skip odd numbers.

## Answer Key

**Q1:** B) 0 1 2

**Q2:** C) break

**Q3:** D) 2, 5

**Q4:** B) An infinite loop occurs

**Q5:** B) `enumerate()`

**Q6:** `break` immediately exits the entire loop. `continue` skips the rest of the current iteration and moves to the next iteration of the loop.

**Q7:** The `else` clause executes when the loop completes normally (i.e., the condition becomes False for while, or the sequence is exhausted for for). It does NOT execute if the loop was terminated by `break`.

**Q8:**
```python
total = 0
for i in range(1, 51):
    if i % 2 != 0:
        continue
    total += i
print(f"Sum of even numbers from 1 to 50: {total}")
```
