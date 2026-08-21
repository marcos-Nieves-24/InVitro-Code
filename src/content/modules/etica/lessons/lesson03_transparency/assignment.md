# Assignment: Construcción de un dashboard de explicaciones

## Objetivos

- Implementar LIME y SHAP para un dataset real
- Construir una función que genere explicaciones para múltiples instancias
- Evaluar críticamente la calidad de las explicaciones
- Escribir un informe adecuado para una audiencia no técnica

## Instrucciones

### Parte 1: Modelo y datos (1 hora)

Elige un dataset con al menos 5 features y un objetivo de clasificación binaria. Opciones:
- Dataset de enfermedades cardíacas UCI
- Dataset de ingresos de adultos UCI (predecir ingresos > 50K)
- Un dataset sintético que crees

Entrena al menos dos modelos:
- Un modelo interpretable (regresión logística)
- Un modelo de caja negra (Random Forest o Gradient Boosting)

### Parte 2: Funciones de explicación (2 horas)

Implementa las siguientes funciones:

1. `global_explanation(model, X, feature_names, method='shap')` — devuelve un DataFrame con la importancia global de las features
2. `local_explanation_lime(model, instance, feature_names)` — devuelve (features, weights) para una sola predicción
3. `local_explanation_shap(model, instance, feature_names)` — devuelve los valores SHAP para una sola predicción
4. `explanation_dashboard(model, X_test, y_test, n_instances=10)` — genera explicaciones para n_instances y devuelve una tabla comparativa

### Parte 3: Análisis (2 horas)

1. Para 10 instancias de prueba, compara las explicaciones de LIME y SHAP. Reporta la correlación de rango de la importancia de features entre los dos métodos.
2. Para cada instancia, verifica si la feature más importante según la explicación coincide con la feature más importante a nivel global.
3. Si el modelo de caja negra clasifica mal una instancia, ¿la explicación revela por qué?

### Parte 4: Informe (1 hora)

Escribe un informe de 500 palabras explicando tus hallazgos para una audiencia no técnica (p. ej., un gerente de producto o un regulador). Incluye:
- Qué es la IA explicable y por qué importa
- Qué hacen LIME y SHAP (en lenguaje simple)
- Hallazgos clave de tu análisis
- Limitaciones de los métodos
- Recomendaciones para usar explicaciones en la práctica

## Entrega

Envía el notebook y el PDF a través del sistema de gestión de aprendizaje del curso.
