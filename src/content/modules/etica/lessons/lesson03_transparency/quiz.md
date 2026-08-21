# Quiz: Transparencia y explicabilidad

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál de las siguientes describe mejor la diferencia entre interpretabilidad y explicabilidad?

A. La interpretabilidad trata sobre la comprensión global; la explicabilidad trata sobre la comprensión local
B. La interpretabilidad se refiere a comprender el funcionamiento interno del modelo; la explicabilidad se refiere a comprender por qué se hizo una predicción específica
C. La interpretabilidad es para modelos lineales; la explicabilidad es para modelos basados en árboles
D. No hay una diferencia significativa

**Q2.** LIME explica una predicción:

A. Calculando gradientes a través del modelo para identificar features influyentes
B. Ajustando un modelo simple e interpretable localmente alrededor de la predicción
C. Calculando la contribución de cada feature usando teoría de juegos
D. Visualizando el árbol de decisión que produjo la predicción

**Q3.** ¿Qué propiedad de los valores SHAP garantiza que la suma de las atribuciones de features sea igual a la predicción menos la predicción promedio?

A. Simetría
B. Eficiencia
C. Aditividad
D. Dummy

**Q4.** Un método de explicación agnóstico del modelo:

A. Solo funciona para redes neuronales
B. Funciona con cualquier modelo de machine learning
C. Requiere acceso a los datos de entrenamiento
D. Solo funciona para problemas de clasificación

**Q5.** ¿Cuál es una limitación clave de los métodos de explicación post-hoc como LIME?

A. Son demasiado lentos para uso en tiempo real
B. Aproximan el modelo y pueden ser incorrectos o inestables
C. Solo funcionan para modelos lineales
D. Requieren que el modelo sea de código abierto

## Respuesta corta (2 preguntas)

**Q6.** Explica el problema de la caja negra. ¿Por qué es especialmente preocupante en las aplicaciones de salud y justicia penal?

**Q7.** Un banco usa un modelo Gradient Boosting para aprobar préstamos y usa LIME para generar explicaciones para los postulantes rechazados. Un postulante rechazado recibe una explicación y demanda, alegando que el modelo es discriminatorio. El banco argumenta que la explicación demuestra que el modelo es equitativo. ¿Cuáles son las debilidades de la posición del banco?

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función de Python `explain_prediction(model, instance, feature_names, explainer_type='lime')` que:
- Reciba un clasificador entrenado, una sola instancia (array 1D), los nombres de las features y el tipo de explainer
- Si `explainer_type='lime'`, cree un explainer de LIME y devuelva la explicación como una lista de tuplas (feature, weight)
- Si `explainer_type='shap'`, cree un explainer de SHAP (asume que el modelo soporta SHAP) y devuelva los valores SHAP para la instancia

No necesitas entrenar el modelo. Asume que las librerías `lime` y `shap` están importadas.

---

## Clave de respuestas

**Q1.** B — Interpretabilidad = comprender el funcionamiento interno del modelo; explicabilidad = comprender por qué se hizo una predicción específica.

**Q2.** B — LIME ajusta un modelo simple e interpretable localmente alrededor de la predicción.

**Q3.** B — La eficiencia garantiza que la suma de los valores Shapley sea igual a la predicción menos la predicción promedio.

**Q4.** B — Los métodos agnósticos del modelo funcionan con cualquier tipo de modelo.

**Q5.** B — Las explicaciones post-hoc aproximan el modelo y pueden ser incorrectas, inestables o engañosas.

**Q6.** El problema de la caja negra se refiere a la opacidad de los modelos complejos de machine learning (redes neuronales profundas, ensembles) cuyos procesos internos de decisión no son directamente comprensibles. En salud, un modelo de diagnóstico de caja negra podría no detectar enfermedades raras sin que nadie entienda por qué. En justicia penal, la sentencia de un acusado podría verse influida por un modelo inexplicable, violando el debido proceso e imposibilitando la responsabilidad.

**Q7.** Debilidades: (1) Las explicaciones de LIME son aproximaciones y pueden ser inestables — diferentes parámetros de perturbación podrían producir explicaciones diferentes. (2) LIME explica predicciones individuales pero puede pasar por alto biases sistemáticos que solo aparecen entre poblaciones. (3) La explicación puede destacar features no discriminatorias mientras el modelo sigue usando features proxy de atributos protegidos. (4) Una explicación no demuestra que el modelo sea equitativo en general — una explicación local puede ser correcta mientras el comportamiento global es discriminatorio.

**Q8.** Solución de ejemplo:

```python
def explain_prediction(model, instance, feature_names, explainer_type='lime'):
    import lime.lime_tabular
    import shap
    import numpy as np

    if explainer_type == 'lime':
        # Dummy training data needed for LIME explainer (use instance as proxy)
        explainer = lime.lime_tabular.LimeTabularExplainer(
            instance.reshape(1, -1),
            feature_names=feature_names,
            mode='classification'
        )
        exp = explainer.explain_instance(instance, model.predict_proba, num_features=len(feature_names))
        return exp.as_list()

    elif explainer_type == 'shap':
        explainer = shap.Explainer(model, instance.reshape(1, -1))
        shap_values = explainer(instance.reshape(1, -1))
        return shap_values[0].values

    else:
        raise ValueError("explainer_type must be 'lime' or 'shap'")
```
