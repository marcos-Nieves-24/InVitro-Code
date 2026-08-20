# Assignment 9: Interpretación de modelos

## Objetivos

- Interpretá un modelo complejo usando múltiples métodos
- Comunicá los hallazgos a una audiencia no técnica
- Hacé una recomendación basada en datos

## Dataset

Usá el dataset de **Breast Cancer**. Entrená un `RandomForestClassifier`.

## Escenario

Sos una data scientist en un hospital. Construiste un modelo de diagnóstico de cáncer con >95% de exactitud. El equipo clínico quiere entender el modelo antes de desplegarlo.

## Instrucciones

1. **Entrená** un Random Forest (ajustálo brevemente)
2. **Interpretación global:**
   - Calculá la importancia por permutación (top 5 features)
   - Creá los PDP de las top 2 features
   - Escribí una explicación en lenguaje sencillo de qué impulsa las predicciones de cáncer
3. **Interpretación local:**
   - Elegí 2 muestras de prueba (una maligna, una benigna)
   - Explicá cada predicción usando las top features
   - Para cada una, decí qué empujó la predicción hacia maligno o benigno
4. **Validá con conocimiento del dominio:**
   - Verificá: ¿las features importantes tienen sentido clínico?
   - ¿Hay alguna feature sospechosa que pueda causar sesgo?
5. **Escribí un memo** (máx. 500 palabras) para el equipo clínico:
   - ¿Cómo funciona el modelo?
   - ¿Qué features son las más importantes?
   - ¿Cuáles son las limitaciones?
   - ¿Recomendarías el despliegue?

