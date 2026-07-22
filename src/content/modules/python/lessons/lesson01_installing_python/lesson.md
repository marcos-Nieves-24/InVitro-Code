---
Module: 2
Lesson Number: 1
Lesson Title: Instalando Python
Estimated Duration: 30 minutos
Prerequisites: None
Learning Objectives:
  - Explicar qué es Python y por qué se usa en ciencia de datos
  - Instalar Python en Windows, macOS o Linux
  - Verificar la instalación usando la línea de comandos
  - Usar pip para instalar paquetes de Python
  - Crear y activar un entorno virtual
Keywords: Python, pip, entorno virtual, línea de comandos, instalación
Difficulty: Beginner
Programming Concepts: Intérprete de Python, CLI, gestión de paquetes, entornos virtuales
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Instalando Python

## Motivación

Antes de escribir una sola línea de código en Python, necesitás un entorno Python funcional. Todo científico de datos, ingeniero de machine learning y desarrollador de software arranca acá. Una instalación correcta te ahorra horas de debugging después. En biotecnología vas a usar Python para analizar secuencias de ADN, procesar datos clínicos y entrenar modelos predictivos. En SaaS, Python impulsa motores de recomendación, análisis de clientes y reportes automatizados. Todo esto empieza con una instalación de Python bien configurada.

## Panorama General

Esta es la base de todo el curso. Sin Python instalado no podés ejecutar ningún código. En el módulo anterior aprendiste qué es la IA. Ahora vas a construir las habilidades prácticas necesarias para implementar soluciones de IA. En la próxima lección vas a aprender a usar Jupyter Notebook, un entorno interactivo que corre sobre tu instalación de Python.

## Teoría

### ¿Qué es Python?

Python es un lenguaje de programación interpretado de alto nivel creado por Guido van Rossum en 1991. Enfatiza la legibilidad del código y la simplicidad. Es el lenguaje más popular para ciencia de datos y machine learning gracias a su amplio ecosistema de librerías (NumPy, Pandas, scikit-learn, TensorFlow) y su curva de aprendizaje amigable.

### Distribuciones de Python

Hay varias formas de obtener Python:

- **Python Oficial** (python.org): La implementación de referencia (CPython). Recomendada para la mayoría de los usuarios.
- **Anaconda Distribution**: Incluye Python más 250+ paquetes de ciencia de datos preinstalados. Buena para principiantes pero pesada.
- **Miniconda**: Una versión mínima de Anaconda solo con conda y Python.
- **Python desde Microsoft Store** (Windows): Conveniente pero puede tener problemas de PATH.

Para este curso recomendamos instalar Python directamente desde python.org.

### El Intérprete de Python

Cuando instalás Python obtenés el **intérprete**, un programa que lee y ejecuta código Python. Podés usarlo en dos modos:

1. **Modo interactivo**: Escribís comandos y ves los resultados al instante (REPL)
2. **Modo script**: Ejecutás archivos `.py` con código Python

### pip — El Instalador de Paquetes

pip es el gestor de paquetes de Python. Descarga e instala paquetes desde el Python Package Index (PyPI), que alberga más de 400.000 paquetes.

Comandos comunes de pip:
- `pip install nombre_paquete` — instala un paquete
- `pip uninstall nombre_paquete` — elimina un paquete
- `pip list` — lista paquetes instalados
- `pip freeze` — lista paquetes instalados con versiones

### Entornos Virtuales

Un entorno virtual es un entorno Python aislado que te permite instalar paquetes sin afectar al Python del sistema ni a otros proyectos. Cada proyecto tiene sus propias dependencias.

**¿Por qué usar entornos virtuales?** Diferentes proyectos pueden requerir distintas versiones de la misma librería. Los entornos virtuales previenen conflictos.

### Instalando Python en Windows

1. Andá a https://python.org y descargá el instalador más reciente de Python
2. **IMPORTANTE**: Marcá "Add Python to PATH"
3. Hacé clic en "Install Now"
4. Abrí el Símbolo del Sistema y escribí `python --version`
5. Verificá pip: `pip --version`

### Instalando Python en macOS

1. Instalá Homebrew (opcional pero recomendado): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. `brew install python`
3. Verificá: `python3 --version`
4. pip viene incluido: `pip3 --version`

### Instalando Python en Linux

La mayoría de las distribuciones Linux incluyen Python. Verificá con:
```bash
python3 --version
```

Si no está instalado:
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip
```

## Explicación Visual

```
┌─────────────────────────────────────────────────────┐
│                 Instalación de Python                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [1] Descargá Python de python.org                  │
│       ↓                                             │
│  [2] Ejecutá el instalador (✓ Add to PATH)          │
│       ↓                                             │
│  [3] Verificá: python --version                     │
│       ↓                                             │
│  [4] Verificá: pip --version                        │
│       ↓                                             │
│  [5] Creá un entorno virtual                        │
│       ↓                                             │
│  [6] Instalá paquetes con pip                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Implementación en Python

### Verificando la Instalación de Python

Abrí una terminal (Símbolo del Sistema en Windows, Terminal en macOS/Linux) y ejecutá:

