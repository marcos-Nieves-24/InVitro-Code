# Lab: Clustering con K-Means

## Objetivo

Aplicá clustering K-Means para segmentar datos y evaluá la calidad de los clusters.

## Duración

60 minutos

## Dataset

El dataset `penguins` de seaborn.

## Instrucciones

### Parte 1: Preparación de datos (10 min)
1. Cargá penguins y eliminá los valores faltantes
2. Seleccioná los features numéricos: bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g
3. Estandarizá los features

### Parte 2: Búsqueda del k óptimo (15 min)
1. Ejecutá K-Means para k = 2 a 8
2. Registrá la inercia y el silhouette score para cada k
3. Graficá la curva del codo y los silhouette scores lado a lado
4. Determiná el k óptimo

### Parte 3: Clustering y visualización (15 min)
1. Aplicá K-Means con el k óptimo
2. Usá PCA para proyectar los datos a 2D
3. Creá un scatter plot coloreado por cluster con los centroides marcados

### Parte 4: Interpretación de los clusters (20 min)
1. Calculá los valores medios de los features por cluster
2. Creá una tabla de perfil
3. Compará las asignaciones de cluster con las especies reales (tabla de contingencia)
4. Escribí una interpretación de un párrafo sobre las características de cada cluster

## Entregables

- Notebook de Jupyter con código, gráficos e interpretaciones

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Análisis del codo + silhouette | 3 |
| Aplicación de K-Means | 2 |
| Visualización con PCA | 2 |
| Interpretación de los clusters | 3 |
Total: 10 puntos
