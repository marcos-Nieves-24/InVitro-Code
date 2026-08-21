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

<Section number={1} title="Instalando Python" eyebrow="INICIO">

<MascotMessage>
Bienvenido al curso práctico. Antes de escribir una sola línea de código necesitas un entorno Python funcional. Todo científico de datos, ingeniero de machine learning y desarrollador de software arranca aquí. Una instalación correcta te ahorra horas de debugging después.
</MascotMessage>

En biotecnología vas a usar Python para analizar secuencias de ADN, procesar datos clínicos y entrenar modelos predictivos. En SaaS, Python impulsa motores de recomendación, análisis de clientes y reportes automatizados. Todo esto empieza con una instalación de Python bien configurada.

Esta es la base de todo el curso: sin Python instalado no puedes ejecutar ningún código. En el módulo anterior aprendiste qué es la IA. Ahora vas a construir las habilidades prácticas que necesitas para implementar soluciones de IA.

En la próxima lección vas a aprender a usar Jupyter Notebook, un entorno interactivo que corre sobre tu instalación de Python.

</Section>

<Section number={2} title="¿Qué es Python?" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Python** es un lenguaje de programación interpretado de alto nivel creado por **Guido van Rossum** en 1991. Enfatiza la legibilidad del código y la simplicidad. Es el lenguaje más popular para ciencia de datos y machine learning.
</ConceptCard>

Cuando instalas Python obtienes el **intérprete**, un programa que lee y ejecuta código Python. Funciona en dos modos:

1. **Modo interactivo (REPL)** — escribes comandos y ves los resultados al instante
2. **Modo script** — ejecutas archivos `.py` con código Python

<CalloutCheck>
**Dato clave**: Python tiene un ecosistema de librerías enorme: NumPy, Pandas, scikit-learn, TensorFlow, Biopython... todas las que vas a usar en este curso. Cada una se instala con un solo comando.
</CalloutCheck>

</Section>

<Section number={3} title="Distribuciones de Python" eyebrow="CONCEPTO">

Hay varias formas de obtener Python. Aquí las principales:

| Distribución | Descripción | Veredicto |
|---|---|---|
| **Python Oficial** (python.org) | Implementación de referencia (CPython) | ✅ Recomendada para este curso |
| **Anaconda Distribution** | Python + 250+ paquetes preinstalados | Buena para comenzar pero pesada |
| **Miniconda** | Solo conda y Python mínimo | Liviana pero requiere conda |
| **Microsoft Store** (Windows) | Conveniente para Windows | ⚠️ Puede tener problemas de PATH |

<ConceptCard variant="key-idea">
Para este curso recomendamos instalar Python directamente desde **python.org**. Es la opción más limpia, predecible y con menos sorpresas.
</ConceptCard>

</Section>

<Section number={4} title="Instalación paso a paso" eyebrow="IMPLEMENTACIÓN">

### Windows

