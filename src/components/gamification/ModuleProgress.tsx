interface ModuleProgressProps {
  moduleSlug: string;
  moduleName: string;
  totalLessons: number;
  initialCompletedLessons: number;
}

export function ModuleProgress({
  moduleSlug,
  moduleName,
  totalLessons,
  initialCompletedLessons,
}: ModuleProgressProps) {
  const completedLessons = initialCompletedLessons;

  if (totalLessons === 0) {
    return (
      <div className="text-sm text-gray-500">
        No hay lecciones disponibles
      </div>
    );
  }

  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{moduleName}</span>
        <span className="text-sm text-gray-600">
          {completedLessons}/{totalLessons} lecciones
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="text-sm font-medium text-green-600">
          Módulo completo
        </div>
      )}
    </div>
  );
}
