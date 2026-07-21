# Quiz: Matplotlib

## Multiple Choice (5 questions)

**Q1:** What is the top-level container in Matplotlib?
- A) Axes
- B) Figure
- C) Plot
- D) Canvas

**Q2:** How do you create a figure with 2 rows and 3 columns of subplots?
- A) `plt.subplot(2, 3)`
- B) `plt.subplots(2, 3)`
- C) `plt.figure(2, 3)`
- D) `plt.create(2, 3)`

**Q3:** Which function saves a figure to a file?
- A) `plt.save()`
- B) `plt.export()`
- C) `plt.savefig()`
- D) `plt.write()`

**Q4:** What does `plt.tight_layout()` do?
- A) Adjusts spacing between subplots
- B) Resizes the figure
- C) Fits the plot to data
- D) Compresses the image

**Q5:** Which parameter controls marker transparency in a scatter plot?
- A) `transparent`
- B) `alpha`
- C) `opacity`
- D) `visible`

## Short Answer (2 questions)

**Q6:** Explain the difference between the pyplot interface and the object-oriented interface in Matplotlib.

**Q7:** Why should you save figures as SVG for publications instead of JPG?

## Coding Question

**Q8:** Write code to create a simple line plot of y = x² for x from 0 to 10, with labeled axes and a title.

## Answer Key

**Q1:** B) Figure

**Q2:** B) `plt.subplots(2, 3)`

**Q3:** C) `plt.savefig()`

**Q4:** A) Adjusts spacing between subplots

**Q5:** B) `alpha`

**Q6:** The pyplot interface (`plt.plot()`, `plt.title()`) is a state-based interface that tracks the "current" figure and axes. It's convenient for quick plots. The object-oriented interface (`fig, ax = plt.subplots()` followed by `ax.plot()`, `ax.set_title()`) explicitly creates figure and axes objects, giving more control and making it better for complex, multi-panel figures.

**Q7:** SVG is a vector format that scales infinitely without losing quality, making it ideal for publications where figures may be resized. JPG is a raster format that loses quality when scaled and uses lossy compression. SVG also allows editing in vector graphics software and produces smaller files for simple plots.

**Q8:**
```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = x ** 2

plt.plot(x, y)
plt.xlabel("x")
plt.ylabel("x²")
plt.title("Plot of y = x²")
plt.grid(True)
plt.show()
```
