# Quiz: Plotly

## Multiple Choice (5 questions)

**Q1:** What type of object does `px.scatter()` return?
- A) A matplotlib Figure
- B) A plotly.graph_objects.Figure
- C) A JSON string
- D) An HTML element

**Q2:** How do you add a new trace to an existing `go.Figure()`?
- A) `fig.append_trace()`
- B) `fig.add_trace()`
- C) `fig.insert_trace()`
- D) `fig.push_trace()`

**Q3:** Which function creates a multi-panel figure with a grid of subplots?
- A) `plt.subplots()`
- B) `plotly.subplots.make_subplots()`
- C) `px.subplots()`
- D) `go.Subplots()`

**Q4:** How do you export a Plotly figure to an interactive standalone file?
- A) `fig.save("file.html")`
- B) `fig.export("file.html")`
- C) `fig.write_html("file.html")`
- D) `fig.to_html("file.html")`

**Q5:** What is Kaleido used for in the Plotly ecosystem?
- A) Rendering interactive HTML in Jupyter
- B) Static image export (PNG, SVG, PDF)
- C) Creating animated GIFs from Plotly figures
- D) Connecting Plotly to Dash

## Short Answer (2 questions)

**Q6:** Explain the difference between Plotly Express and Graph Objects. When would you use each?

**Q7:** Why does interactive visualization matter in biotechnology? Give at least two specific use cases.

## Coding Question

**Q8:** Write code using Plotly Express to create a scatter matrix (pair plot) of the iris dataset (`px.data.iris()`), coloring points by species. Use the columns: `sepal_length`, `sepal_width`, `petal_length`, `petal_width`.

## Answer Key

**Q1:** B) A plotly.graph_objects.Figure

**Q2:** B) `fig.add_trace()`

**Q3:** B) `plotly.subplots.make_subplots()`

**Q4:** C) `fig.write_html("file.html")`

**Q5:** B) Static image export (PNG, SVG, PDF)

**Q6:** Plotly Express is a high-level API that creates complete figures with a single function call — ideal for rapid exploration and standard plots. Graph Objects is a lower-level API that gives full control over every element of the figure (traces, layout, annotations) — ideal for custom dashboards, multi-trace figures, and subplot layouts. Start with Express, migrate to Graph Objects when you need finer control.

**Q7:** Interactive visualization matters in biotech because: (1) Volcano plots with hover allow researchers to identify specific genes by name without cluttering the plot with labels; (2) 3D scatter plots of PCA or t-SNE data with zoom/rotate enable visual cluster identification; (3) Dashboards with dropdowns let biologists switch between gene expression metrics without rewriting code; (4) Animated scatter plots show temporal evolution of molecular data.

**Q8:**
```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter_matrix(
    df,
    dimensions=["sepal_length", "sepal_width", "petal_length", "petal_width"],
    color="species",
    title="Iris Scatter Matrix"
)
fig.show()
```
