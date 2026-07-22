# Assignment: Fairness Analysis of COMPAS

## Objectives

- Analyze a real-world algorithmic bias case using multiple fairness definitions
- Implement fairness metrics and interpret results
- Critically evaluate competing claims about algorithmic fairness

## Instructions

### Part 1: Read and Summarize (500 words)

Read ProPublica's "Machine Bias" article (Angwin et al., 2016) and summarize:
1. What is COMPAS? What does it predict?
2. How did ProPublica evaluate its fairness?
3. What were the main findings?
4. How did Northpointe (the developer) respond?

### Part 2: Replicate the Analysis (Python)

Using the COMPAS dataset from ProPublica (available at https://github.com/propublica/compas-analysis), replicate the key fairness analysis:

1. Load the raw COMPAS data (arrest date from 2013–2014).
2. Filter to create the same sample used in the ProPublica analysis (same filtering criteria).
3. Compute accuracy, TPR, FPR by race (Black and White defendants only).
4. Compute demographic parity, equal opportunity, and equalized odds.
5. Create a visualization showing the disparities.

### Part 3: Compare Definitions (500 words)

Write an analysis comparing the ProPublica and Northpointe positions:
1. What fairness definition did ProPublica use?
2. What fairness definition did Northpointe use (calibration)?
3. Can both be correct? Explain the impossibility theorem in this context.
4. Which fairness definition do you think is more appropriate for criminal sentencing? Why?

### Part 4: Recommendations (300 words)

Propose at least three recommendations for how COMPAS (or similar risk assessment tools) should be improved. Consider technical, procedural, and policy changes.

## Deliverables

- A Jupyter notebook with Part 2 (code and outputs)
- A PDF report with Parts 1, 3, and 4

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| Case summary | 15 | Accurate, thorough | Mostly accurate | Basic | Missing or incorrect |
| Code implementation | 30 | Correct, clean, well-commented | Mostly correct | Partial | Not working |
| Fairness analysis | 25 | All metrics computed and interpreted | Most metrics | Some metrics | Missing |
| Definition comparison | 20 | Nuanced understanding of competing definitions | Good analysis | Basic | Limited or incorrect |
| Recommendations | 10 | Specific, feasible, thoughtful | Reasonable | Generic | Missing |

**Total: 100 points**

## Estimated Time

5–6 hours

## Submission

Submit notebook and PDF via the course learning management system.