1. Ve a [python.org](https://python.org) y descarga el instalador más reciente
2. **IMPORTANTE**: marca **"Add Python to PATH"**
3. Haz clic en "Install Now"
4. Abre el Símbolo del Sistema y verifica:

```bash
python --version
pip --version
```

### macOS

```bash
# Instala Homebrew (recomendado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instala Python
brew install python

# Verifica
python3 --version
pip3 --version
```

### Linux

```bash
# Verifica si ya está instalado
python3 --version

# Si no está:
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip
```

</Section>

<Section number={5} title="El Intérprete Interactivo" eyebrow="IMPLEMENTACIÓN">

Una vez que Python está instalado, abre una terminal y ejecuta:

```bash
python --version
```

Salida esperada: `Python 3.x.x`

Ahora prueba el modo interactivo (REPL):

```bash
python
```

Dentro del intérprete, escribe:

```python
print("¡Hola, Python!")
result = 2 + 2
print(result)
```

<CalloutInfo>
Para salir del intérprete interactivo escribe `exit()` o presiona **Ctrl+D** (Linux/macOS) / **Ctrl+Z + Enter** (Windows).
</CalloutInfo>

</Section>

<Section number={6} title="pip — El Instalador de Paquetes" eyebrow="CONCEPTO">

**pip** es el gestor de paquetes de Python. Descarga e instala paquetes desde el **Python Package Index (PyPI)**, que alberga más de 400.000 paquetes.

Comandos fundamentales:

| Comando | Qué hace |
|---------|----------|
| `pip install numpy` | Instala un paquete |
| `pip uninstall numpy` | Lo elimina |
| `pip list` | Lista paquetes instalados |
| `pip freeze` | Lista paquetes con sus versiones |

```bash
pip install numpy pandas matplotlib
```

El comando `pip freeze` es especialmente útil porque te da una lista exacta de dependencias que puedes compartir:

```bash
pip freeze > requirements.txt
```

<CalloutCheck>
Este archivo `requirements.txt` es la base de la reproducibilidad en ciencia de datos y desarrollo de software. Lo vas a usar en cada proyecto.
</CalloutCheck>

</Section>

<Section number={7} title="Entornos Virtuales" eyebrow="CONCEPTO">

Un **entorno virtual** es un entorno Python aislado que te permite instalar paquetes sin afectar al Python del sistema ni a otros proyectos.

<ConceptCard variant="key-idea">
Cada proyecto puede tener sus propias dependencias. Un proyecto usa Django 4.2, otro usa Django 5.0 — con entornos virtuales ambos conviven sin conflictos.
</ConceptCard>

Creación y activación:

```bash
# Crear el entorno
python -m venv venv

# Activarlo:
# En Windows:
venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate
```

Una vez activado, el prompt cambia para mostrar `(venv)`. Ahí instalas tus paquetes:

```bash
pip install numpy pandas matplotlib
pip freeze > requirements.txt
```

<CalloutInfo>
Cuando terminas de trabajar, desactivas el entorno con el comando `deactivate`.
</CalloutInfo>

</Section>

<Section number={8} title="Ejemplo: Biotecnología" eyebrow="APLICACIÓN">

**Escenario**: Un laboratorio de bioinformática necesita un entorno Python consistente para analizar secuencias de ADN. Varios investigadores trabajan en el mismo proyecto.

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

Cualquier investigador replica el entorno con un solo comando:

```bash
pip install -r requirements.txt
```

<ConceptCard variant="definition">
**Reproducibilidad**: todos tienen las mismas versiones de cada paquete. No importa si usan Windows, macOS o Linux — el entorno es idéntico.
</ConceptCard>

</Section>

<Section number={9} title="Ejemplo: SaaS" eyebrow="APLICACIÓN">

**Escenario**: Una startup SaaS necesita desplegar un modelo de predicción de churn de clientes. El equipo de desarrollo aísla las dependencias con un entorno virtual y las congela para producción.

```bash
# Entorno de desarrollo
python -m venv venv
source venv/bin/activate
pip install scikit-learn pandas flask gunicorn
pip freeze > requirements.txt

# En el servidor de producción:
pip install -r requirements.txt
```

<CalloutCheck>
**Esto garantiza que producción coincida exactamente con desarrollo.** Sin sorpresas por versiones distintas de una librería.
</CalloutCheck>

</Section>

<Section number={10} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">

### Errores Comunes

1. **Olvidarse de marcar "Add Python to PATH"** → Python no es reconocido como comando. Reinstala y marca la opción.
2. **Usar el Python del sistema directamente** → siempre crea un entorno virtual para cada proyecto.
3. **Subir `venv/` al control de versiones** → agrega `venv/` al `.gitignore`.
4. **Ejecutar `pip install` sin un entorno virtual** → puede romper el Python del sistema.
5. **Confundir `pip` y `pip3`** → en algunos sistemas `pip` apunta a Python 2. Usa `pip3` para Python 3.

### Buenas Prácticas

<CalloutCheck>
- Usa **siempre** entornos virtuales para aislar proyectos
- Usa `requirements.txt` para reproducibilidad
- Mantén Python actualizado (dentro de la misma versión mayor)
- Documenta la versión de Python que requiere tu proyecto
- Nunca uses `sudo pip install` — puede corromper paquetes del sistema
- Considera **pyenv** para gestionar múltiples versiones de Python
</CalloutCheck>

</Section>

<Section number={11} title="Resumen y Conceptos Clave" eyebrow="CIERRE">

| Concepto | Idea clave |
|----------|------------|
| **Python** | Lenguaje interpretado de alto nivel, esencial para ciencia de datos |
| **Instalación** | Descarga desde python.org y verifica con `python --version` |
| **pip** | Instala paquetes desde PyPI |
| **Entorno virtual** | Aísla las dependencias de cada proyecto |
| **requirements.txt** | Lista exacta de dependencias para reproducibilidad |

<MascotMessage mood="celebrating">
Todo esto es la base. Una vez que tienes Python funcionando, todo lo demás — Jupyter, NumPy, Pandas, scikit-learn — está a un `pip install` de distancia.
</MascotMessage>

### Términos Clave

- **Intérprete**: Programa que ejecuta código Python línea por línea
- **pip**: Instalador de paquetes de Python
- **PyPI**: Python Package Index — repositorio oficial de paquetes
- **Entorno virtual**: Entorno Python aislado para un proyecto específico
- **PATH**: Variable del sistema que le dice al SO dónde encontrar ejecutables
- **REPL**: Read-Eval-Print Loop — shell interactiva de Python

</Section>

<Section number={12} title="Ejercicios y Desafío" eyebrow="EVALUACIÓN">

### Nivel 1: Básico

1. ¿Qué comando usas para verificar la versión de Python?
2. ¿Cuál es el propósito de un entorno virtual?
3. ¿Qué hace `pip freeze`?

### Nivel 2: Implementación

4. Instala Python (si no está instalado), crea un entorno virtual e instala NumPy. Verifica la instalación ejecutando `python -c "import numpy; print(numpy.__version__)"`.
5. Crea un archivo `requirements.txt` para un proyecto que depende de pandas y matplotlib.

### Nivel 3: Pensamiento Crítico

6. Compara la distribución oficial de Python con Anaconda. ¿Cuándo usarías cada una?
7. ¿Por qué es mala práctica instalar paquetes globalmente con `sudo pip install`? ¿Qué alternativas existen?

<AnswerReveal summary="Ver respuestas">

**1.** `python --version` (o `python3 --version` en macOS/Linux).

**2.** Aislar las dependencias de un proyecto para que no interfieran con otros proyectos ni con el Python del sistema.

**3.** Lista todos los paquetes instalados con sus versiones exactas. Se usa para generar un `requirements.txt`.

**4.** Los comandos: `python -m venv venv` → `source venv/bin/activate` (o `venv\Scripts\activate` en Windows) → `pip install numpy` → `python -c "import numpy; print(numpy.__version__)"`.

**5.** Ejecuta `pip freeze > requirements.txt` después de instalar pandas y matplotlib.

**6.** La distribución oficial es más liviana y te da control total. Anaconda viene con muchos paquetes preinstalados, ideal para alguien que quiere empezar rápido sin pensar en dependencias, pero ocupa mucho espacio.

**7.** `sudo pip install` instala paquetes globalmente como root, lo que puede corromper paquetes del sistema. Alternativas: usar entornos virtuales o `pip install --user`.

</AnswerReveal>

### Desafío de Código

Escribe un script de Python llamado `check_env.py` que:
1. Imprima la versión de Python
2. Imprima la ubicación del intérprete de Python
3. Liste todos los paquetes instalados
4. Intente importar numpy, pandas y matplotlib, informando si cada uno está disponible

Ejecuta el script y verifica la salida.

</Section>
