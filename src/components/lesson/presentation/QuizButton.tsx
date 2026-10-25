"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { QuizOption } from "@/domain/slide";
import { renderWithMicroorganismItalics } from "@/lib/microorganisms";

export interface QuizButtonProps {
  option: QuizOption;
  selected: boolean;
  revealed: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  showHoverHint?: boolean;
}

export function QuizButton({
  option,
  selected,
  revealed,
  onSelect,
  disabled = false,
  showHoverHint = false,
}: QuizButtonProps) {
  const isCorrect = option.correct;

  // Visual state derivation
  const showCorrect = revealed && isCorrect;
  // Selected revealed correct => strong green
  // Selected revealed incorrect => red
  // Revealed correct but not selected => muted green highlight (show answer)
  // Idle / pre-reveal => neutral
  let containerClasses =
    "group relative flex w-full items-center gap-3 rounded-btn border px-4 py-3 text-left text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ";

  if (!revealed) {
    if (selected) {
      containerClasses +=
        "border-brand-300 bg-brand-50 text-brand-800 shadow-sm ";
    } else {
      // Base idle styles; hover hint alters hover border/bg when active after failure
      if (showHoverHint) {
        containerClasses +=
          "border-gray-200 bg-surface-card text-graphite hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 motion-reduce:transform-none ";
        containerClasses += isCorrect
          ? "hover:border-green-300 hover:bg-green-50/50 "
          : "hover:border-red-200 hover:bg-red-50/30 ";
      } else {
        containerClasses +=
          "border-gray-200 bg-surface-card text-graphite hover:border-mint/30 hover:bg-surface-raised hover:shadow-sm hover:-translate-y-[1px] active:translate-y-0 motion-reduce:transform-none ";
      }
    }
  } else {
    // Revealed states
    if (selected && isCorrect) {
      containerClasses +=
        "border-green-500 bg-green-50 text-green-800 shadow-sm ";
    } else if (selected && !isCorrect) {
      containerClasses +=
        "border-red-300 bg-red-50 text-red-800 shadow-sm ";
    } else if (!selected && isCorrect) {
      if (showHoverHint) {
        // Hover-only hint: neutral base, green on hover to guide second attempt without fully spoiling
        containerClasses +=
          "border-gray-200 bg-surface-card text-storm hover:border-green-300 hover:bg-green-50/50 hover:text-green-800 ";
      } else {
        containerClasses +=
          "border-green-500 bg-green-50/50 text-green-800 ";
      }
    } else {
      // non-selected incorrect after reveal -> dim, with hover hint when active
      if (showHoverHint) {
        containerClasses +=
          "border-gray-200 bg-surface-card text-storm opacity-80 hover:border-red-200 hover:bg-red-50/30 ";
      } else {
        containerClasses +=
          "border-gray-200 bg-surface-card text-storm opacity-80 ";
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(option.id);
    }
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={option.label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      data-no-advance
      onClick={() => {
        if (!disabled) onSelect(option.id);
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={containerClasses}
    >
      {/* Selection indicator */}
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ${
          !revealed
            ? selected
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-gray-300 bg-white text-transparent group-hover:border-mint/50"
            : selected && isCorrect
              ? "border-green-500 bg-green-500 text-white"
              : selected && !isCorrect
                ? "border-red-400 bg-red-500 text-white"
                : showCorrect
                  ? "border-green-500 bg-green-100 text-green-700"
                  : "border-gray-300 bg-white text-transparent"
        }`}
      >
        {/* inner dot for pre-reveal selected */}
        {!revealed && selected ? "•" : null}
        {revealed && showCorrect ? (
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
        {revealed && selected && !isCorrect ? (
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
      </span>

      <span className="min-w-0 flex-1 leading-relaxed">{renderWithMicroorganismItalics(option.label)}</span>

      {/* Trailing icon for revealed state */}
      {revealed && (
        <span aria-hidden="true" className="shrink-0">
          {selected && isCorrect && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
          {selected && !isCorrect && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {!selected && isCorrect && !showHoverHint && (
            <CheckCircle2 className="h-5 w-5 text-green-500 opacity-70" />
          )}
        </span>
      )}
    </button>
  );
}

export default QuizButton;
