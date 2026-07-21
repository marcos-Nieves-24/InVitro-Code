# Quiz: Probability Fundamentals

## Multiple Choice (5 questions)

**1. Which of Kolmogorov's axioms states that the probability of the entire sample space is 1?**

a) Non-negativity
b) Normalization
c) Additivity
d) Complementarity

**2. P(A|B) = P(A∩B) / P(B) is the formula for:**

a) Bayes' theorem
b) Conditional probability
c) Law of total probability
d) Joint probability

**3. Bayes' theorem allows us to:**

a) Compute the probability of A without any data
b) Update beliefs about A after observing evidence B
c) Prove that A causes B
d) Calculate the variance of a random variable

**4. The expected value of a random variable is:**

a) The most likely value
b) The long-run average value
c) Always equal to the median
d) The square root of variance

**5. If events A and B are mutually exclusive:**

a) P(A∩B) = P(A) × P(B)
b) P(A∪B) = P(A) + P(B)
c) P(A|B) = P(A)
d) P(A) + P(B) = 1

## Short Answer (2 questions)

**6.** A test for a rare disease (prevalence 0.1%) has 99% sensitivity and 95% specificity. If a patient tests positive, what is the probability they actually have the disease? Show the calculation.

**7.** Explain the "base rate fallacy" and give an example from biotechnology.

## Coding Question (1 question)

**8.** Write Python code using numpy to simulate 50,000 patients where:
- Disease prevalence is 2%
- Test sensitivity is 90%
- Test specificity is 85%

Compute the empirical probability that a patient has the disease given a positive test.

---

# Answer Key

1. b) Normalization
2. b) Conditional probability
3. b) Update beliefs about A after observing evidence B
4. b) The long-run average value
5. b) P(A∪B) = P(A) + P(B)

6. P(disease|positive) = (0.99 × 0.001) / (0.99 × 0.001 + 0.05 × 0.999) = 0.00099 / 0.05094 = 0.0194 (1.94%)

7. The base rate fallacy occurs when people ignore the base rate (prevalence) and overestimate the probability of a rare event after positive evidence. In biotech: if a disease affects 1 in 10,000 and a test is 99% accurate, many doctors mistakenly believe a positive test means 99% chance of disease, when it's actually much lower.

8. 
```python
import numpy as np
n = 50000
has_dis = np.random.random(n) < 0.02
pos_test = np.where(has_dis, np.random.random(n) < 0.90, np.random.random(n) < 0.15)
p = has_dis[pos_test].mean()
print(f"P(disease|positive) = {p:.4f}")
```
