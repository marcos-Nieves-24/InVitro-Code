---
Module: 4
Lesson Number: 5
Lesson Title: Bosque Aleatorio
Estimated Duration: 75 minutos
Prerequisites: L4 (Árboles de Decisión)
Learning Objectives:
  - Explicar cómo el bagging reduce la varianza en modelos ensemble
  - Entrenar y evaluar clasificadores de Bosque Aleatorio con scikit-learn
  - Calcular e interpretar la importancia de características de Bosques Aleatorios
  - Comparar el rendimiento del Bosque Aleatorio con árboles de decisión individuales
  - Ajustar hiperparámetros del Bosque Aleatorio
Keywords: bosque aleatorio, ensemble, bagging, bootstrap, importancia de características, out-of-bag
Difficulty: Intermedio
Programming Concepts: sklearn.ensemble.RandomForestClassifier, n_estimators, oob_score
Mathematical Concepts: bagging, muestreo bootstrap, votación mayoritaria
Machine Learning Concepts: aprendizaje ensemble, reducción de varianza, importancia de características
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Bosque Aleatorio

## Motivación

Un solo árbol de decisión se sobreajusta fácilmente y es inestable — pequeños cambios en los datos producen árboles muy diferentes. Pero si le pedís a 100 médicos que diagnostiquen un paciente y tomás una votación, el diagnóstico colectivo es más confiable que el de cualquier médico individual. Esta es la idea central del Bosque Aleatorio: construir muchos árboles y promediar sus predicciones. El Bosque Aleatorio es uno de los algoritmos más utilizados tanto en biotecnología (genómica, descubrimiento de fármacos) como en SaaS (detección de fraude, predicción de abandono).

## Panorama general

**Anterior:** Los árboles de decisión eran interpretables pero inestables. **Esta lección:** Los Bosques Aleatorios solucionan la inestabilidad promediando muchos árboles. **Siguiente:** Clustering K-Means — pasando de aprendizaje supervisado a no supervisado.

## Teoría

### Aprendizaje Ensemble

Los métodos ensemble combinan múltiples modelos para producir mejores predicciones. La idea clave: modelos diversos cometen errores diferentes, y promediarlos reduce esos errores.

### Bagging (Bootstrap Aggregating)

1. Creá $B$ muestras bootstrap (muestreo con reemplazo) a partir de los datos de entrenamiento
2. Entrená un árbol de decisión en cada muestra bootstrap
3. Promediá las predicciones (regresión) o votación mayoritaria (clasificación)

**Por qué funciona:** Cada árbol tiene varianza alta pero sesgo bajo. Promediar $B$ árboles reduce la varianza aproximadamente en $1/B$ sin aumentar el sesgo.

### Bosque Aleatorio = Bagging + Aleatoriedad de Características

El Bosque Aleatorio agrega una fuente extra de diversidad: en cada división, solo se considera un subconjunto aleatorio de características. Esto descorrelaciona aún más los árboles.

- Para clasificación: típicamente $\sqrt{p}$ características
- Para regresión: típicamente $p/3$ características

### Evaluación Out-of-Bag (OOB)

Cada muestra bootstrap excluye ~37% de las muestras. Estas muestras out-of-bag se pueden usar como un conjunto de validación incorporado sin necesidad de una división train/validation separada.

### Importancia de características

El Bosque Aleatorio provee dos tipos:

1. **Importancia basada en impureza:** suma de la reducción de impureza en todas las divisiones para cada característica
2. **Importancia por permutación:** disminución en el rendimiento del modelo cuando los valores de una característica se mezclan aleatoriamente

## Fundamento matemático

### Reducción de varianza con bootstrap

Sea $\hat{f}_b(x)$ la predicción del árbol $b$. La predicción del ensemble:

$$\hat{f}_{\text{rf}}(x) = \frac{1}{B}\sum_{b=1}^{B} \hat{f}_b(x)$$

Si cada árbol tiene varianza $\sigma^2$ y correlación pairwise $\rho$:

$$\text{Var}(\hat{f}_{\text{rf}}) = \rho\sigma^2 + \frac{1-\rho}{B}\sigma^2$$

A medida que $B \to \infty$, la varianza se acerca a $\rho\sigma^2$. La aleatoriedad de características reduce $\rho$, haciendo el ensemble más efectivo.

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            n_clusters_per_class=1, class_sep=0.8, random_state=42)

tree = DecisionTreeClassifier(random_state=42)
forest = RandomForestClassifier(n_estimators=100, random_state=42)

tree.fit(X, y)
forest.fit(X, y)

xx, yy = np.meshgrid(np.linspace(X[:,0].min()-0.5, X[:,0].max()+0.5, 100),
                     np.linspace(X[:,1].min()-0.5, X[:,1].max()+0.5, 100))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for ax, model, title in zip(axes, [tree, forest], ['Single Tree', 'Random Forest (100 trees)']):
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', alpha=0.7)
    ax.set_title(title)
plt.tight_layout()
plt.savefig('figures/tree_vs_forest_boundary.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare tree vs. forest
tree = DecisionTreeClassifier(max_depth=5, random_state=42)
forest = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)

for name, model in [('Single Tree', tree), ('Random Forest', forest)]:
    model.fit(X_train, y_train)
    print(f"{name}:")
    print(f"  Train: {accuracy_score(y_train, model.predict(X_train)):.3f}")
    print(f"  Test:  {accuracy_score(y_test, model.predict(X_test)):.3f}")

