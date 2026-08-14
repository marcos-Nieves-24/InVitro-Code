# Lab: Configurá tu entorno de Python

## Objetivo

Instalar Python con éxito, crear un virtual environment, instalar paquetes y verificar la configuración.

## Duración

30 minutos

## Requisitos previos

- Una computadora con acceso a internet
- Derechos administrativos para instalar software (o usar el package manager)

## Instrucciones

### Parte 1: Instalar Python

1. Descargá Python desde https://python.org (la versión estable más reciente)
2. Ejecutá el instalador — asegurate de marcar "Add Python to PATH" (Windows)
3. Abrí una terminal y verificá:
   ```bash
   python --version
   ```

### Parte 2: Crear y activar un virtual environment

```bash
# Create project directory
mkdir ml_project
cd ml_project

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### Parte 3: Instalar paquetes

```bash
pip install numpy pandas matplotlib jupyter
```

### Parte 4: Verificar la instalación

Creá un archivo `test_install.py` con:

```python
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

print(f"Python version: {sys.version}")
print(f"NumPy version: {np.__version__}")
print(f"Pandas version: {pd.__version__}")
print("All packages installed successfully!")
```

Ejecutalo:
```bash
python test_install.py
```

### Parte 5: Guardar las dependencias

```bash
pip freeze > requirements.txt
type requirements.txt  # Windows
cat requirements.txt   # macOS/Linux
```

## Entregables

- Captura de pantalla o copia de la salida de la terminal mostrando la versión de Python y las versiones de los paquetes
- El contenido del archivo `requirements.txt`

## Bonus

Instalá un paquete de bioinformática (Biopython) e importalo con éxito.
