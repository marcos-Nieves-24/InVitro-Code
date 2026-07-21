---
Module: 3
Lesson Number: 10
Lesson Title: Data Storytelling
Estimated Duration: 60 minutes
Prerequisites: Lessons 1-6
Learning Objectives:
  - Structure a data story with narrative arc
  - Apply visualization best practices for effective communication
  - Design informative dashboards
  - Communicate statistical findings to non-technical audiences
  - Avoid common visualization pitfalls
Keywords: data storytelling, visualization, dashboard, communication, narrative, data journalism
Difficulty: Intermediate
Programming Concepts: matplotlib, plotly, seaborn, dashboards
Mathematical Concepts: None (application-oriented)
Machine Learning Concepts: result communication, model interpretation
Datasets Used: penguins, mpg, synthetic
Notebook: 10_data_storytelling.ipynb
Assignment: data_storytelling_assignment.md
Quiz: data_storytelling_quiz.md
---

# Lesson 10: Data Storytelling

## Motivation

The best analysis in the world is worthless if nobody understands it. Data storytelling is the art of communicating data-driven insights effectively. In biotechnology, this means convincing clinicians to adopt a new diagnostic test. In SaaS, this means persuading product managers to prioritize features based on user data. A compelling data story combines narrative, visualization, and context to drive decision-making.

## Big Picture

This capstone lesson integrates all previous lessons (descriptive statistics, distributions, EDA, relationships, PCA, clustering, model evaluation). You will learn to communicate the results of any analysis effectively. These skills are directly applicable to the final project and to any data science career.

## Theory

### The Data Story Arc

1. **Hook**: Why should the audience care?
2. **Context**: What data was collected and how?
3. **Conflict**: What problem or question drove the analysis?
4. **Analysis**: What did we find? (show the key insight, not every detail)
5. **Resolution**: What does this mean? What should we do?

### Visualization Best Practices

**Tufte's Principles**:
- **Data-ink ratio**: Maximize data-ink, minimize non-data-ink
- **Lie factor**: The size of the visual effect should match the size of the data effect
- **Chartjunk**: Avoid unnecessary decorations (3D effects, excessive colors, heavy gridlines)

**Cairo's Principles**:
- **Truthful**: Represent data accurately without distortion
- **Functional**: Easy to read and understand
- **Beautiful**: Aesthetically pleasing (but not at the expense of function)
- **Insightful**: Reveals patterns not obvious in raw data
- **Enlightening**: Teaches the audience something new

### Choosing the Right Chart

| Goal | Chart Type |
|------|------------|
| Compare categories | Bar chart |
| Show trends over time | Line chart |
| Distribution of one variable | Histogram, density plot |
| Relationship between two variables | Scatter plot |
| Composition of parts | Stacked bar, pie chart (sparingly) |
| Geographic data | Map |
| Hierarchical data | Treemap |

### Color Best Practices

- Use colorblind-friendly palettes (e.g., viridis, colorblind-safe)
- Use sequential palettes for ordered data
- Use diverging palettes for data with a meaningful midpoint
- Use qualitative palettes for categorical data (max ~8 categories)
- Never use red-green combinations (most common colorblindness)

### Dashboard Design

- **Hierarchy**: Most important information at top-left
- **Consistency**: Same color scheme, font, and layout throughout
- **Interactivity**: Allow users to filter and drill down (for web dashboards)
- **Context**: Include benchmarks, targets, and historical comparisons

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('default')

# BAD visualization
plt.figure(figsize=(8, 4))
x = np.arange(5)
y = [10, 12, 8, 15, 9]
plt.bar(x, y, color=['red', 'green', 'blue', 'yellow', 'purple'])
plt.title('BAD: Too Many Colors, No Labels, Chartjunk')
plt.show()

# GOOD visualization
plt.figure(figsize=(8, 4))
bars = plt.bar(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], y, color='steelblue')
plt.title('Website Traffic by Day')
plt.ylabel('Visitors (thousands)')
for bar, val in zip(bars, y):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
             str(val), ha='center')
plt.tight_layout()
plt.show()

# Story-driven visualization: penguins body mass by species
penguins = sns.load_dataset('penguins').dropna()

