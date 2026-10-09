// Domain — LessonCard pure model
// No imports from infrastructure/presentation/gamification.
// xp is injected by caller (calcXpForLesson) to keep domain pure.

export type LessonCardState = "available" | "completed" | "blocked";

export interface LessonCardModel {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  difficulty: string;
  difficultyLabel: string;
  xp: number;
  estimatedDuration?: string;
  prerequisites?: string;
  state: LessonCardState;
}

const DIFFICULTY_MAP: Record<string, string> = {
  Principiante: "Principiante",
  Intermedio: "Intermedio",
  Avanzado: "Avanzado",
};

export function normalizeDifficulty(d: string | undefined): string {
  if (d && DIFFICULTY_MAP[d]) return DIFFICULTY_MAP[d];
  if (d !== undefined && d !== null && String(d).trim() !== "") {
    // Known label verbatim? Only allow exact keys; otherwise fallback
    // Keep raw trimmed value if it is one of the known keys case-insensitively?
    // Decision: strict — unknown values → "—" to avoid leaking unnormalized UI strings.
    return "—";
  }
  return "—";
}

function normalizePrerequisites(
  p: string | undefined,
): string | undefined {
  if (p === undefined || p === null) return undefined;
  const trimmed = String(p).trim();
  if (trimmed === "") return undefined;
  if (trimmed.toLowerCase() === "ninguno") return undefined;
  return trimmed;
}

export function buildLessonCardModel(params: {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  xp: number;
  difficulty?: string;
  estimatedDuration?: string;
  prerequisites?: string;
  completed?: boolean;
  blocked?: boolean;
}): LessonCardModel {
  const {
    moduleSlug,
    lessonSlug,
    title,
    xp,
    difficulty,
    estimatedDuration,
    prerequisites,
    completed,
    blocked,
  } = params;

  const state: LessonCardState = blocked
    ? "blocked"
    : completed
      ? "completed"
      : "available";

  const difficultyLabel = normalizeDifficulty(difficulty);
  // Preserve raw difficulty string for storage; fallback to "—" display already via label
  const normalizedDifficulty =
    difficulty && DIFFICULTY_MAP[difficulty] ? difficulty : (difficulty ?? "");

  const prereq = normalizePrerequisites(prerequisites);
  const duration =
    estimatedDuration !== undefined && String(estimatedDuration).trim() !== ""
      ? String(estimatedDuration).trim()
      : undefined;

  return {
    moduleSlug,
    lessonSlug,
    title,
    difficulty: normalizedDifficulty,
    difficultyLabel,
    xp,
    ...(duration !== undefined ? { estimatedDuration: duration } : {}),
    ...(prereq !== undefined ? { prerequisites: prereq } : {}),
    state,
  };
}
