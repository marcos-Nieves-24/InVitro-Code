```python
# =========================================================================
# LAB 4: Tipos de datos en la practica
# -------------------------------------------------------------------------
# Practicamos la identificacion, conversion y el trabajo con los tipos de
# datos primitivos de Python: int, float, str, bool y None.
# =========================================================================

# PASO 1: Identificacion de tipos.
# Creamos una variable de cada tipo primitivo y las mostramos junto a su
# tipo con la funcion type().
a = 42              # entero
b = 3.14159         # flotante
c = "Bioinformatics"  # texto
d = True            # booleano
e = None            # valor nulo

for var in [a, b, c, d, e]:
    print(f"{var!r:>18} -> {type(var).__name__}")

# PASO 2: Conversion de tipos.
# Convertimos un texto a numero para poder operar matematicamente.
price_str = "49.99"
price = float(price_str)
quantity = 3
total = price * quantity
print(f"\nTotal: ${total:.2f}")

# Y un numero a texto para concatenarlo en un reporte.
count = 1500
report = "Samples processed: " + str(count)
print(report)

# PASO 3: La trampa del tipo de input().
# En un script normal input() devuelve SIEMPRE un texto (str). Si escribes:
#   age = input("Enter age: ")       # "25" como texto
#   next_year = age + 1              # ERROR: no puedes sumar str + int
# La solucion es convertir explicitamente con int():
#   age = int(input("Enter age: "))
# Aqui simulamos ese caso con un valor fijo que representa lo que el
# usuario escribiria: el texto "25".
age_str = "25"
print(f"\ninput() devuelve: {type(age_str).__name__} (el texto '25')")
age = int(age_str)
print(f"Tras int(): {type(age).__name__} (el numero 25)")
next_year = age + 1
print(f"El proximo ano tendras: {next_year}")

# PASO 4: Logica booleana.
# Evaluamos condiciones medicas con operadores de comparacion y logicos.
temperature = 38.5  # grados Celsius
has_fever = temperature > 37.5
print(f"\nTemperatura: {temperature}°C")
print(f"Tiene fiebre: {has_fever}")

is_coughing = True
is_tired = False
should_rest = has_fever or is_coughing or is_tired
print(f"Deberia descansar: {should_rest}")

# PASO 5: Precision de los flotantes.
# Los numeros de punto flotante no representan todas las fracciones con
# exactitud. El clasico ejemplo es 0.1 + 0.2.
print("\n0.1 + 0.2 =", 0.1 + 0.2)
print("0.1 + 0.2 == 0.3 ->", 0.1 + 0.2 == 0.3)
# Para comparar flotantes se usa una tolerancia (epsilon).
tolerancia = 1e-10
print("abs((0.1 + 0.2) - 0.3) < 1e-10 ->", abs((0.1 + 0.2) - 0.3) < tolerancia)

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Identificamos int, float, str, bool y None con type().")
print("Convertimos tipos con float(), str() e int().")
print("Recordamos que input() siempre devuelve str: hay que convertir.")
print("Comparamos flotantes con tolerancia, nunca con ==")
```