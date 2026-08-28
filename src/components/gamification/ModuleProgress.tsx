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
      <div className="text-sm text-storm">
        No hay lecciones disponibles
      </div>
    );
  }

  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{moduleName}</span>
        <span className="text-sm text-storm">
          {completedLessons}/{totalLessons} lecciones
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="absolute inset-0 rounded-full bg-mint transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="text-sm font-medium text-mint">
          Módulo completo
        </div>
      )}
    </div>
  );
}