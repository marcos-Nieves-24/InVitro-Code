# Quiz: Listas

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál es el resultado de `[1, 2, 3, 4][::-1]`?
- A) [4, 3, 2, 1]
- B) [1, 3]
- C) [2, 4]
- D) Error

**Q2:** ¿Qué hace `fruits.append("orange")`?
- A) Agrega "orange" al principio
- B) Agrega "orange" al final
- C) Reemplaza el último elemento
- D) Elimina "orange"

**Q3:** ¿Cuál es la salida de `len([[1, 2], [3, 4], 5])`?
- A) 3
- B) 5
- C) 4
- D) 6

**Q4:** ¿Qué list comprehension crea una lista de números pares del 0 al 10?
- A) `[x for x in range(11) if x % 2 == 0]`
- B) `[x for x in range(11) if x % 2 != 0]`
- C) `[x for x in range(11) if x % 2]`
- D) `[x for x in range(10) while x % 2 == 0]`

**Q5:** ¿Cuál es el resultado de `[1, 2, 3] + [4, 5]`?
- A) [1, 2, 3, 4, 5]
- B) [5, 7, 8]
- C) Error
- D) [[1, 2, 3], [4, 5]]

## Respuesta corta (2 preguntas)

**Q6:** Explica la diferencia entre `append()` y `extend()` para listas.

**Q7:** ¿Qué significa que las listas sean mutables? Da un ejemplo.

## Pregunta de código

**Q8:** Escribe una list comprehension que cree una lista de los primeros 10 números cuadrados (1, 4, 9, 16, ..., 100).

## Clave de respuestas

**Q1:** A) [4, 3, 2, 1]

**Q2:** B) Agrega "orange" al final

**Q3:** A) 3

**Q4:** A) `[x for x in range(11) if x % 2 == 0]`

**Q5:** A) [1, 2, 3, 4, 5]

**Q6:** `append()` agrega su argumento como un solo elemento al final de la lista, incluso si el argumento es a su vez una lista (se convierte en una lista anidada). `extend()` itera sobre su argumento y agrega cada elemento de forma individual, aplanando el iterable dentro de la lista.

**Q7:** Mutable significa que el contenido de la lista se puede modificar después de crearla. Ejemplo:
```python
items = [1, 2, 3]
items[1] = 99  # items is now [1, 99, 3]
items.append(4)  # items is now [1, 99, 3, 4]
```
El objeto de la lista se modifica en su lugar.

**Q8:**
```python
squares = [n ** 2 for n in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```
