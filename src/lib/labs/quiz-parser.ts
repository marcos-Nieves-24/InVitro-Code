// Quiz parser — pure, typed, tolerant. Never throws.
// Input: raw quiz.md string → Output: QuizResult

export interface QuizQuestion {
  id: number;
  type: "mcq" | "short-answer" | "coding";
  question: string;
  options?: string[]; // mcq only
  correctAnswer?: string; // mcq: letter; short-answer/coding: text
  explanation?: string; // from answer key or <details>
}

export interface QuizResult {
  parseMode: "structured" | "raw-fallback";
  questions: QuizQuestion[]; // empty on raw-fallback
  title: string;
}

// ---------------------------------------------------------------------------
// Section identifiers — case-insensitive, accent-preserving regex
// ---------------------------------------------------------------------------
const SECTION_MCQ =
  /\bMultiple\s*Choice\b|\bOpci[oó]n\s*[Mm][úu]ltiple\b/i;
const SECTION_SA =
  /\bShort\s*Answer\b|\bRespuesta\s*[Cc]orta\b/i;
const SECTION_CODING =
  /\bCoding\s*Question\b|\bPregunta\s*de\s*[Cc][óo]digo\b/i;
const SECTION_ANSWER_KEY =
  /\bAnswer\s*Key\b|\bClave\s*de\s*[Rr]espuestas?\b/i;

const SECTION_PATTERNS = [
  { regex: SECTION_MCQ, type: "mcq" as const },
  { regex: SECTION_SA, type: "short-answer" as const },
  { regex: SECTION_CODING, type: "coding" as const },
  { regex: SECTION_ANSWER_KEY, type: "answer-key" as const },
];

// Match a heading line: optional #s, then text
const HEADING_RE = /^(#{1,3})\s+(.+)$/;

// Question start: **Q1:**, **Q1.**, **1.**, **1:**
const QUESTION_START_RE = /^\s*\*\*\s*(Q?\d+)[.:]?\s*\*\*\s*/;
// Also bare **N. or **N at start
const Q_PREFIX_RE = /^\*\*(Q?\d+)[.:]?(?:\*\*\s*)?/;

// Option line: optional dash, letter, dot or paren
const OPTION_RE = /^[- ]*([A-Da-d])[.)]\s+(.+)$/;
// Also standalone "a)" without space (same regex works)

// Answer key line: **Q1:** B) text, **1.** b) text, 1. **b)** text, etc.
const ANSWER_RE =
  /^(?:\*\*)?(Q?\d+)[.:)]?(?:\*\*)?\s*[-—]?\s*(?:\*\*)?([A-Da-d])[.)]?\s*(?:\*\*)?(.+)$/;

// Inline <details> answer (uses [\s\S] in place of dotAll /s flag for ES2017 compat)
const DETAILS_ANSWER_RE = /<details>\s*<summary>\s*Answer\s*<\/summary>\s*([\s\S]+?)\s*<\/details>/i;

// ---------------------------------------------------------------------------
// Section extraction — split content by H1-H3 headings matching section types
// ---------------------------------------------------------------------------
interface MarkedSection {
  type: "mcq" | "short-answer" | "coding" | "answer-key";
  body: string;
}

