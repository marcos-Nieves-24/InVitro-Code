# Assignment: Exploración de Features

## Objetivos

- Cargar y explorar el dataset Breast Cancer Wisconsin usando scikit-learn
- Calcular estadísticas descriptivas por feature y por clase
- Crear visualizaciones que revelen patrones en los datos
- Interpretar los resultados en el contexto de clasificación

## Instrucciones

1. Cargá el dataset Breast Cancer Wisconsin:
```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data
y = data.target
```

2. Para cada una de las 30 features, calculá:
   - Media, mediana, desviación estándar
   - Mínimo y máximo
   - Rango intercuartílico (IQR)

3. Creá un DataFrame `feature_stats` con una fila por feature y columnas para todas las estadísticas anteriores.

4. Separá los datos por clase (maligno vs benigno) y calculá las mismas estadísticas para cada clase.

5. Creá las siguientes visualizaciones:
   - **Scatter plot 2D**: elegí las 2 features que mejor separan las clases y creá un scatter plot con colores por clase
   - **Histogramas comparativos**: para las 3 features más discriminativas, creá histogramas superpuestos (maligno vs benigno)
   - **Boxplot**: para las 5 features con mayor diferencia relativa entre clases

6. Respondé en una celda de markdown:
   - ¿Cuáles son las 3 features más discriminativas? ¿Cómo lo determinaste?
   - ¿Hay features donde las clases se superponen significativamente? ¿Qué implica esto?
   - ¿Por qué es importante explorar los datos antes de entrenar un modelo de IA?

## Entregables

- Un notebook Jupyter (`.ipynb`) con todo el código, outputs y respuestas escritas

## Rúbrica de Evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Insuficiente (1 pt) |
|----------|-------------------|---------------|-------------------|---------------------|
| Carga y exploración del dataset | Dataset cargado correctamente, todas las estadísticas calculadas sin errores | Estadísticas correctas con errores menores | Faltan 1-2 estadísticas | Faltan más de 2 estadísticas o errores graves |
| Visualizaciones | Scatter plot, histogramas y boxplots con labels, títulos y leyendas correctas | Todas las visualizaciones presentes | Visualizaciones básicas sin formato adecuado | Faltan visualizaciones |
| Análisis por clase | Comparación completa maligno vs benigno con estadísticas separadas | Comparación correcta | Comparación parcial | Sin separación por clase |
| Interpretación | Análisis profundo, contextualizado, conecta features con clasificación | Buen análisis | Análisis superficial | Sin interpretación o incorrecta |

**Total: 16 puntos**

## Tiempo Estimado

2 horas
