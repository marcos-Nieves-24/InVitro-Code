# Assignment: Registros de datos con tuplas

## Objetivos

- Usar tuplas para representar registros estructurados
- Practicar el desempaquetado de tuplas
- Entender cuándo la inmutabilidad es beneficiosa
- Usar tuplas como valores de retorno de funciones de forma eficaz

## Instrucciones

Crea un script de Python `student_records.py` que:

1. **Definición de registros**: Crea una lista de registros de estudiantes, cada uno como tupla: `(student_id, name, [grades])` donde grades es una lista de notas de exámenes.

2. **Funciones con tuplas**:
   - `average_grade(student)` — devuelve `(student_id, name, avg_score)`
   - `top_student(students)` — devuelve la tupla del estudiante con el promedio más alto
   - `passed_students(students, threshold=60)` — devuelve una lista de tuplas de estudiantes aprobados
   - `grade_summary(students)` — devuelve una tupla con (class_average, highest_avg, lowest_avg, num_passed, num_failed)

3. **Análisis**: Usa las funciones para analizar los datos e imprime un resumen formateado.

## Datos iniciales

```python
students = [
    ("S001", "Alice", [85, 92, 78, 95]),
    ("S002", "Bob", [45, 55, 60, 50]),
    ("S003", "Charlie", [70, 75, 80, 72]),
    ("S004", "Diana", [95, 98, 92, 96]),
    ("S005", "Eve", [30, 40, 35, 45]),
]
```

