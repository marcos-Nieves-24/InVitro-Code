# Assignment: A prueba de errores de tipo

## Objetivos

- Demostrar comprensión de los tipos de datos de Python
- Manejar la conversión de tipos correctamente
- Depurar errores de tipo comunes
- Escribir código seguro respecto a los tipos

## Instrucciones

Crea un script de Python llamado `grade_calculator.py` que:

1. **Recolecte la entrada**: Pregunta por el nombre del estudiante (str), las notas de las tareas (3 números ingresados por separado) y el total de puntos posibles
2. **Calcule**: Calcula el promedio de notas y el porcentaje de calificación
3. **Convierta los tipos apropiadamente**: Toda la entrada llega como strings
4. **Asigne la calificación**: Usa lógica booleana para determinar aprobado/desaprobado (≥ 60% aprueba)
5. **Salida**: Imprime un informe de calificación con formato

También incluye una función `safe_divide(a, b)` que maneje la división de forma segura devolviendo `None` si `b` es cero.

