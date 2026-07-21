import Link from "next/link";

export default function LessonNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Lección No Encontrada
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Esta lección no existe o aún no ha sido creada.
      </p>
      <Link
        href="/learn"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver a Aprender
      </Link>
    </div>
  );
}
