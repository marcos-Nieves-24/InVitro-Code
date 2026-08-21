# Quiz: Instalar Python

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué comando verifica que Python esté instalado correctamente?
- A) `python check`
- B) `python --version`
- C) `python install`
- D) `python verify`

**Q2:** ¿Cuál es el propósito de un virtual environment?
- A) Hacer que Python corra más rápido
- B) Aislar las dependencias del proyecto
- C) Crear un backup de Python
- D) Instalar múltiples versiones de Python

**Q3:** ¿Qué comando instala un paquete con pip?
- A) `pip get package_name`
- B) `pip add package_name`
- C) `pip install package_name`
- D) `pip download package_name`

**Q4:** En Windows, ¿qué opción crítica se debe marcar durante la instalación?
- A) "Install for all users"
- B) "Add Python to PATH"
- C) "Create desktop shortcut"
- D) "Enable debug mode"

**Q5:** ¿Qué archivo lista todas las dependencias del proyecto con sus versiones?
- A) `dependencies.txt`
- B) `packages.txt`
- C) `requirements.txt`
- D) `config.txt`

## Respuesta corta (2 preguntas)

**Q6:** Explica por qué deberías usar virtual environments en lugar de instalar paquetes de forma global.

**Q7:** ¿Cuál es la diferencia entre pip y pip3?

## Pregunta de código

**Q8:** Escribe la secuencia de comandos de terminal para:
1. Crear un virtual environment llamado `ml_env`
2. Activarlo (en macOS/Linux)
3. Instalar el paquete `scikit-learn`
4. Guardar la lista de paquetes instalados en un archivo

## Clave de respuestas

**Q1:** B) `python --version`

**Q2:** B) Aislar las dependencias del proyecto

**Q3:** C) `pip install package_name`

**Q4:** B) "Add Python to PATH"

**Q5:** C) `requirements.txt`

**Q6:** Los virtual environments aíslan las dependencias de cada proyecto, previniendo conflictos de versiones entre proyectos. Las instalaciones globales pueden romper herramientas del sistema y hacer imposible usar diferentes versiones de la misma librería para distintos proyectos.

**Q7:** En algunos sistemas, `pip` puede apuntar a Python 2, mientras que `pip3` apunta explícitamente a Python 3. En instalaciones modernas de Python, `pip` y `pip3` suelen ser lo mismo, pero usar `pip3` asegura que estés instalando para Python 3.

**Q8:**
```bash
python -m venv ml_env
source ml_env/bin/activate
pip install scikit-learn
pip freeze > requirements.txt
```
