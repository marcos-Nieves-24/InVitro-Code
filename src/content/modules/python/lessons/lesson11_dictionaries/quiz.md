# Quiz: Diccionarios

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué pasa si accedés a `d["missing"]` cuando la clave no existe?
- A) Devuelve None
- B) Lanza un KeyError
- C) Crea la clave
- D) Devuelve False

**Q2:** ¿Cuál de los siguientes puede ser una clave de diccionario?
- A) Lista
- B) Diccionario
- C) Tupla
- D) Conjunto

**Q3:** ¿Qué devuelve `d.get("key", "default")` si "key" no está en el diccionario?
- A) None
- B) "default"
- C) KeyError
- D) False

**Q4:** ¿Cómo iterás sobre claves y valores a la vez en un diccionario d?
- A) `for k in d:`
- B) `for k, v in d:`
- C) `for k, v in d.items():`
- D) `for v in d.values():`

**Q5:** ¿Cuál es la complejidad temporal de la búsqueda de claves en un diccionario?
- A) O(1)
- B) O(n)
- C) O(log n)
- D) O(n²)

## Respuesta corta (2 preguntas)

**Q6:** Explicá por qué las listas no pueden usarse como claves de diccionario pero las tuplas sí.

**Q7:** ¿Cuál es la diferencia entre `d.get(key)` y `d[key]`?

## Pregunta de código

**Q8:** Escribí una función `count_characters(s)` que devuelva un diccionario con las frecuencias de cada carácter de una cadena. Por ejemplo, `count_characters("hello")` debería devolver `{"h": 1, "e": 1, "l": 2, "o": 1}`.

## Clave de respuestas

**Q1:** B) Lanza un KeyError

**Q2:** C) Tupla

**Q3:** B) "default"

**Q4:** C) `for k, v in d.items():`

**Q5:** A) O(1)

**Q6:** Las claves de los diccionarios deben ser hashables — necesitan un valor de hash estable que no cambie. Las listas son mutables (se pueden modificar), así que su hash cambiaría si se modificaran, rompiendo el diccionario. Las tuplas son inmutables, por lo que su hash es estable y se pueden usar como claves.

**Q7:** `d[key]` lanza un KeyError si la clave no existe. `d.get(key)` devuelve None si la clave no existe (o un valor por defecto si se lo proporcionás). `get()` es más seguro y se prefiere cuando no estás seguro de que la clave exista.

**Q8:**
```python
def count_characters(s):
    counts = {}
    for char in s:
        counts[char] = counts.get(char, 0) + 1
    return counts

print(count_characters("hello"))
```
