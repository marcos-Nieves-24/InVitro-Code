export function CalloutCheck({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-red-500 bg-red-50 p-6">
      {children}
    </div>
  );
}
