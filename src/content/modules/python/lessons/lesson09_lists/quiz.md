# Quiz: Lists

## Multiple Choice (5 questions)

**Q1:** What is the result of `[1, 2, 3, 4][::-1]`?
- A) [4, 3, 2, 1]
- B) [1, 3]
- C) [2, 4]
- D) Error

**Q2:** What does `fruits.append("orange")` do?
- A) Adds "orange" at the beginning
- B) Adds "orange" at the end
- C) Replaces the last element
- D) Removes "orange"

**Q3:** What is the output of `len([[1, 2], [3, 4], 5])`?
- A) 3
- B) 5
- C) 4
- D) 6

**Q4:** Which list comprehension creates a list of even numbers from 0 to 10?
- A) `[x for x in range(11) if x % 2 == 0]`
- B) `[x for x in range(11) if x % 2 != 0]`
- C) `[x for x in range(11) if x % 2]`
- D) `[x for x in range(10) while x % 2 == 0]`

**Q5:** What is the result of `[1, 2, 3] + [4, 5]`?
- A) [1, 2, 3, 4, 5]
- B) [5, 7, 8]
- C) Error
- D) [[1, 2, 3], [4, 5]]

## Short Answer (2 questions)

**Q6:** Explain the difference between `append()` and `extend()` for lists.

**Q7:** What does it mean that lists are mutable? Give an example.

## Coding Question

**Q8:** Write a list comprehension that creates a list of the first 10 square numbers (1, 4, 9, 16, ..., 100).

## Answer Key

**Q1:** A) [4, 3, 2, 1]

**Q2:** B) Adds "orange" at the end

**Q3:** A) 3

**Q4:** A) `[x for x in range(11) if x % 2 == 0]`

**Q5:** A) [1, 2, 3, 4, 5]

**Q6:** `append()` adds its argument as a single element to the end of the list, even if the argument is itself a list (it becomes a nested list). `extend()` iterates over its argument and adds each element individually, flattening the iterable into the list.

**Q7:** Mutable means the list's contents can be changed after creation. Example:
```python
items = [1, 2, 3]
items[1] = 99  # items is now [1, 99, 3]
items.append(4)  # items is now [1, 99, 3, 4]
```
The list object itself is modified in place.

**Q8:**
```python
squares = [n ** 2 for n in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
