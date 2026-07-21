# Assignment: E-commerce Data Analysis with Pandas

## Objectives

- Load and explore data with Pandas
- Perform data cleaning and transformation
- Use groupby for aggregation and analysis
- Merge multiple DataFrames
- Generate a summary report

## Instructions

Create a Python script `ecommerce_analysis.py` that:

1. **Create synthetic data** (or load from CSV): Generate three DataFrames:
   - `customers`: customer_id, name, age, city, signup_date
   - `orders`: order_id, customer_id, order_date, amount, product_category
   - `products`: product_id, product_name, category, price, stock

2. **Data cleaning**:
   - Check for and handle missing values
   - Remove duplicate orders
   - Convert date columns to datetime
   - Remove orders with amount ≤ 0

3. **Analysis**:
   - Total revenue per product category
   - Monthly revenue trend
   - Top 10 customers by total spend
   - Average order value by city
   - Customer segmentation (new/regular/vip based on order count)

4. **Merge**: Join customers with orders to create a complete view

5. **Report**: Print a formatted summary of all findings

## Starter Code

```python
import pandas as pd
import numpy as np

# Generate synthetic data
np.random.seed(42)
```

## Deliverables

- `ecommerce_analysis.py`
- Printed summary report with all findings

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Data Creation | All 3 DataFrames with realistic data | 2 DataFrames | 1 or missing |
| Data Cleaning | Handles all issues correctly | Partial cleaning | No cleaning |
| GroupBy | Correct aggregation, multiple metrics | Basic groupby | Errors |
| Merging | Correct merge, all records accounted | Basic merge | Incorrect |
| Report | Clear, formatted, comprehensive | Adequate | Missing/incomplete |

## Estimated Completion Time

90 minutes
