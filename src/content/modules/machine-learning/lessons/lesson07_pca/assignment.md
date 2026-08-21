# Assignment 7: PCA

## Objetivos

- Aplica PCA a un dataset biológico de alta dimensionalidad
- Determina el número óptimo de componentes
- Interpreta los componentes en términos biológicos
- Usa PCA como paso de preprocesamiento para la clasificación

## Dataset

Usa el dataset de **Breast Cancer** (30 features, 569 samples).

## Escenario

Estás analizando datos de pacientes de alta dimensionalidad. Necesitas:
1. Reducir la dimensionalidad para la visualización
2. Determinar cuántas dimensiones capturan la estructura esencial
3. Entender qué representa cada componente
4. Probar si PCA mejora el rendimiento de clasificación

## Instrucciones

1. **Escala los datos** con StandardScaler
2. **PCA completo:** calcula y grafica la varianza explicada; determina n para 80%, 90%, 95%, 99%
3. **Interpreta los componentes:** para PC1 y PC2, lista las 5 features principales por magnitud de carga. ¿Qué tema biológico representa cada componente?
4. **Experimento de clasificación:**
   - Entrena una LogisticRegression con las 30 features originales (escaladas)
   - Entrena LogisticRegression con los datos reducidos por PCA (2, 5, 10 componentes)
   - Entrena LogisticRegression con los datos reducidos por PCA (n óptima para 90%)
   - Compara las exactitudes de prueba
5. **Conclusión final:** ¿PCA mejora o perjudica la clasificación? ¿Por qué?

