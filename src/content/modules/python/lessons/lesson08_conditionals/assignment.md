# Assignment: Sistema de soporte a decisiones clínicas

## Objetivos

- Escribir lógica condicional compleja para escenarios del mundo real
- Usar if/elif/else con expresiones booleanas
- Aplicar conceptos de truthy/falsy
- Usar expresiones ternarias y sentencias match

## Instrucciones

Creá un script de Python `clinical_triage.py` que implemente un sistema de triaje clínico:

1. **Evaluación de signos vitales**: Dada la frecuencia cardíaca (bpm), la presión arterial sistólica, la presión arterial diastólica, la temperatura (°C) y la saturación de oxígeno (%), clasificá cada uno como normal o anormal.

2. **Nivel de triaje**: Asigná un nivel de triaje según la cantidad y la gravedad de los signos vitales anormales:
   - Nivel 1 (Reanimación): Cualquier anormalidad que ponga en riesgo la vida (por ejemplo, O2 < 85%, FC > 140 o < 40)
   - Nivel 2 (Emergencia): 2+ signos vitales anormales o cualquier anormalidad grave aislada
   - Nivel 3 (Urgente): 1 signo vital anormal
   - Nivel 4 (No urgente): Todos los signos vitales normales
   - Nivel 5 (Rutina): Solo seguimiento

3. **Recomendación**: Según el nivel de triaje, emití una recomendación.

4. Usá una sentencia `match` para el mapeo de nivel de triaje → recomendación.

## Esquema de código inicial

```python
def assess_vitals(hr, sbp, dbp, temp, spo2):
    """Returns dict of abnormal vitals."""


def determine_triage(vitals):
    """Returns triage level 1-5."""


def get_recommendation(triage_level):
    """Returns recommendation based on triage level."""
```

