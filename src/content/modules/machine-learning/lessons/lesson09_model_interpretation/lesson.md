---
Module: 4
Lesson Number: 9
Lesson Title: Interpretación de Modelos
Estimated Duration: 75 minutos
Prerequisites: L2-L5 (Regresión Lineal, Clasificación, Árboles de Decisión, Bosque Aleatorio)
Learning Objectives:
  - Explicar por qué la interpretabilidad de los modelos es importante en biotecnología y SaaS
  - Calcular e interpretar la importancia de características por permutación
  - Generar e interpretar gráficos de dependencia parcial
  - Explicar la intuición detrás de SHAP y LIME
  - Comparar métodos de interpretabilidad global y local
Keywords: interpretabilidad, importancia de características, importancia por permutación, dependencia parcial, SHAP, LIME
Difficulty: Avanzado
Programming Concepts: sklearn.inspection.permutation_importance, sklearn.inspection.PartialDependenceDisplay
Mathematical Concepts: efecto marginal, perturbación de características
Machine Learning Concepts: interpretación global, interpretación local, métodos agnósticos al modelo
Datasets Used: breast cancer, california housing
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Interpretación de Modelos

## Motivación

Un modelo de ML de caja negra predice que un paciente tiene cáncer — pero ¿por qué? ¿Qué biomarcadores impulsaron esa decisión? En industrias reguladas (salud, finanzas), no podés implementar un modelo a menos que puedas explicar sus predicciones. La interpretación de modelos responde "¿por qué?" — genera confianza, permite la depuración y brinda conocimiento científico. En biotecnología, identifica qué genes impulsan una enfermedad. En SaaS, revela qué características impulsan el abandono de clientes.

## Panorama general

**Anterior:** Aprendiste muchos modelos (RL, RF, GB). **Esta lección:** Cómo entender lo que estos modelos aprendieron. **Siguiente:** Aplicaciones — juntando todo.

## Teoría

### Por qué importa la interpretabilidad

1. **Confianza:** Los interesados necesitan confiar en el modelo
2. **Depuración:** Encontrar fugas de datos, correlaciones espurias
3. **Descubrimiento:** Aprender sobre el dominio (ej., qué genes importan)
4. **Regulación:** El GDPR exige explicación para decisiones automatizadas

### Tipos de interpretabilidad

**Global:** Entender el comportamiento completo del modelo
- Importancia de características (qué características importan en general)
- Gráficos de dependencia parcial (cómo las características afectan las predicciones)

**Local:** Entender una predicción individual
- LIME (Explicaciones Locales Agnósticas al Modelo Interpretables)
- SHAP (Explicaciones Aditivas de Shapley)

### Específico del modelo vs. Agnóstico al modelo

- **Específico del modelo:** Reglas de árboles de decisión, coeficientes de regresión lineal
- **Agnóstico al modelo:** Puede aplicarse a cualquier modelo (importancia por permutación, SHAP)

## Importancia de características por permutación

**Idea:** Mezclar los valores de una característica y medir la caída en el rendimiento. Si mezclar reduce el rendimiento significativamente, la característica es importante.

**Algoritmo:**
1. Evaluar el rendimiento base (puntaje en conjunto de validación)
2. Para cada característica:
   - Mezclar aleatoriamente los valores de la característica
   - Re-evaluar el rendimiento
   - Importancia = rendimiento base - puntaje mezclado
3. Repetir múltiples veces para estabilidad

## Gráficos de Dependencia Parcial (PDP)

**Idea:** Mostrar cómo una característica afecta las predicciones mientras se promedian las demás características.

**Algoritmo:**
1. Elegir una característica $x_s$
2. Para cada valor único de $x_s$:
   - Configurar todas las muestras a ese valor
   - Promediar las predicciones de todas las muestras
3. Graficar la predicción promedio vs. $x_s$

**Interpretación:** La pendiente muestra el efecto marginal. Línea plana = sin efecto.

## SHAP (Explicaciones Aditivas de Shapley)

**Enfoque de teoría de juegos:** Cada característica es un "jugador" que contribuye a la predicción. Los valores SHAP distribuyen la predicción entre las características de forma justa.

**Propiedades:**
- La suma de los valores SHAP = predicción - predicción promedio
- SHAP positivo = la característica empuja la predicción hacia arriba
- SHAP negativo = la característica empuja la predicción hacia abajo

**Gráfico resumen SHAP:** Muestra la importancia de las características y la dirección del efecto.

## LIME (Explicaciones Locales Agnósticas al Modelo Interpretables)

**Idea:** Aproximar el modelo complejo con un modelo simple e interpretable (modelo lineal) localmente alrededor de una predicción.

**Algoritmo:**
1. Generar muestras perturbadas alrededor de la instancia
2. Obtener predicciones del modelo complejo
3. Ponderar muestras por proximidad a la instancia
4. Ajustar un modelo interpretable (regresión lineal) sobre las muestras ponderadas
5. Coeficientes = explicación local

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

housing = fetch_california_housing()
X, y = housing.data, housing.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Permutation importance
result = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)

sorted_idx = result.importances_mean.argsort()[::-1]
plt.figure(figsize=(8, 5))
plt.barh([housing.feature_names[i] for i in sorted_idx],
         result.importances_mean[sorted_idx])
