---
Module: 2
Lesson Number: 1
Lesson Title: Installing Python
Estimated Duration: 30 minutes
Prerequisites: None
Learning Objectives:
  - Explain what Python is and why it is used for data science
  - Install Python on Windows, macOS, or Linux
  - Verify the installation using the command line
  - Use pip to install Python packages
  - Create and activate a virtual environment
Keywords: Python, pip, virtual environment, command line, installation
Difficulty: Beginner
Programming Concepts: Python interpreter, CLI, package management, virtual environments
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Installing Python

## Motivation

Before you can write a single line of Python code, you need a working Python environment. Every data scientist, machine learning engineer, and software developer starts here. A correct installation saves hours of debugging later. In biotechnology, you will use Python to analyze DNA sequences, process clinical data, and train predictive models. In SaaS, Python powers recommendation engines, customer analytics, and automated reporting. All of this begins with a properly configured Python installation.

## Big Picture

This is the foundation of the entire course. Without Python installed, you cannot run any code. In the previous module, you learned what AI is. Now you will build the practical skills needed to implement AI solutions. In the next lesson, you will learn to use Jupyter Notebook — an interactive environment that runs on top of your Python installation.

## Theory

### What is Python?

Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It emphasizes code readability and simplicity. Python is the most popular language for data science and machine learning because of its extensive ecosystem of libraries (NumPy, Pandas, scikit-learn, TensorFlow) and its gentle learning curve.

### Python Distributions

There are several ways to get Python:

- **Official Python** (python.org): The reference implementation (CPython). Recommended for most users.
- **Anaconda Distribution**: Includes Python plus 250+ pre-installed data science packages. Good for beginners but heavy.
- **Miniconda**: A minimal version of Anaconda with just conda and Python.
- **Python from Microsoft Store** (Windows): Convenient but may have path issues.

For this course, we recommend installing Python directly from python.org.

### The Python Interpreter

When you install Python, you get the **interpreter** — a program that reads and executes Python code. You can use it in two modes:

1. **Interactive mode**: Type commands and see results immediately (REPL)
2. **Script mode**: Run `.py` files containing Python code

### pip — The Package Installer

pip is Python's package manager. It downloads and installs packages from the Python Package Index (PyPI), which hosts over 400,000 packages.

Common pip commands:
- `pip install package_name` — install a package
- `pip uninstall package_name` — remove a package
- `pip list` — list installed packages
- `pip freeze` — list installed packages with versions

### Virtual Environments

A virtual environment is an isolated Python environment that allows you to install packages without affecting the system Python or other projects. Each project gets its own dependencies.

**Why use virtual environments?** Different projects may require different versions of the same library. Virtual environments prevent conflicts.

### Installing Python on Windows

1. Go to https://python.org and download the latest Python installer
2. **IMPORTANT**: Check "Add Python to PATH"
3. Click "Install Now"
4. Open Command Prompt and type `python --version`
5. Verify pip: `pip --version`

### Installing Python on macOS

1. Install Homebrew (optional but recommended): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. `brew install python`
3. Verify: `python3 --version`
4. pip is included: `pip3 --version`

### Installing Python on Linux

Most Linux distributions include Python. Check with:
```bash
python3 --version
```

If not installed:
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip
```

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│                 Python Installation                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [1] Download Python from python.org                │
│       ↓                                             │
│  [2] Run installer (✓ Add to PATH)                  │
│       ↓                                             │
│  [3] Verify: python --version                       │
│       ↓                                             │
│  [4] Verify: pip --version                          │
│       ↓                                             │
│  [5] Create virtual environment                     │
│       ↓                                             │
│  [6] Install packages with pip                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Python Implementation

### Verifying Python Installation

Open a terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run:

```bash
python --version
```

Expected output: `Python 3.x.x`

### Using the Interactive Interpreter

```bash
python
```

Then type:

```python
print("Hello, Python!")
result = 2 + 2
print(result)
```

### Creating a Virtual Environment

```bash
# Create a virtual environment named 'venv'
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Your prompt will change to show (venv)
```

### Installing Packages

```bash
pip install numpy pandas matplotlib
```

### Freezing Dependencies

```bash
pip freeze > requirements.txt
```

This creates a file listing all installed packages and versions — essential for reproducibility.

## Biotechnology Example

**Scenario**: A bioinformatics lab needs a consistent Python environment for analyzing DNA sequences. Multiple researchers work on the same project. Using a `requirements.txt` file ensures everyone has the same package versions.

```bash
# Create project directory
mkdir dna_analysis
cd dna_analysis

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install bioinformatics packages
pip install biopython pandas numpy matplotlib

# Save dependencies
pip freeze > requirements.txt
```

Now any researcher can replicate the environment with:
```bash
pip install -r requirements.txt
```

## SaaS Example

**Scenario**: A SaaS startup needs to deploy a customer churn prediction model. The development team uses a virtual environment to isolate dependencies, then freezes them for deployment.

```bash
# Developer machine
python -m venv venv
source venv/bin/activate
pip install scikit-learn pandas flask gunicorn
pip freeze > requirements.txt

# Production server
pip install -r requirements.txt
```

This guarantees that the production environment matches development exactly.

## Common Mistakes

1. **Forgetting to check "Add Python to PATH"**: Python won't be recognized as a command. Reinstall and check the box.
2. **Using the system Python directly**: Always create a virtual environment for projects.
3. **Committing `venv` to version control**: Add `venv/` to `.gitignore`.
4. **Running `pip install` without a virtual environment**: Can break system Python.
5. **Confusing `pip` and `pip3`**: On some systems, `pip` points to Python 2. Use `pip3` for Python 3.

## Best Practices

- Always use virtual environments for project isolation
- Use `requirements.txt` for reproducibility
- Keep Python updated (within the same major version)
- Document the Python version your project requires
- Use `pip freeze > requirements.txt` regularly
- Never use `sudo pip install` (Linux/macOS) — it can corrupt system packages
- Consider using pyenv to manage multiple Python versions

## Summary

- Python is an interpreted, high-level language essential for data science
- Install from python.org and verify with `python --version`
- pip installs packages from PyPI
- Virtual environments isolate project dependencies
- Always use virtual environments for reproducibility
- Verify your installation by running Python code in interactive mode

## Key Terms

- **Interpreter**: Program that executes Python code line by line
- **pip**: Python's package installer
- **PyPI**: Python Package Index — repository of Python packages
- **Virtual environment**: Isolated Python environment for a specific project
- **PATH**: System variable that tells the OS where to find executables
- **REPL**: Read-Eval-Print Loop — interactive Python shell
- **requirements.txt**: File listing project dependencies

## Exercises

### Level 1: Basic

1. What command do you use to check the Python version?
2. What is the purpose of a virtual environment?
3. What does `pip freeze` do?

### Level 2: Implementation

4. Install Python (if not installed), create a virtual environment, and install NumPy. Verify the installation by running `python -c "import numpy; print(numpy.__version__)"`.
5. Create a `requirements.txt` file for a project that depends on pandas and matplotlib.

### Level 3: Critical Thinking

6. Compare the official Python distribution with Anaconda. When would you use each?
7. Why is it bad practice to install packages globally with `sudo pip install`? What alternatives exist?

## Coding Challenge

Write a Python script called `check_env.py` that:
1. Prints the Python version
2. Prints the location of the Python interpreter
3. Lists all installed packages
4. Attempts to import numpy, pandas, and matplotlib, reporting whether each is available

Run the script and verify the output.
