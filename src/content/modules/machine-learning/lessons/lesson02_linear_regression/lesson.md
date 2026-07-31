---
Module: 4
Lesson Number: 2
Lesson Title: Regresión Lineal
Estimated Duration: 90 minutos
Prerequisites: L1 (Fundamentos de ML), Módulo 3 estadística (varianza, covarianza, correlación)
Learning Objectives:
  - Explicar la formulación matemática de la regresión lineal simple y múltiple
  - Implementar regresión lineal con scikit-learn
  - Interpretar coeficientes de regresión en contexto
  - Evaluar modelos de regresión usando R², MSE y RMSE
  - Describir cómo el descenso por gradiente optimiza los parámetros del modelo
Keywords: regresión lineal, OLS, descenso por gradiente, R-cuadrado, MSE, coeficiente, intersección
Difficulty: Principiante
Programming Concepts: sklearn.linear_model.LinearRegression, álgebra lineal con numpy
Mathematical Concepts: Mínimos Cuadrados Ordinarios, descenso por gradiente, R², MSE, RMSE
Machine Learning Concepts: regresión, ponderación de características, residuales
Datasets Used: scikit-learn diabetes, California Housing, sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Predecir números, no categorías" eyebrow="INICIO">

<MascotMessage mood="curious">
Tu primer algoritmo de ML real. La regresión lineal es el más simple, el más interpretable, y la base sobre la que se construyen redes neuronales enteras. Dominarla es obligatorio.
</MascotMessage>

Una empresa biotecnológica quiere predecir la solubilidad de fármacos a partir de propiedades moleculares. Una SaaS quiere pronosticar ingresos del próximo mes. Ambos son problemas de **regresión** — predecir un número continuo.

<ConceptCard variant="key-idea">
La regresión lineal modela la relación entre características de entrada y un valor numérico de salida como una **suma ponderada**. Cada característica aporta según su peso (coeficiente), y el modelo aprende esos pesos a partir de los datos.
</ConceptCard>

</Section>

<Section number={2} title="La ecuación que lo explica todo" eyebrow="CONCEPTO">

**Regresión Lineal Simple** (una característica):

$$y = \beta_0 + \beta_1 x + \varepsilon$$

- $\beta_0$: intersección — valor de $y$ cuando $x = 0$
- $\beta_1$: pendiente — cuánto cambia $y$ por cada unidad de $x$
- $\varepsilon$: residual — lo que el modelo no puede explicar

**Regresión Lineal Múltiple** ($p$ características):

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p + \varepsilon$$

En forma matricial: $\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$

<ConceptCard variant="definition">
**Mínimos Cuadrados Ordinarios (OLS):** El método que encuentra los coeficientes $\boldsymbol{\beta}$ que minimizan la suma de errores al cuadrado. La solución tiene forma cerrada:

$$\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$
</ConceptCard>

</Section>

<Section number={3} title="Descenso por gradiente: la alternativa iterativa" eyebrow="MATEMÁTICA">

Cuando tenés miles de features, calcular $(\mathbf{X}^\top\mathbf{X})^{-1}$ es carísimo. El descenso por gradiente ofrece un camino iterativo:

1. Iniciá con $\boldsymbol{\beta}$ aleatorio
2. Calculá el gradiente del error respecto a $\boldsymbol{\beta}$
3. Actualizá: $\boldsymbol{\beta} := \boldsymbol{\beta} - \alpha \nabla \text{MSE}$
4. Repetí hasta converger

<CalloutInfo>
$\alpha$ es la **tasa de aprendizaje** (learning rate). Si es muy chica, tardás una eternidad. Si es muy grande, pasás de largo y nunca convergés. En la práctica se prueba con valores como 0.1, 0.01, 0.001.
</CalloutInfo>

### Supuestos del modelo

1. **Linealidad:** $y$ es aproximadamente lineal en $X$
2. **Independencia:** Las observaciones no dependen entre sí
3. **Homocedasticidad:** Varianza constante de los residuales
4. **Normalidad:** Residuales con distribución normal (para tests estadísticos)
5. **Sin multicolinealidad:** Features no altamente correlacionadas entre sí

