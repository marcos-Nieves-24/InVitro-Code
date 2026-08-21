# Assignment: Procesamiento de datos con listas

## Objetivos

- Crear y manipular listas de forma eficaz
- Usar list comprehensions para código conciso
- Trabajar con listas anidadas (matrices)
- Procesar datos usando listas y bucles

## Instrucciones

Crea un script de Python `list_processor.py` que realice las siguientes tareas:

1. **Análisis de temperaturas**: Dada una lista de temperaturas diarias, calcula el mínimo, el máximo y el promedio, e identifica los días por encima del promedio.

2. **Transposición de matrices**: Dada una matriz (lista de listas), calcula su transpuesta y la multiplicación de matrices (producto punto) con otra matriz.

3. **Análisis de secuencias**: Dada una secuencia de ADN como cadena, crea una lista de todos los codones (bloques de 3 bases), cuenta las ocurrencias de cada codón y encuentra el codón más frecuente.

4. **Promedio móvil**: Implementa una función `moving_average(data, window_size)` usando list comprehension.

5. **Detección de valores atípicos**: Dada una lista de números, identifica los valores atípicos usando el método IQR (Q1 - 1.5*IQR, Q3 + 1.5*IQR).

## Datos iniciales

```python
temperatures = [36.1, 37.2, 38.5, 36.8, 37.0, 39.1, 36.5, 37.8, 38.0, 36.9]
matrix_a = [[1, 2], [3, 4], [5, 6]]
matrix_b = [[7, 8, 9], [10, 11, 12]]
dna = "ATGCGATCGAATTCGATCGATCGAATTCGATCGA"
data_points = [10, 12, 11, 13, 45, 12, 11, 10, 13, 12, 48, 11, 10, 13]
```

