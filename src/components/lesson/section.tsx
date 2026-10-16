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
    <section className="px-3 py-2 sm:px-5 md:py-2.5 lg:px-6 lg:py-3.5">
      <div className="mx-auto w-full max-w-4xl">
        {/* Eyebrow */}
        <div className="eyebrow mb-1.5 flex items-center gap-2 text-xs font-semibold text-brand-600">
          <span>{String(number).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-gray-300" />
          <span>{eyebrow}</span>
        </div>

        {/* Title in display font */}
        <h2 className="font-display text-xl leading-[1.15] font-bold tracking-tight text-ink md:text-2xl lg:text-[28px]">
          {title}
        </h2>

        {/* Optional description */}
        {description && (
          <p className="mt-1 w-full text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        )}

        {/* Content */}
        <div className="mt-3 w-full">{children}</div>
      </div>
    </section>
  );
}