</Section>

<Section number={4} title="Las 3 métricas que necesitás saber" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**MSE (Error Cuadrático Medio):** $\frac{1}{n}\sum(y_i - \hat{y}_i)^2$

Penaliza fuerte los errores grandes (los eleva al cuadrado). La métrica que el modelo optimiza internamente.
</ConceptCard>

<ConceptCard variant="definition">
**RMSE (Raíz del MSE):** $\sqrt{\text{MSE}}$

La ventaja: está en las mismas unidades que $y$. Si predecís precios en dólares, el RMSE te dice "me equivoco en promedio por \$X".
</ConceptCard>

<ConceptCard variant="definition">
**R² (Coeficiente de Determinación):** $1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$

Proporción de varianza explicada. R² = 1 es ajuste perfecto, R² = 0 es tan bueno como predecir siempre el promedio, R² < 0 es peor que el promedio.
</ConceptCard>

</Section>

<Section number={5} title="Visualizá tu primera regresión" eyebrow="INTERACTIVA">

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

np.random.seed(42)
X = np.random.rand(50, 1) * 10
y = 2.5 * X.ravel() + 1.3 + np.random.normal(0, 1.5, 50)

model = LinearRegression()
model.fit(X, y)

X_line = np.linspace(0, 10, 100).reshape(-1, 1)
y_line = model.predict(X_line)

plt.figure(figsize=(8, 5))
plt.scatter(X, y, alpha=0.6, label='Datos')
plt.plot(X_line, y_line, 'r-', linewidth=2,
         label=f'y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}')
plt.xlabel('Feature (x)')
plt.ylabel('Target (y)')
plt.legend()
plt.title('Regresión Lineal Simple')
plt.show()
```

<CalloutInfo>
La línea roja es lo que el modelo aprendió. Cada punto azul que se desvía de la línea es un residual — lo que el modelo no pudo explicar. El objetivo de OLS es hacer que esas desviaciones verticales sean lo más chicas posible, en promedio.
</CalloutInfo>

</Section>

<Section number={6} title="Tu primer modelo con datos reales" eyebrow="CÓDIGO">

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

data = load_diabetes()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Intercept:", model.intercept_)
print("Coeficientes:")
for name, coef in zip(data.feature_names, model.coef_):
    print(f"  {name}: {coef:.4f}")
print(f"\nMSE:  {mean_squared_error(y_test, y_pred):.1f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.1f}")
print(f"R²:   {r2_score(y_test, y_pred):.3f}")
```

<ReflectionCheck
  blockId="reflection-l02-coefficients"
  moduleSlug="machine-learning"
  lessonSlug="lesson02_linear_regression"
  prompt="Mirá los coeficientes. Si un coeficiente es 50 y otro es 0.5, ¿significa que la primera feature es 100 veces más importante?"
  answer="No necesariamente. Los coeficientes dependen de las unidades de cada feature. Si una feature va de 0 a 1 y otra de 0 a 1000, sus coeficientes no son comparables directamente. Para comparar importancia real hay que estandarizar las features primero (restar media, dividir por desvío)."
/>

</Section>

<Section number={7} title="Caso California Housing" eyebrow="INTERACTIVA">

```python
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing()
X_h = pd.DataFrame(housing.data, columns=housing.feature_names)
y_h = housing.target

X_train, X_test, y_train, y_test = train_test_split(
    X_h, y_h, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

print(f"R²: {model.score(X_test, y_test):.3f}")

# Feature importance
coef_df = pd.DataFrame({
    'feature': housing.feature_names,
    'coefficient': model.coef_
}).sort_values('coefficient', key=abs, ascending=False)
print(coef_df)
```

<CalloutCheck>
**Interpretación:** MedInc (ingreso mediano) domina los coeficientes. A mayor ingreso en la zona, mayor el precio de las viviendas. Esto tiene sentido económico y valida que el modelo está capturando relaciones reales, no ruido.
</CalloutCheck>

