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

## Entregables

- `clinical_triage.py` con todas las funciones y la demostración
- Probá el sistema con al menos 3 escenarios de pacientes

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Lógica condicional | Correcta y completa | Mayormente correcta | Errores de lógica |
| Reglas de triaje | Todos los niveles correctamente implementados | La mayoría de los niveles | Faltan niveles |
| Sentencia match | Usada apropiadamente | Usada pero básica | No usada |
| Pruebas | 3+ casos de prueba con salida | 2 casos de prueba | 1 o ninguno |
| Calidad del código | Limpio, bien comentado | Aceptable | Mala |

## Tiempo estimado

75 minutos
