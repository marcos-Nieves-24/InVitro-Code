```python
# =========================================================================
# LAB 8: Condicionales y toma de decisiones
# -------------------------------------------------------------------------
# Practicamos if/elif/else, valores truthy/falsy, expresiones ternarias,
# la sentencia match de Python 3.10+ y los condicionales anidados.
# =========================================================================

# PASO 1: if/elif/else basico.
# Clasificamos un numero como positivo, negativo o cero.
# En el original se pedía con input(); aqui usamos un valor fijo:
#   num = float(input("Enter a number: "))
num = -3.5
if num > 0:
    print(f"{num} es positivo")
elif num < 0:
    print(f"{num} es negativo")
else:
    print(f"{num} es cero")

# PASO 2: Valores truthy y falsy.
# En Python, ciertos valores se evaluan como False en un contexto
# booleano: 0, "", [], None y False. El resto son "truthy".
test_values = [0, 1, "", "hello", [], [1, 2], None, False, True]
print("\nValores truthy/falsy:")
for val in test_values:
    if val:
        print(f"  Truthy: {val!r}")
    else:
        print(f"  Falsy:  {val!r}")

# PASO 3: Expresion ternaria.
# Una forma compacta de if/else en una sola linea.
age = 17
can_vote = "Si" if age >= 18 else "No"
print(f"\nPuede votar (ternario): {can_vote}")

# La forma equivalente con if/else tradicional.
if age >= 18:
    can_vote = "Si"
else:
    can_vote = "No"
print(f"Puede votar (if/else): {can_vote}")

# PASO 4: Sentencia match (Python 3.10+).
# Match permite comparar contra multiples patrones de forma legible.
def get_day_type(day):
    match day.lower():
        case "monday" | "tuesday" | "wednesday" | "thursday" | "friday":
            return "Weekday"
        case "saturday" | "sunday":
            return "Weekend"
        case _:
            return "Invalid day"

print(f"\nmatch('Monday') -> {get_day_type('Monday')}")
print(f"match('Sunday') -> {get_day_type('Sunday')}")
print(f"match('Funday') -> {get_day_type('Funday')}")

# PASO 5: Condicionales anidados.
# Simulamos un sistema de login con condiciones dentro de condiciones.
# En el original las credenciales se pedian con input(); aqui van fijas:
#   username = input("Username: ")
#   password = input("Password: ")
username = "admin"
password = "secret123"

if username == "admin":
    if password == "secret123":
        print("\nBienvenido, admin!")
    else:
        print("\nContrasena incorrecta")
elif username == "guest":
    print("\nBienvenido, invitado (acceso limitado)")
else:
    print("\nUsuario desconocido")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Clasificamos numeros con if/elif/else.")
print("Reconocimos valores truthy/falsy.")
print("Usamos ternarios, la sentencia match y condicionales anidados.")
```