</Section>

<Section number={8} title="Biotecnología: solubilidad de proteínas" eyebrow="APLICACIÓN">

```python
np.random.seed(42)
n_proteins = 200

solubility_data = pd.DataFrame({
    'molecular_weight': np.random.normal(50000, 10000, n_proteins),
    'hydrophobicity': np.random.uniform(-2, 2, n_proteins),
    'charge': np.random.normal(0, 5, n_proteins),
    'helix_fraction': np.random.uniform(0, 1, n_proteins),
})

solubility_data['solubility'] = (
    0.5
    - 0.3 * solubility_data['hydrophobicity']
    + 0.1 * solubility_data['charge']
    + 0.2 * solubility_data['helix_fraction']
    + np.random.normal(0, 0.1, n_proteins)
)

X_s = solubility_data.drop('solubility', axis=1)
y_s = solubility_data['solubility']

model_s = LinearRegression()
model_s.fit(X_s, y_s)

for col, coef in zip(X_s.columns, model_s.coef_):
    print(f"{col}: {coef:.4f}")
print(f"R²: {model_s.score(X_s, y_s):.3f}")
```

<ConceptCard variant="key-idea">
La hidrofobicidad tiene el coeficiente negativo más grande: proteínas más hidrofóbicas → menos solubles en agua. Esto coincide con lo que sabemos de bioquímica. Cuando los coeficientes tienen sentido físico, confiás más en el modelo.
</ConceptCard>

</Section>

<Section number={9} title="SaaS: forecasting de ingresos" eyebrow="APLICACIÓN">

Una startup quiere pronosticar su MRR (Ingreso Recurrente Mensual) del próximo mes basándose en métricas del mes actual:

```python
np.random.seed(42)
n_months = 36

revenue_data = pd.DataFrame({
    'active_users': np.random.poisson(1000, n_months) + np.arange(n_months) * 10,
    'new_signups': np.random.poisson(50, n_months) + np.arange(n_months) * 2,
    'churn_rate': np.random.uniform(0.02, 0.08, n_months),
    'avg_revenue_per_user': np.random.uniform(20, 30, n_months),
})

true_mrr = (
    0.5 * revenue_data['active_users']
    + 2.0 * revenue_data['new_signups']
    - 500 * revenue_data['churn_rate']
    + revenue_data['avg_revenue_per_user'] * revenue_data['active_users'] * 0.01
    + np.random.normal(0, 100, n_months)
)
revenue_data['mrr'] = true_mrr

X_r = revenue_data.drop('mrr', axis=1)
y_r = revenue_data['mrr']

model_r = LinearRegression()
model_r.fit(X_r, y_r)

print(f"R²: {model_r.score(X_r, y_r):.3f}")
for col, coef in zip(X_r.columns, model_r.coef_):
    print(f"{col}: {coef:.2f}")
```

</Section>

<Section number={10} title="Errores que te van a costar puntos" eyebrow="PELIGROS">

<CalloutInfo>
1. **Interpretar coeficientes como causales.** Que el coeficiente de "gasto en marketing" sea positivo no significa que gastar más cause más ingresos. Podría ser al revés: empresas con más ingresos gastan más en marketing.

2. **Ignorar multicolinealidad.** Si dos features están muy correlacionadas (ej. "pies cuadrados" y "número de habitaciones"), los coeficientes se vuelven inestables y sus valores individuales pierden sentido.

3. **No mirar los residuales.** Si graficás residuales vs predicciones y ves un patrón curvo, tus datos no son lineales. Necesitás features polinómicas u otro modelo.

4. **Usar solo R².** Un R² alto no garantiza un buen modelo. Podrías estar sobreajustando o teniendo errores sistemáticos que R² no captura.

5. **No escalar features al comparar coeficientes.** Si una feature va de 0 a 1 y otra de 0 a 100000, sus coeficientes no son comparables.
</CalloutInfo>

