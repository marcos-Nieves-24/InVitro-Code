---
Module: 4
Lesson Number: 8
Lesson Title: Gradient Boosting
Estimated Duration: 90 minutos
Prerequisites: L4 (Árboles de Decisión), L5 (Bosque Aleatorio)
Learning Objectives:
  - Explicar el paradigma de boosting y cómo difiere del bagging
  - Describir el algoritmo de Gradient Boosting
  - Entrenar modelos de Gradient Boosting con scikit-learn
  - Ajustar hiperparámetros: learning_rate, n_estimators, max_depth
  - Describir cómo XGBoost y LightGBM mejoran el gradient boosting básico
Keywords: boosting, gradient boosting, XGBoost, LightGBM, tasa de aprendizaje, modelo aditivo, residual
Difficulty: Avanzado
Programming Concepts: sklearn.ensemble.GradientBoostingClassifier, learning_rate, early_stopping
Mathematical Concepts: descenso por gradiente en el espacio de funciones, modelado aditivo
Machine Learning Concepts: boosting, aprendices débiles, ensemble secuencial
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Gradient Boosting

## Motivación

El Bosque Aleatorio construye muchos árboles de forma independiente y los promedia. Gradient Boosting construye árboles *secuencialmente*, donde cada nuevo árbol se enfoca en los errores de los anteriores. Como un estudiante que aprende de sus errores, boosting crea un ensemble poderoso a partir de árboles simples. Gradient Boosting y sus variantes optimizadas (XGBoost, LightGBM) dominan las competencias de ML y son ampliamente utilizados en biotecnología (descubrimiento de fármacos, genómica) y SaaS (predicción de tasa de clics, ranking).

## Panorama general

**Anterior:** Bosque Aleatorio (ensemble paralelo — bagging). **Esta lección:** Gradient Boosting (ensemble secuencial — boosting). **Siguiente:** Interpretación de Modelos — entender lo que tu modelo aprendió.

## Teoría

### Intuición de Boosting

En lugar de entrenar árboles de forma independiente, boosting los entrena secuencialmente. Cada nuevo árbol intenta corregir los errores del ensemble anterior.

**Analogía:** Si le pedís a 100 personas que adivinen el peso de un objeto de forma independiente (bagging), obtenés 100 estimaciones independientes. Si le preguntás a la persona 1, luego le mostrás su error a la persona 2, luego le mostrás el error combinado a la persona 3 (boosting), cada persona subsiguiente se enfoca en los casos más difíciles.

### Algoritmo de Gradient Boosting

1. Empezá con un modelo simple (ej., predecir la media)
2. Calculá los residuales (errores) del modelo actual
3. Entrená un árbol superficial para predecir los residuales
4. Agregá las predicciones del árbol (escaladas por la tasa de aprendizaje) al ensemble
5. Repetí los pasos 2-4 durante M iteraciones

**Idea clave:** Entrenar sobre residuales es equivalente al descenso por gradiente en el espacio de funciones.

### Fundamento matemático

El modelo es un ensemble aditivo:

$$F_M(x) = \sum_{m=1}^{M} \gamma_m h_m(x)$$

En el paso $m$, ajustamos $h_m$ al gradiente negativo de la función de pérdida con respecto a la predicción actual:

$$h_m \approx \arg\min_h \sum_{i=1}^{n} \left[ -\frac{\partial L(y_i, F_{m-1}(x_i))}{\partial F_{m-1}(x_i)} - h(x_i) \right]^2$$

Para la pérdida MSE, el gradiente negativo es simplemente el residual: $y_i - F_{m-1}(x_i)$.

### Hiperparámetros clave

**learning_rate (η):** Reduce la contribución de cada árbol (típico: 0.01-0.3). Un η más bajo requiere más árboles pero generaliza mejor.

**n_estimators:** Cantidad de árboles. Más árboles + tasa de aprendizaje baja = mejor rendimiento (con rendimientos decrecientes).

