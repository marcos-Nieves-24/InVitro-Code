export function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[var(--width-layout-max)] px-4 py-4 md:py-6">
      <div className="rounded-card border border-gray-200 bg-white p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
