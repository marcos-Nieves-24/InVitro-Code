
Module: 2
Lesson Number: 1
Lesson Title: Instalando Python
Estimated Duration: 30 minutos
Prerequisites: None
Learning Objectives:
  Explicar qué es Python y por qué se usa en ciencia de datos
  Instalar Python en Windows, macOS o Linux
  Verificar la instalación usando la línea de comandos
  Usar pip para instalar paquetes de Python
  Crear y activar un entorno virtual
Keywords: Python, pip, entorno virtual, línea de comandos, instalación
Difficulty: Beginner
Programming Concepts: Intérprete de Python, CLI, gestión de paquetes, entornos virtuales
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


<Section number={1} title="Instalando Python" eyebrow="INICIO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  typing={true}
  lines={[
    "Bienvenido al curso práctico.",
    "Antes de escribir una sola línea de código necesitas un entorno Python funcional.",
    "Una instalación correcta te ahorra horas de debugging después.",
  ]}
/>

<MascotMessage>
Bienvenido al curso práctico. Todo científico de datos, ingeniero de machine learning y desarrollador de software arranca aquí.
</MascotMessage>

<ConceptCard variant="key idea">
En biotecnología vas a usar Python para analizar secuencias de ADN, procesar datos clínicos y entrenar modelos predictivos. En SaaS, Python impulsa motores de recomendación, análisis de clientes y reportes automatizados.

Esta es la base de todo el curso: sin Python instalado no puedes ejecutar ningún código. En el módulo anterior aprendiste qué es la IA. Ahora vas a construir las habilidades prácticas que necesitas para implementar soluciones de IA. En la próxima lección vas a aprender a usar Jupyter Notebook, un entorno interactivo que corre sobre tu instalación de Python.
</ConceptCard>

