# Assignment: Type-Error Proofing

## Objectives

- Demonstrate understanding of Python data types
- Handle type conversion correctly
- Debug common type errors
- Write type-safe code

## Instructions

Create a Python script called `grade_calculator.py` that:

1. **Collect input**: Ask for student name (str), assignment scores (3 numbers entered separately), and total possible points
2. **Calculate**: Compute the average score and percentage grade
3. **Convert types appropriately**: All input comes as strings
4. **Grade assignment**: Use boolean logic to determine pass/fail (≥ 60% passes)
5. **Output**: Print a formatted grade report

Also include a function `safe_divide(a, b)` that safely handles division by returning `None` if `b` is zero.

## Deliverables

- `grade_calculator.py`
- Example output showing at least two student grade calculations

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Type Conversion | All input correctly converted | Most conversions correct | Missing conversions |
| Calculations | Accurate and correct | Minor errors | Major errors |
| Boolean Logic | Correct pass/fail with edge cases | Basic logic | Logic errors |
| Error Handling | Handles division by zero and invalid input | Basic handling | No error handling |
| Code Quality | Well-commented, PEP 8, organized | Acceptable | Poor quality |

## Estimated Completion Time

45 minutes
