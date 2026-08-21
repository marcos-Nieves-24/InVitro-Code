import { describe, it, expect } from "vitest";
import { parseQuiz } from "./quiz-parser";

describe("parseQuiz", () => {
  it("parses ES quiz with **N.** questions and a) options", () => {
    const raw = `# Quiz: Prueba
## Opción múltiple (1 pregunta)

**1. ¿Qué es una feature?**
a) Una propiedad medible
b) Un error
c) Un algoritmo
d) Un hardware

---
## Clave de respuestas

1. **a)** Una propiedad medible.
`;
    const res = parseQuiz(raw);
    expect(res.parseMode).toBe("structured");
    expect(res.questions).toHaveLength(1);
    const q = res.questions[0];
    expect(q.type).toBe("mcq");
    expect(q.question).toBe("¿Qué es una feature?");
    expect(q.options).toHaveLength(4);
    expect(q.options?.[0]).toBe("A) Una propiedad medible");
    expect(q.correctAnswer).toBe("A");
  });

  it("strips trailing ** left by the **N. question** format", () => {
    const raw = `# Quiz
## Multiple Choice (1 question)

**1. ¿Pregunta?**
a) Sí
b) No

## Answer Key

1. **a)** Explicación
`;
    const res = parseQuiz(raw);
    expect(res.questions[0].question).toBe("¿Pregunta?");
    expect(res.questions[0].question.endsWith("**")).toBe(false);
  });

  it("parses Q1: format with - A) options", () => {
    const raw = `# Quiz
## Opción múltiple (1 pregunta)

**Q1:** ¿Cuál es el resultado?
- A) 42
- B) 0

## Clave de respuestas

**Q1:** A) 42
`;
    const res = parseQuiz(raw);
    expect(res.parseMode).toBe("structured");
    const q = res.questions[0];
    expect(q.question).toBe("¿Cuál es el resultado?");
    expect(q.options?.[0]).toBe("A) 42");
    expect(q.correctAnswer).toBe("A");
  });

  it("falls back to raw-fallback on empty content", () => {
    const res = parseQuiz("");
    expect(res.parseMode).toBe("raw-fallback");
    expect(res.questions).toHaveLength(0);
  });

  it("parses short-answer questions", () => {
    const raw = `# Quiz
## Respuesta corta (1 pregunta)

**1.** Explica la diferencia entre media y mediana.

## Clave de respuestas

1. La media es sensible a outliers.
`;
    const res = parseQuiz(raw);
    expect(res.parseMode).toBe("structured");
    const q = res.questions[0];
    expect(q.type).toBe("short-answer");
    expect(q.correctAnswer).toBe("La media es sensible a outliers.");
  });

  it("handles multiple questions in order", () => {
    const raw = `# Quiz
## Opción múltiple (2 preguntas)

**1.** ¿A?
a) 1
b) 2

**2.** ¿B?
a) 3
b) 4

## Clave de respuestas

1. **a)** A
2. **b)** B
`;
    const res = parseQuiz(raw);
    expect(res.questions).toHaveLength(2);
    expect(res.questions[0].id).toBe(1);
    expect(res.questions[1].id).toBe(2);
    expect(res.questions[0].correctAnswer).toBe("A");
    expect(res.questions[1].correctAnswer).toBe("B");
  });
});
