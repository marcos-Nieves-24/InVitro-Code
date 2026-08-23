export function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-screen-2xl rounded-card border border-gray-200 bg-white p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
