# Quiz: Plotly

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué tipo de objeto devuelve `px.scatter()`?
- A) Un Figure de matplotlib
- B) Un plotly.graph_objects.Figure
- C) Una cadena JSON
- D) Un elemento HTML

**Q2:** ¿Cómo agregás una trace nueva a un `go.Figure()` existente?
- A) `fig.append_trace()`
- B) `fig.add_trace()`
- C) `fig.insert_trace()`
- D) `fig.push_trace()`

**Q3:** ¿Qué función crea una figura de múltiples paneles con una cuadrícula de subplots?
- A) `plt.subplots()`
- B) `plotly.subplots.make_subplots()`
- C) `px.subplots()`
- D) `go.Subplots()`

**Q4:** ¿Cómo exportás una figura de Plotly a un archivo interactivo independiente?
- A) `fig.save("file.html")`
- B) `fig.export("file.html")`
- C) `fig.write_html("file.html")`
- D) `fig.to_html("file.html")`

**Q5:** ¿Para qué se usa Kaleido en el ecosistema de Plotly?
- A) Renderizar HTML interactivo en Jupyter
- B) Exportación de imágenes estáticas (PNG, SVG, PDF)
- C) Crear GIFs animados a partir de figuras de Plotly
- D) Conectar Plotly con Dash

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre Plotly Express y Graph Objects. ¿Cuándo usarías cada uno?

**Q7:** ¿Por qué importa la visualización interactiva en biotecnología? Da al menos dos casos de uso específicos.

## Pregunta de código

**Q8:** Escribí código con Plotly Express para crear una scatter matrix (pair plot) del dataset iris (`px.data.iris()`), coloreando los puntos por especie. Usá las columnas: `sepal_length`, `sepal_width`, `petal_length`, `petal_width`.

## Clave de respuestas

**Q1:** B) Un plotly.graph_objects.Figure

**Q2:** B) `fig.add_trace()`

**Q3:** B) `plotly.subplots.make_subplots()`

**Q4:** C) `fig.write_html("file.html")`

**Q5:** B) Exportación de imágenes estáticas (PNG, SVG, PDF)

**Q6:** Plotly Express es una API de alto nivel que crea figuras completas con una sola llamada a una función: es ideal para exploración rápida y gráficos estándar. Graph Objects es una API de menor nivel que da control total sobre cada elemento de la figura (traces, layout, anotaciones): es ideal para paneles personalizados, figuras con múltiples traces y disposiciones de subplots. Empezá con Express y migrá a Graph Objects cuando necesites un control más fino.

**Q7:** La visualización interactiva importa en biotecnología porque: (1) los volcano plots con hover permiten identificar genes específicos por nombre sin saturar el gráfico con etiquetas; (2) los scatter plots 3D de datos de PCA o t-SNE con zoom/rotación permiten identificar agrupaciones visualmente; (3) los paneles con menús desplegables permiten que los biólogos cambien entre métricas de expresión génica sin reescribir código; (4) los scatter plots animados muestran la evolución temporal de datos moleculares.

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
