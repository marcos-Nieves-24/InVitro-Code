---
Module: 2
Lesson Number: 17
Lesson Title: Plotly
Estimated Duration: 75 minutos
Prerequisites: L15 — Matplotlib
Learning Objectives:
  - "Crear gráficos interactivos con Plotly Express: scatter, line, bar"
  - "Usar Plotly Graph Objects para personalización avanzada"
  - "Construir subplots y figuras multi-panel con make_subplots"
  - "Agregar interactividad: hover, zoom, dropdowns, sliders"
  - "Exportar figuras a HTML y PNG usando Kaleido"
Keywords: Plotly, Plotly Express, graph_objects, interactividad, subplots, dash, kaleido
Difficulty: Intermediate
Programming Concepts: Visualización interactiva, gráficos web, widgets
Datasets Used: px.data.iris, px.data.tips, px.data.gapminder (datos reales)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Plotly

<Section number={1} title="¿Por qué Plotly?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Plotly genera gráficos web interactivos con zoom, hover, pan y animaciones por default.",
    "Matplotlib y Seaborn no hacen eso sin trabajo extra.",
    "En biotecnología: inspeccionar genes individuales con hover, rotar moléculas en 3D, dashboards interactivos.",
    "En SaaS: la base de Dash para paneles ejecutivos dinámicos.",
    "La progresión es Matplotlib → Seaborn → Plotly → Dash.",
  ]}
/>

<ConceptCard variant="key-idea">
Plotly es una librería de visualización interactiva que genera gráficos web con zoom, hover, pan y animaciones por defecto — algo que Matplotlib y Seaborn no pueden hacer sin trabajo extra. Mientras Matplotlib produce imágenes estáticas, Plotly renderiza figuras como HTML+JavaScript que el usuario puede explorar. En biotecnología, Plotly permite inspeccionar datos de expresión génica con hover que muestra genes individuales, rotar moléculas en 3D y construir dashboards interactivos. En SaaS, es la base de Dash para paneles ejecutivos dinámicos.
</ConceptCard>

En las lecciones anteriores aprendiste Matplotlib (control total, salida estática) y Seaborn (visualización estadística de alto nivel). Plotly agrega la tercera dimensión: **interactividad**. La progresión es: Matplotlib → Seaborn → Plotly → Dash (apps web). Plotly Express (`px`) es el punto de entrada recomendado para creación rápida, y Graph Objects (`go`) para control fino. Al final del módulo vas a combinar Plotly con Dash para construir aplicaciones web de datos.

- Matplotlib: control total, salida estática
- Seaborn: estadística de alto nivel
- Plotly: interactividad web
- Dash: aplicaciones web de datos

</RevealSequence>
</Section>

<Section number={2} title="Arquitectura de Plotly" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Plotly serializa figuras a JSON que Plotly.js interpreta en el navegador.",
    "Usa px para velocidad y go para control fino.",
    "Toda figura es go.Figure con data (trazas) y layout (configuración global).",
  ]}
/>

**¿Qué es Plotly?**

<ConceptCard variant="definition">
Plotly genera figuras como estructuras de árbol serializadas a JSON que Plotly.js interpreta en el navegador. Tres capas:
- **plotly.express (`px`)**: alta abstracción, una llamada = figura completa
- **plotly.graph_objects (`go`)**: control medio, construyes traza por traza
- **Plotly.js**: renderizador JavaScript en el navegador
</ConceptCard>

**La figura Plotly**

Toda figura es un objeto `go.Figure` con dos componentes principales:
- **`data`**: lista de `Trace` (Scatter, Bar, Heatmap, etc.)
- **`layout`**: configuración global (título, ejes, template, hovermode)

**Plotly Express vs Graph Objects** (candidato a tabla → ConceptCard+bullets):

<ConceptCard variant="key-idea">
- **Nivel**: Plotly Express alto (1 llamada), Graph Objects bajo (control total)
- **Código**: mínimo vs más código
- **Personalización**: limitada a args vs ilimitada
- **Subplots**: difícil vs fácil con make_subplots
- **Interactividad**: incorporada en ambos
</ConceptCard>

**Tipos de gráficos clave en Plotly Express**

```python
px.scatter(data_frame=df, x="col1", y="col2", color="category")
px.line(data_frame=df, x="x", y="y")
px.bar(data_frame=df, x="cat", y="value")
px.histogram(data_frame=df, x="col")
px.box(data_frame=df, x="cat", y="value")
px.violin(data_frame=df, x="cat", y="value")
px.pie(data_frame=df, values="val", names="cat")
px.sunburst(data_frame=df, path=["cat1", "cat2"], values="val")
px.scatter_matrix(data_frame=df, dimensions=["col1", "col2", "col3"])
px.imshow(matrix)
```

