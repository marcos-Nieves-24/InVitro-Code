# Assignment 6: Agrupamiento K-Means

## Objetivos

- Agrupá datos biológicos reales para descubrir subtipos novedosos
- Determiná la K óptima usando múltiples métricas
- Interpretá los perfiles de los clusters en contexto biológico
- Visualizá clusters de alta dimensionalidad con PCA

## Dataset

Usá el dataset de **Breast Cancer** de scikit-learn — pero tratálo como un dataset sin etiquetar para el agrupamiento (ignorá las etiquetas reales durante el entrenamiento, usalas solo para la evaluación).

```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data  # No labels during training!
```

## Escenario

Sos un investigador estudiando la heterogeneidad del breast cancer. Creés que existen subtipos moleculares más allá de la clasificación estándar maligno/benigno. Usá K-Means para descubrir posibles subtipos.

## Instrucciones

1. **Escalá las features** con StandardScaler
2. **Determiná la K óptima** usando el codo, la silueta y conocimiento del dominio (K=2..10)
3. **Agrupá con la K óptima**
4. **Visualizá los clusters** usando PCA (scatter 2D con colores de cluster)
5. **Perfilá los clusters** — calculá la media de cada feature para cada cluster
6. **Compará con las etiquetas reales** — creá una tabla cruzada. ¿Recuperó K-Means la división maligno/benigno? ¿O descubrió algo diferente?
7. **Interpretá** — ¿qué distingue clínicamente a cada cluster?