# Feature importance
importance = pd.DataFrame({
    'feature': data.feature_names,
    'importance': forest.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 5 features:")
print(importance.head(5).to_string(index=False))
```

## Ejemplo guiado: Cáncer de mama con Bosque Aleatorio

**Comparando árbol vs. bosque:**
- Árbol individual (profundidad 5): Prueba ~93%
- Bosque Aleatorio (100 árboles, profundidad 5): Prueba ~97%

**¿Por qué?** El bosque promedia muchos árboles, reduciendo la varianza. Algunos árboles podrían sobreajustar patrones específicos, pero la votación mayoritaria corrige errores individuales.

**Puntaje OOB:** ~95% — cercano al puntaje de prueba, confirmando que OOB es un proxy de validación confiable.

## Ejemplo en biotecnología: Clasificación de expresión génica

```python
np.random.seed(42)
n_samples, n_genes = 300, 1000

X_expr = np.random.randn(n_samples, n_genes)
y_type = (X_expr[:, 0] * 0.5 + X_expr[:, 50] * 0.3 - X_expr[:, 200] * 0.4 > 0).astype(int)

X_tr, X_te, y_tr, y_te = train_test_split(X_expr, y_type, test_size=0.3)

rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
rf.fit(X_tr, y_tr)

print(f"Test accuracy: {accuracy_score(y_te, rf.predict(X_te)):.3f}")

# Top predictive genes
gene_importance = pd.DataFrame({
    'gene': [f'GENE_{i}' for i in range(n_genes)],
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False).head(10)
print(gene_importance.to_string(index=False))
```

**Interpretación:** El modelo identifica los genes 0, 50 y 200 como los más predictivos — coincidiendo con la generación de datos sintéticos.

## Ejemplo en SaaS: Detección de fraude

```python
np.random.seed(42)
n = 2000

fraud_data = pd.DataFrame({
    'transaction_amount': np.random.exponential(100, n),
    'distance_from_home': np.random.exponential(50, n),
    'hour_of_day': np.random.randint(0, 24, n),
    'num_previous_transactions': np.random.poisson(20, n),
    'is_new_device': np.random.binomial(1, 0.1, n),
})

fraud_prob = (
    0.001 * fraud_data['transaction_amount']
    + 0.002 * fraud_data['distance_from_home']
    + 0.02 * (fraud_data['hour_of_day'] < 6)
    + 0.1 * fraud_data['is_new_device']
    + np.random.normal(0, 0.05, n)
)
fraud_data['is_fraud'] = (fraud_prob > 0.15).astype(int)

X_f = fraud_data.drop('is_fraud', axis=1)
y_f = fraud_data['is_fraud']

rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
rf.fit(X_f, y_f)

print(f"Recall: {recall_score(y_f, rf.predict(X_f)):.3f}")
print(f"Precision: {precision_score(y_f, rf.predict(X_f)):.3f}")
```

## Errores comunes

1. **Muy pocos árboles** — empezá con 100, aumentá hasta que el error OOB se estabilice.
2. **Sin límite de profundidad** — incluso en bosques, árboles muy profundos pueden sobreajustar en conjuntos pequeños.
3. **Ignorar class_weight** — para datos desbalanceados, configurá `class_weight='balanced'`.
4. **Usar importancia por impureza a ciegas** — para características de alta cardinalidad, la importancia por permutación es más confiable.

## Buenas prácticas

- Usá el puntaje OOB como métrica de validación gratuita
- Empezá con `n_estimators=100` y aumentá hasta que el error OOB se estabilice
- Limitá `max_depth` o configurá `min_samples_leaf` para controlar la complejidad del árbol
- Compará con un árbol individual para medir el beneficio del ensemble
- Usá importancia por permutación para la selección final de características

## Resumen

- El Bosque Aleatorio promedia muchos árboles para reducir la varianza
- El bagging crea árboles diversos mediante muestreo bootstrap
- La aleatoriedad de características descorrelaciona aún más los árboles
- La evaluación OOB provee validación gratuita
- La importancia de características identifica predictores clave
- RF es robusto, preciso y ampliamente aplicable

## Términos clave

| Término | Definición |
|---------|------------|
| Ensemble | Combinación de múltiples modelos |
| Bagging | Bootstrap + Agregación |
| Bootstrap | Muestreo con reemplazo |
| OOB | Muestras out-of-bag para validación |
| Importancia de características | Medida de la contribución de cada característica |
| n_estimators | Cantidad de árboles en el bosque |

## Ejercicios

**Nivel 1 — Básico:** Explicá por qué el bagging reduce la varianza comparado con un árbol individual.

**Nivel 2 — Implementación:** Entrená un Bosque Aleatorio en el dataset breast cancer con `n_estimators=[10, 50, 100, 200]`. Graficá el puntaje OOB vs. n_estimators. ¿En qué punto disminuyen los retornos?

**Nivel 3 — Pensamiento crítico:** Tu Bosque Aleatorio alcanza 99.5% de precisión en entrenamiento pero 88% en prueba. El árbol individual alcanza 94% en entrenamiento y 90% en prueba. ¿Qué está pasando y cómo arreglarías el bosque?

## Desafío de programación

Escribí una función `tune_random_forest(X_train, y_train, X_val, y_val)` que realice una búsqueda en grilla sobre `n_estimators` (50, 100, 200) y `max_depth` (3, 5, 10, None) y devuelva el mejor modelo y su precisión en validación.
