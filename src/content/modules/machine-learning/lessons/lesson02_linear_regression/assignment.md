# Assignment 2: Regresión Lineal

## Objetivos

- Aplicar la regresión lineal a un problema real
- Comparar múltiples subconjuntos de features
- Diagnosticar violaciones de supuestos
- Escribir un informe profesional

## Dataset

Alternativa a **Boston Housing**: usá `fetch_california_housing` de scikit-learn.

## Instrucciones

1. **Dividí** los datos en entrenamiento (70%), validación (15%) y prueba (15%)
2. **Entrená tres modelos:**
   - Modelo A: solo MedInc (simple)
   - Modelo B: las 8 features
   - Modelo C: las 8 features + términos de interacción (MedInc × AveRooms, Latitude × Longitude)
3. **Evaluá** cada modelo en el set de validación usando R² y RMSE
4. **Analizá los residuos** del mejor modelo
5. **Seleccioná el mejor modelo** y evaluá en el set de prueba