**Visualización: estructura de una figura Plotly** (candidato a player visual):

```text
Estructura de una Figura Plotly

┌─────────────────────────────────────────┐
│ Figure                                  │
│  ┌───────────────────────────────────┐  │
│  │ Layout                            │  │
│  │  title, width, height, template,  │  │
│  │  xaxis, yaxis, hovermode, ...     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ data[0] — Trace (Scatter)         │  │
│  │  x=[...], y=[...], mode, marker,  │  │
│  │  name, hovertemplate, ...         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ data[1] — Trace (Bar)             │  │
│  │  x=[...], y=[...], marker, ...    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

</RevealSequence>
</Section>

<Section number={3} title="Plotly Express en Acción" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Plotly Express trabaja directamente con DataFrames de Pandas y datasets incorporados.",
    "Una llamada produce una figura interactiva completa.",
    "Prueba cada snippet y explora con hover y zoom.",
  ]}
/>

Plotly Express trabaja directamente con DataFrames de Pandas y datasets incorporados.

**Scatter plot — Iris dataset**

```python
import plotly.express as px

df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species",
                 size="petal_length", hover_data=["petal_width"],
                 title="Iris: Sepal Width vs Sepal Length")
fig.show()
```

**Line plot — Gapminder**

```python
df = px.data.gapminder()
fig = px.line(df[df.country == "Argentina"], x="year", y="gdpPercap",
              title="GDP per cápita de Argentina")
fig.show()
```

**Bar chart — Tips dataset**

```python
df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex", barmode="group",
             title="Cuenta por Día y Sexo")
fig.show()
```

**Histogram y box plot**

```python
df = px.data.tips()

fig = px.histogram(df, x="total_bill", color="sex", nbins=30,
                   title="Distribución de Cuentas")
fig.show()

fig = px.box(df, x="day", y="total_bill", color="sex",
             title="Cuentas por Día")
fig.show()
```

**Sunburst — Población mundial**

```python
df = px.data.gapminder().query("year == 2007")
fig = px.sunburst(df, path=["continent", "country"], values="pop",
                  title="Población Mundial 2007")
fig.show()
```

**Scatter matrix**

```python
df = px.data.iris()
fig = px.scatter_matrix(df, dimensions=["sepal_length", "sepal_width",
                        "petal_length", "petal_width"], color="species")
fig.show()
```

</RevealSequence>
</Section>

<Section number={4} title="Graph Objects y Personalización" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Con go.Figure aramas la figura traza por traza con control total sobre cada elemento.",
    "Mixta px y go: px devuelve go.Figure, así que puedes usar update_layout/update_traces en ambas.",
    "Magic underscore notation acorta el acceso a keys anidadas.",
  ]}
/>

**Graph Objects**

Con `go.Figure()` armas la figura traza por traza, con control total sobre cada elemento.

**Construir desde cero**

```python
import plotly.graph_objects as go
import numpy as np

x = np.linspace(0, 10, 100)
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines", name="sin(x)"))
fig.add_trace(go.Scatter(x=x, y=np.cos(x), mode="lines", name="cos(x)"))
fig.update_layout(title="Funciones Trigonométricas",
                  xaxis_title="x", yaxis_title="y",
                  template="plotly_white",
                  hovermode="x unified")
fig.show()
```

**Actualizar trazas y layout**

```python
fig.update_traces(line=dict(width=3))
fig.update_layout(
    font=dict(size=14),
    legend=dict(title="Función", orientation="h", y=1.1),
    margin=dict(l=40, r=40, t=60, b=40)
)
```

**Magic underscore notation**

Plotly permite notación con guión bajo para acceder a keys anidadas:

```python
# En lugar de:
fig.update_layout(title=dict(text="Mi Título", font=dict(size=20)))
# Escribís:
fig.update_layout(title_text="Mi Título", title_font_size=20)
```

**Heatmap con Graph Objects**

```python
import pandas as pd

df = px.data.iris()
corr = df.select_dtypes(include=[np.number]).corr()
fig = go.Figure(data=go.Heatmap(
    z=corr.values, x=corr.columns, y=corr.index,
    colorscale="RdBu_r", zmin=-1, zmax=1, text=corr.round(2),
    texttemplate="%{text}", textfont=dict(size=10)))
