# Assignment 6: Agrupamiento K-Means

## Objetivos

- Agrupa datos biológicos reales para descubrir subtipos novedosos
- Determina la K óptima usando múltiples métricas
- Interpreta los perfiles de los clusters en contexto biológico
- Visualiza clusters de alta dimensionalidad con PCA

## Dataset

Usa el dataset de **Breast Cancer** de scikit-learn — pero trátalo como un dataset sin etiquetar para el agrupamiento (ignora las etiquetas reales durante el entrenamiento, úsalas solo para la evaluación).

```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data  # No labels during training!
```

## Escenario

Eres un investigador estudiando la heterogeneidad del breast cancer. Crees que existen subtipos moleculares más allá de la clasificación estándar maligno/benigno. Usa K-Means para descubrir posibles subtipos.

## Instrucciones

1. **Escala las features** con StandardScaler
2. **Determina la K óptima** usando el codo, la silueta y conocimiento del dominio (K=2..10)
3. **Agrupa con la K óptima**
4. **Visualiza los clusters** usando PCA (scatter 2D con colores de cluster)
5. **Perfila los clusters** — calcula la media de cada feature para cada cluster
6. **Compara con las etiquetas reales** — crea una tabla cruzada. ¿Recuperó K-Means la división maligno/benigno? ¿O descubrió algo diferente?
7. **Interpreta** — ¿qué distingue clínicamente a cada cluster?