function extractSections(content: string): MarkedSection[] {
  const lines = content.split("\n");
  const sections: MarkedSection[] = [];
  let currentType: MarkedSection["type"] | null = null;
  let currentBody: string[] = [];

  const flushSection = () => {
    if (currentType && currentBody.length > 0) {
      sections.push({
        type: currentType,
        body: currentBody.join("\n").trim(),
      });
    }
    currentType = null;
    currentBody = [];
  };

  for (const line of lines) {
    const m = line.match(HEADING_RE);
    if (m) {
      const headingText = m[2].trim();
      let matched = false;

      for (const pat of SECTION_PATTERNS) {
        if (pat.regex.test(headingText)) {
          flushSection();
          currentType = pat.type;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // A heading that isn't a known section type — this could be the main
        // title heading or a divider. If we're inside a section, treat it as
        // body text (sub-headings inside sections are common).
        if (currentType) {
          currentBody.push(line);
        }
      }
      continue;
    }

    if (currentType) {
      currentBody.push(line);
    }
  }

  flushSection();
  return sections;
}

// ---------------------------------------------------------------------------
// Question splitting — identify individual question blocks within a section
// ---------------------------------------------------------------------------
interface RawQuestion {
  id: number; // derived from order within section
  questionNumber: number; // the actual number/letter from the source
  qPrefixLabel: string; // "Q1", "1", etc.
  body: string;
}

function splitQuestions(body: string): RawQuestion[] {
  const lines = body.split("\n");
  const raw: RawQuestion[] = [];
  let current: {
    qPrefixLabel: string;
    header: string; // the bold marker line
    contentLines: string[];
  } | null = null;
  let seq = 0;

  const flushCurrent = () => {
    if (!current) return;
    // Combine header + content
    const fullBody =
      current.header +
      "\n" +
      current.contentLines.join("\n");
    raw.push({
      id: seq,
      questionNumber: parseQNumber(current.qPrefixLabel),
      qPrefixLabel: current.qPrefixLabel,
      body: fullBody.trim(),
    });
    seq++;
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(Q_PREFIX_RE);
    if (m) {
      flushCurrent();
      current = {
        qPrefixLabel: m[1],
        header: line,
        contentLines: [],
      };
    } else if (current) {
      current.contentLines.push(line);
    }
  }

  flushCurrent();
  return raw;
}

function parseQNumber(label: string): number {
  // "Q1" → 1, "1" → 1
  const num = Number.parseInt(label.replace(/^Q/i, ""), 10);
  return Number.isNaN(num) ? 0 : num;
}

// ---------------------------------------------------------------------------
// Option extraction from MCQ question body
// ---------------------------------------------------------------------------
function extractMcqOptions(body: string): {
  question: string;
  options: string[];
} {
  const lines = body.split("\n");
  const questionLines: string[] = [];
  const options: string[] = [];
  let inOptions = false;

  // The first line IS the question header line (bold marker).
  // Subsequent non-option lines are question text.
  for (const line of lines) {
    // Skip empty lines at the start of body
    if (!inOptions && questionLines.length === 0 && line.trim() === "") {
      continue;
    }

    const optMatch = line.match(OPTION_RE);
    if (optMatch) {
      inOptions = true;
      options.push(`${optMatch[1].toUpperCase()}) ${optMatch[2].trim()}`);
      continue;
    }

    if (!inOptions) {
      questionLines.push(line);
    }
    // Once we hit options, ignore non-option lines (except for <details>)
  }

  // Clean question: remove the bold **Q1:**/**1.** prefix from the first line,
  // then join
  let questionText = questionLines.join("\n");
  questionText = questionText.replace(Q_PREFIX_RE, "").trim();

  return { question: questionText, options };
}

// Extract question text for short-answer / coding (non-MCQ)
function extractPlainQuestion(body: string): string {
  const lines = body.split("\n");
  // Skip the first line (bold marker) and any leading whitespace
  let start = 0;
  // Find first non-empty line after the bold marker
  for (let i = 0; i < lines.length; i++) {
    const clean = lines[i].replace(Q_PREFIX_RE, "").trim();
    if (clean) {
      start = i;
      break;
    }
  }
  return lines
    .slice(start)
    .join("\n")
    .replace(Q_PREFIX_RE, "") // in case it's on the first kept line
    .trim();
}

// ---------------------------------------------------------------------------
// Answer Key parsing
// ---------------------------------------------------------------------------
function parseAnswerKey(
  body: string,
): Map<number, { answer: string; explanation: string }> {
  const results = new Map<number, { answer: string; explanation: string }>();
  const lines = body.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // (1) Letter-based: **Q1:** C) text, **1.** b) text, 1. **b)** text
    let m = trimmed.match(ANSWER_RE);
    if (m) {
      const qNum = parseQNumber(m[1]);
      const answer = m[2].toUpperCase();
      const explanation = m[3].trim();
      if (qNum > 0) results.set(qNum, { answer, explanation });
      continue;
    }

    // (2) Inline **b)** format: `1. **b)** text`
    const inlineAnswerRe = /^(\d+)[.:)]?\s+\*\*([A-Da-d])\)\*\*\s+(.+)$/;
    let im = trimmed.match(inlineAnswerRe);
    if (im) {
      const qNum = Number.parseInt(im[1], 10);
      const answer = im[2].toUpperCase();
      const explanation = im[3].trim();
      if (!Number.isNaN(qNum) && qNum > 0) {
        results.set(qNum, { answer, explanation });
      }
      continue;
    }

    // (3) Text-only short-answer/coding: **Q6:** text, **6.** text, 6. text
    const textAnswerRe =
      /^(?:\*\*)?(Q?\d+)[.:)]?(?:\*\*)?\s*[-—]?\s*(.+)$/;
    let tm = trimmed.match(textAnswerRe);
    if (tm) {
      const qNum = parseQNumber(tm[1]);
      const text = tm[2].trim();
      if (qNum > 0 && text.length > 0) {
        // Only set if no letter-based answer exists for this question
        if (!results.has(qNum)) {
          results.set(qNum, { answer: text, explanation: text });
        }
      }
    }
  }

  return results;
}

