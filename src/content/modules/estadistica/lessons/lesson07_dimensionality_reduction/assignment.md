# Assignment: Análisis de PCA

## Objetivos

- Aplicar PCA para analizar datos de alta dimensionalidad
- Determinar la cantidad óptima de componentes
- Interpretar los componentes principales en términos de los features originales

## Instrucciones

1. Carga el dataset de cáncer de mama de sklearn:
```python
from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()
```

2. **Estandarización**: Estandariza los 30 features

3. **Aplicación de PCA**:
   - Aplica PCA conservando todos los componentes
   - Crea un scree plot con la varianza explicada acumulada
   - Determina la cantidad de componentes necesarios para el 80%, 90% y 95% de la varianza explicada

4. **Visualización 2D**:
   - Proyecta los datos sobre PC1 y PC2
   - Crea un scatter plot coloreado por diagnóstico (maligno vs benigno)
   - Interpreta la separación

5. **Análisis de cargas**:
   - Extrae los 5 features principales que contribuyen a PC1
   - Extrae los 5 features principales que contribuyen a PC2
   - Interpreta PC1 y PC2 biológicamente (¿qué tipos de features dominan?)

6. **Reconstrucción**:
   - Conserva solo los primeros N componentes (donde N explica el 90% de la varianza)
   - Reconstruye los datos y calcula el MSE de reconstrucción
   - Discutí la pérdida de información

7. **Informe**: Escribe un resumen que interprete qué revela PCA sobre el dataset de cáncer de mama

