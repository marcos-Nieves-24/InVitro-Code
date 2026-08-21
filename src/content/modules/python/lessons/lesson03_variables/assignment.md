# Assignment: Variables en la práctica

## Objetivos

- Demostrar asignación y reasignación de variables
- Usar la conversión de tipos correctamente
- Implementar un pipeline de datos simple usando variables
- Aplicar convenciones de nombres

## Instrucciones

Crea un script de Python `patient_analysis.py` que:

1. **Recolección de datos**: Usa `input()` para recolectar:
   - ID del paciente
   - Edad (años)
   - Altura (metros)
   - Peso (kilogramos)
   - Presión arterial sistólica
   - Presión arterial diastólica

2. **Cálculos**: Calcula:
   - BMI = weight / (height²)
   - Presión arterial media = diastolic + (systolic - diastolic) / 3

3. **Clasificación**: Determina:
   - Categoría de BMI (bajo peso < 18.5, normal 18.5-24.9, sobrepeso 25-29.9, obesidad ≥ 30)
   - Categoría de presión arterial (normal: sistólica < 120 Y diastólica < 80)

4. **Salida**: Imprime un informe resumido del paciente con formato

