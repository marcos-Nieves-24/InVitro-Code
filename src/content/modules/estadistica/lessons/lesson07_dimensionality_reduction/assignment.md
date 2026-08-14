# Assignment: Análisis de PCA

## Objetivos

- Aplicar PCA para analizar datos de alta dimensionalidad
- Determinar la cantidad óptima de componentes
- Interpretar los componentes principales en términos de los features originales

## Instrucciones

1. Cargá el dataset de cáncer de mama de sklearn:
```python
from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()
```

2. **Estandarización**: Estandarizá los 30 features

3. **Aplicación de PCA**:
   - Aplicá PCA conservando todos los componentes
   - Creá un scree plot con la varianza explicada acumulada
   - Determiná la cantidad de componentes necesarios para el 80%, 90% y 95% de la varianza explicada

4. **Visualización 2D**:
   - Proyectá los datos sobre PC1 y PC2
   - Creá un scatter plot coloreado por diagnóstico (maligno vs benigno)
   - Interpretá la separación

5. **Análisis de cargas**:
   - Extraé los 5 features principales que contribuyen a PC1
   - Extraé los 5 features principales que contribuyen a PC2
   - Interpretá PC1 y PC2 biológicamente (¿qué tipos de features dominan?)

6. **Reconstrucción**:
   - Conservá solo los primeros N componentes (donde N explica el 90% de la varianza)
   - Reconstruí los datos y calculá el MSE de reconstrucción
   - Discutí la pérdida de información

7. **Informe**: Escribí un resumen que interprete qué revela PCA sobre el dataset de cáncer de mama

## Entregables

- Notebook de Jupyter con código, gráficos e interpretaciones escritas

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Deficiente (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Aplicación de PCA | Correcta con todos los pasos | Problemas menores | Parcial | Faltante |
| Scree + selección de componentes | Clara y justificada | Básica | Confusa | Faltante |
| Visualización 2D | Informativa con interpretación | Buen gráfico | Básica | Faltante |
| Análisis de cargas | Interpretación con insight | Buena | Superficial | Faltante |
| Reconstrucción | Correcta con discusión | Correcta solamente | Incompleta | Faltante |
| Resumen escrito | Síntesis excelente | Bueno | Básico | Faltante |

**Total: 24 puntos**

## Tiempo estimado

3 horas
