# Quiz: Conjuntos

## Opción múltiple (5 preguntas)

**Q1:** ¿Cómo creas un conjunto vacío en Python?
- A) `{}`
- B) `set()`
- C) `[]`
- D) `empty_set()`

**Q2:** ¿Cuál es la salida de `set([1, 2, 2, 3, 1, 3])`?
- A) {1, 2, 3}
- B) {1, 2, 2, 3, 1, 3}
- C) [1, 2, 3]
- D) (1, 2, 3)

**Q3:** ¿Qué devuelve `{1, 2, 3} & {3, 4, 5}`?
- A) {3}
- B) {1, 2, 3, 4, 5}
- C) {1, 2}
- D) {4, 5}

**Q4:** ¿Qué tipo de dato se puede agregar a un conjunto?
- A) Lista
- B) Diccionario
- C) Tupla
- D) Conjunto

**Q5:** ¿Cuál es la complejidad temporal de `element in my_set`?
- A) O(1)
- B) O(n)
- C) O(log n)
- D) O(n²)

## Respuesta corta (2 preguntas)

**Q6:** Explica la diferencia entre `remove()` y `discard()` para conjuntos.

**Q7:** ¿Qué es un frozenset y cuándo lo usarías?

## Pregunta de código

**Q8:** Escribe una función `common_elements(list1, list2)` que devuelva un conjunto con los elementos que aparecen en ambas listas.

## Clave de respuestas

**Q1:** B) `set()`

**Q2:** A) {1, 2, 3}

**Q3:** A) {3}

**Q4:** C) Tupla

**Q5:** A) O(1)

**Q6:** `remove(x)` elimina x del conjunto pero lanza un KeyError si x no está presente. `discard(x)` también elimina x pero no hace nada si x no está presente (sin error). Usa `discard` cuando no estés seguro de que el elemento exista.

**Q7:** Un frozenset es una versión inmutable de un conjunto. No se puede modificar después de su creación (sin add, remove, etc.). Usa frozenset cuando necesites un objeto con características de conjunto y hashable, como usar un conjunto como clave de diccionario o como elemento de otro conjunto.

**Q8:**
```python
def common_elements(list1, list2):
    return set(list1) & set(list2)

print(common_elements([1, 2, 3, 4], [3, 4, 5, 6]))  # {3, 4}
```
