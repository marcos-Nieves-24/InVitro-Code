# Lab 2: Regresión Lineal

## Objetivos

- Implementar regresión lineal simple y múltiple
- Interpretar los coeficientes y evaluar el rendimiento del modelo
- Detectar violaciones de los supuestos de la regresión lineal
- Comparar la solución de forma cerrada de OLS con la implementación de sklearn

## Datos

Usá el dataset de **California Housing**.

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

## Parte 1: Regresión lineal simple

Usá solo `MedInc` (ingreso medio) para predecir `MedHouseVal`. Ajustá el modelo, graficá la línea de regresión sobre el scatter plot e informá el R².

## Parte 2: Regresión lineal múltiple

Usá las 8 features. Informá:
- R², MSE, RMSE
- Valores de los coeficientes (ordenados por valor absoluto)
- ¿Qué feature tiene el mayor impacto positivo? ¿El mayor impacto negativo?

## Parte 3: Análisis de residuos

Calculá los residuos: $e_i = y_i - \hat{y}_i$

1. Graficá los residuos vs. los valores predichos — ¿ves algún patrón?
2. Graficá un histograma de los residuos — ¿son aproximadamente normales?
3. Calculá la correlación entre los residuos y cada feature — debería ser cercana a 0.

## Parte 4: Verificación de multicolinealidad

Calculá la matriz de correlación de las 8 features. ¿Hay pares altamente correlacionados (|r| > 0.7)? ¿Cómo afectaría esto tu interpretación de los coeficientes?

## Parte 5: OLS desde cero

Implementá la solución de forma cerrada y verificá que los coeficientes coinciden con los de sklearn.

## Entregables

- Notebook o script con las 5 partes
- 3 gráficos (línea de regresión, residuos vs. ajustados, histograma de residuos)
- Interpretación escrita de los gráficos de residuos

## Tiempo estimado: 45 minutos