plt.xlabel('Permutation Importance')
plt.title('Feature Importance (Permutation)')
plt.tight_layout()
plt.savefig('figures/permutation_importance.png', dpi=150)
plt.show()

# Partial dependence
fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    model, X_test, ['MedInc', 'AveOccup'],
    grid_resolution=20, ax=ax
)
plt.suptitle('Partial Dependence Plots')
plt.tight_layout()
plt.savefig('figures/partial_dependence.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 1. Built-in feature importance
impurity_imp = pd.DataFrame({
    'feature': data.feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Impurity-based importance (top 5):")
print(impurity_imp.head(5).to_string(index=False))

# 2. Permutation importance
perm_imp = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)
perm_df = pd.DataFrame({
    'feature': data.feature_names,
    'importance': perm_imp.importances_mean,
    'std': perm_imp.importances_std
}).sort_values('importance', ascending=False)

print("\nPermutation importance (top 5):")
print(perm_df.head(5).to_string(index=False))

# 3. Partial dependence
fig, ax = plt.subplots(figsize=(10, 4))
PartialDependenceDisplay.from_estimator(
    model, X_test, ['worst radius', 'worst concave points'],
    grid_resolution=20, ax=ax
)
plt.suptitle('Partial Dependence: Breast Cancer')
plt.tight_layout()
plt.savefig('figures/pdp_breast_cancer.png', dpi=150)
plt.show()
```

## Ejemplo guiado: Entendiendo un clasificador de cáncer

**Modelo:** Bosque Aleatorio prediciendo maligno vs. benigno.

**Principales características (permutación):**
1. `worst concave points` — la más importante
2. `worst radius`
3. `worst perimeter`

**Dependencia parcial para `worst radius`:**
- Debajo de 15: probabilidad de malignidad cerca de 0
- Entre 15-25: la probabilidad aumenta rápidamente
- Arriba de 25: probabilidad cerca de 1

**Esto tiene sentido clínico:** Los tumores más grandes tienen más probabilidad de ser malignos.

## Ejemplo en biotecnología: Descubrimiento de biomarcadores

```python
np.random.seed(42)
n, n_genes = 300, 100

X_gene = np.random.randn(n, n_genes)
y_gene = (X_gene[:, 0] * 0.5 + X_gene[:, 15] * 0.3 - X_gene[:, 42] * 0.4 > 0).astype(int)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_gene, y_gene)

perm = permutation_importance(rf, X_gene, y_gene, n_repeats=5, random_state=42)

top_genes = np.argsort(perm.importances_mean)[::-1][:5]
print("Top predictive genes:")
for g in top_genes:
    print(f"  Gene {g}: importance = {perm.importances_mean[g]:.4f}")
```

**Interpretación:** La importancia por permutación identifica correctamente los genes 0, 15 y 42 como las características predictivas reales — incluso entre 100 genes.

## Errores comunes

1. **Confundir correlación con causalidad** — una característica puede ser "importante" sin causar el resultado
2. **Sesgo de impureza** — la importancia basada en impureza favorece características de alta cardinalidad
3. **Usar solo un método de importancia** — compará siempre permutación + impureza
4. **Ignorar correlaciones entre características** — las características correlacionadas comparten importancia
5. **Sobre-interpretar efectos pequeños** — la importancia por permutación puede ser ruidosa

## Buenas prácticas

- Usá siempre importancia por permutación (no solo impureza)
- Compará la importancia incorporada con la importancia por permutación
- Usá PDP para características con alta importancia
- Revisá interacciones usando PDP 2D
- Para explicaciones locales, considerá SHAP (si es instalable) o LIME
- El conocimiento del dominio es esencial para una interpretación correcta

## Resumen

- La importancia por permutación mide la importancia de las características mediante mezclado
- Los gráficos de dependencia parcial muestran efectos marginales
- SHAP y LIME proveen explicaciones locales para predicciones individuales
- Los métodos globales explican todo el modelo; los métodos locales explican una predicción
- Combiná siempre la interpretación de ML con conocimiento del dominio
- La interpretabilidad es esencial para la confianza, la depuración y el descubrimiento

## Términos clave

| Término | Definición |
|---------|------------|
| Importancia por permutación | Caída en el puntaje cuando se mezcla una característica |
| Dependencia parcial | Predicción promedio en función de una característica |
| Interpretación global | Entender el modelo en su totalidad |
| Interpretación local | Entender una predicción individual |
| SHAP | Atribución de características basada en teoría de juegos |
| LIME | Aproximación local con modelo sustituto |

## Ejercicios

**Nivel 1 — Básico:** ¿Por qué se considera la importancia por permutación más confiable que la importancia basada en impureza?

**Nivel 2 — Implementación:** Entrená un `RandomForestRegressor` en California Housing. Calculá la importancia por permutación y graficá las 5 características principales.

**Nivel 3 — Pensamiento crítico:** Las características A y B están altamente correlacionadas (r = 0.95). La importancia por permutación da puntajes bajos a ambas. Si eliminás la característica A, la importancia de B se vuelve alta. ¿Qué está pasando?

## Desafío de programación

Escribí una función `compare_importances(model, X_val, y_val, feature_names)` que devuelva un DataFrame comparando las importancias basadas en impureza y por permutación, ordenadas por importancia por permutación.
