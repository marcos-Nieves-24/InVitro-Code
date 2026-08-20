# Assignment: Panel de visualización exploratoria

## Objetivos

- Crear una variedad de tipos de gráficos para la exploración de datos
- Personalizar figuras con estilo profesional
- Usar subplots para crear paneles con múltiples gráficos
- Guardar figuras para informes

## Instrucciones

Creá un script de Python `viz_dashboard.py` que genere una figura de panel con múltiples gráficos para un dataset sintético:

1. **Generá datos**: creá un DataFrame con 500 muestras y las siguientes columnas:
   - `date`: 500 fechas consecutivas
   - `revenue`: random walk (camino aleatorio) que empieza en 1000
   - `users`: correlacionado con revenue + ruido
   - `conversion_rate`: entre 2% y 5%
   - `category`: A, B o C

2. **Creá una figura de panel 2×3**:
   - (1,1) Ingresos a lo largo del tiempo (line plot)
   - (1,2) Usuarios vs. ingresos (scatter plot)
   - (1,3) Histograma de la tasa de conversión
   - (2,1) Ingresos por categoría (gráfico de barras)
   - (2,2) Distribución de ingresos (box plot)
   - (2,3) Heatmap de correlación de las columnas numéricas

3. **Personalización**:
   - Usá un estilo profesional (`seaborn-v0_8` o `ggplot`)
   - Todos los ejes etiquetados con títulos apropiados
   - Esquema de colores consistente
   - Líneas de cuadrícula con alpha bajo
   - Aplicá `tight_layout()`

4. **Guardá** el panel como PNG y como SVG

