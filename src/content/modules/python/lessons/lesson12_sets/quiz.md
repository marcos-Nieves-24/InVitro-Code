# Quiz: Sets

## Multiple Choice (5 questions)

**Q1:** How do you create an empty set in Python?
- A) `{}`
- B) `set()`
- C) `[]`
- D) `empty_set()`

**Q2:** What is the output of `set([1, 2, 2, 3, 1, 3])`?
- A) {1, 2, 3}
- B) {1, 2, 2, 3, 1, 3}
- C) [1, 2, 3]
- D) (1, 2, 3)

**Q3:** What does `{1, 2, 3} & {3, 4, 5}` return?
- A) {3}
- B) {1, 2, 3, 4, 5}
- C) {1, 2}
- D) {4, 5}

**Q4:** Which data type can be added to a set?
- A) List
- B) Dictionary
- C) Tuple
- D) Set

**Q5:** What is the time complexity of `element in my_set`?
- A) O(1)
- B) O(n)
- C) O(log n)
- D) O(n²)

## Short Answer (2 questions)

**Q6:** Explain the difference between `remove()` and `discard()` for sets.

**Q7:** What is a frozenset and when would you use it?

## Coding Question

**Q8:** Write a function `common_elements(list1, list2)` that returns a set of elements that appear in both lists.

## Answer Key

**Q1:** B) `set()`

**Q2:** A) {1, 2, 3}

**Q3:** A) {3}

**Q4:** C) Tuple

**Q5:** A) O(1)

**Q6:** `remove(x)` removes x from the set but raises a KeyError if x is not present. `discard(x)` also removes x but does nothing if x is not present (no error). Use `discard` when you're not sure if the element exists.

**Q7:** A frozenset is an immutable version of a set. It cannot be modified after creation (no add, remove, etc.). Use frozenset when you need a hashable set-like object, such as using a set as a dictionary key or as an element of another set.

**Q8:**
```python
def common_elements(list1, list2):
    return set(list1) & set(list2)

print(common_elements([1, 2, 3, 4], [3, 4, 5, 6]))  # {3, 4}
```
