export function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dot-grid">
      <div className="mx-auto max-w-[920px] px-4 py-4 md:py-6">
        <div className="rounded-[12px] border border-gray-200 bg-white p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
