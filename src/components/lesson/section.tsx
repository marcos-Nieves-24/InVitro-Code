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
    <section className="px-4 py-3 sm:px-6 md:py-4 lg:px-8 lg:py-6">
      <div className="w-full">
        {/* Eyebrow — ampliada */}
        <div className="eyebrow mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
          <span>{String(number).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-gray-300" />
          <span>{eyebrow}</span>
        </div>

        {/* Title — ampliado */}
        <h2 className="font-display text-2xl leading-[1.15] font-bold tracking-tight text-ink md:text-3xl lg:text-[32px]">
          {title}
        </h2>

        {/* Optional description — ampliada */}
        {description && (
          <p className="mt-2 w-full text-base leading-relaxed text-gray-600">
            {description}
          </p>
        )}

        {/* Content — 100% width, sin guiones */}
        <div className="mt-4 w-full [hyphens:none]" style={{ hyphens: "none" as const }}>
          {children}
        </div>
      </div>
    </section>
  );
}
