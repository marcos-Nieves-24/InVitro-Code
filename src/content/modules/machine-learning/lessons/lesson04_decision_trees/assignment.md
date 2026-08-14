# Assignment 4: Árboles de Decisión

## Objetivos

- Construir un árbol de decisión interpretable para un problema de diagnóstico médico
- Ajustar los hiperparámetros para prevenir el sobreajuste
- Presentar un árbol visual que pueda explicarse a los clínicos

## Dataset

Usá el dataset de **Breast Cancer Wisconsin** de scikit-learn.

## Escenario

Estás construyendo una herramienta de soporte a decisiones clínicas. La herramienta debe:
1. Ser interpretable (los médicos necesitan entender por qué se hace una predicción)
2. Ser lo más pequeña posible (máx. 5 niveles de profundidad para la legibilidad)
3. Alcanzar al menos 90% de exactitud en prueba

## Instrucciones

1. **Dividí** entrenamiento (70%), validación (15%) y prueba (15%)
2. **Ajustá los hiperparámetros** usando el set de validación:
   - max_depth: [2, 3, 4, 5]
   - min_samples_split: [2, 5, 10, 20]
   - min_samples_leaf: [1, 5, 10]
3. **Seleccioná el mejor modelo** que cumpla todos los requisitos
4. **Visualizá** el árbol final
5. **Extraé las reglas de decisión** del árbol (p. ej., "Si worst radius > 15 y worst concave points > 0.1 → malignant")
6. **Evaluá** en el set de prueba

## Entregables

- Notebook con el código
- Árbol de decisión visualizado (exportado como PNG)
- Lista de 5-10 reglas de decisión extraídas del árbol
- Informe corto que responda:
  - ¿Qué hiperparámetros elegiste y por qué?
  - ¿Cuál es la exactitud de prueba?
  - ¿Cuántas reglas se necesitan para cubrir el 90% de los casos?

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| Ajuste de hiperparámetros | Búsqueda sistemática, justificada | Búsqueda básica | Mínima | Faltante |
| Visualización del árbol | Clara, etiquetada, exportada | Visible | Mala calidad | Faltante |
| Reglas de decisión | 5+ reglas claras | 3-4 reglas | 1-2 reglas | Faltante |
| Interpretabilidad | Explicación apta para médicos | Clara | Vaga | Faltante |
| Rendimiento | ≥90% con ≤5 de profundidad | Cumple uno | No cumple ninguno | No evaluado |

## Tiempo estimado: 2 horas
