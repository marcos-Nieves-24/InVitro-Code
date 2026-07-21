# Quiz: Data Storytelling

## Multiple Choice (5 questions)

**1. The data-ink ratio measures:**

a) How much ink a printer uses
b) The proportion of ink devoted to data vs decoration
c) The number of colors in a visualization
d) The size of the dataset

**2. Which color combination should be avoided for accessibility?**

a) Blue and orange
b) Red and green
c) Purple and yellow
d) Black and white

**3. According to Tufte, the "lie factor" is:**

a) The ratio of the size of the visual effect to the size of the data effect
b) A measure of how many lies a chart contains
c) The number of decimal places in the data
d) The font size used in labels

**4. Which chart type is best for showing a trend over time?**

a) Pie chart
b) Bar chart
c) Line chart
d) Scatter plot

**5. In dashboard design, the most important information should be placed:**

a) Bottom-right
b) Top-left
c) Center
d) Bottom-left

## Short Answer (2 questions)

**6.** What is chartjunk? Give two examples.

**7.** Explain why 3D charts are generally discouraged in data visualization.

## Coding Question (1 question)

**8.** Write Python code that creates a simple bar chart with:
- Categories: ['Q1', 'Q2', 'Q3', 'Q4']
- Values: [25, 40, 35, 50]
- A clear title, x-label, y-label
- Values annotated on top of each bar
- Consistent single color for all bars

---

# Answer Key

1. b) The proportion of ink devoted to data vs decoration
2. b) Red and green
3. a) The ratio of the size of the visual effect to the size of the data effect
4. c) Line chart
5. b) Top-left

6. Chartjunk refers to unnecessary visual elements that distract from the data. Examples: heavy gridlines, 3D effects, excessive colors, irrelevant images, decorative patterns on bars.

7. 3D charts distort perception — the perspective effect makes it difficult to accurately compare values. The "closer" bars appear larger even when they aren't. They also add visual clutter without adding information. Almost always, a 2D version is clearer.

8. 
```python
import matplotlib.pyplot as plt
categories = ['Q1', 'Q2', 'Q3', 'Q4']
values = [25, 40, 35, 50]
plt.figure(figsize=(8, 4))
bars = plt.bar(categories, values, color='steelblue')
plt.title('Quarterly Revenue')
plt.xlabel('Quarter')
plt.ylabel('Revenue ($K)')
for bar, val in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             str(val), ha='center')
plt.tight_layout()
plt.show()
```