plt.figure(figsize=(10, 6))
species_colors = {'Adelie': '#3498db', 'Chinstrap': '#e74c3c', 'Gentoo': '#2ecc71'}
for species, color in species_colors.items():
    subset = penguins[penguins['species'] == species]
    plt.scatter(subset['flipper_length_mm'], subset['body_mass_g'],
                c=color, label=species, alpha=0.7, s=50)
plt.xlabel('Flipper Length (mm)')
plt.ylabel('Body Mass (g)')
plt.title('Penguin Size: How Flipper Length Relates to Body Mass')
plt.legend(title='Species')
plt.tight_layout()
plt.show()
```

## Walkthrough Example

Telling a complete data story: Customer churn analysis.

```python
np.random.seed(42)
n_customers = 500
churn_data = pd.DataFrame({
    'tenure_months': np.random.exponential(12, n_customers),
    'monthly_charges': np.random.uniform(20, 100, n_customers),
    'contract_type': np.random.choice(['Month-to-month', '1 year', '2 year'],
                                      n_customers, p=[0.6, 0.3, 0.1]),
    'churned': np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

# Story structure
# 1. Hook: "30% of our customers churn every year. That's $2M in lost revenue."
churn_rate = churn_data['churned'].mean()
print(f"CHURN RATE: {churn_rate:.0%}")

# 2. Context: Data from 500 customers over 12 months

# 3. Conflict: Which factors drive churn?
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Tenure
axes[0].hist(churn_data[churn_data['churned']==0]['tenure_months'],
             bins=20, alpha=0.7, label='Stayed', color='steelblue')
axes[0].hist(churn_data[churn_data['churned']==1]['tenure_months'],
             bins=20, alpha=0.7, label='Churned', color='coral')
axes[0].set_xlabel('Tenure (months)')
axes[0].set_ylabel('Count')
axes[0].set_title('Churn by Tenure')
axes[0].legend()

# Monthly charges
axes[1].boxplot([churn_data[churn_data['churned']==0]['monthly_charges'],
                 churn_data[churn_data['churned']==1]['monthly_charges']],
                labels=['Stayed', 'Churned'])
axes[1].set_title('Churn by Monthly Charges')

# Contract type
contract_churn = churn_data.groupby('contract_type')['churned'].mean()
axes[2].bar(contract_churn.index, contract_churn.values, color=['coral', 'steelblue', 'seagreen'])
axes[2].set_title('Churn Rate by Contract Type')
axes[2].set_ylabel('Churn Rate')

plt.tight_layout()
plt.show()

# 4. Resolution: Findings
print("KEY FINDINGS:")
print("1. Customers who churn have shorter tenure (median 6 vs 14 months)")
print("2. Higher monthly charges correlate with higher churn")
print("3. Month-to-month contracts have 3x higher churn than 2-year contracts")
print("\nRECOMMENDATION:")
print("Offer discounted annual contracts to new customers after 3 months")
```

## Biotechnology Example

Communicating drug trial results to clinicians.

```python
# Simulated clinical trial data
np.random.seed(42)
n_patients = 200
trial_data = pd.DataFrame({
    'group': ['placebo'] * 100 + ['treatment'] * 100,
    'biomarker_change': np.concatenate([
        np.random.normal(-2, 5, 100),   # placebo
        np.random.normal(8, 5, 100)     # treatment
    ])
})

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
sns.boxplot(x='group', y='biomarker_change', data=trial_data, palette=['#95a5a6', '#3498db'])
plt.title('Biomarker Change by Treatment Group')
plt.ylabel('Change in Biomarker (units)')

plt.subplot(1, 2, 2)
sns.histplot(data=trial_data, x='biomarker_change', hue='group', kde=True, alpha=0.5)
plt.title('Distribution of Biomarker Changes')
plt.xlabel('Change in Biomarker (units)')

plt.tight_layout()
plt.show()

# Statistical summary for clinicians
placebo_mean = trial_data[trial_data['group']=='placebo']['biomarker_change'].mean()
treat_mean = trial_data[trial_data['group']=='treatment']['biomarker_change'].mean()
effect = treat_mean - placebo_mean

print(f"Placebo group: {placebo_mean:.1f} ± {trial_data[trial_data['group']=='placebo']['biomarker_change'].std():.1f}")
print(f"Treatment group: {treat_mean:.1f} ± {trial_data[trial_data['group']=='treatment']['biomarker_change'].std():.1f}")
print(f"Treatment effect: {effect:.1f} units improvement")
```

## SaaS Example

Executive dashboard for a SaaS product.

```python
# Mock dashboard data
months = pd.date_range('2024-01-01', periods=12, freq='M')
dashboard_data = pd.DataFrame({
    'month': months,
    'mrr': np.random.normal(50000, 3000, 12).cumsum() + 100000,
    'new_customers': np.random.poisson(50, 12),
    'churn_rate': np.random.beta(2, 20, 12),
    'nps_score': np.random.normal(45, 5, 12)
})

fig, axes = plt.subplots(2, 2, figsize=(14, 8))

# MRR
axes[0, 0].plot(dashboard_data['month'], dashboard_data['mrr'], 'b-o', linewidth=2)
axes[0, 0].set_title('Monthly Recurring Revenue (MRR)')
axes[0, 0].set_ylabel('$')

# New Customers
axes[0, 1].bar(dashboard_data['month'], dashboard_data['new_customers'], color='steelblue')
axes[0, 1].set_title('New Customers')

# Churn Rate
axes[1, 0].plot(dashboard_data['month'], dashboard_data['churn_rate'] * 100, 'r-o', linewidth=2)
axes[1, 0].set_title('Churn Rate (%)')
axes[1, 0].set_ylabel('%')

# NPS
axes[1, 1].plot(dashboard_data['month'], dashboard_data['nps_score'], 'g-o', linewidth=2)
axes[1, 1].set_title('Net Promoter Score')
axes[1, 1].set_ylabel('NPS')
axes[1, 1].axhline(0, color='gray', linestyle='--')

plt.tight_layout()
plt.show()
```

## Common Mistakes

1. **3D charts**: Almost always distort perception. Avoid them.
2. **Pie charts with too many slices**: Limit to 3-5 categories.
3. **Truncated y-axis**: Can exaggerate differences; always start at 0 for bar charts.
4. **Using the wrong chart type**: E.g., line chart for categorical data.
5. **Cherry-picking data**: Presenting only data that supports your narrative.
6. **Ignoring your audience**: Technical details for executives, high-level summaries for scientists.

## Best Practices

- Start with the conclusion, then show evidence
- One chart = one message
- Label axes clearly; use units
- Use annotations to highlight key findings
- Keep it simple; remove anything that doesn't add value
- Tell a story: hook → context → conflict → analysis → resolution

## Summary

- Data storytelling = narrative + visualization + context
- Choose the right chart for your data and message
- Follow Tufte's principles: maximize data-ink ratio
- Use color intentionally and accessibly
- Design dashboards with hierarchy and consistency
- Know your audience and tailor your message

## Key Terms

| Term | Definition |
|------|------------|
| Data Storytelling | Communicating insights through narrative and visuals |
| Data-Ink Ratio | Proportion of ink devoted to data vs decoration |
| Chartjunk | Unnecessary visual elements that distract from data |
| Lie Factor | Ratio of visual effect size to data effect size |
| Dashboard | Visual display of key metrics at a glance |
| NPS | Net Promoter Score — customer loyalty metric |
| MRR | Monthly Recurring Revenue |

## Exercises

**Level 1: Basic Understanding**

1. What is the data-ink ratio and why is it important?
2. List three visualization mistakes that can mislead the audience.

**Level 2: Implementation**

3. Take the "bad" visualization from this lesson and improve it using best practices. Explain your changes.
4. Create a scatter plot that tells a story about the penguins dataset. Include annotations, appropriate colors, and a clear title.

**Level 3: Critical Thinking**

5. A pharmaceutical company's data scientist creates a visualization showing that patients on Drug A had 20% better outcomes than Drug B. When you examine the raw data, you notice the Drug A group was 10 years younger on average. How does this change the story? How should the visualization be updated?
6. Critique a data visualization from a news article or scientific paper. What works well? What could be improved? Focus on the data-ink ratio, chart choice, color use, and clarity.

## Coding Challenge

Write a Python script that:
1. Generates a synthetic dataset about a fictional SaaS startup (daily signups, revenue, churn, support tickets over 6 months)
2. Creates a dashboard with 4 visualizations arranged in a 2×2 grid
3. Includes: a line chart of revenue over time, a bar chart of signups by week, a histogram of support ticket resolution times, and a scatter plot of churn vs usage
4. Uses a consistent color palette and clear labels
5. Adds a title and summary text that tells the story: "Our startup grew revenue by 150% in 6 months, but support tickets are rising rapidly"
