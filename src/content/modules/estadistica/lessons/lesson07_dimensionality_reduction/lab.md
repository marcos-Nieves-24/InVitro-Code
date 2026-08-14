# Lab: Reducción de dimensionalidad con PCA

## Objetivo

Aplicá PCA a datos de alta dimensionalidad reales y sintéticos e interpretá los resultados.

## Duración

60 minutos

## Dataset

Dataset Wine de sklearn.

## Instrucciones

### Parte 1: PCA sobre el dataset Wine (20 min)
1. Cargá el dataset wine
2. Estandarizá los features
3. Aplicá PCA (conservá todos los componentes)
4. Graficá el scree plot con la varianza explicada acumulada
5. ¿Cuántos componentes explican el 90% de la varianza?

### Parte 2: Visualización 2D (15 min)
1. Proyectá los datos sobre los primeros 2 PCs
2. Creá un scatter plot coloreado por cultivar
3. Interpretá: ¿los cultivares son separables?

### Parte 3: Análisis de cargas (15 min)
1. Extraé las cargas de PC1 y PC2
2. Identificá los 3 features principales que contribuyen a cada uno
3. Creá un heatmap de las cargas
4. Interpretá PC1 y PC2 en términos de los features originales

### Parte 4: Impacto de la reducción de dimensionalidad (10 min)
1. Reconstruí los datos usando solo los primeros 3 PCs
2. Calculá el error de reconstrucción (MSE entre el original y el reconstruido)
3. Discutí: ¿cuánta información se pierde?

## Entregables

- Notebook de Jupyter con todos los análisis e interpretaciones

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Aplicación de PCA y scree plot | 3 |
| Visualización 2D con interpretación | 2 |
| Análisis de cargas | 3 |
| Análisis de reconstrucción | 2 |
Total: 10 puntos
