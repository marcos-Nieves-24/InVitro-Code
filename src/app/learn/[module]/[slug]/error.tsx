"use client";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Error en la lección
      </h1>
      <p className="text-lg text-gray-600 mb-2">
        Ocurrió un error al cargar esta lección.
      </p>
      <p className="text-sm text-gray-400 mb-6 font-mono">
        digest: {error.digest || "N/A"}
      </p>
      <pre className="text-xs text-left bg-gray-100 p-4 rounded mb-6 max-w-xl overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