</Section>

<Section number={11} title="Buenas prácticas" eyebrow="BUENAS PRÁCTICAS">

<CalloutCheck>
Visualizá siempre los datos antes de modelar. Un scatter plot te dice más que cualquier métrica.

Revisá los gráficos de residuales (residuales vs. ajustados, Q-Q plot). Son tu alerta temprana de violaciones de supuestos.

Usá RMSE en lugar de MSE para comunicar resultados. "El modelo se equivoca en promedio por \$3,200" es más claro que "MSE = 10,240,000".

Compará contra una línea base simple (predecir siempre el promedio). Si tu modelo no le gana a la línea base, algo anda mal.

Considerá regularización (Ridge, Lasso) cuando tengas muchas features. La regresión lineal simple se descontrola con alta dimensionalidad.
</CalloutCheck>

</Section>

<Section number={12} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La regresión lineal modela el objetivo como suma ponderada de features. OLS encuentra los coeficientes óptimos minimizando el error cuadrático. R² mide cuánta varianza explicás, RMSE mide cuánto te equivocás en unidades reales. El descenso por gradiente es la alternativa iterativa cuando la solución cerrada es inviable.
</ConceptCard>

<InteractiveTable
  columns={[
    { key: "term", label: "Término" },
    { key: "def", label: "Definición" },
  ]}
  rows={[
    { term: "OLS", def: "Mínimos Cuadrados Ordinarios — solución cerrada que minimiza MSE" },
    { term: "Coeficiente", def: "Peso asignado a una feature. Cuánto cambia y por unidad de x" },
    { term: "Intersección", def: "Predicción cuando todas las features son 0" },
    { term: "Residual", def: "Diferencia entre valor real y predicción: yᵢ − ŷᵢ" },
    { term: "R²", def: "Proporción de varianza explicada. 1 = perfecto, 0 = promedio" },
    { term: "MSE", def: "Error cuadrático medio. Penaliza fuerte los errores grandes" },
    { term: "RMSE", def: "Raíz del MSE. Mismas unidades que y — interpretable" },
    { term: "Descenso por gradiente", def: "Optimización iterativa: ajusta β en dirección del gradiente negativo" },
  ]}
/>

</Section>

<Section number={13} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<ReflectionCheck
  blockId="reflection-l02-r2-values"
  moduleSlug="machine-learning"
  lessonSlug="lesson02_linear_regression"
  prompt="Nivel 1 — ¿Qué significan en la práctica R² = 1, R² = 0 y R² = -0.5?"
  answer="R² = 1: el modelo explica el 100% de la varianza — predicciones perfectas (cuidado, puede ser sobreajuste). R² = 0: el modelo no es mejor que predecir siempre el promedio de y. R² = -0.5: el modelo es peor que el promedio — tus predicciones son contraproducentes. Posiblemente hay un error en el código o el modelo no es adecuado."
/>

<ReflectionCheck
  blockId="reflection-l02-feature-importance"
  moduleSlug="machine-learning"
  lessonSlug="lesson02_linear_regression"
  prompt="Nivel 3 — Tenés 5 features. Después de entrenar, 3 tienen coeficientes enormes y 2 muy chicos. ¿Son irrelevantes esas 2 features?"
  answer="No necesariamente. Tres explicaciones posibles: (1) Las features no están escaladas — si una feature va de 0 a 0.001, necesita un coeficiente enorme para tener impacto. (2) Hay multicolinealidad — dos features correlacionadas se reparten el peso y ambas parecen chicas. (3) Efectivamente son irrelevantes. Para saberlo, estandarizá las features y usá regularización Lasso, que lleva coeficientes irrelevantes a cero."
/>

<ConceptCard variant="key-idea">
**Desafío:** Escribí `linear_regression_from_scratch(X, y)` que implemente OLS usando la solución cerrada $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$. Compará tus coeficientes con `sklearn.linear_model.LinearRegression`.
</ConceptCard>

</Section>
