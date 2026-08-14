# Assignment: Panel interactivo de exploración de datos

## Objetivos

- Usar Plotly Express para crear visualizaciones interactivas
- Trabajar con datasets integrados reales (gapminder)
- Crear scatter plots animados con `animation_frame`
- Construir sunburst charts de múltiples niveles
- Agregar interactividad con menús desplegables para cambiar métricas
- Exportar paneles HTML interactivos

## Instrucciones

Creá un script de Python `gapminder_dashboard.py` que:

1. **Cargue datos**: usá `px.data.gapminder()` para obtener el dataset

2. **Cree 3 visualizaciones**:

   a. **Scatter plot animado**: usá `px.scatter()` con:
      - `x="gdpPercap"`, `y="lifeExp"`, `size="pop"`, `color="continent"`
      - `animation_frame="year"` para la animación a lo largo de los años
      - `log_x=True` para la escala logarítmica del PBI
      - Título: "Evolución Global: GDP vs Esperanza de Vida"

   b. **Histograma de esperanza de vida**: usá `px.histogram()` con:
      - `x="lifeExp"`, `color="continent"`, `nbins=40`
      - Filtrá los datos para `year == 2007`
      - Título: "Distribución de Esperanza de Vida por Continente (2007)"

   c. **Sunburst**: usá `px.sunburst()` con:
      - `path=["continent", "country"]`, `values="pop"`
      - Filtrá los datos para `year == 2007`
      - Título: "Población Mundial por Continente y País"

3. **Agregá interactividad con menús desplegables**:

   Creá un line chart que muestre 4 países a elección a lo largo del tiempo, con un menú desplegable para cambiar entre estas métricas:
   - `gdpPercap` (PBI per cápita)
   - `lifeExp` (Esperanza de vida)
   - `pop` (Población)

   Usá `fig.update_layout(updatemenus=[...])` para implementar el menú desplegable.

4. **Exportación**: guardá el panel final como `exploracion.html`

## Entregables

- `gapminder_dashboard.py`
- `exploracion.html` (exportado desde tu script)

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Visualizaciones | 3+ gráficos con datos correctos | 2-3 gráficos | < 2 gráficos |
| Animación | Scatter con animation_frame funciona correctamente | Animación presente pero con bugs | Sin animación |
| Interactividad | Menú desplegable funciona + hover/zoom | Menú desplegable funciona | Sin interactividad |
| Exportación | HTML renderiza de forma independiente, totalmente interactivo | HTML funciona | Sin exportación |
| Calidad del código | Limpio, bien estructurado, documentado | Legible | Mala estructura |

## Tiempo estimado

90 minutos