fig.update_layout(title="Matriz de Correlación - Iris", width=500, height=500)
fig.show()
```

</RevealSequence>
</Section>

<Section number={5} title="Subplots y Dashboards" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "make_subplots crea una grilla de subplots para armar dashboards multi-panel.",
    "Agrega trazas a celdas específicas con row/col.",
    "Ideal para reportes EDA con varios gráficos en una sola figura.",
  ]}
/>

**Subplots con make_subplots**

`make_subplots` crea una grilla de subplots donde puedes agregar trazas a celdas específicas.

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=("Scatter", "Histogram", "Box", "Heatmap"),
    specs=[[{"type": "scatter"}, {"type": "xy"}],
           [{"type": "xy"}, {"type": "heatmap"}]])

df = px.data.iris()
fig.add_trace(go.Scatter(x=df.sepal_width, y=df.sepal_length, mode="markers",
              marker=dict(color=df.species.astype("category").cat.codes)),
              row=1, col=1)
fig.add_trace(go.Histogram(x=df.petal_length, nbinsx=20), row=1, col=2)
fig.add_trace(go.Box(y=df.petal_width), row=2, col=1)
corr = df.select_dtypes(include=[np.number]).corr()
fig.add_trace(go.Heatmap(z=corr.values, colorscale="Viridis"), row=2, col=2)

fig.update_layout(height=600, width=900, title_text="Dashboard Iris",
                  showlegend=False)
fig.show()
```

</RevealSequence>
</Section>

<Section number={6} title="Interactividad y Exportación" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Personaliza tooltips con hovertemplate para mostrar datos relevantes.",
    "Agrega dropdowns con updatemenus y sliders con rangeslider.",
    "Exporta a HTML para compartir o PNG/SVG con kaleido.",
  ]}
/>

**Interactividad**

**Hover templates**

Personaliza el tooltip que aparece al pasar el mouse:

```python
fig = px.scatter(px.data.iris(), x="sepal_width", y="sepal_length",
                 color="species", hover_data=["petal_width"])
fig.update_traces(hovertemplate="<b>%{customdata[0]}</b><br>Ancho: %{x}<br>Largo: %{y}")
fig.show()
```

**Dropdown menu**

Agrega un menú desplegable para cambiar entre métricas:

```python
df = px.data.gapminder().query("country.isin(['Argentina', 'Brazil', 'Chile', 'Uruguay'])")
fig = px.line(df, x="year", y="gdpPercap", color="country")
fig.update_layout(
    updatemenus=[dict(
        buttons=[dict(label="GDP", method="update",
                      args=[{"y": [df[df.country == c]["gdpPercap"] for c in df.country.unique()]}]),
                 dict(label="Life Exp", method="update",
                      args=[{"y": [df[df.country == c]["lifeExp"] for c in df.country.unique()]}])],
        direction="down", showactive=True)])
fig.show()
```

**Range slider**

Agrega un slider para navegar rangos en el eje X:

```python
fig.update_layout(xaxis=dict(rangeslider=dict(visible=True), type="linear"))
```

**Exportación**

```python
fig.write_html("grafico.html")       # HTML interactivo (recomendado)
fig.write_image("grafico.png")       # PNG estático (requiere kaleido)
fig.write_image("grafico.svg")       # SVG vectorial
# Instalar kaleido: pip install kaleido
```

</RevealSequence>
</Section>

<Section number={7} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Volcano plot para expresión génica diferencial y dashboard SaaS de métricas.",
    "Plotly permite hover sobre cada gen para inspeccionar valores.",
    "Dash Bio extiende Plotly con componentes bioinformáticos.",
  ]}
/>

**Ejemplo de biotecnología — Volcano plot**

**Escenario**: visualizar resultados de un experimento de expresión génica diferencial.

```python
import numpy as np
import pandas as pd
import plotly.express as px

np.random.seed(42)
n_genes = 500
genes = [f"GENE_{i}" for i in range(n_genes)]
log2fc = np.random.randn(n_genes) * 1.5
pvalues = np.random.uniform(0, 1, n_genes)
log2fc[:30] = np.random.randn(30) * 0.5 + 3
pvalues[:30] = np.random.uniform(0, 0.001, 30)
neg_log10_p = -np.log10(pvalues)

df = pd.DataFrame({
    "Gene": genes, "log2FC": log2fc, "neg_log10_p": neg_log10_p,
    "Significant": ["Significant" if (abs(log2fc[i]) > 1.5 and pvalues[i] < 0.05)
                     else "Not Significant" for i in range(n_genes)]})

fig = px.scatter(df, x="log2FC", y="neg_log10_p", color="Significant",
                 hover_data=["Gene"], opacity=0.6,
                 title="Volcano Plot — Expresión Génica Diferencial")
fig.add_hline(y=-np.log10(0.05), line_dash="dash", line_color="grey")
fig.add_vline(x=1.5, line_dash="dash", line_color="grey")
fig.add_vline(x=-1.5, line_dash="dash", line_color="grey")
fig.show()
```

