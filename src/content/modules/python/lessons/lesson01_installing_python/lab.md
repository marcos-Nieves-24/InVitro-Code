```python
# =========================================================================
# LAB 1: Configuracion de tu entorno de Python
# -------------------------------------------------------------------------
# En el laboratorio original instalabas Python, creabas un virtual
# environment y verificabas la instalacion con un script. Aqui no puedes
# ejecutar comandos de terminal, pero SI puedes verificar tu entorno real
# de Python (el de Pyodide) y repasar cada concepto en los comentarios.
# =========================================================================

# PASO 1: Verificar la version de Python y la plataforma.
# Los comandos originales de terminal se muestran como comentarios:
#   python --version
# En Python, sys.version guarda la informacion completa de la version.
import sys
import platform
print("Version de Python:", sys.version.split()[0])
print("Plataforma:", platform.platform())
print("Ruta del interprete:", sys.executable)

# PASO 2: Repasar el concepto de virtual environment (venv).
# En tu terminal real harías lo siguiente (aqui es solo teoria):
#   mkdir ml_project && cd ml_project
#   python -m venv venv
#   source venv/bin/activate      # macOS/Linux
#   venv\\Scripts\\activate       # Windows
# Un venv es un entorno aislado con sus propias dependencias: cada
# proyecto lleva sus paquetes sin contaminar el Python del sistema.
print("\n--- Virtual environment (venv) ---")
print("Un venv aísla las dependencias de cada proyecto.")
print("Se crea con: python -m venv venv")
print("Se activa con: source venv/bin/activate (o venv\\Scripts\\activate en Windows)")

# PASO 3: Verificar que los paquetes cientificos estan instalados.
# El comando original era: pip install numpy pandas matplotlib jupyter
# En Pyodide estos paquetes ya vienen precargados. Comprobamos cada
# import y mostramos su version con el atributo __version__.
print("\n--- Paquetes instalados ---")
try:
    import numpy as np
    print(f"NumPy {np.__version__}: OK")
except ImportError:
    print("NumPy: NO instalado")

try:
    import pandas as pd
    print(f"Pandas {pd.__version__}: OK")
except ImportError:
    print("Pandas: NO instalado")

try:
    import matplotlib
    print(f"Matplotlib {matplotlib.__version__}: OK")
except ImportError:
    print("Matplotlib: NO instalado")

# PASO 4: Comprobar que los modulos estandar que usaremos existen.
# sys y platform ya se importaron arriba. Tambien verificamos que el
# modulo math (matematicas basicas) esta disponible sin instalar nada.
import math
print("\n--- Modulos de la biblioteca estandar ---")
print(f"math.pi = {math.pi:.5f} (modulo estandar, sin instalar)")

# PASO 5: Repasar la gestion de dependencias con requirements.txt.
# En tu terminal real guardarias el listado con:
#   pip freeze > requirements.txt
#   cat requirements.txt
# Ese archivo permite reproducir el entorno con: pip install -r requirements.txt
print("\n--- Requirements ---")
print("Con 'pip freeze > requirements.txt' guardas las dependencias.")
print("Con 'pip install -r requirements.txt' las reinstalas en otro equipo.")

# PASO 6: Bonus de bioinformatica - importar Biopython.
# El laboratorio original proponía instalar Biopython. Intenta el import;
# si no está disponible lo detectamos con elegancia (pip install biopython).
try:
    import Bio
    print(f"\nBiopython {Bio.__version__}: instalado. Puedes parsear secuencias.")
except ImportError:
    print("\nBiopython: no disponible en este entorno. En tu terminal:")
    print("  pip install biopython")

# PASO 7: Resumen final de la verificacion.
print("\n--- Verificacion completa ---")
print("Tu entorno de Python esta configurado y es funcional.")
```