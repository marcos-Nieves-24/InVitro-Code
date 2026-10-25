# Subunidad 3: Temas Avanzados

## Descripción

Los ensembles secuenciales dominan el ML tabular moderno. Esta subunidad cubre Gradient Boosting — el algoritmo que gana competencias — y técnicas de interpretación para entender qué aprenden los modelos complejos.

## Lecciones

| # | Lección | Tema principal |
|---|---------|---------------|
| L8 | Gradient Boosting | Boosting secuencial, learning rate, XGBoost/LightGBM |
| L9 | Interpretación de Modelos | Permutation importance, PDP, SHAP, LIME |

## Temas complementarios

- **XGBoost:** Regularización L1/L2, manejo de nulos, GPU acceleration
- **LightGBM:** Gradient-based One-Side Sampling, Exclusive Feature Bundling
- **CatBoost:** Manejo nativo de variables categóricas
- **SHAP values:** Teoría de juegos de Shapley aplicada a ML
- **ALE plots:** Alternativa a PDP para features correlacionadas

## Habilidades clave

- Elegir entre Bagging y Boosting según el problema
- Ajustar learning rate, n_estimators y max_depth con early stopping
- Explicar predicciones individuales con SHAP/LIME
- Identificar qué features realmente importan (no solo las que el modelo dice)

## Aplicaciones

- **Biotecnología:** Predicción de afinidad fármaco-proteína con XGBoost
- **SaaS:** Ranking de leads por probabilidad de conversión
- **Finanzas:** Credit scoring con modelos interpretables (regulatorio)
