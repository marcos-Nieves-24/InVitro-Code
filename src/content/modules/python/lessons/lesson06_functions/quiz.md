# Quiz: Funciones

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué palabra clave se usa para definir una función en Python?
- A) `function`
- B) `def`
- C) `define`
- D) `func`

**Q2:** ¿Qué devuelve una función si no hay una sentencia `return`?
- A) 0
- B) False
- C) None
- D) Error

**Q3:** ¿Qué tipo de argumento te permite especificar qué parámetro recibe el valor?
- A) Argumento posicional
- B) Argumento de palabra clave
- C) Argumento por defecto
- D) Argumento variable

**Q4:** ¿Qué es una función lambda?
- A) Una función que no toma argumentos
- B) Una función definida con `def`
- C) Una función anónima de una sola expresión
- D) Una función que devuelve None

**Q5:** ¿Dónde es accesible una variable creada dentro de una función?
- A) En todo el programa
- B) Solo dentro de la función
- C) Solo en el programa principal
- D) Solo en otras funciones

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre `return` y `print()` dentro de una función.

**Q7:** ¿Cuál es el problema con `def append_to(item, target=[])` y cómo lo solucionás?

## Pregunta de código

**Q8:** Escribí una función `is_even(n)` que devuelva `True` si `n` es par y `False` en caso contrario. Después escribí una lambda que haga lo mismo.

## Clave de respuestas

**Q1:** B) `def`

**Q2:** C) None

**Q3:** B) Argumento de palabra clave

**Q4:** C) Una función anónima de una sola expresión

**Q5:** B) Solo dentro de la función

**Q6:** `return` envía un valor de vuelta al llamador y sale de la función. `print()` muestra la salida en la consola pero no devuelve un valor al llamador. Una función puede hacer `print` sin `return` (devuelve None), o `return` sin `print`.

**Q7:** La lista por defecto `[]` se crea una sola vez cuando se define la función, no cada vez que se la llama. Todas las llamadas comparten la misma lista. Solución: usá `def append_to(item, target=None)` y creá una lista nueva adentro: `if target is None: target = []`.

**Q8:**
```python
def is_even(n):
    return n % 2 == 0

is_even_lambda = lambda n: n % 2 == 0

print(is_even(4))     # True
print(is_even_lambda(5))  # False
```