**max_depth:** Los árboles en boosting son típicamente superficiales (2-5). Cada árbol es un "aprendiz débil".

**subsample:** Fracción de datos usada por iteración (stochastic gradient boosting).

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor

np.random.seed(42)
X = np.sort(np.random.rand(80, 1) * 10, axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.15, X.shape[0])

# Sequential fitting
F = np.zeros_like(y)
n_stages = 5
fig, axes = plt.subplots(1, n_stages, figsize=(20, 3))

for i in range(n_stages):
    residual = y - F
    tree = DecisionTreeRegressor(max_depth=3)
    tree.fit(X, residual)
    F += 0.5 * tree.predict(X)

    axes[i].scatter(X, y, alpha=0.3, label='Data')
    axes[i].scatter(X, F, color='red', s=20, label=f'Stage {i+1}')
    axes[i].set_ylim(-1.5, 1.5)
    axes[i].legend()

plt.suptitle('Gradient Boosting: Sequential Residual Fitting')
plt.tight_layout()
plt.savefig('figures/boosting_sequential.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare learning rates
for lr in [0.01, 0.1, 0.5, 1.0]:
    gb = GradientBoostingClassifier(
        n_estimators=100, learning_rate=lr, max_depth=3, random_state=42
    )
    gb.fit(X_train, y_train)
    print(f"LR={lr:.2f}: Train={gb.score(X_train, y_train):.3f}, "
          f"Test={gb.score(X_test, y_test):.3f}")

# Best model
gb = GradientBoostingClassifier(
    n_estimators=200, learning_rate=0.1, max_depth=3, subsample=0.8, random_state=42
)
gb.fit(X_train, y_train)
y_pred = gb.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
```

## Ejemplo guiado: Cáncer de mama con Gradient Boosting

**Resultados:**
- learning_rate=0.1: Prueba ~97%
- learning_rate=0.5: Prueba ~96% (ligeramente peor — sobreajuste)
- learning_rate=0.01: Prueba ~96% (necesitaba más árboles)

**Hallazgo clave:** Tasa de aprendizaje más baja + más árboles supera consistentemente a una tasa más alta con menos árboles.

## XGBoost y LightGBM

Ambas son implementaciones optimizadas de gradient boosting ampliamente usadas en la práctica.

**XGBoost (eXtreme Gradient Boosting):**
- Boosting regularizado para prevenir sobreajuste
- Manejo eficiente de valores faltantes
- Validación cruzada incorporada
- Procesamiento paralelo (a nivel de árbol)

**LightGBM:**
- Entrenamiento más rápido (algoritmo basado en histogramas)
- Crecimiento de árbol por hojas (vs. por profundidad)
- Menor uso de memoria
- Manejo nativo de características categóricas

```python
# Conceptual example (requires xgboost/lightgbm installation)
# import xgboost as xgb
# model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
# model.fit(X_train, y_train)
```

## Ejemplo en biotecnología: Interacción fármaco-objetivo

```python
np.random.seed(42)
n = 500

drug_data = pd.DataFrame({
    'molecular_weight': np.random.normal(400, 100, n),
    'logP': np.random.uniform(-2, 5, n),
    'h_bond_donors': np.random.poisson(2, n),
    'h_bond_acceptors': np.random.poisson(4, n),
    'rotatable_bonds': np.random.poisson(5, n),
})

interaction = (
    0.3 * drug_data['logP']
    - 0.1 * drug_data['molecular_weight'] / 100
    + 0.2 * drug_data['h_bond_acceptors']
    + np.random.normal(0, 0.2, n)
)
drug_data['binds'] = (interaction > interaction.median()).astype(int)

X_d = drug_data.drop('binds', axis=1)
y_d = drug_data['binds']

gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
gb.fit(X_d, y_d)

print(f"Feature importances:")
for name, imp in zip(X_d.columns, gb.feature_importances_):
    print(f"  {name}: {imp:.3f}")
```

## Ejemplo en SaaS: Predicción de tasa de clics

```python
np.random.seed(42)
n = 2000

ctr_data = pd.DataFrame({
    'user_age_days': np.random.randint(1, 1000, n),
    'past_clicks': np.random.poisson(10, n),
    'hour_of_day': np.random.randint(0, 24, n),
    'device_type': np.random.choice([0, 1, 2], n),
    'ad_position': np.random.choice([0, 1, 2, 3], n),
})

click_prob = (
    0.01 * np.log1p(ctr_data['past_clicks'])
    - 0.02 * ctr_data['hour_of_day']
    + 0.05 * (ctr_data['ad_position'] == 0)
    + np.random.normal(0, 0.1, n)
)
ctr_data['clicked'] = (click_prob > 0).astype(int)

gb_ctr = GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, max_depth=3)
gb_ctr.fit(ctr_data.drop('clicked', axis=1), ctr_data['clicked'])
print(f"Test AUC: {roc_auc_score(ctr_data['clicked'], gb_ctr.predict_proba(ctr_data.drop('clicked', axis=1))[:, 1]):.3f}")
```

## Errores comunes

1. **Demasiados árboles sin suficiente tasa de aprendizaje** — sobreajuste
2. **Árboles profundos en boosting** — boosting está diseñado para árboles superficiales (profundidad 2-5)
3. **Ignorar la parada temprana** — usá un conjunto de validación para detenerte cuando el rendimiento se estabilice
4. **Usar boosting en conjuntos de datos muy pequeños** — propenso a sobreajuste con menos de 100 muestras

## Buenas prácticas

- Usá siempre un conjunto de validación para parada temprana
- Empezá con learning_rate=0.1, n_estimators=100, max_depth=3
- Tasa de aprendizaje más baja → más árboles → mejor generalización
- Usá subsample < 1.0 para boosting estocástico (reduce sobreajuste)
- Compará con Bosque Aleatorio para decidir qué ensemble funciona mejor
- Para datos grandes, usá XGBoost o LightGBM

## Resumen

- Boosting construye árboles secuencialmente, cada uno corrigiendo errores anteriores
- Cada árbol ajusta los residuales (gradiente negativo) del ensemble actual
- Hiperparámetros clave: learning_rate, n_estimators, max_depth
- Tasa de aprendizaje más baja + más árboles = mejor generalización
- XGBoost y LightGBM son implementaciones optimizadas listas para producción

## Términos clave

| Término | Definición |
|---------|------------|
| Boosting | Ensemble secuencial que corrige errores anteriores |
| Residual | Diferencia entre el valor real y el predicho |
| Tasa de aprendizaje | Factor de escala para la contribución de cada árbol |
| Aprendiz débil | Árbol superficial que apenas supera al azar |
| Modelo aditivo | Ensemble formado agregando modelos secuencialmente |
| Parada temprana | Detener el entrenamiento cuando el rendimiento en validación deja de mejorar |

## Ejercicios

**Nivel 1 — Básico:** Explicá la diferencia clave entre bagging (Bosque Aleatorio) y boosting (Gradient Boosting).

**Nivel 2 — Implementación:** Entrená GradientBoostingClassifier en breast cancer con learning_rates [0.01, 0.05, 0.1, 0.5] y n_estimators=100. Graficá la precisión en prueba vs. learning_rate.

**Nivel 3 — Pensamiento crítico:** Tenés 50 muestras con 200 características. ¿Por qué Gradient Boosting podría ser una mala elección? ¿Qué usarías en su lugar?

## Desafío de programación

Escribí una función `tune_gradient_boosting(X_train, y_train, X_val, y_val)` que realice una búsqueda en grilla sobre learning_rate (0.01, 0.05, 0.1) y max_depth (2, 3, 5) y devuelva el mejor modelo y su precisión en validación.