// Extract answer from <details> block
function extractDetailsAnswer(body: string): string | null {
  const m = body.match(DETAILS_ANSWER_RE);
  if (!m) return null;
  const inner = m[1].trim();

  // Try to extract just the letter: "b) text" → "b"
  const letterMatch = inner.match(/^([A-Da-d])[.)]/);
  if (letterMatch) {
    return letterMatch[1].toUpperCase();
  }
  // Otherwise return the full text (for short-answer/coding)
  return inner;
}

// ---------------------------------------------------------------------------
// Main parse function
// ---------------------------------------------------------------------------
export function parseQuiz(mdContent: string): QuizResult {
  try {
    // Sanity: must be a string with some content
    if (typeof mdContent !== "string" || mdContent.trim().length === 0) {
      return { parseMode: "raw-fallback", questions: [], title: "" };
    }

    const normalized = mdContent.trim();

    // Extract title from first H1 heading
    const titleMatch = normalized.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract sections
    const sections = extractSections(normalized);

    // Parse answer key first (so we can merge answers later)
    const answerKeyBodies = sections
      .filter((s) => s.type === "answer-key")
      .map((s) => s.body);
    const answerMap = new Map<number, { answer: string; explanation: string }>();
    for (const keyBody of answerKeyBodies) {
      const parsed = parseAnswerKey(keyBody);
      for (const [k, v] of parsed) {
        answerMap.set(k, v);
      }
    }

    const questions: QuizQuestion[] = [];
    let globalId = 1;

    for (const section of sections) {
      if (section.type === "answer-key") continue;

      const rawQuestions = splitQuestions(section.body);
      for (const raw of rawQuestions) {
        // Check for inline <details> answer
        const detailsAnswer = extractDetailsAnswer(raw.body);
        // Answer from key section using questionNumber
        const keyAnswer = answerMap.get(raw.questionNumber);

        if (section.type === "mcq") {
          const { question, options } = extractMcqOptions(raw.body);

          const correctAnswer =
            detailsAnswer ?? keyAnswer?.answer ?? undefined;
          const explanation =
            (detailsAnswer ? raw.body.match(DETAILS_ANSWER_RE)?.[1]?.trim() : undefined) ??
            keyAnswer?.explanation ??
            undefined;

          questions.push({
            id: globalId++,
            type: "mcq",
            question,
            options,
            correctAnswer,
            explanation,
          });
        } else if (section.type === "short-answer") {
          const question = extractPlainQuestion(raw.body);
          const correctAnswer = detailsAnswer ?? keyAnswer?.answer ?? keyAnswer?.explanation ?? undefined;
          const explanation = keyAnswer?.explanation ?? undefined;

          questions.push({
            id: globalId++,
            type: "short-answer",
            question,
            correctAnswer,
            explanation,
          });
        } else if (section.type === "coding") {
          const question = extractPlainQuestion(raw.body);
          const correctAnswer = detailsAnswer ?? keyAnswer?.explanation ?? undefined;
          const explanation = keyAnswer?.explanation ?? undefined;

          questions.push({
            id: globalId++,
            type: "coding",
            question,
            correctAnswer,
            explanation,
          });
        }
      }
    }

    if (questions.length === 0) {
      return { parseMode: "raw-fallback", questions: [], title };
    }

    return { parseMode: "structured", questions, title };
  } catch {
    // Never throw — any error means raw-fallback
    return { parseMode: "raw-fallback", questions: [], title: "" };
  }
}
