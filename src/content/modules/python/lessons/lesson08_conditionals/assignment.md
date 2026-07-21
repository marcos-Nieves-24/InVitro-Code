# Assignment: Clinical Decision Support System

## Objectives

- Write complex conditional logic for real-world scenarios
- Use if/elif/else with boolean expressions
- Apply truthy/falsy concepts
- Use ternary expressions and match statements

## Instructions

Create a Python script `clinical_triage.py` that implements a clinical triage system:

1. **Vital signs assessment**: Given heart rate (bpm), systolic BP, diastolic BP, temperature (°C), and oxygen saturation (%), classify each as normal or abnormal.

2. **Triage level**: Assign a triage level based on the number and severity of abnormal vitals:
   - Level 1 (Resuscitation): Any life-threatening abnormality (e.g., O2 < 85%, HR > 140 or < 40)
   - Level 2 (Emergency): 2+ abnormal vitals or any single severe abnormality
   - Level 3 (Urgent): 1 abnormal vital
   - Level 4 (Non-urgent): All vitals normal
   - Level 5 (Routine): Follow-up only

3. **Recommendation**: Based on triage level, output a recommendation.

4. Use a `match` statement for the triage level → recommendation mapping.

## Starter Code Sketch

```python
def assess_vitals(hr, sbp, dbp, temp, spo2):
    """Returns dict of abnormal vitals."""


def determine_triage(vitals):
    """Returns triage level 1-5."""


def get_recommendation(triage_level):
    """Returns recommendation based on triage level."""
```

## Deliverables

- `clinical_triage.py` with all functions and demonstration
- Test the system with at least 3 patient scenarios

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Conditional Logic | Correct, comprehensive | Mostly correct | Logical errors |
| Triage Rules | All levels correctly implemented | Most levels | Missing levels |
| Match Statement | Used appropriately | Used but basic | Not used |
| Testing | 3+ test cases with output | 2 test cases | 1 or none |
| Code Quality | Clean, well-commented | Acceptable | Poor |

## Estimated Completion Time

75 minutes
