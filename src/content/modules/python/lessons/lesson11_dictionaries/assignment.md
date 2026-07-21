# Assignment: Data Aggregation with Dictionaries

## Objectives

- Use dictionaries for data organization and lookup
- Implement dictionary comprehensions
- Use defaultdict and Counter for specialized tasks
- Nest dictionaries for structured data

## Instructions

Create a Python script `sales_analyzer.py` that:

1. **Sales data**: Create a dictionary with product names as keys and a list of monthly sales as values.

2. **Analysis functions**:
   - `total_sales(sales_data)` — returns dict of product → total sales
   - `average_sales(sales_data)` — returns dict of product → average monthly sales
   - `top_product(sales_data)` — returns the product name with highest total sales
   - `monthly_totals(sales_data)` — returns list of total sales per month
   - `products_above_threshold(sales_data, threshold)` — returns list of products above threshold

3. **Report**: Generate a formatted report with all statistics.

## Starter Data

```python
sales_data = {
    "WidgetA": [1200, 1350, 1100, 1400, 1250, 1300, 1150, 1420, 1280, 1350, 1400, 1380],
    "WidgetB": [800, 750, 900, 850, 780, 820, 790, 860, 840, 810, 830, 870],
    "WidgetC": [1500, 1600, 1450, 1550, 1480, 1520, 1490, 1580, 1510, 1570, 1530, 1560],
    "WidgetD": [500, 520, 480, 550, 510, 530, 490, 540, 505, 525, 515, 535],
}
```

## Deliverables

- `sales_analyzer.py`
- Formatted output of all analysis results

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Dictionary Usage | Effective, appropriate usage | Mostly appropriate | Poor usage |
| Functions | All functions correct, reusable | Most correct | Missing functions |
| Comprehensions | Used where appropriate | Used but unnecessary | Not used |
| Output | Clear, formatted report | Adequate | Hard to read |
| Code Quality | PEP 8, commented, clean | Acceptable | Poor |

## Estimated Completion Time

60 minutes