**Ejemplo SaaS — Dashboard de métricas**

```python
months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
df = pd.DataFrame({
    "Mes": months * 3,
    "Métrica": ["Ingresos ($K)"]*6 + ["Usuarios"]*6 + ["Churn (%)"]*6,
    "Valor": [50, 55, 62, 68, 75, 82, 1000, 1100, 1250, 1400, 1550, 1700,
              5.2, 4.8, 4.5, 4.2, 3.9, 3.5]})

fig = px.line(df, x="Mes", y="Valor", color="Métrica", markers=True,
              title="Dashboard SaaS - Métricas Mensuales")
fig.update_layout(legend_title="Métrica",
                  hovermode="x unified",
                  template="plotly_white")
fig.show()
```

**Siguiente paso: Dash Bio**

Dash Bio extiende Plotly con componentes bioinformáticos: AlignmentChart, NeedlePlot, OncoPrint, VolcanoPlot, Molecule3DViewer, SequenceViewer. Permite construir dashboards interactivos para visualización genómica sin escribir JavaScript.

</RevealSequence>
</Section>

<Section number={8} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los errores típicos de Plotly son de entorno (kaleido) y de volumen de datos en el navegador.",
    "Empieza con px y migra a go cuando necesites control fino.",
    "Configura hovermode temprano para mejorar la experiencia.",
  ]}
/>

**Errores comunes**

- **No instalar kaleido**: `fig.write_image()` falla sin `pip install kaleido`
- **Olvidar `fig.show()`**: en scripts la figura no se renderiza sin `fig.show()`
- **Mezclar px y go sin entender el flujo**: `px` devuelve `go.Figure` — puedes usar `.update_layout()` y `.update_traces()` en figuras de Express
- **Muchos datos sin downsampling**: Plotly renderiza en el navegador; más de ~100k puntos puede colgar el browser. Usa `sample()` o agregación
- **No configurar hovermode**: el valor por defecto no siempre es el más útil; usa `hovermode="x unified"` para series temporales

**Buenas prácticas**

- Empieza con `px` y migra a `go` cuando necesitas control fino
- Usa templates incorporados: `"plotly_white"`, `"plotly_dark"`, `"seaborn"`, `"ggplot2"`
- Configura `hovermode` temprano para mejorar la experiencia
- Exporta a HTML para compartir — `write_html()` produce un archivo standalone
- Usa `fig.update_layout(margin=dict(...))` para controlar bordes
- Para presentaciones, exporta a SVG con `write_image("fig.svg")`

</RevealSequence>
</Section>

<Section number={9} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Plotly Express para velocidad, Graph Objects para control fino.",
    "fig.show() renderiza; write_html() exporta standalone.",
    "Hover, zoom y dropdowns son la razón de ser de Plotly.",
  ]}
/>

