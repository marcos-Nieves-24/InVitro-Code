# Lab 7: PCA

## Objetivos

- Aplicá PCA para la reducción de dimensionalidad
- Interpretá la varianza explicada y las cargas de los componentes
- Visualizá datos de alta dimensionalidad en 2D
- Entendé el efecto del escalado

## Parte 1: PCA en Iris

Cargá iris, aplicá PCA con 2 componentes y creá un scatter plot coloreado por especie.

**Preguntas:**
- ¿Qué % de la varianza capturan 2 componentes?
- ¿Qué especie queda más claramente separada?

## Parte 2: Scree plot

En el dataset de breast cancer, corré PCA sobre los datos escalados y graficá:
- Gráfico de barras de la varianza explicada individual
- Línea de varianza acumulada
- Líneas de umbral de 90% y 95%

**Pregunta:** ¿Cuántos componentes para 90%? ¿Y para 95%?

## Parte 3: Análisis de cargas

Para PCA en breast cancer con 2 componentes:
1. Examiná las cargas: ¿qué features originales contribuyen más a PC1? ¿Y a PC2?
2. Creá un gráfico de barras de las 5 cargas absolutas principales de cada componente.

**Pregunta:** ¿Podés interpretar qué representan biológicamente PC1 y PC2?

## Parte 4: PCA vs. sin escalado

Creá datos: `np.column_stack([feature1 * 1000, feature2, feature3])` donde todas las features tengan estructura de grupo inherente. Corré PCA con y sin escalado.

**Pregunta:** ¿Cómo cambia el escalado la distribución de la varianza explicada?

## Parte 5: PCA + K-Means

Aplicá PCA para reducir breast cancer a 2 componentes y después corré K-Means (K=2) sobre los datos transformados con PCA. Compará los clusters con las etiquetas reales.

**Pregunta:** ¿Recupera K-Means en el espacio de PCA la división maligno/benigno?

## Entregables

- Notebook con las 5 partes
- Gráfico PCA de iris (Parte 1)
- Scree plot con umbrales (Parte 2)
- Gráfico de barras de cargas (Parte 3)
- Comparación de escalado (Parte 4)
- Comparación PCA + K-Means (Parte 5)

## Tiempo estimado: 45 minutos
