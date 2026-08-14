# Quiz: NumPy

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué función crea un array de ceros con forma (3, 4)?
- A) `np.zeros([3, 4])`
- B) `np.zeros((3, 4))`
- C) `np.zero(3, 4)`
- D) `np.zeros(3, 4)`

**Q2:** ¿Cuál es la salida de `np.array([1, 2, 3]) + 10`?
- A) [11, 12, 13]
- B) [1, 2, 3, 10]
- C) Error
- D) [10, 11, 12, 13]

**Q3:** Para un array 2D con forma (5, 3), ¿qué devuelve `arr[:, 1]`?
- A) La fila 1
- B) La columna 1
- C) El array completo
- D) El elemento [1, 1]

**Q4:** ¿Qué te permite hacer el broadcasting?
- A) Operar sobre arrays con distintas formas
- B) Enviar arrays por la red
- C) Difundir advertencias
- D) Convertir arrays en listas de Python

**Q5:** ¿Qué operador realiza la multiplicación de matrices en Python 3.5+?
- A) `*`
- B) `@`
- C) `&`
- D) `%`

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre una vista y una copia en NumPy.

**Q7:** ¿Qué es la vectorización y por qué es más rápida que los bucles de Python?

## Pregunta de código

**Q8:** Escribí código de NumPy para crear un array de 3×3 de números aleatorios de una distribución normal y después calculá la media y la desviación estándar de todos los elementos.

## Clave de respuestas

**Q1:** B) `np.zeros((3, 4))`

**Q2:** A) [11, 12, 13]

**Q3:** B) Columna 1

**Q4:** A) Operar sobre arrays con distintas formas

**Q5:** B) `@`

**Q6:** Una vista es otra forma de acceder a los mismos datos subyacentes: modificar una vista modifica el original. Una copia es un array independiente con sus propios datos. El rebanado devuelve una vista; `.copy()` crea una copia. Usá `.copy()` cuando necesites modificar una rebanada de forma independiente.

**Q7:** La vectorización significa aplicar una operación a un array completo de una vez en lugar de recorrer los elementos individuales en un bucle. Las operaciones de NumPy están implementadas en C y operan sobre bloques de memoria contiguos, lo que las hace 10-100 veces más rápidas que los bucles equivalentes en Python. NumPy también usa instrucciones SIMD en CPUs modernas para operaciones en paralelo.

**Q8:**
```python
import numpy as np
arr = np.random.randn(3, 3)
print(f"Array:\n{arr}")
print(f"Mean: {arr.mean():.3f}")
print(f"Std: {arr.std():.3f}")
```
