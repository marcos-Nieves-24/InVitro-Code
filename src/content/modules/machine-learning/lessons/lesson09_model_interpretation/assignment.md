# Assignment 9: Interpretación de modelos

## Objetivos

- Interpreta un modelo complejo usando múltiples métodos
- Comunica los hallazgos a una audiencia no técnica
- Haz una recomendación basada en datos

## Dataset

Usa el dataset de **Breast Cancer**. Entrena un `RandomForestClassifier`.

## Escenario

Eres una data scientist en un hospital. Construiste un modelo de diagnóstico de cáncer con >95% de exactitud. El equipo clínico quiere entender el modelo antes de desplegarlo.

## Instrucciones

1. **Entrena** un Random Forest (ajustálo brevemente)
2. **Interpretación global:**
   - Calcula la importancia por permutación (top 5 features)
   - Crea los PDP de las top 2 features
   - Escribe una explicación en lenguaje sencillo de qué impulsa las predicciones de cáncer
3. **Interpretación local:**
   - Elige 2 muestras de prueba (una maligna, una benigna)
   - Explica cada predicción usando las top features
   - Para cada una, di qué empujó la predicción hacia maligno o benigno
4. **Valida con conocimiento del dominio:**
   - Verifica: ¿las features importantes tienen sentido clínico?
   - ¿Hay alguna feature sospechosa que pueda causar sesgo?
5. **Escribe un memo** (máx. 500 palabras) para el equipo clínico:
   - ¿Cómo funciona el modelo?
   - ¿Qué features son las más importantes?
   - ¿Cuáles son las limitaciones?
   - ¿Recomendarías el despliegue?

