interface LabProgressProps {
  total: number;
  current: number;
}

export function LabProgress({ total, current }: LabProgressProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          {/* well (circle) */}
          <div
            className={`flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 ${
              i < current
                ? "bg-teal-500"
                : i === current
                  ? "bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.2)]"
                  : "border-2 border-gray-300 bg-transparent"
            }`}
          />

          {/* connector line (not after the last well) */}
          {i < total - 1 && (
            <div
              className={`h-0.5 w-5 transition-colors duration-300 sm:w-8 ${
                i < current ? "bg-teal-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
