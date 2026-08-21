# Lab: Explicando modelos de caja negra con LIME y SHAP

## Objetivo

Usar LIME y SHAP para explicar predicciones de un modelo de caja negra. Comparar las explicaciones y evaluar su confiabilidad.

## Duración

60 minutos

## Requisitos previos

Lección 3, Python (pandas, sklearn, lime, shap)

## Dataset

Usamos el dataset de Vino UCI (incluido en sklearn) para una tarea de clasificación multiclase.

## Instrucciones

### Parte 1: Preparación de datos y entrenamiento del modelo (10 minutos)

1. Carga el dataset de Vino con `sklearn.datasets.load_wine`.
2. Divídelo en conjuntos de entrenamiento y prueba.
3. Entrena un clasificador Random Forest con 200 árboles.
4. Reporta la accuracy en el conjunto de prueba.

### Parte 2: Explicación global (10 minutos)

1. Extrae y visualiza la importancia de features incorporada en el Random Forest.
2. Calcula y visualiza el SHAP summary plot (explicación global).
3. Compara las dos explicaciones globales. ¿Coinciden en las 3 features principales?

### Parte 3: Explicación local con LIME (15 minutos)

1. Selecciona dos instancias de prueba: una clasificada correctamente y una mal clasificada.
2. Para cada instancia, genera una explicación LIME.
3. Muestra la explicación como un gráfico de barras que muestre las contribuciones de las features.
4. ¿Las explicaciones sugieren por qué ocurrió la clasificación errónea?

### Parte 4: Explicación local con SHAP (15 minutos)

1. Para las mismas dos instancias, genera SHAP waterfall plots.
2. Compara las explicaciones de SHAP y LIME para cada instancia.
3. ¿Coinciden los métodos? ¿En qué se diferencian?

### Parte 5: Análisis de estabilidad (10 minutos)

1. Ejecuta LIME 5 veces sobre la misma instancia.
2. Registra las 3 features principales cada vez.
3. ¿Es estable LIME? ¿Cuál es la varianza en la importancia de las features?
4. Repite con SHAP. ¿Es SHAP más estable?

## Entregables

Envía un notebook de Jupyter con:
- Todo el código y las visualizaciones
- Celdas de markdown que respondan las preguntas de comparación
- Un párrafo final que resuma tus hallazgos

## Rúbrica

| Criterio | Puntos | Excelente | Bueno | Satisfactorio | Necesita mejorar |
|-----------|--------|-----------|------|--------------|-------------------|
| Entrenamiento y evaluación del modelo | 15 | Correcto con análisis | Correcto | Errores menores | No funciona |
| Explicaciones globales | 20 | Ambos métodos, comparados | Ambos métodos | Un método | Faltantes |
| Explicaciones locales | 25 | Ambas instancias, ambos métodos | Parcial | Una instancia/un método | Faltantes |
| Análisis de estabilidad | 25 | Riguroso con interpretación | Realizado con observaciones | Intentado | Faltante |
| Discusión | 15 | Comparación perspicaz | Buenas observaciones | Básica | Faltante |
