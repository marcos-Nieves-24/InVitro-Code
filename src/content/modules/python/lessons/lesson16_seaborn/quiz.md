# Quiz: Seaborn

## Multiple Choice (5 questions)

**Q1:** Which library is Seaborn built on top of?
- A) NumPy
- B) Pandas
- C) Matplotlib
- D) Plotly

**Q2:** What does `sns.pairplot()` display?
- A) A single scatter plot
- B) A matrix of scatter plots for all variable pairs
- C) A heatmap of correlations
- D) A box plot for each variable

**Q3:** Which parameter adds color coding for categorical variables?
- A) `color`
- B) `hue`
- C) `palette`
- D) `cmap`

**Q4:** What type of plot combines a box plot with a kernel density estimate?
- A) Boxen plot
- B) Violin plot
- C) Swarm plot
- D) Strip plot

**Q5:** How do you apply Seaborn's default theme?
- A) `sns.default_theme()`
- B) `sns.set_theme()`
- C) `sns.apply_theme()`
- D) `sns.theme()`

## Short Answer (2 questions)

**Q6:** What is a heatmap and when would you use it?

**Q7:** How does Seaborn differ from Matplotlib in terms of default design philosophy?

## Coding Question

**Q8:** Write code to create a box plot using Seaborn showing the distribution of `total_bill` by `day` from the tips dataset.

## Answer Key

**Q1:** C) Matplotlib

**Q2:** B) A matrix of scatter plots for all variable pairs

**Q3:** B) `hue`

**Q4:** B) Violin plot

**Q5:** B) `sns.set_theme()`

**Q6:** A heatmap is a color-coded matrix representation where values are represented by colors. It's commonly used to visualize correlation matrices, confusion matrices, or any grid of values where you want to quickly identify patterns, clusters, and high/low values.

**Q7:** Matplotlib prioritizes control and customization, with basic default styling. Seaborn prioritizes statistical analysis and attractive defaults, requiring less code to create publication-quality plots. Seaborn provides built-in statistical aggregations, while Matplotlib requires manual computation.

**Q8:**
```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")
sns.boxplot(data=tips, x="day", y="total_bill")
plt.title("Bill Distribution by Day")
plt.show()
```
