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

## Entregables

- Notebook con todos los pasos
- Gráficos de codo + silueta
- Visualización PCA de los clusters
- Tabla de perfiles de cluster (valores medios de features por cluster)
- Tabla cruzada de clusters vs. diagnóstico real
- Informe (máx. 300 palabras):
  - ¿Cuál es la K óptima y por qué?
  - ¿Coincidieron los clusters con maligno/benigno?
  - ¿Qué hipótesis biológica propondrías?

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| Selección de K | Codo + silueta + justificación | Un método | Sin método | Faltante |
| Perfil de clusters | Medias de features + interpretación | Medias de features | Básico | Faltante |
| Visualización | Gráfico PCA con clusters claros | Gráfico PCA | Gráfico básico | Faltante |
| Interpretación biológica | Hipótesis con insights | Clara | Vaga | Faltante |
| Calidad del código | Limpio, bien documentado | Legible | Desordenado | No corre |

## Tiempo estimado: 2 horas
