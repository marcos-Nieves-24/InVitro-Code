# Assignment 7: PCA

## Objetivos

- Aplicá PCA a un dataset biológico de alta dimensionalidad
- Determiná el número óptimo de componentes
- Interpretá los componentes en términos biológicos
- Usá PCA como paso de preprocesamiento para la clasificación

## Dataset

Usá el dataset de **Breast Cancer** (30 features, 569 samples).

## Escenario

Estás analizando datos de pacientes de alta dimensionalidad. Necesitás:
1. Reducir la dimensionalidad para la visualización
2. Determinar cuántas dimensiones capturan la estructura esencial
3. Entender qué representa cada componente
4. Probar si PCA mejora el rendimiento de clasificación

## Instrucciones

1. **Escalá los datos** con StandardScaler
2. **PCA completo:** calculá y graficá la varianza explicada; determiná n para 80%, 90%, 95%, 99%
3. **Interpretá los componentes:** para PC1 y PC2, listá las 5 features principales por magnitud de carga. ¿Qué tema biológico representa cada componente?
4. **Experimento de clasificación:**
   - Entrená una LogisticRegression con las 30 features originales (escaladas)
   - Entrená LogisticRegression con los datos reducidos por PCA (2, 5, 10 componentes)
   - Entrená LogisticRegression con los datos reducidos por PCA (n óptima para 90%)
   - Compará las exactitudes de prueba
5. **Conclusión final:** ¿PCA mejora o perjudica la clasificación? ¿Por qué?

