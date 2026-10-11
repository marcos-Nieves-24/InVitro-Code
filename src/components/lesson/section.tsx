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
    <section className="border-b border-gray-200 py-3 last:border-b-0 md:py-4 lg:py-5">
      {/* Eyebrow */}
      <div className="eyebrow mb-1.5 flex items-center gap-2">
        <span>{String(number).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-gray-300" />
        <span>{eyebrow}</span>
      </div>

      {/* Title in display font */}
      <h2 className="font-display text-xl leading-[1.15] font-semibold tracking-tight text-gray-900 md:text-2xl lg:text-[28px]">
        {title}
      </h2>

      {/* Optional description — full bleed */}
      {description && (
        <p className="mt-1.5 w-full text-sm leading-relaxed text-gray-500 lg:text-[15px]">
          {description}
        </p>
      )}

      {/* Content — full bleed */}
      <div className="mt-3 w-full">{children}</div>
    </section>
  );
}
