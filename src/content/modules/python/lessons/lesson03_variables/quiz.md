# Quiz: Variables

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál de los siguientes es un nombre de variable válido en Python?
- A) `2nd_place`
- B) `my-variable`
- C) `_count`
- D) `class`

**Q2:** ¿Cuál es el tipo de `x` después de `x = "42"`?
- A) int
- B) float
- C) str
- D) bool

**Q3:** ¿Qué devuelve siempre `input()`?
- A) int
- B) float
- C) str
- D) El tipo del valor ingresado

**Q4:** ¿Cuál es el valor de `a` y `b` después de `a, b = b, a` si inicialmente `a=3` y `b=7`?
- A) a=3, b=7
- B) a=7, b=3
- C) a=3, b=3
- D) Error

**Q5:** ¿Qué convención de nombres recomienda PEP 8 para las variables?
- A) camelCase
- B) PascalCase
- C) snake_case
- D) kebab-case

## Respuesta corta (2 preguntas)

**Q6:** Explicá qué significa el tipado dinámico en Python y da un ejemplo.

**Q7:** ¿Por qué no podés usar `if` o `for` como nombres de variables?

## Pregunta de código

**Q8:** Escribí código que:
1. Le pregunte al usuario su nombre, edad y color favorito
2. Los almacene en variables
3. Imprima "Hello [name], you are [age] years old and your favorite color is [color]."

## Clave de respuestas

**Q1:** C) `_count`

**Q2:** C) str

**Q3:** C) str

**Q4:** B) a=7, b=3

**Q5:** C) snake_case

**Q6:** El tipado dinámico significa que una variable puede cambiar de tipo durante la ejecución. Por ejemplo:
```python
x = 10      # x is int
x = "hello" # x is now str
```
El tipo lo determina el valor asignado, no se declara de antemano.

**Q7:** `if` y `for` son palabras reservadas en Python. Son parte de la sintaxis del lenguaje. Usarlas como nombres de variables crearía ambigüedad entre la palabra clave y la variable, por lo que Python lanza un `SyntaxError`.

**Q8:**
```python
name = input("Enter your name: ")
age = input("Enter your age: ")
color = input("Enter your favorite color: ")
print(f"Hello {name}, you are {age} years old and your favorite color is {color}.")
```
