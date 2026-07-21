# Assignment: Sequence Analysis Toolkit

## Objectives

- Write well-structured functions with docstrings
- Implement domain-specific functions for biotechnology
- Use lambda functions appropriately
- Demonstrate understanding of scope

## Instructions

Create a Python module `sequence_tools.py` with the following functions:

1. `gc_content(sequence)` — returns GC percentage
2. `reverse_complement(sequence)` — returns reverse complement of DNA
3. `transcribe(sequence)` — transcribes DNA to RNA (T → U)
4. `translate(sequence)` — translates DNA to protein (using a provided codon table). For simplicity, translate the first reading frame only.
5. `has_motif(sequence, motif)` — returns True if motif is found
6. `filter_by_gc(sequences, min_gc, max_gc)` — uses a lambda to filter sequences by GC content range

Include:
- Docstrings for all functions (PEP 257 format)
- Type hints for all functions
- A demonstration in `if __name__ == "__main__":` block

## Deliverables

- `sequence_tools.py`
- Example output from the demonstration block

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Function Design | Clear, single-purpose functions | Mostly clear | Unclear purpose |
| Parameters/Return | Appropriate I/O for each function | Mostly appropriate | Poor design |
| Docstrings | PEP 257 compliant, comprehensive | Present but incomplete | Missing |
| Lambda Usage | Appropriate use of lambdas | Basic use | Not used |
| Code Quality | PEP 8, type hints, organized | Mostly compliant | Poor quality |
| Demonstration | Shows all functions, clear output | Shows most functions | Incomplete |

## Estimated Completion Time

90 minutes
