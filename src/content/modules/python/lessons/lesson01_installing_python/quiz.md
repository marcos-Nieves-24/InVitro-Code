# Quiz: Installing Python

## Multiple Choice (5 questions)

**Q1:** What command verifies that Python is installed correctly?
- A) `python check`
- B) `python --version`
- C) `python install`
- D) `python verify`

**Q2:** What is the purpose of a virtual environment?
- A) To run Python faster
- B) To isolate project dependencies
- C) To create a backup of Python
- D) To install multiple Python versions

**Q3:** Which command installs a package with pip?
- A) `pip get package_name`
- B) `pip add package_name`
- C) `pip install package_name`
- D) `pip download package_name`

**Q4:** On Windows, what critical option must be checked during installation?
- A) "Install for all users"
- B) "Add Python to PATH"
- C) "Create desktop shortcut"
- D) "Enable debug mode"

**Q5:** What file lists all project dependencies with their versions?
- A) `dependencies.txt`
- B) `packages.txt`
- C) `requirements.txt`
- D) `config.txt`

## Short Answer (2 questions)

**Q6:** Explain why you should use virtual environments instead of installing packages globally.

**Q7:** What is the difference between pip and pip3?

## Coding Question

**Q8:** Write the sequence of terminal commands to:
1. Create a virtual environment named `ml_env`
2. Activate it (on macOS/Linux)
3. Install the package `scikit-learn`
4. Save the list of installed packages to a file

## Answer Key

**Q1:** B) `python --version`

**Q2:** B) To isolate project dependencies

**Q3:** C) `pip install package_name`

**Q4:** B) "Add Python to PATH"

**Q5:** C) `requirements.txt`

**Q6:** Virtual environments isolate dependencies per project, preventing version conflicts between projects. Global installations can break system tools and make it impossible to use different versions of the same library for different projects.

**Q7:** On some systems, `pip` may point to Python 2, while `pip3` explicitly points to Python 3. On modern Python installations, `pip` and `pip3` are often the same, but using `pip3` ensures you're installing for Python 3.

**Q8:**
```bash
python -m venv ml_env
source ml_env/bin/activate
pip install scikit-learn
pip freeze > requirements.txt
```
