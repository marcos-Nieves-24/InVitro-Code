# Assignment: Scientific Calculator

## Objectives

- Implement arithmetic operations correctly
- Use comparison and logical operators
- Apply assignment operators
- Handle operator precedence correctly

## Instructions

Create a Python script `lab_calculator.py` that implements a simple laboratory calculator:

1. **Solution dilution calculation**: Ask for stock concentration (M), desired concentration (M), and desired volume (mL). Calculate: `volume_stock = (desired_conc * desired_volume) / stock_conc`, then volume_water = desired_volume - volume_stock.

2. **pH calculation**: Given hydrogen ion concentration [H⁺], calculate pH = -log10([H⁺]). Use `**` for log10: `pH = -math.log10(h_concentration)` (import math).

3. **Classification**: Based on pH output: acid (< 7), neutral (== 7), base (> 7).

4. **Statistical calculation**: Given 5 numbers, calculate the mean, variance, and standard deviation using operators (no statistical libraries).

5. **Budget check**: Given a total cost and budget, determine if the purchase is within budget. Apply an assignment operator.

## Deliverables

- `lab_calculator.py` with all functions
- Documented output showing each calculation

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Arithmetic | All calculations correct | Minor errors | Major errors |
| Operators | Uses all operator types appropriately | Most types used | Few types used |
| Logic | Correct branching with logical operators | Mostly correct | Logical errors |
| Code Quality | Well-commented, PEP 8 | Adequate | Poor |
| Output | Formatted, clear results | Acceptable | Hard to read |

## Estimated Completion Time

60 minutes
