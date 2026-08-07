# Quiz Runner Specification

## Purpose

The Cuestionario tab parses `quiz.md` — which has no frontmatter and varies in heading language and option style — into an interactive client-side quiz with validation and an Answer Key reveal. Parsing must be tolerant: any unrecognized structure falls back to raw markdown rather than failing.

## Requirements

### Requirement: REQ-QUIZ-01 Parser Contract

The system MUST provide a parser taking the raw `quiz.md` string and returning `{ questions: QuizQuestion[], parseMode: 'structured' | 'raw-fallback' }`. `QuizQuestion` MUST be `{ id, type: 'mcq'|'short-answer'|'coding', question, options?, correctAnswer?, explanation? }`. The parser MUST NOT throw on any input.

#### Scenario: Well-formed quiz parsed

- GIVEN a standard `quiz.md` with MCQ, short-answer, and coding sections
- WHEN the parser runs
- THEN it returns `parseMode: 'structured'` and one `QuizQuestion` per authored question

### Requirement: REQ-QUIZ-02 Bilingual Headings

The parser MUST recognize EN and ES section headings — `Multiple Choice`/`Opción múltiple`, `Short Answer`/`Respuesta corta`, `Coding Question`/`Pregunta de código`, `Answer Key`/`Clave de respuestas` — at any `#`/`##`/`###` level.

#### Scenario: Spanish headings parsed

- GIVEN a quiz using `## Preguntas de opción múltiple`
- WHEN the parser runs
- THEN questions are classified `mcq` with options extracted

### Requirement: REQ-QUIZ-03 Option Styles

The parser MUST accept `- A)`, `A)`, `a)`, `- a)`, and question-number prefixes such as `**Q1:**` or `**1.**`, matching per-module variance.

#### Scenario: Mixed styles across modules

- GIVEN a python quiz with `- A)` options and an ia quiz with `a)` options
- WHEN the parser runs on each
- THEN both produce equivalent `mcq` questions with four options

### Requirement: REQ-QUIZ-04 Missing Sections

The parser MUST tolerate absent sections — e.g. no coding question, no answer key — and return the questions it did find.

#### Scenario: Answer key absent

- GIVEN a quiz with no `Answer Key` section
- WHEN the parser runs
- THEN questions still parse with `parseMode: 'structured'` and `correctAnswer` omitted

### Requirement: REQ-QUIZ-05 Raw Fallback

When the parser cannot extract structured questions, it MUST return `parseMode: 'raw-fallback'` with empty questions, and the tab MUST render the raw markdown with a notice. It MUST never crash.

#### Scenario: Unparseable quiz

- GIVEN a `quiz.md` with no recognizable question structure
- WHEN the parser runs and the tab renders
- THEN raw markdown shows with a "no disponible" notice and no error

### Requirement: REQ-QUIZ-06 Client-Side Validation

The quiz MUST be interactive on the client: MCQs render radio inputs, short answers text inputs; submitting MUST mark each answer correct or incorrect against the parsed `correctAnswer`. Validation MUST NOT write to any server.

#### Scenario: Correct and incorrect answers

- GIVEN an MCQ with `correctAnswer: "b"`
- WHEN the student selects `b` and submits
- THEN it is marked correct; selecting `a` marks it incorrect with feedback

### Requirement: REQ-QUIZ-07 Answer Key Reveal

The tab MUST provide a reveal control showing each question's `correctAnswer` and `explanation` when toggled. UI chrome MUST be Spanish; question text MUST keep its authored language.

#### Scenario: Key revealed

- GIVEN a completed quiz
- WHEN the student toggles the answer key
- THEN correct answers and explanations appear beside each question

## Out of Scope

- Persisting quiz attempts (`quiz_attempts` table is phase 2)
- Code execution for `coding` questions (rendered as prompts with solution in the key)
- Editing quiz content
