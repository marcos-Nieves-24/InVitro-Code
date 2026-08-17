```python
# =========================================================================
# LAB 5: Operadores en accion
# -------------------------------------------------------------------------
# Practicamos los operadores aritmeticos, de comparacion, logicos y de
# asignacion, con ejemplos numericos, de paridad y de condiciones
# ambientales.
# =========================================================================

# PASO 1: Operadores aritmeticos.
# Python distingue entre division real (/), division entera (//) y
# modulo (%). Tambien soporta la potenciacion con **.
a, b = 20, 7
print(f"a = {a}, b = {b}")
print(f"a + b = {a + b}")
print(f"a - b = {a - b}")
print(f"a * b = {a * b}")
print(f"a / b = {a / b:.4f}   (division real)")
print(f"a // b = {a // b}     (division entera)")
print(f"a % b = {a % b}       (resto de la division)")
print(f"a ** b = {a ** b}     (potencia)")

# PASO 2: Verificador de par o impar.
# El operador modulo % devuelve 0 cuando el numero es divisible por 2.
# En el original se pedía el numero con input(); aqui usamos un fijo:
#   num = int(input("Enter a number: "))
num = 37
if num % 2 == 0:
    print(f"\n{num} es par")
else:
    print(f"\n{num} es impar")

# PASO 3: Tabla de verdad de los operadores logicos.
# and, or y not operan sobre valores booleanos (True/False).
print("\n--- Tabla de verdad: and ---")
print(f"True  and True  = {True and True}")
print(f"True  and False = {True and False}")
print(f"False and True  = {False and True}")
print(f"False and False = {False and False}")

print("\n--- Tabla de verdad: or ---")
print(f"True  or True   = {True or True}")
print(f"True  or False  = {True or False}")
print(f"False or True   = {False or True}")
print(f"False or False  = {False or False}")

print("\n--- Negacion: not ---")
print(f"not True  = {not True}")
print(f"not False = {not False}")

# PASO 4: Operadores de asignacion.
# Atajos que combinan una operacion con la asignacion.
x = 10
print(f"\nInicial: x = {x}")
x += 5
print(f"Despues de x += 5: x = {x}")
x *= 2
print(f"Despues de x *= 2: x = {x}")
x -= 7
print(f"Despues de x -= 7: x = {x}")
x //= 3
print(f"Despues de x //= 3: x = {x}")

# PASO 5: Condicion compuesta (clima).
# Combinamos comparaciones con and/not para tomar una decision.
# En el original los valores se pedian con input(); aqui van fijos:
#   temperature = float(input("Enter temperature (C): "))
#   humidity = float(input("Enter humidity (%): "))
temperature = 33.0
humidity = 80.0

is_hot = temperature > 30
is_humid = humidity > 70
is_uncomfortable = is_hot and is_humid
is_pleasant = not is_hot and not is_humid

print(f"\nTemperatura: {temperature}°C, Humedad: {humidity}%")
print(f"Caluroso: {is_hot}, Humedo: {is_humid}")
print(f"Incomodo: {is_uncomfortable}")
print(f"Agradable: {is_pleasant}")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Repasamos +, -, *, /, //, %, ** y los atajos de asignacion.")
print("Combinamos comparaciones y logicos para tomar decisiones.")
```