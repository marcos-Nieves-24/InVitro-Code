# Assignment: Customer Segmentation with K-Means

## Objectives

- Segment customers using K-Means clustering
- Determine optimal number of segments
- Interpret and profile each segment
- Provide business recommendations

## Instructions

1. Generate or load customer data. Use the `make_blobs` function to create synthetic customer data with 5 segments based on:
   - Annual income
   - Spending score
   - Number of purchases
   - Average purchase value

2. **Preprocessing**:
   - Standardize all features
   - Explain why standardization is necessary

3. **Finding Optimal k**:
   - Test k from 2 to 10
   - Plot elbow curve and silhouette scores
   - Determine optimal k and justify your choice

4. **Clustering**:
   - Apply K-Means with optimal k
   - Create a PCA visualization colored by cluster
   - Plot centroids

5. **Segment Profiling**:
   - Compute mean feature values per cluster
   - Create a profile table
   - Name each segment (e.g., "High-Value Customers", "Bargain Shoppers")
   - Write a 1-paragraph description of each segment

6. **Business Recommendations**:
   - Based on segment profiles, suggest 3 marketing strategies
   - Explain how each strategy targets specific segments

## Deliverables

- Jupyter notebook with code, visualizations, segment profiles, and recommendations

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Data generation + preprocessing | Realistic + justified | Adequate | Simple | Missing |
| Optimal k selection | Both methods, well justified | One method | Weak justification | Missing |
| K-Means + visualization | Clean, informative | Good | Basic | Missing |
| Segment profiling | Detailed, named segments | Good profiles | Basic | Missing |
| Business recommendations | Specific, actionable | General | Vague | Missing |

**Total: 20 points**

## Estimated Time

2.5 hours
