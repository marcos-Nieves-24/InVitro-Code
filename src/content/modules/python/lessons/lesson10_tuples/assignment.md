# Assignment: Data Records with Tuples

## Objectives

- Use tuples to represent structured records
- Practice tuple unpacking
- Understand when immutability is beneficial
- Use function return tuples effectively

## Instructions

Create a Python script `student_records.py` that:

1. **Define records**: Create a list of student records, each as a tuple: `(student_id, name, [grades])` where grades is a list of exam scores.

2. **Functions using tuples**:
   - `average_grade(student)` — returns `(student_id, name, avg_score)`
   - `top_student(students)` — returns the tuple of the student with highest average
   - `passed_students(students, threshold=60)` — returns list of tuples of students who passed
   - `grade_summary(students)` — returns a tuple containing (class_average, highest_avg, lowest_avg, num_passed, num_failed)

3. **Analysis**: Use the functions to analyze the data and print a formatted summary.

## Starter Data

```python
students = [
    ("S001", "Alice", [85, 92, 78, 95]),
    ("S002", "Bob", [45, 55, 60, 50]),
    ("S003", "Charlie", [70, 75, 80, 72]),
    ("S004", "Diana", [95, 98, 92, 96]),
    ("S005", "Eve", [30, 40, 35, 45]),
]
```

## Deliverables

- `student_records.py`
- Output showing the analysis

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Tuple Usage | Appropriate use throughout | Mostly appropriate | Poor use |
| Unpacking | Used effectively in all functions | Used occasionally | Not used |
| Functions | Well-designed, clear I/O | Mostly clear | Poor design |
| Analysis | Complete summary output | Partial output | Missing |
| Code Quality | Clean, commented | Acceptable | Poor |

## Estimated Completion Time

45 minutes
