# Lab: Narración de datos

## Objetivo

Creá visualizaciones efectivas y una historia de datos a partir de un dataset real.

## Duración

60 minutos

## Dataset

El dataset `tips` de seaborn.

## Instrucciones

### Parte 1: Criticá una visualización (10 min)
```python
tips = sns.load_dataset('tips')
```

1. Creá visualizaciones intencionalmente malas (gráfico de torta 3D, gráfico de barras arcoíris, eje y truncado)
2. En markdown, enumerá qué está mal en cada una

### Parte 2: Rediseño (15 min)
Para una de las visualizaciones "malas" anteriores:
1. Rediseñala siguiendo las mejores prácticas
2. Usá el tipo de gráfico apropiado
3. Usá una paleta apta para daltonismo
4. Agregá etiquetas claras, título y anotaciones

### Parte 3: Análisis guiado por la historia (20 min)
Creá una historia de datos sobre el comportamiento de las propinas:
1. Gancho: "Los mozos ganan el 70% de sus ingresos por propinas: ¿qué factores afectan el monto de la propina?"
2. Creá 3 visualizaciones que muestren relaciones:
   - Monto de propina por día de la semana
   - Porcentaje de propina por tamaño del grupo
   - Monto de propina por momento (almuerzo vs cena) y sexo
3. Agregá anotaciones y una narrativa clara

### Parte 4: Mini-tablero (15 min)
Creá un diseño de tablero de 2×2 con:
- Distribución de la cuenta total (histograma)
- Propina vs cuenta total (scatter plot con línea de regresión)
- Propina promedio por día (gráfico de barras)
- Porcentaje de propina por condición de fumador (boxplot)

Usá colores consistentes, títulos claros y un suptítulo a nivel de figura.

## Entregables

- Notebook de Jupyter con visualizaciones malas/buenas, historia y tablero

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Crítica y rediseño | 3 |
| Análisis guiado por la historia | 3 |
| Diseño del tablero | 2 |
| Mejores prácticas seguidas | 2 |
Total: 10 puntos
