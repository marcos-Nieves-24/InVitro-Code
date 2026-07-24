interface SectionProps {
  number: number;
  title: string;
  eyebrow: string;
  description?: string;
  children?: React.ReactNode;
}

export function Section({
  number,
  title,
  eyebrow,
  description,
  children,
}: SectionProps) {
  return (
    <section className="border-b border-gray-200 py-4 last:border-b-0 md:py-6">
      {/* Eyebrow */}
      <div className="eyebrow mb-2 flex items-center gap-2">
        <span>{String(number).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-gray-300" />
        <span>{eyebrow}</span>
      </div>

      {/* Title in display font */}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>

      {/* Optional description */}
      {description && (
        <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}

      {/* Content */}
      <div className="mt-6">{children}</div>
    </section>
  );
}
