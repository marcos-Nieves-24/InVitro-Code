# Assignment: Variables in Practice

## Objectives

- Demonstrate variable assignment and reassignment
- Use type conversion correctly
- Implement a simple data pipeline using variables
- Apply naming conventions

## Instructions

Create a Python script `patient_analysis.py` that:

1. **Data collection**: Use `input()` to collect:
   - Patient ID
   - Age (years)
   - Height (meters)
   - Weight (kilograms)
   - Systolic blood pressure
   - Diastolic blood pressure

2. **Calculations**: Compute:
   - BMI = weight / (height²)
   - Mean arterial pressure = diastolic + (systolic - diastolic) / 3

3. **Classification**: Determine:
   - BMI category (underweight < 18.5, normal 18.5-24.9, overweight 25-29.9, obese ≥ 30)
   - Blood pressure category (normal: systolic < 120 AND diastolic < 80)

4. **Output**: Print a formatted patient summary report

## Deliverables

- `patient_analysis.py` (well-commented, PEP 8 compliant)
- Example output showing the results

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Variable Usage | Clear, descriptive names, proper case | Acceptable names | Poor naming |
| Type Conversion | Correct conversion of input() results | Mostly correct | Missing conversions |
| Calculations | All formulas correct | Minor errors | Major errors |
| Output | Formatted, readable summary | Adequate | Hard to read |
| Code Quality | PEP 8, commented, organized | Mostly compliant | Disorganized |

## Estimated Completion Time

60 minutes