<ChoiceQuestion
  question="¿Cuál es el primer paso recomendado para tener un entorno Python funcional?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 paso 1"
  allowContinueOnIncorrect
  explanation="La base es descargar e instalar Python desde python.org, verificarlo con python --version y luego crear entornos virtuales."
  options={[
    { id: "a", label: "Descargar Python desde python.org e instalarlo", correct: true, feedback: "¡Correcto! Empezar por la distribución oficial es la opción más limpia y predecible." },
    { id: "b", label: "Instalar directamente scikit learn con sudo pip", correct: false, feedback: "No: instalar paquetes sobre el Python del sistema puede corromperlo. Primero el intérprete." },
    { id: "c", label: "Crear un entorno virtual sin tener Python instalado", correct: false, feedback: "Falso: el entorno virtual requiere un intérprete Python base." },
    { id: "d", label: "Usar únicamente Anaconda Distribution", correct: false, feedback: "Anaconda es una opción válida, pero no el único ni siempre el recomendado para este curso." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={2} title="¿Qué es Python?" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="definition">
**Python** es un lenguaje de programación interpretado de alto nivel creado por **Guido van Rossum** en 1991. Enfatiza la legibilidad del código y la simplicidad. Es el lenguaje más popular para ciencia de datos y machine learning.
</ConceptCard>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Cuando instalas Python obtienes el intérprete: un programa que lee y ejecuta código Python.",
    "Funciona en dos modos: modo interactivo (REPL), donde escribes comandos y ves resultados al instante, y modo script, donde ejecutas archivos .py.",
  ]}
/>

<CalloutCheck>
**Dato clave**: Python tiene un ecosistema de librerías enorme: NumPy, Pandas, scikit learn, TensorFlow, Biopython... todas las que vas a usar en este curso. Cada una se instala con un solo comando.
</CalloutCheck>

<ChoiceQuestion
  question="¿Qué obtienes al instalar Python?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 interprete 2"
  allowContinueOnIncorrect
  explanation="La instalación entrega el intérprete, que puede ejecutar código en modo interactivo o como script, más el gestor pip."
  options={[
    { id: "a", label: "Solo una librería de cálculo numérico", correct: false, feedback: "No: NumPy es una librería aparte que instalas con pip." },
    { id: "b", label: "El intérprete y herramientas como pip", correct: true, feedback: "¡Exacto! El intérprete ejecuta código y pip instala paquetes." },
    { id: "c", label: "Un editor de código completo (IDE)", correct: false, feedback: "El instalador de Python no incluye un IDE; usas el que prefieras." },
    { id: "d", label: "Solo archivos de documentación", correct: false, feedback: "La instalación incluye el ejecutable del intérprete, no solo docs." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={3} title="Distribuciones de Python" eyebrow="CONCEPTO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Hay varias formas de obtener Python. Aquí las principales: Python Oficial (python.org), Anaconda Distribution, Miniconda y Microsoft Store en Windows.",
  ]}
/>

<ConceptCard variant="key idea">
- **Distribución**: **Python Oficial** (python.org)   **Descripción**: Implementación de referencia (CPython)   **Veredicto**: Recomendada para este curso
- **Distribución**: **Anaconda Distribution**   **Descripción**: Python + 250+ paquetes preinstalados   **Veredicto**: Buena para comenzar pero pesada
- **Distribución**: **Miniconda**   **Descripción**: Solo conda y Python mínimo   **Veredicto**: Liviana pero requiere conda
- **Distribución**: **Microsoft Store** (Windows)   **Descripción**: Conveniente para Windows   **Veredicto**: Puede tener problemas de PATH
</ConceptCard>

<ConceptCard variant="key idea">
Para este curso recomendamos instalar Python directamente desde **python.org**. Es la opción más limpia, predecible y con menos sorpresas.
</ConceptCard>

<ChoiceQuestion
  question="¿Qué distribución recomienda este curso?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 distro 3"
  allowContinueOnIncorrect
  explanation="La distribución oficial desde python.org es la opción más limpia y predecible."
  options={[
    { id: "a", label: "Python oficial desde python.org", correct: true, feedback: "¡Correcto! Es la más limpia y predecible." },
    { id: "b", label: "Anaconda Distribution", correct: false, feedback: "Útil por sus paquetes preinstalados, pero pesada y no es la recomendación del curso." },
    { id: "c", label: "Microsoft Store (Windows)", correct: false, feedback: "Puede tener problemas de PATH; no es la opción recomendada." },
    { id: "d", label: "Miniconda", correct: false, feedback: "Liviana, pero requiere conda; no es la opción principal del curso." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={4} title="Instalación paso a paso" eyebrow="IMPLEMENTACIÓN">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "En Windows: ve a python.org, descarga el instalador, marca 'Add Python to PATH' y haz clic en Install Now. Luego verifica en el Símbolo del Sistema con python --version y pip --version.",
    "En macOS: instala Homebrew y luego ejecuta brew install python; verifica con python3 --version y pip3 --version.",
    "En Linux (Ubuntu/Debian): sudo apt update && sudo apt install python3 python3 pip. Fedora: sudo dnf install python3 python3 pip.",
  ]}
/>

<ConceptCard variant="key idea">
**Windows**
1. Ve a [python.org](https://python.org) y descarga el instalador más reciente
2. **IMPORTANTE**: marca **"Add Python to PATH"**
3. Haz clic en "Install Now"
4. Abre el Símbolo del Sistema y verifica:

```bash
python --version
pip --version
```
</ConceptCard>

<ConceptCard variant="key idea">
**macOS**

```bash
# Instala Homebrew (recomendado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instala Python
brew install python

# Verifica
python3 --version
pip3 --version
```
</ConceptCard>

<ConceptCard variant="key idea">
**Linux**

```bash
# Verifica si ya está instalado
python3 --version

# Si no está:
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3 pip

# Fedora
sudo dnf install python3 python3 pip
```
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="El Intérprete Interactivo" eyebrow="IMPLEMENTACIÓN">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Una vez que Python está instalado, abre una terminal y ejecuta python --version. La salida esperada es Python 3.x.x.",
    "Ahora prueba el modo interactivo (REPL) con python. Dentro del intérprete escribe print(\"¡Hola, Python!\") y el resultado de 2 + 2.",
  ]}
/>

```bash
python --version
```

```python
print("¡Hola, Python!")
result = 2 + 2
print(result)
```

<CalloutInfo>
Para salir del intérprete interactivo escribe `exit()` o presiona **Ctrl+D** (Linux/macOS) / **Ctrl+Z + Enter** (Windows).
</CalloutInfo>

<ChoiceQuestion
  question="¿Cómo sales del intérprete interactivo de Python?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 exit 5"
  allowContinueOnIncorrect
  explanation="Se sale con exit() o con Ctrl+D (Linux/macOS) / Ctrl+Z + Enter (Windows)."
  options={[
    { id: "a", label: "exit() o Ctrl+D (Linux/macOS) / Ctrl+Z+Enter (Windows)", correct: true, feedback: "¡Exacto!" },
    { id: "b", label: "ESC dos veces", correct: false, feedback: "No es la combinación estándar del intérprete." },
    { id: "c", label: "Cerrar la ventana siempre", correct: false, feedback: "Funciona, pero no es la forma canónica de salir." },
    { id: "d", label: "kill -9 python", correct: false, feedback: "Innecesariamente agresivo." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="pip   El Instalador de Paquetes" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="definition">
**pip** es el gestor de paquetes de Python. Descarga e instala paquetes desde el **Python Package Index (PyPI)**, que alberga más de 400.000 paquetes.
</ConceptCard>

<ConceptCard variant="key idea">
Comandos fundamentales de pip:

- `pip install numpy`  Instala un paquete
- `pip uninstall numpy`  Lo elimina
- `pip list`  Lista paquetes instalados
- `pip freeze`  Lista paquetes con sus versiones
</ConceptCard>

```bash
pip install numpy pandas matplotlib
```

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "El comando pip freeze es especialmente útil porque te da una lista exacta de dependencias que puedes compartir.",
  ]}
/>

```bash
pip freeze > requirements.txt
```

<CalloutCheck>
Este archivo `requirements.txt` es la base de la reproducibilidad en ciencia de datos y desarrollo de software. Lo vas a usar en cada proyecto.
</CalloutCheck>

<ChoiceQuestion
  question="¿Qué hace `pip freeze`?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 pip 6"
  allowContinueOnIncorrect
  explanation="Lista todos los paquetes instalados con sus versiones exactas; se usa para generar requirements.txt."
  options={[
    { id: "a", label: "Instala todos los paquetes del sistema", correct: false, feedback: "No instala; solo lista." },
    { id: "b", label: "Lista paquetes instalados con versiones exactas", correct: true, feedback: "¡Exacto! Ideal para requirements.txt." },
    { id: "c", label: "Elimina paquetes obsoletos", correct: false, feedback: "pip freeze no desinstala." },
    { id: "d", label: "Congela el intérprete de Python", correct: false, feedback: "No tiene que ver con el intérprete." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="Entornos Virtuales" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="key idea">
Un **entorno virtual** es un entorno Python aislado que te permite instalar paquetes sin afectar al Python del sistema ni a otros proyectos. Cada proyecto puede tener sus propias dependencias: un proyecto usa Django 4.2, otro usa Django 5.0   con entornos virtuales ambos conviven sin conflictos.
</ConceptCard>

<ConceptCard variant="key idea">
Creación y activación del entorno virtual:

```bash
# Crear el entorno
python -m venv venv

# Activarlo:
# En Windows:
venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate
```
</ConceptCard>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Una vez activado, el prompt cambia para mostrar (venv). Ahí instalas tus paquetes.",
    "Cuando terminas de trabajar, desactivas el entorno con el comando deactivate.",
  ]}
/>

```bash
pip install numpy pandas matplotlib
pip freeze > requirements.txt
```

<CalloutInfo>
Cuando terminas de trabajar, desactivas el entorno con el comando `deactivate`.
</CalloutInfo>

<ChoiceQuestion
  question="¿Qué es un entorno virtual?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 venv 7"
  allowContinueOnIncorrect
  explanation="Es un entorno Python aislado que permite instalar paquetes sin afectar al sistema ni a otros proyectos."
  options={[
    { id: "a", label: "Un contenedor que aísla dependencias por proyecto", correct: true, feedback: "¡Exacto!" },
    { id: "b", label: "Una máquina virtual completa con otro sistema operativo", correct: false, feedback: "No es una VM; solo aísla paquetes de Python." },
    { id: "c", label: "Un archivo de texto con nombres de paquetes", correct: false, feedback: "Eso describe requirements.txt, no el entorno." },
    { id: "d", label: "Una carpeta con el código fuente de Python", correct: false, feedback: "No es el código fuente; es un entorno aislado." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="Ejemplo: Biotecnología" eyebrow="APLICACIÓN">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Un laboratorio de bioinformática necesita un entorno Python consistente para analizar secuencias de ADN.",
    "Varios investigadores trabajan en el mismo proyecto y deben compartir dependencias.",
  ]}
/>

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

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Cualquier investigador replica el entorno con un solo comando: pip install -r requirements.txt.",
  ]}
/>

<ConceptCard variant="definition">
**Reproducibilidad**: todos tienen las mismas versiones de cada paquete. No importa si usan Windows, macOS o Linux   el entorno es idéntico.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Ejemplo: SaaS" eyebrow="APLICACIÓN">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Una startup SaaS necesita desplegar un modelo de predicción de churn de clientes.",
    "El equipo aísla las dependencias con un entorno virtual y las congela para producción.",
  ]}
/>

```bash
# Entorno de desarrollo
python -m venv venv
source venv/bin/activate
pip install scikit learn pandas flask gunicorn
pip freeze > requirements.txt

# En el servidor de producción:
pip install -r requirements.txt
```

<CalloutCheck>
**Esto garantiza que producción coincida exactamente con desarrollo.** Sin sorpresas por versiones distintas de una librería.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={10} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Olvidarse de marcar 'Add Python to PATH' hace que Python no sea reconocido como comando: reinstala y marca la opción.",
    "Usar el Python del sistema directamente: siempre crea un entorno virtual para cada proyecto.",
    "Subir venv/ al control de versiones: agrega venv/ al .gitignore.",
    "Ejecutar pip install sin un entorno virtual: puede romper el Python del sistema.",
    "Confundir pip y pip3: en algunos sistemas pip apunta a Python 2; usa pip3 para Python 3.",
  ]}
