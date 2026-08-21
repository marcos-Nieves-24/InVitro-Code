# Assignment 2: Regresión Lineal

## Objetivos

- Aplicar la regresión lineal a un problema real
- Comparar múltiples subconjuntos de features
- Diagnosticar violaciones de supuestos
- Escribir un informe profesional

## Dataset

Alternativa a **Boston Housing**: usa `fetch_california_housing` de scikit-learn.

## Instrucciones

1. **Divide** los datos en entrenamiento (70%), validación (15%) y prueba (15%)
2. **Entrena tres modelos:**
   - Modelo A: solo MedInc (simple)
   - Modelo B: las 8 features
   - Modelo C: las 8 features + términos de interacción (MedInc × AveRooms, Latitude × Longitude)
3. **Evalúa** cada modelo en el set de validación usando R² y RMSE
4. **Analiza los residuos** del mejor modelo
5. **Selecciona el mejor modelo** y evalúa en el set de prueba

