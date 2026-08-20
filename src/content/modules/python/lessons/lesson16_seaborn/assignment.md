# Assignment: Visualización de segmentación de clientes

## Objetivos

- Usar Seaborn para crear visualizaciones estadísticas
- Explorar relaciones multivariables con pairplots y heatmaps
- Personalizar temas y paletas de Seaborn
- Crear un informe completo de EDA (análisis exploratorio de datos)

## Instrucciones

Creá un script de Python `customer_segmentation_viz.py` que:

1. **Genere datos sintéticos**: 300 clientes con:
   - `age`: 18-70
   - `income`: 20k-150k
   - `spending_score`: 1-100
   - `membership_years`: 0-10
   - `region`: North, South, East, West
   - `segment`: Low, Medium, High (basado en los percentiles de spending_score)

2. **Cree visualizaciones**:
   - Pairplot de las características numéricas coloreado por segment (usá `sns.pairplot`)
   - Heatmap de correlación de todas las características numéricas
   - Box plot de spending_score por region, coloreado por segment
   - Violin plot de income por segment
   - Count plot de los segmentos por region (usá `sns.countplot`)
   - Histograma de age con KDE, coloreado por segment (usá `sns.histplot`)
   - Scatter estilo 3D de income vs. spending_score con hue=segment y size=membership_years

3. **Personalización**:
   - Aplicá `sns.set_theme(style="whitegrid")`
   - Usá una paleta de colores personalizada: `sns.color_palette("viridis", 3)`
   - Todos los gráficos deben tener títulos y etiquetas de ejes apropiadas

4. **Disposición**: organizá al menos 4 gráficos en una figura de subplots 2×2

5. **Guardá** la figura combinada como `segmentation_analysis.png`