/>

<CalloutCheck>
- Usa **siempre** entornos virtuales para aislar proyectos
- Usa `requirements.txt` para reproducibilidad
- Mantén Python actualizado (dentro de la misma versión mayor)
- Documenta la versión de Python que requiere tu proyecto
- Nunca uses `sudo pip install`   puede corromper paquetes del sistema
- Considera **pyenv** para gestionar múltiples versiones de Python
</CalloutCheck>

<ChoiceQuestion
  question="¿Cuál es una buena práctica al usar pip y entornos virtuales?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 bp 10"
  allowContinueOnIncorrect
  explanation="La mejor práctica es aislar cada proyecto en su propio entorno virtual y congelar dependencias en requirements.txt."
  options={[
    { id: "a", label: "Usar entornos virtuales y requirements.txt", correct: true, feedback: "¡Correcto!" },
    { id: "b", label: "Instalar todo con sudo pip install", correct: false, feedback: "Puede corromper paquetes del sistema." },
    { id: "c", label: "Subir la carpeta venv al repositorio", correct: false, feedback: "La carpeta venv no debe versionarse." },
    { id: "d", label: "Usar un único entorno global para todos los proyectos", correct: false, feedback: "Mezcla dependencias y genera conflictos." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={11} title="Resumen y Conceptos Clave" eyebrow="CIERRE">

<RevealSequence>

<ConceptCard variant="key idea">
Tener Python funcionando, con pip y un entorno virtual es la base de todo lo demás: Jupyter, NumPy, Pandas y scikit learn están a un `pip install` de distancia.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "python", label: "Python", detail: "Lenguaje interpretado de alto nivel, esencial para ciencia de datos." },
    { id: "instalacion", label: "Instalación", detail: "Descarga desde python.org y verifica con `python --version`." },
    { id: "pip", label: "pip", detail: "Instala paquetes desde PyPI." },
    { id: "entorno virtual", label: "Entorno virtual", detail: "Aísla las dependencias de cada proyecto." },
    { id: "requirements", label: "requirements.txt", detail: "Lista exacta de dependencias para reproducibilidad." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "interprete", label: "Intérprete", detail: "Programa que ejecuta código Python línea por línea." },
    { id: "pip instalador", label: "pip", detail: "Instalador de paquetes de Python." },
    { id: "pypi", label: "PyPI", detail: "Python Package Index   repositorio oficial de paquetes." },
    { id: "entorno virtual aislado", label: "Entorno virtual", detail: "Entorno Python aislado para un proyecto específico." },
    { id: "path", label: "PATH", detail: "Variable del sistema que le dice al SO dónde encontrar ejecutables." },
    { id: "repl", label: "REPL", detail: "Read Eval Print Loop   shell interactiva de Python." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué archivo captura las dependencias exactas de un proyecto para poder reproducirlo?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 resumen 1"
  allowContinueOnIncorrect
  explanation="requirements.txt lista los paquetes con sus versiones exactas para reinstalarlos iguales."
  options={[
    { id: "a", label: "requirements.txt", correct: true, feedback: "¡Exacto! Se genera con pip freeze y se reinstala con pip install -r." },
    { id: "b", label: "setup.py", correct: false, feedback: "setup.py describe el paquete mismo, no las dependencias del proyecto." },
    { id: "c", label: "README.md", correct: false, feedback: "El README documenta el proyecto, no las versiones exactas." },
    { id: "d", label: ".gitignore", correct: false, feedback: "Ignora archivos en git, no registra dependencias." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Python listo! Ahora Jupyter convierte ese intérprete en un cuaderno interactivo.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={12} title="Ejercicios y Desafío" eyebrow="EVALUACIÓN">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Antes de cerrar, repasemos: primer nivel   ¿qué comando verifica la versión de Python? ¿cuál es el propósito de un entorno virtual? ¿qué hace pip freeze?",
    "Segundo nivel   instala Python, crea un entorno virtual e instala NumPy; crea un requirements.txt con pandas y matplotlib.",
    "Tercer nivel   compara la distribución oficial con Anaconda y argumenta cuándo usar cada una; explica por qué sudo pip install es una mala práctica.",
  ]}
/>

<ChoiceQuestion
  question="¿Qué comando verifica la versión de Python instalada?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 1"
  allowContinueOnIncorrect
  explanation="Usá python --version (o python3 --version en macOS/Linux)."
  options={[
    { id: "a", label: "python --version (o python3 --version en macOS/Linux)", correct: true, feedback: "¡Correcto! Es la forma estándar." },
    { id: "b", label: "pip --version", correct: false, feedback: "Ese verifica la versión de pip, no de Python." },
    { id: "c", label: "which python", correct: false, feedback: "Muestra la ruta del ejecutable, no la versión." },
    { id: "d", label: "python -V sólo en Windows", correct: false, feedback: "python --version funciona en todos los sistemas operativos." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es el propósito de un entorno virtual (venv)?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 2"
  allowContinueOnIncorrect
  explanation="Aislar las dependencias de un proyecto para que no interfieran con otros proyectos ni con el Python del sistema."
  options={[
    { id: "a", label: "Aislar las dependencias de un proyecto del Python del sistema y de otros proyectos", correct: true, feedback: "¡Exacto! Cada proyecto tiene su propio conjunto de paquetes." },
    { id: "b", label: "Acelerar la ejecución del código Python", correct: false, feedback: "El venv no cambia la velocidad de ejecución." },
    { id: "c", label: "Ocultar el código fuente del proyecto", correct: false, feedback: "El venv no tiene nada que ver con ocultar código." },
    { id: "d", label: "Permitir usar varias versiones de Python sin instalarlas", correct: false, feedback: "Para eso necesitás instalar cada intérprete; el venv usa el que tengas." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué hace pip freeze?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 3"
  allowContinueOnIncorrect
  explanation="Lista todos los paquetes instalados con sus versiones exactas; se usa para generar un requirements.txt."
  options={[
    { id: "a", label: "Lista todos los paquetes instalados con sus versiones exactas", correct: true, feedback: "¡Exacto! La salida se redirige a requirements.txt." },
    { id: "b", label: "Congela el intérprete para que no ejecute código", correct: false, feedback: "pip freeze no congela la ejecución, registra paquetes." },
    { id: "c", label: "Elimina los paquetes no utilizados del entorno", correct: false, feedback: "Para eso existe pip uninstall; freeze solo lista." },
    { id: "d", label: "Actualiza pip a la última versión disponible", correct: false, feedback: "Eso se hace con pip install --upgrade pip, no con freeze." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué comandos crean un entorno virtual e instalan NumPy verificando la instalación?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 4"
  allowContinueOnIncorrect
  explanation="python -m venv venv, luego activar (source venv/bin/activate o venv\Scripts\activate en Windows), pip install numpy y python -c 'import numpy; print(numpy.__version__)'."
  options={[
    { id: "a", label: "python -m venv venv  activar  pip install numpy  python -c 'import numpy; print(numpy.__version__)'", correct: true, feedback: "¡Exacto! Es la secuencia estándar." },
    { id: "b", label: "pip install venv && venv create", correct: false, feedback: "venv es un módulo de Python, no un paquete de pip." },
    { id: "c", label: "conda create -n venv numpy sin activar el entorno", correct: false, feedback: "Con conda hay que activar el entorno antes de instalar/usar." },
    { id: "d", label: "python -m pip install venv numpy en un solo paso", correct: false, feedback: "venv no se instala por pip y la creación del entorno es un paso aparte." },
  ]}
/>

<ChoiceQuestion
  question="¿Cómo genero un archivo requirements.txt a partir de un entorno virtual?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 5"
  allowContinueOnIncorrect
  explanation="Ejecutá pip freeze > requirements.txt después de instalar pandas y matplotlib (u otras dependencias)."
  options={[
    { id: "a", label: "pip freeze > requirements.txt (tras instalar las dependencias)", correct: true, feedback: "¡Exacto! Captura versiones exactas para reproducir el entorno." },
    { id: "b", label: "pip list > requirements.txt", correct: false, feedback: "pip list no incluye el formato compatible con pip install -r." },
    { id: "c", label: "pip save requirements.txt", correct: false, feedback: "Ese comando no existe en pip." },
    { id: "d", label: "echo $PIP_PACKAGES > requirements.txt", correct: false, feedback: "No hay variable estándar PIP_PACKAGES; pip freeze es la vía correcta." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuándo conviene la distribución oficial de Python vs Anaconda?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 6"
  allowContinueOnIncorrect
  explanation="La distribución oficial es más liviana y da control total; Anaconda trae muchos paquetes preinstalados, ideal para empezar rápido, pero ocupa mucho espacio."
  options={[
    { id: "a", label: "Oficial: liviana y control total; Anaconda: muchos paquetes preinstalados (ocupa mucho espacio)", correct: true, feedback: "¡Exacto! Elegís según si querés control o comodidad inicial." },
    { id: "b", label: "Anaconda siempre, porque es la distribución oficial", correct: false, feedback: "Anaconda es de una empresa privada; la oficial es la de python.org." },
    { id: "c", label: "La distribución oficial no sirve para data science", correct: false, feedback: "Sirve perfectamente: sólo instalás lo que necesitás." },
    { id: "d", label: "Son idénticas, sólo cambia el instalador", correct: false, feedback: "Difieren en tamaño y en los paquetes incluidos por defecto." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué es mala práctica usar sudo pip install?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 rev 7"
  allowContinueOnIncorrect
  explanation="sudo pip install instala paquetes globalmente como root y puede corromper paquetes del sistema. Alternativas: entornos virtuales o pip install --user."
  options={[
    { id: "a", label: "Instala globalmente como root y puede corromper paquetes del sistema (usar venv o pip install --user)", correct: true, feedback: "¡Exacto! Los entornos virtuales evitan ese riesgo." },
    { id: "b", label: "Porque sudo bloquea el acceso a internet", correct: false, feedback: "sudo no bloquea internet; el problema es el alcance de la instalación." },
    { id: "c", label: "Porque pip no acepta el comando sudo", correct: false, feedback: "pip sí acepta sudo; justamente por eso es peligroso." },
    { id: "d", label: "Porque instala versiones antiguas por defecto", correct: false, feedback: "sudo no determina la versión; el problema es la instalación global como root." },
  ]}
/>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Desafío de código: escribe un script check_env.py que imprima la versión de Python, la ubicación del intérprete, liste los paquetes instalados e intente importar numpy, pandas y matplotlib informando disponibilidad.",
  ]}
/>

<ChoiceQuestion
  question="¿Qué comando usas para verificar la versión de Python?"
  moduleSlug="python"
  lessonSlug="lesson01_installing_python"
  blockId="choice python l01 verify 12"
  allowContinueOnIncorrect
  explanation="python --version (o python3 --version en macOS/Linux)."
  options={[
    { id: "a", label: "python --version", correct: true, feedback: "¡Correcto!" },
    { id: "b", label: "pip --version", correct: false, feedback: "Ese comando verifica la versión de pip, no de Python." },
    { id: "c", label: "python -c \"import sys; print(sys.version)\"", correct: false, feedback: "Muestra versión detallada, pero no es el comando canónico de verificación." },
    { id: "d", label: "which python", correct: false, feedback: "Muestra la ruta del binario, no la versión." },
  ]}
/>

</RevealSequence>

</Section>
