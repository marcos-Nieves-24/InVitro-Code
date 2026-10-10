// domain/slide.ts — pure types, no infra imports
// Presentation slide quiz types for ChoiceQuestion / T4

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  mode?: "single" | "multiple";
}

export type SlideKind = "dialogue" | "content" | "quiz" | "lab";
