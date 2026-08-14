# Assignment: A prueba de errores de tipo

## Objetivos

- Demostrar comprensión de los tipos de datos de Python
- Manejar la conversión de tipos correctamente
- Depurar errores de tipo comunes
- Escribir código seguro respecto a los tipos

## Instrucciones

Creá un script de Python llamado `grade_calculator.py` que:

1. **Recolecte la entrada**: Preguntá por el nombre del estudiante (str), las notas de las tareas (3 números ingresados por separado) y el total de puntos posibles
2. **Calcule**: Calculá el promedio de notas y el porcentaje de calificación
3. **Convierta los tipos apropiadamente**: Toda la entrada llega como strings
4. **Asigne la calificación**: Usá lógica booleana para determinar aprobado/desaprobado (≥ 60% aprueba)
5. **Salida**: Imprimí un informe de calificación con formato

También incluí una función `safe_divide(a, b)` que maneje la división de forma segura devolviendo `None` si `b` es cero.

## Entregables

- `grade_calculator.py`
- Ejemplo de salida mostrando al menos dos cálculos de calificaciones de estudiantes

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Conversión de tipos | Toda la entrada convertida correctamente | La mayoría de las conversiones correctas | Conversiones faltantes |
| Cálculos | Precisos y correctos | Errores menores | Errores mayores |
| Lógica booleana | Aprobado/desaprobado correcto con casos límite | Lógica básica | Errores de lógica |
| Manejo de errores | Maneja la división por cero y la entrada inválida | Manejo básico | Sin manejo de errores |
| Calidad del código | Bien comentado, PEP 8, organizado | Aceptable | Mala calidad |

## Tiempo estimado

45 minutos
