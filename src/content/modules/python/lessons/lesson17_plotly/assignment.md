# Assignment: Panel interactivo de exploración de datos

## Objetivos

- Usar Plotly Express para crear visualizaciones interactivas
- Trabajar con datasets integrados reales (gapminder)
- Crear scatter plots animados con `animation_frame`
- Construir sunburst charts de múltiples niveles
- Agregar interactividad con menús desplegables para cambiar métricas
- Exportar paneles HTML interactivos

## Instrucciones

Crea un script de Python `gapminder_dashboard.py` que:

1. **Cargue datos**: usa `px.data.gapminder()` para obtener el dataset

2. **Cree 3 visualizaciones**:

   a. **Scatter plot animado**: usa `px.scatter()` con:
      - `x="gdpPercap"`, `y="lifeExp"`, `size="pop"`, `color="continent"`
      - `animation_frame="year"` para la animación a lo largo de los años
      - `log_x=True` para la escala logarítmica del PBI
      - Título: "Evolución Global: GDP vs Esperanza de Vida"

   b. **Histograma de esperanza de vida**: usa `px.histogram()` con:
      - `x="lifeExp"`, `color="continent"`, `nbins=40`
      - Filtra los datos para `year == 2007`
      - Título: "Distribución de Esperanza de Vida por Continente (2007)"

   c. **Sunburst**: usa `px.sunburst()` con:
      - `path=["continent", "country"]`, `values="pop"`
      - Filtra los datos para `year == 2007`
      - Título: "Población Mundial por Continente y País"

3. **Agrega interactividad con menús desplegables**:

   Crea un line chart que muestre 4 países a elección a lo largo del tiempo, con un menú desplegable para cambiar entre estas métricas:
   - `gdpPercap` (PBI per cápita)
   - `lifeExp` (Esperanza de vida)
   - `pop` (Población)

   Usa `fig.update_layout(updatemenus=[...])` para implementar el menú desplegable.

4. **Exportación**: guarda el panel final como `exploracion.html`

