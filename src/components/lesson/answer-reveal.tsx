interface AnswerRevealProps {
  summary: string;
  children: React.ReactNode;
}

export function AnswerReveal({ summary, children }: AnswerRevealProps) {
  return (
    <details className="group rounded-[12px] border border-gray-200 transition-all duration-200">
      <summary className="eyebrow flex cursor-pointer items-center gap-2 rounded-[12px] px-5 py-3 transition-colors duration-150 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
        <span className="text-xs text-gray-400 transition-transform duration-200 group-open:rotate-90">
          ▶
        </span>
        {summary}
      </summary>
      <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-700">
        {children}
      </div>
    </details>
  );
}
