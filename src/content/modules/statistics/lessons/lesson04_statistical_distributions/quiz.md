# Quiz: Statistical Distributions

## Multiple Choice (5 questions)

**1. Which distribution models the number of successes in n independent trials?**

a) Bernoulli
b) Binomial
c) Poisson
d) Normal

**2. The Poisson distribution assumes:**

a) Mean = Variance
b) Mean > Variance
c) Mean < Variance
d) Variance = 0

**3. What is the Z-score of a value X = 75 from a normal distribution with μ = 50 and σ = 10?**

a) 1.5
b) 2.0
c) 2.5
d) 0.5

**4. According to the 68-95-99.7 rule, approximately what percentage of data falls within 2 standard deviations of the mean?**

a) 68%
b) 95%
c) 99.7%
d) 50%

**5. The Central Limit Theorem states that:**

a) Individual observations are normally distributed
b) The sample mean approaches normality as sample size increases
c) All distributions have the same mean
d) Variance equals the mean for all distributions

## Short Answer (2 questions)

**6.** A call center receives an average of 20 calls per hour. What distribution models this? What is the probability of receiving exactly 15 calls in the next hour?

**7.** What is standardization and why is it important in machine learning?

## Coding Question (1 question)

**8.** Write Python code using scipy.stats to:
- Create a Binomial distribution with n=15, p=0.4
- Compute P(X = 7)
- Compute P(X ≤ 5)
- Generate 100 random samples

---

# Answer Key

1. b) Binomial
2. a) Mean = Variance
3. c) 2.5
4. b) 95%
5. b) The sample mean approaches normality as sample size increases

6. Poisson distribution (λ = 20). P(X=15) = e^(-20) × 20^15 / 15!. Using Python: `stats.poisson(20).pmf(15)` ≈ 0.052.

7. Standardization transforms data to have mean = 0 and standard deviation = 1 using Z = (X - μ)/σ. It is important because many ML algorithms (SVM, K-Means, PCA, logistic regression) assume features are on the same scale; otherwise, features with larger magnitudes dominate.

8. 
```python
from scipy import stats
binom = stats.binom(15, 0.4)
print(f"P(X=7) = {binom.pmf(7):.4f}")
print(f"P(X<=5) = {binom.cdf(5):.4f}")
samples = binom.rvs(100, random_state=42)
print(samples[:10])
```
