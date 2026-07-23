type ConceptCardVariant = "definition" | "key-idea" | "warning";

interface ConceptCardProps {
  children: React.ReactNode;
  variant?: ConceptCardVariant;
}

const variantStyles: Record<ConceptCardVariant, string> = {
  definition: "border-teal-500 bg-teal-50",
  "key-idea": "border-blue-500 bg-blue-50",
  warning: "border-amber-500 bg-amber-50",
};

const variantLabels: Record<ConceptCardVariant, string> = {
  definition: "Definicion",
  "key-idea": "Idea clave",
  warning: "Atencion",
};

export function ConceptCard({
  children,
  variant = "definition",
}: ConceptCardProps) {
  return (
    <div
      className={`my-6 rounded-[12px] border-l-4 p-4 ${variantStyles[variant]}`}
    >
      <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
        {variantLabels[variant]}
      </p>
      <div className="text-sm leading-relaxed text-gray-800 [&_strong]:text-gray-900">
        {children}
      </div>
    </div>
  );
}
