"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { parseQuiz, type QuizQuestion, type QuizResult } from "@/lib/labs/quiz-parser";

interface QuizRunnerProps {
  raw: string;
}

interface UserAnswer {
  questionId: number;
  value: string; // letter for MCQ, text for short-answer/coding
}

function countMcqCorrect(
  questions: QuizQuestion[],
  answers: UserAnswer[],
): number {
  let correct = 0;
  for (const q of questions) {
    if (q.type !== "mcq") continue;
    const userAnswer = answers.find((a) => a.questionId === q.id);
    if (userAnswer && userAnswer.value.toUpperCase() === q.correctAnswer?.toUpperCase()) {
      correct++;
    }
  }
  return correct;
}

function renderMarkdownFallback(raw: string): string {
  // Strip heading markers and excessive whitespace for a cleaner fallback
  return raw
    .replace(/^#+\s+/gm, "")
    .trim();
}

export function QuizRunner({ raw }: QuizRunnerProps) {
  const result: QuizResult = useMemo(() => parseQuiz(raw), [raw]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const mcqQuestions = result.questions.filter((q) => q.type === "mcq");
  const mcqTotal = mcqQuestions.length;
  const mcqCorrect = submitted
    ? countMcqCorrect(result.questions, answers)
    : 0;

  const handleMcqSelect = (questionId: number, letter: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, value: letter }];
    });
    // Clear submission state when answer changes
    if (submitted) setSubmitted(false);
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, value: text }];
    });
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleToggleAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  // ── Raw fallback ──
  if (result.parseMode === "raw-fallback") {
    return (
      <div className="rounded-card border border-amber-200 bg-amber-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">
              Formato no reconocido
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              El contenido de este cuestionario no se pudo interpretar. Se
              muestra en formato original:
            </p>
          </div>
        </div>
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-100/50 p-4 font-mono text-sm text-gray-800">
          {renderMarkdownFallback(raw)}
        </pre>
      </div>
    );
  }

  // ── Structured quiz ──
  return (
    <div className="space-y-8">
      {/* Score display */}
      {submitted && mcqTotal > 0 && (
        <div
          className={`rounded-card border p-4 ${
            mcqCorrect === mcqTotal
              ? "border-green-200 bg-green-50"
              : mcqCorrect >= mcqTotal / 2
                ? "border-blue-200 bg-blue-50"
                : "border-red-200 bg-red-50"
          }`}
        >
          <p className="text-sm font-semibold">
            {mcqCorrect === mcqTotal
              ? `¡Excelente! ${mcqCorrect} de ${mcqTotal} correctas`
              : mcqCorrect >= mcqTotal / 2
                ? `¡Buen trabajo! ${mcqCorrect} de ${mcqTotal} correctas`
                : `Resultado: ${mcqCorrect} de ${mcqTotal} correctas`}
          </p>
        </div>
      )}

      {/* Questions */}
      {result.questions.map((question) => {
        const userAnswer = answers.find((a) => a.questionId === question.id);
        const userValue = userAnswer?.value ?? "";
        const isCorrect =
          submitted &&
          question.correctAnswer &&
          userValue.toUpperCase() === question.correctAnswer.toUpperCase();

        return (
          <div
            key={question.id}
            className="rounded-card border border-gray-200 bg-white p-6 shadow-sm"
          >
            {/* Question header */}
            <div className="mb-4 flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">
                <span className="mr-2 text-xs font-bold uppercase tracking-wider text-brand">
                  Pregunta {question.id}
                </span>
                {question.type === "mcq" && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Opción múltiple
                  </span>
                )}
                {question.type === "short-answer" && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Respuesta corta
                  </span>
                )}
                {question.type === "coding" && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Código
                  </span>
                )}
              </p>
              {submitted && isCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              )}
              {submitted && !isCorrect && question.correctAnswer && (
                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              )}
            </div>

            {/* Question text */}
            <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {question.question}
            </p>

            {/* MCQ options */}
            {question.type === "mcq" && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => {
                  const letter = option.charAt(0);
                  const selected = userValue === letter;
                  const isMcqCorrect =
                    submitted && question.correctAnswer === letter;
                  const isMcqWrong =
                    submitted && selected && question.correctAnswer !== letter;

                  return (
                    <label
                      key={letter}
                      className={`flex cursor-pointer items-start gap-3 rounded-btn border p-3 transition-colors ${
                        isMcqCorrect
                          ? "border-green-300 bg-green-50"
                          : isMcqWrong
                            ? "border-red-300 bg-red-50"
                            : selected
                              ? "border-brand bg-brand/5"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        value={letter}
                        checked={selected}
                        onChange={() => handleMcqSelect(question.id, letter)}
                        disabled={submitted}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                      />
                      <span className="text-sm text-gray-800">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Short answer textarea */}
            {question.type === "short-answer" && (
              <textarea
                value={userValue}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                disabled={submitted}
                placeholder="Escribe tu respuesta..."
                rows={3}
                className="w-full rounded-btn border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
            )}

            {/* Coding textarea */}
            {question.type === "coding" && (
              <textarea
                value={userValue}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                disabled={submitted}
                placeholder="Escribe tu código..."
                rows={6}
                className="w-full rounded-btn border border-gray-200 bg-gray-900 p-3 font-mono text-sm text-green-300 placeholder-gray-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
              />
            )}

            {/* Feedback — answer key reveal */}
            {showAnswers && question.correctAnswer && (
              <div className="mt-4 rounded-lg border border-brand/20 bg-brand/5 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-brand">
                  Respuesta correcta
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {question.type === "mcq"
                    ? `${question.correctAnswer}) ${question.options?.find((o) => o.startsWith(question.correctAnswer ?? ""))?.slice(3) ?? ""}`
                    : question.correctAnswer}
                </p>
                {question.explanation &&
                  question.explanation !== question.correctAnswer && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {question.explanation}
                    </p>
                  )}
              </div>
            )}
          </div>
        );
      })}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
        <button
          onClick={handleSubmit}
          disabled={submitted || result.questions.length === 0}
          type="button"
          className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50"
        >
          {submitted ? "Revisado" : "Verificar respuestas"}
        </button>

        <button
          onClick={handleToggleAnswers}
          type="button"
          className="inline-flex items-center gap-2 rounded-btn border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {showAnswers ? (
            <>
              <EyeOff className="h-4 w-4" />
              Ocultar respuestas
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Ver respuestas
            </>
          )}
        </button>
      </div>
    </div>
  );
}
