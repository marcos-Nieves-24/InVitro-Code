# Lab: Setting Up Your Python Environment

## Objective

Successfully install Python, create a virtual environment, install packages, and verify the setup.

## Duration

30 minutes

## Prerequisites

- A computer with internet access
- Administrative rights to install software (or use package manager)

## Instructions

### Part 1: Install Python

1. Download Python from https://python.org (latest stable version)
2. Run the installer — ensure you check "Add Python to PATH" (Windows)
3. Open a terminal and verify:
   ```bash
   python --version
   ```

### Part 2: Create and Activate a Virtual Environment

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

### Part 3: Install Packages

```bash
pip install numpy pandas matplotlib jupyter
```

### Part 4: Verify Installation

Create a file `test_install.py` with:

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

Run it:
```bash
python test_install.py
```

### Part 5: Save Dependencies

```bash
pip freeze > requirements.txt
type requirements.txt  # Windows
cat requirements.txt   # macOS/Linux
```

## Deliverables

- Screenshot or copy of terminal output showing Python version and package versions
- The `requirements.txt` file content

## Bonus

Install a bioinformatics package (Biopython) and import it successfully.
