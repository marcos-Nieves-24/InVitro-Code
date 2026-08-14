# Lab 10: Aplicaciones — Pipelines de extremo a extremo

## Objetivos

- Construí pipelines de ML completos para regresión y clasificación
- Trabajá con tipos de datos mixtos (numéricos + categóricos)
- Usá GridSearchCV para el ajuste de hiperparámetros
- Combiná clustering con clasificación

## Parte 1: Pipeline de calidad biotecnológica

Creá un pipeline para el dataset de calidad biotecnológica:
1. Creá el dataset sintético (500 muestras)
2. Construí un Pipeline: StandardScaler → RandomForestRegressor
3. Realizá GridSearchCV sobre n_estimators y max_depth
4. Reportá los mejores parámetros y el R² de validación cruzada

## Parte 2: Comparación de modelos

Compará LinearRegression, RandomForestRegressor y GradientBoostingRegressor en el dataset biotecnológico. Usá pipelines con StandardScaler. Reportá RMSE y R².

**Pregunta:** ¿Cuál modelo rinde mejor y por qué?

## Parte 3: Pipeline con datos mixtos

Agregá una feature categórica `batch_type` a los datos biotecnológicos. Creá un ColumnTransformer que escale las features numéricas y haga one-hot encoding de las features categóricas. Construí un pipeline completo y ajustálo.

## Parte 4: Segmentación SaaS + churn

1. Generá el dataset de clientes SaaS
2. Segmentá los clientes con K-Means (K=3)
3. Perfilá cada segmento
4. Entrená un modelo de churn por segmento
5. Compará el AUC entre segmentos

**Pregunta:** ¿Los distintos segmentos tienen diferentes drivers de churn?

## Parte 5: Función de pipeline completo

Escribí una función reutilizable que tome X, y, un modelo y un param_grid, y devuelva el mejor pipeline después de GridSearchCV con validación cruzada de 5 folds.

## Entregables

- Notebook con las 5 partes
- Pipeline con resultados de GridSearchCV (Parte 1)
- Tabla de comparación de modelos (Parte 2)
- Perfiles de segmento (Parte 4)

## Tiempo estimado: 45 minutos
