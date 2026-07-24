"use client";

import { useState, useCallback, useEffect } from "react";

interface ConidiaPattern {
  id: number;
  grid: number[][];
  correct: "Aspergillus" | "Penicillium";
}

const PATTERNS: ConidiaPattern[] = [
  { id: 1, grid: [[0,0,1,1,0],[0,1,1,1,1],[1,1,1,1,1],[1,1,1,1,0],[0,1,1,0,0]], correct: "Aspergillus" },
  { id: 2, grid: [[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0],[1,1,1,1,1],[0,1,1,1,1]], correct: "Penicillium" },
  { id: 3, grid: [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[1,1,1,0,0],[1,1,0,0,0]], correct: "Aspergillus" },
  { id: 4, grid: [[1,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0],[0,0,0,0,0]], correct: "Penicillium" },
  { id: 5, grid: [[1,0,0,0,0],[1,1,0,0,0],[1,1,1,1,0],[1,1,1,1,1],[0,1,1,1,1]], correct: "Aspergillus" },
  { id: 6, grid: [[0,0,0,1,1],[0,0,1,1,1],[0,1,1,1,1],[1,1,1,1,0],[1,1,0,0,0]], correct: "Penicillium" },
  { id: 7, grid: [[0,0,1,1,1],[0,1,1,1,1],[1,1,1,1,1],[1,1,1,1,0],[1,1,1,0,0]], correct: "Aspergillus" },
  { id: 8, grid: [[1,1,1,1,0],[1,1,1,1,0],[0,1,1,1,0],[0,0,1,1,1],[0,0,1,1,1]], correct: "Penicillium" },
];

type FeedbackType = "correct" | "wrong" | null;

export function ConidiaSortGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<{ userChoice: string; correct: string; isCorrect: boolean }[]>([]);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [gameOver, setGameOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(false);

  const current = PATTERNS[currentIndex];
  const isLast = currentIndex >= PATTERNS.length - 1;

  // Auto-advance after feedback
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      if (isLast) {
        setGameOver(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
      setFeedback(null);
    }, 700);
    return () => clearTimeout(timer);
  }, [feedback, isLast]);

  // Submit XP when game is over
  useEffect(() => {
    if (!gameOver || posted || submitting) return;
    setSubmitting(true);
    fetch("/api/progress/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleSlug: "ia",
        lessonSlug: "lesson01_what_is_ai",
        blockId: "interactive-l01-patterns",
      }),
    })
      .then(() => setPosted(true))
      .catch(() => {
        // Silent fail — XP is nice-to-have
      })
      .finally(() => setSubmitting(false));
  }, [gameOver, posted, submitting]);

  const handleChoice = useCallback(
    (choice: "Aspergillus" | "Penicillium") => {
      if (feedback) return; // Already answered this one

      const isCorrect = choice === current.correct;
      setFeedback(isCorrect ? "correct" : "wrong");
      setStreak((s) => (isCorrect ? s + 1 : 0));
      setResults((r) => [...r, { userChoice: choice, correct: current.correct, isCorrect }]);
    },
    [feedback, current],
  );

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setStreak(0);
    setResults([]);
    setFeedback(null);
    setGameOver(false);
    setPosted(false);
    setSubmitting(false);
  }, []);

  // --- Result summary screen ---
  if (gameOver) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    return (
      <div className="my-4 rounded-[12px] border border-gray-200 bg-white p-6 text-center">
        <p className="mb-2 text-lg font-semibold text-gray-900">
          {correctCount === PATTERNS.length
            ? "¡Perfecto!"
            : correctCount >= 6
              ? "Muy bien"
              : "Seguí practicando"}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Acertaste {correctCount} de {PATTERNS.length}
        </p>
        <button
          onClick={handleReset}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* Streak */}
      <div className={`mb-3 text-center text-sm font-semibold transition-opacity ${streak >= 3 ? "animate-pulse text-orange-500" : "text-gray-400"}`}>
        Racha: 🔥 {streak}
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center">
        <p className="mb-2 text-xs font-medium text-gray-500">Conidia #{current.id}</p>
        <div
          className={`inline-grid grid-cols-5 gap-[2px] rounded-lg border-2 p-2 transition-colors duration-200 ${
            feedback === "correct"
              ? "border-teal-400"
              : feedback === "wrong"
                ? "border-orange-400 animate-[shake_0.3s_ease-in-out]"
                : "border-gray-200"
          }`}
        >
          {current.grid.map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`h-8 w-8 rounded-sm sm:h-10 sm:w-10 ${
                  cell === 1 ? "bg-[#1f77b4]" : "bg-gray-100"
                }`}
              />
            )),
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => handleChoice("Aspergillus")}
            disabled={!!feedback}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aspergillus
          </button>
          <button
            onClick={() => handleChoice("Penicillium")}
            disabled={!!feedback}
            className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Penicillium
          </button>
        </div>

        {/* Progress dots */}
        <div className="mt-4 flex gap-1.5">
          {PATTERNS.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < currentIndex
                  ? results[i]?.isCorrect
                    ? "bg-teal-400"
                    : "bg-orange-400"
                  : i === currentIndex
                    ? "bg-blue-600"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
