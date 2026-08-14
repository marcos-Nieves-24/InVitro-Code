# Quiz: Aplicaciones

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál es el principal beneficio de usar un Pipeline en scikit-learn?

a) Entrena los modelos más rápido
b) Encadena el preprocesamiento y el modelado en un único objeto reproducible
c) Selecciona automáticamente el mejor modelo
d) Genera visualizaciones

<details><summary>Respuesta</summary>b) Encadena el preprocesamiento y el modelado en un único objeto reproducible, garantizando que se aplique el mismo preprocesamiento a los datos de entrenamiento y de prueba</details>

**Q2.** En el case study de predicción de calidad biotecnológica, ¿qué parámetro de proceso probablemente tiene el mayor impacto en la calidad?

a) Velocidad de agitación
b) Desviación del pH respecto de 7.2
c) Tiempo de cultivo
d) Tasa de alimentación (feed rate)

<details><summary>Respuesta</summary>b) La desviación del pH respecto de 7.2 (la fórmula simulada tiene un coeficiente de 5 para la desviación del pH, lo que lo convierte en el factor más fuerte)</details>

**Q3.** ¿Por qué podrías construir modelos de churn separados por segmento de clientes en lugar de un único modelo global?

a) Siempre es más preciso
b) Distintos segmentos pueden tener diferentes drivers de churn
c) Requiere menos datos
d) Converge más rápido

<details><summary>Respuesta</summary>b) Distintos segmentos pueden tener diferentes drivers de churn. Un segmento de alto valor podría perder clientes por el precio, mientras que un segmento de baja participación podría perderlos por falta de adopción de features.</details>

**Q4.** ColumnTransformer es útil cuando:

a) Todas las features son numéricas
b) Distintas columnas necesitan distinto preprocesamiento (por ejemplo, scaling para numéricas, encoding para categóricas)
c) El dataset no tiene valores faltantes
d) Solo se está probando un modelo

<details><summary>Respuesta</summary>b) Aplica distintos pipelines de preprocesamiento a distintas columnas, lo cual es esencial cuando se trabaja con tipos de datos mixtos</details>

**Q5.** GridSearchCV realiza:

a) Una búsqueda aleatoria de hiperparámetros
b) Una búsqueda exhaustiva sobre los valores de parámetros especificados con validación cruzada
c) Una evaluación de un único modelo
d) Selección de features

<details><summary>Respuesta</summary>b) Una búsqueda exhaustiva sobre los valores de parámetros especificados con validación cruzada para encontrar los mejores hiperparámetros</details>

## Respuesta corta (2 preguntas)

**Q6.** Describí un pipeline de ML de extremo a extremo desde los datos crudos hasta la decisión de despliegue. Nombrá al menos 5 etapas.

<details><summary>Respuesta</summary>1) Recolección y entendimiento de los datos (EDA), 2) Preprocesamiento de los datos (limpieza, scaling, encoding), 3) Entrenamiento y selección del modelo (comparar múltiples algoritmos), 4) Evaluación del modelo (validación cruzada, set de prueba, métricas de negocio), 5) Interpretación del modelo (importancia de características, PDP), 6) Despliegue y monitoreo (trackear el rendimiento a lo largo del tiempo).</details>

**Q7.** El modelo de predicción de calidad de una empresa biotecnológica logra una exactitud excelente. Sin embargo, el equipo de manufactura se niega a usarlo. ¿Qué pasos darías para lograr su adopción?

<details><summary>Respuesta</summary>1) Generá confianza mediante la interpretabilidad: mostrá la importancia de características y los PDP para que el equipo entienda los drivers. 2) Empezá con un piloto: corré el modelo en paralelo con los procesos existentes sin reemplazarlos. 3) Involucrá a los expertos del dominio en la validación de las features y las predicciones. 4) Comunicate en lenguaje de negocio/proceso, no en jerga de ML. 5) Documentá las limitaciones con claridad. 6) Demostrá el ROI con un ejemplo concreto (por ejemplo, "si hubiéramos tenido este modelo el mes pasado, habríamos detectado 3 problemas de calidad antes").</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `regression_pipeline_comparison(X, y)` que cree un pipeline con StandardScaler para cada uno de LinearRegression, RandomForestRegressor (n=100) y GradientBoostingRegressor (n=100). Devuelve un DataFrame comparando su RMSE y su R² usando validación cruzada de 5 folds.

<details><summary>Respuesta</summary>

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import make_scorer, mean_squared_error, r2_score

def regression_pipeline_comparison(X, y):
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
    }

    results = []
    for name, model in models.items():
        pipe = Pipeline([('scaler', StandardScaler()), ('model', model)])
        rmse_scores = -cross_val_score(pipe, X, y, cv=5, scoring='neg_root_mean_squared_error')
        r2_scores = cross_val_score(pipe, X, y, cv=5, scoring='r2')
        results.append({
            'Model': name,
            'RMSE_mean': rmse_scores.mean(),
            'RMSE_std': rmse_scores.std(),
            'R2_mean': r2_scores.mean(),
            'R2_std': r2_scores.std(),
        })

    return pd.DataFrame(results).round(3)

from sklearn.datasets import make_regression
X, y = make_regression(n_samples=500, n_features=10, noise=20, random_state=42)
print(regression_pipeline_comparison(X, y).to_string(index=False))
```
</details>
