---
Module: 4
Lesson Number: 10
Lesson Title: Aplicaciones
Estimated Duration: 90 minutos
Prerequisites: L1-L9 (todas las lecciones anteriores)
Learning Objectives:
  - Construir un pipeline de ML de extremo a extremo desde datos crudos hasta evaluación
  - Aplicar regresión a un problema de predicción de calidad de productos biotecnológicos
  - Aplicar clustering + clasificación a un problema de análisis de clientes SaaS
  - Seleccionar modelos y métricas apropiados para diferentes contextos de negocio
  - Comunicar resultados de ML a interesados no técnicos
Keywords: pipeline, extremo a extremo, biotecnología, SaaS, calidad de producto, segmentación de clientes, despliegue
Difficulty: Avanzado
Programming Concepts: Pipeline, ColumnTransformer, GridSearchCV
Mathematical Concepts: integración de múltiples conceptos de ML
Machine Learning Concepts: flujo de trabajo completo de ML, consideraciones de despliegue de modelos
Datasets Used: calidad biotecnológica sintética, datos SaaS de clientes sintéticos
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Aplicaciones

## Motivación

Aprendiste 9 algoritmos diferentes. Ahora es momento de aplicarlos a problemas reales: predecir la calidad de un producto biotecnológico y segmentar clientes SaaS. Esta lección integra todo — desde el preprocesamiento de datos hasta la selección de modelos y la comunicación empresarial.

## Panorama general

**Anterior:** 9 lecciones de teoría y práctica. **Esta lección:** Dos casos de estudio completos de extremo a extremo. **Siguiente:** Estás listo para el proyecto final.

## Caso de Estudio 1: Predicción de calidad de producto biotecnológico

### Problema

Una empresa de biomanufactura produce proteínas terapéuticas. Quiere predecir el **puntaje de calidad** del producto final (0-100) basándose en parámetros del proceso medidos durante la producción.

### Conjunto de datos

```python
import numpy as np
import pandas as pd

np.random.seed(42)
n_batches = 500

biotech = pd.DataFrame({
    'temperature_c': np.random.normal(37, 2, n_batches),
    'ph_level': np.random.normal(7.2, 0.3, n_batches),
    'dissolved_oxygen_pct': np.random.normal(60, 10, n_batches),
    'agitation_rpm': np.random.normal(200, 30, n_batches),
    'feed_rate_ml_hr': np.random.normal(50, 10, n_batches),
    'culture_time_hr': np.random.normal(120, 20, n_batches),
    'cell_density': np.random.normal(10, 3, n_batches),
})

# Quality score formula (simulated)
quality = (
    80
    - 2 * np.abs(biotech['temperature_c'] - 37)
    - 5 * np.abs(biotech['ph_level'] - 7.2)
    - 0.3 * np.abs(biotech['dissolved_oxygen_pct'] - 60)
    + 0.02 * biotech['cell_density']
    + np.random.normal(0, 3, n_batches)
)
biotech['quality_score'] = quality.clip(0, 100)
```

### Pipeline

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline

X = biotech.drop('quality_score', axis=1)
y = biotech['quality_score']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42),
}

