export function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-3 py-3 md:px-4 md:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-screen-2xl rounded-card border border-gray-200 bg-surface-card p-3 md:p-4 lg:p-6">
        {children}
      </div>
    </div>
  );
}