```bash
python --version
```

Salida esperada: `Python 3.x.x`

### Usando el Intérprete Interactivo

```bash
python
```

Después escribí:

```python
print("¡Hola, Python!")
result = 2 + 2
print(result)
```

### Creando un Entorno Virtual

```bash
# Creá un entorno virtual llamado 'venv'
python -m venv venv

# Activarlo
# En Windows:
venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate

# El prompt va a cambiar para mostrar (venv)
```

### Instalando Paquetes

```bash
pip install numpy pandas matplotlib
```

### Congelando Dependencias

```bash
pip freeze > requirements.txt
```

Esto crea un archivo que lista todos los paquetes instalados con sus versiones, esencial para la reproducibilidad.

## Ejemplo de Biotecnología

**Escenario**: Un laboratorio de bioinformática necesita un entorno Python consistente para analizar secuencias de ADN. Varios investigadores trabajan en el mismo proyecto. Usar un archivo `requirements.txt` asegura que todos tengan las mismas versiones de paquetes.

```bash
# Crear directorio del proyecto
mkdir dna_analysis
cd dna_analysis

# Crear entorno virtual
python -m venv venv
source venv/bin/activate

# Instalar paquetes de bioinformática
pip install biopython pandas numpy matplotlib

# Guardar dependencias
pip freeze > requirements.txt
```

Ahora cualquier investigador puede replicar el entorno con:
```bash
pip install -r requirements.txt
```

## Ejemplo SaaS

**Escenario**: Una startup SaaS necesita desplegar un modelo de predicción de churn de clientes. El equipo de desarrollo usa un entorno virtual para aislar dependencias, y luego las congela para el despliegue.

```bash
# Máquina del desarrollador
python -m venv venv
source venv/bin/activate
pip install scikit-learn pandas flask gunicorn
pip freeze > requirements.txt

# Servidor de producción
pip install -r requirements.txt
```

Esto garantiza que el entorno de producción coincida exactamente con el de desarrollo.

## Errores Comunes

1. **Olvidarse de marcar "Add Python to PATH"**: Python no va a ser reconocido como comando. Reinstalá y marcá la opción.
2. **Usar el Python del sistema directamente**: Siempre creá un entorno virtual para los proyectos.
3. **Subir `venv` al control de versiones**: Agregá `venv/` al `.gitignore`.
4. **Ejecutar `pip install` sin un entorno virtual**: Puede romper el Python del sistema.
5. **Confundir `pip` y `pip3`**: En algunos sistemas, `pip` apunta a Python 2. Usá `pip3` para Python 3.

## Buenas Prácticas

- Usá siempre entornos virtuales para aislar proyectos
- Usá `requirements.txt` para reproducibilidad
- Mantené Python actualizado (dentro de la misma versión mayor)
- Documentá la versión de Python que requiere tu proyecto
- Usá `pip freeze > requirements.txt` regularmente
- Nunca uses `sudo pip install` (Linux/macOS) — puede corromper paquetes del sistema
- Considerá usar pyenv para gestionar múltiples versiones de Python

## Resumen

- Python es un lenguaje interpretado de alto nivel esencial para ciencia de datos
- Instalá desde python.org y verificá con `python --version`
- pip instala paquetes desde PyPI
- Los entornos virtuales aíslan las dependencias de cada proyecto
- Usá siempre entornos virtuales para reproducibilidad
- Verificá tu instalación ejecutando código Python en modo interactivo

## Términos Clave

- **Intérprete**: Programa que ejecuta código Python línea por línea
- **pip**: Instalador de paquetes de Python
- **PyPI**: Python Package Index — repositorio de paquetes de Python
- **Entorno virtual**: Entorno Python aislado para un proyecto específico
- **PATH**: Variable del sistema que le dice al SO dónde encontrar ejecutables
- **REPL**: Read-Eval-Print Loop — shell interactiva de Python
- **requirements.txt**: Archivo que lista las dependencias del proyecto

## Ejercicios

### Nivel 1: Básico

1. ¿Qué comando usás para verificar la versión de Python?
2. ¿Cuál es el propósito de un entorno virtual?
3. ¿Qué hace `pip freeze`?

### Nivel 2: Implementación

4. Instalá Python (si no está instalado), creá un entorno virtual e instalá NumPy. Verificá la instalación ejecutando `python -c "import numpy; print(numpy.__version__)"`.
5. Creá un archivo `requirements.txt` para un proyecto que depende de pandas y matplotlib.

### Nivel 3: Pensamiento Crítico

6. Compará la distribución oficial de Python con Anaconda. ¿Cuándo usarías cada una?
7. ¿Por qué es mala práctica instalar paquetes globalmente con `sudo pip install`? ¿Qué alternativas existen?

## Desafío de Código

Escribí un script de Python llamado `check_env.py` que:
1. Imprima la versión de Python
2. Imprima la ubicación del intérprete de Python
3. Liste todos los paquetes instalados
4. Intente importar numpy, pandas y matplotlib, informando si cada uno está disponible

Ejecutá el script y verificá la salida.
