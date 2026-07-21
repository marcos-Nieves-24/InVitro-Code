# Installing Python — Slide Outline

## Slide 1: Title Slide
- Installing Python
- Module 2: Python Programming Fundamentals
- Course: Machine Learning for Data Analysis and SaaS

## Slide 2: Why This Matters
- Every data scientist starts here
- Foundation for all future lessons
- Biotechnology: DNA analysis, clinical data
- SaaS: Recommendation engines, customer analytics

## Slide 3: What is Python?
- High-level, interpreted language (1991, Guido van Rossum)
- Emphasizes readability
- Most popular language for data science
- Extensive ecosystem: NumPy, Pandas, scikit-learn

## Slide 4: Python Distributions
- Official Python (python.org)
- Anaconda (250+ pre-installed packages)
- Miniconda (minimal)
- Microsoft Store Python
- Recommendation: Official Python

## Slide 5: Installation Steps
1. Download from python.org
2. Run installer
3. ✓ Add Python to PATH (Windows)
4. Verify: `python --version`
5. Verify pip: `pip --version`

## Slide 6: The Python Interpreter
- Two modes: interactive (REPL) and script (.py files)
- Demo: `python` then `print("Hello")`, `2 + 2`, `exit()`

## Slide 7: pip — Package Installer
- Python Package Index (PyPI): 400,000+ packages
- `pip install pandas`
- `pip uninstall pandas`
- `pip list`
- `pip freeze > requirements.txt`

## Slide 8: Virtual Environments
- Isolated Python environments per project
- Why? Different projects need different package versions
- Create: `python -m venv venv`
- Activate: `source venv/bin/activate` (macOS/Linux) or `venv\Scripts\activate` (Windows)

## Slide 9: Biotechnology Example
- Bioinformatics lab needs consistent environment
- Create project with Biopython
- Share `requirements.txt`
- Reproducibility in research

## Slide 10: SaaS Example
- Customer churn prediction project
- Isolate dependencies with venv
- Freeze for deployment
- Production matches development exactly

## Slide 11: Common Mistakes
- Forgetting to add Python to PATH
- Installing globally without virtual environment
- Committing venv to git
- Using sudo pip install

## Slide 12: Best Practices
- Always use virtual environments
- Use `requirements.txt`
- Keep Python updated
- Document Python version
- Never use `sudo pip install`

## Slide 13: Summary
- Install from python.org
- Verify with `python --version`
- pip installs packages
- Virtual environments isolate projects
- Reproducibility is key