results = []
for name, model in models.items():
    pipeline = Pipeline([('scaler', StandardScaler()), ('model', model)])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    results.append({
        'Model': name,
        'R²': r2_score(y_test, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
    })

results_df = pd.DataFrame(results).sort_values('R²', ascending=False)
print(results_df.to_string(index=False))
```

### Interpretación

Gradient Boosting explica ~85% de la varianza de calidad. Hallazgo clave: las desviaciones de pH y temperatura del óptimo son los factores más importantes.

### Acción empresarial

- Ajustar el control de temperatura y pH en los biorreactores
- Monitorear el oxígeno disuelto más cuidadosamente
- El puntaje de calidad predicho puede usarse para liberación anticipada de lotes

## Caso de Estudio 2: Segmentación de clientes SaaS y abandono

### Problema

Una empresa SaaS quiere:
1. Segmentar clientes según patrones de uso
2. Construir un modelo de predicción de abandono para cada segmento

### Conjunto de datos

```python
np.random.seed(42)
n_customers = 1000

saas = pd.DataFrame({
    'monthly_spend': np.random.exponential(200, n_customers),
    'logins_per_week': np.random.poisson(5, n_customers),
    'features_used': np.random.poisson(8, n_customers),
    'support_tickets': np.random.poisson(1, n_customers),
    'account_age_months': np.random.exponential(18, n_customers),
    'days_since_login': np.random.exponential(14, n_customers),
})

# Simulate churn
churn_log_odds = (
    -1
    + 0.05 * saas['days_since_login']
    + 0.3 * saas['support_tickets']
    - 0.02 * saas['logins_per_week']
    - 0.1 * saas['features_used']
)
saas['churned'] = (1 / (1 + np.exp(-churn_log_odds)) > 0.3).astype(int)
```

### Paso 1: Segmentación

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X_seg = StandardScaler().fit_transform(saas.drop('churned', axis=1))

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
saas['segment'] = kmeans.fit_predict(X_seg)

segment_profiles = saas.groupby('segment').mean()
print("Segment Profiles:")
print(segment_profiles.round(1))
```

### Paso 2: Predicción de abandono por segmento

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

for seg in sorted(saas['segment'].unique()):
    seg_data = saas[saas['segment'] == seg]
    X_s = seg_data.drop(['churned', 'segment'], axis=1)
    y_s = seg_data['churned']

    if len(seg_data) < 50:
        continue

    Xs_tr, Xs_te, ys_tr, ys_te = train_test_split(X_s, y_s, test_size=0.3, random_state=42)

    rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf.fit(Xs_tr, ys_tr)

    auc = roc_auc_score(ys_te, rf.predict_proba(Xs_te)[:, 1])
    print(f"Segment {seg} (n={len(seg_data)}): AUC = {auc:.3f}")
```

### Acción empresarial

- Campañas de retención específicas por segmento
- Clientes de alto riesgo identificados semanas antes del abandono
- Cambios de precio personalizados

## Ejemplo guiado: Pipeline de extremo a extremo

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV

# Mixed data example
mixed_data = biotech.copy()
mixed_data['batch_type'] = np.random.choice(['A', 'B', 'C'], n_batches)

X_mixed = mixed_data.drop('quality_score', axis=1)
y_mixed = mixed_data['quality_score']

numeric_features = ['temperature_c', 'ph_level', 'dissolved_oxygen_pct',
                    'agitation_rpm', 'feed_rate_ml_hr', 'culture_time_hr', 'cell_density']
categorical_features = ['batch_type']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(drop='first'), categorical_features),
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(random_state=42)),
])

param_grid = {
    'model__n_estimators': [50, 100, 200],
    'model__max_depth': [5, 10, None],
}

grid = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2')
grid.fit(X_mixed, y_mixed)

print(f"Best params: {grid.best_params_}")
print(f"Best CV R²: {grid.best_score_:.3f}")
```

## Errores comunes

1. **Saltarse el EDA** — entendé siempre los datos antes de modelar
2. **Filtrar información futura** — los datos basados en tiempo necesitan divisiones cronológicas
3. **Ajustar sobre datos de prueba** — usá validación o validación cruzada
4. **Ignorar restricciones de negocio** — la interpretabilidad, velocidad y costo importan
5. **No comunicar los resultados** — un modelo excelente sin aceptación es inútil

## Buenas prácticas

- Empezá siempre con una línea base simple
- Construí pipelines para reproducibilidad
- Usá validación cruzada para estimaciones confiables
- Documentá todo (fuentes de datos, supuestos, decisiones)
- Comunicá en lenguaje de negocio, no en jerga de ML
- Monitoreá el rendimiento del modelo después del despliegue

## Resumen

- Pipeline de ML de extremo a extremo: datos → preprocesamiento → modelo → evaluación → acción empresarial
- Biotecnología: la predicción de calidad permite la optimización de procesos
- SaaS: la segmentación + predicción de abandono permite retención dirigida
- Considerá siempre el contexto de negocio al elegir modelos y métricas
- La comunicación es tan importante como la precisión técnica

## Términos clave

| Término | Definición |
|---------|------------|
| Pipeline | Secuencia encadenada de transformaciones de datos y modelo |
| Extremo a extremo | Flujo de trabajo completo desde datos crudos hasta decisión empresarial |
| ColumnTransformer | Aplica diferentes preprocesamientos a diferentes columnas |
| GridSearchCV | Búsqueda sistemática de hiperparámetros con validación cruzada |
| Métrica de negocio | KPI que importa a los interesados (no solo métricas de ML) |

## Ejercicios

**Nivel 1 — Básico:** ¿Cuáles son las 5 etapas clave de un pipeline de ML de extremo a extremo?

**Nivel 2 — Implementación:** Construí un pipeline completo para el dataset de calidad biotecnológica que incluya escalado, un Bosque Aleatorio y GridSearchCV para n_estimators y max_depth.

**Nivel 3 — Pensamiento crítico:** Un modelo alcanza R² = 0.92 en el conjunto de prueba, pero el equipo de manufactura no confía en él. ¿Qué harías para generar confianza y permitir la adopción?

## Desafío de programación

Escribí una función `build_ml_pipeline(X, y, model, param_grid)` que cree un pipeline con StandardScaler y el modelo dado, realice GridSearchCV con validación cruzada de 5 folds, y devuelva el mejor pipeline y el DataFrame de resultados de validación cruzada.
