# Lab 9: Interpretación de modelos

## Objetivos

- Calculá e interpretá la importancia por permutación
- Generá e interpretá los gráficos de dependencia parcial
- Compará la importancia basada en impureza vs. la importancia por permutación
- Entendé cómo afectan las correlaciones a la importancia

## Parte 1: Importancia por permutación en breast cancer

Entrená un `RandomForestClassifier` en breast cancer. Calculá tanto la importancia por impureza como la importancia por permutación. Creá un DataFrame que las compare. Graficá las top 10 features según la importancia por permutación con barras de error.

**Pregunta:** ¿Cuáles top features difieren entre los dos métodos?

## Parte 2: Dependencia parcial

Creá los PDP de las top 3 features según la importancia por permutación. Para cada una, describí la forma de la curva.

**Pregunta:** ¿El PDP coincide con el conocimiento clínico sobre breast cancer?

## Parte 3: Experimento con features correlacionadas

```python
np.random.seed(42)
n = 500
X_corr = np.random.randn(n, 5)
X_corr[:, 1] = X_corr[:, 0] * 0.95 + np.random.randn(n) * 0.1  # Correlated
y_corr = X_corr[:, 0] + X_corr[:, 2] + np.random.randn(n) * 0.5
```

Entrená un RandomForestRegressor. Calculá la importancia por permutación.

**Pregunta:** ¿Qué pasa con la importancia de la feature 0 y la feature 1? ¿Por qué?

## Parte 4: PDP para California Housing

Entrená un RF en California Housing. Creá los PDP de MedInc, AveOccup y Latitude.

**Pregunta:** ¿Qué revela el PDP de Latitude sobre el mercado inmobiliario de California?

## Parte 5: Explicación local con SHAP (conceptual)

Si SHAP está instalado: elegí una muestra de prueba y creá un SHAP waterfall plot. Si no, explicá qué esperarías ver.

## Entregables

- Notebook con las 5 partes
- Gráfico de barras con la comparación de importancia (Parte 1)
- PDP de las top features (Parte 2)
- Resultados del experimento de correlación (Parte 3)

## Tiempo estimado: 45 minutos