<ConceptCard variant="key-idea">
Plotly combina interactividad (hover, zoom, dropdowns) con dos APIs: Express para crear rápido y Graph Objects para control fino traza por traza.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "plotly-express", label: "Plotly Express", detail: "px para creación rápida de gráficos interactivos." },
    { id: "graph-objects", label: "Graph Objects", detail: "go para control total traza por traza." },
    { id: "fig-show", label: "fig.show()", detail: "Renderiza en el navegador o en Jupyter." },
    { id: "fig-write-html", label: "fig.write_html()", detail: "Exporta a archivo HTML standalone." },
    { id: "make-subplots", label: "make_subplots()", detail: "Dashboards multi-panel." },
    { id: "update-layout-traces", label: "update_layout/update_traces", detail: "Personalizan cualquier figura." },
    { id: "menus-sliders", label: "Menús y sliders", detail: "updatemenus y rangeslider para interactividad." },
    { id: "kaleido", label: "Kaleido", detail: "Necesario para exportar a PNG/SVG." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "trace", label: "Trace", detail: "Una capa visual en la figura (Scatter, Bar, Heatmap, etc.)." },
    { id: "layout", label: "Layout", detail: "Configuración global de la figura (título, ejes, template)." },
    { id: "figure", label: "Figure", detail: "Objeto contenedor con data + layout." },
    { id: "plotly-express-g", label: "Plotly Express", detail: "API de alto nivel para creación rápida." },
    { id: "graph-objects-g", label: "Graph Objects", detail: "API de bajo nivel para control fino." },
    { id: "kaleido-g", label: "Kaleido", detail: "Motor de renderizado estático para exportar imágenes." },
    { id: "dash", label: "Dash", detail: "Framework para apps web basado en Plotly." },
    { id: "updatemenu", label: "updatemenu", detail: "Menú desplegable interactivo." },
    { id: "rangeslider", label: "rangeslider", detail: "Slider para navegar rangos en el eje X." },
    { id: "hovertemplate", label: "hovertemplate", detail: "Plantilla para personalizar tooltips." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué motor necesita Plotly para exportar figuras a PNG o SVG?"
  moduleSlug="python"
  lessonSlug="lesson17_plotly"
  blockId="choice-python-l17-resumen-1"
  allowContinueOnIncorrect
  explanation="Kaleido es el motor de renderizado estático que permite escribir imágenes desde una Figure."
  options={[
    { id: "a", label: "Kaleido", correct: true, feedback: "¡Exacto! Sin Kaleido no se pueden exportar imágenes estáticas." },
    { id: "b", label: "Matplotlib", correct: false, feedback: "Plotly no usa Matplotlib para exportar." },
    { id: "c", label: "Dash", correct: false, feedback: "Dash es para apps web, no para render estático." },
    { id: "d", label: "Pillow", correct: false, feedback: "Pillow no es el motor de Plotly." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Plotly completo! El bloque de visualización quedó listo: llevá estos gráficos interactivos a los módulos de Estadística y Machine Learning.
</MascotMessage>

</RevealSequence>
</Section>

<Section number={10} title="Evaluación" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

**Ejercicios**

**Nivel 1: Básico**

1. ¿Qué tipo de objeto devuelve una función de Plotly Express como `px.scatter()`?
2. ¿Cómo agregas una segunda traza a una figura existente de Graph Objects?
3. ¿Cuál es la diferencia entre `fig.show()` y `fig.write_html()`?

**Nivel 2: Implementación**

4. Usando `px.data.tips()`, crea un scatter plot de `total_bill` vs `tip` coloreado por `time` y con tamaño según `size`.
5. Construye una figura con `go.Figure()` que contenga dos trazas: un scatter y una línea, con template "plotly_dark".

**Nivel 3: Pensamiento Crítico**

6. ¿Cuándo conviene usar Plotly Express y cuándo Graph Objects? ¿Qué tradeoffs existen?
7. ¿Por qué es importante la interactividad en visualización de datos biotecnológicos? ¿Dónde agregarías hover, zoom y dropdowns en un volcano plot?

**Desafío de código**

Crea un **scatter 3D interactivo** usando `px.scatter_3d()` del dataset iris:
1. Usa `px.data.iris()` como fuente de datos
2. Ejes: `sepal_length` (x), `sepal_width` (y), `petal_length` (z)
3. Color por `species`
4. Tamaño de los puntos según `petal_width`
5. Agrega hover_data mostrando todas las columnas
6. Exporta la figura a `iris_3d.html`

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Qué tipo de objeto devuelve una función de Plotly Express como px.scatter()?"
  moduleSlug="python"
  lessonSlug="lesson17_plotly"
  blockId="choice-python-l17-tema-1"
  allowContinueOnIncorrect
  explanation="Plotly Express devuelve un objeto go.Figure, por eso puedes llamar update_layout y update_traces."
  options={[
    { id: "a", label: "Un objeto go.Figure", correct: true, feedback: "¡Correcto! px devuelve una Figure estándar." },
    { id: "b", label: "Un DataFrame de Pandas", correct: false, feedback: "No: no devuelve datos tabulares." },
    { id: "c", label: "Una imagen PNG", correct: false, feedback: "No renderiza hasta fig.show()." },
    { id: "d", label: "Un dict de Python crudo", correct: false, feedback: "La Figure encapsula el dict; no lo devuelve directo." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre fig.show() y fig.write_html()?"
  moduleSlug="python"
  lessonSlug="lesson17_plotly"
  blockId="choice-python-l17-tema-2"
  allowContinueOnIncorrect
  explanation="show() renderiza la figura en el entorno actual; write_html() exporta un archivo HTML standalone compartible."
  options={[
    { id: "a", label: "show() renderiza; write_html() exporta archivo standalone", correct: true, feedback: "¡Correcto!" },
    { id: "b", label: "Ambos hacen lo mismo", correct: false, feedback: "No: uno muestra, el otro persiste." },
    { id: "c", label: "write_html() solo guarda PNG", correct: false, feedback: "HTML, no PNG." },
    { id: "d", label: "show() genera un archivo", correct: false, feedback: "show() no persiste a disco." },
  ]}
/>

</RevealSequence>
</Section>
