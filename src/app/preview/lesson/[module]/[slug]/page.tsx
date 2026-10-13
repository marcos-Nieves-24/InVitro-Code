// Preview público de una lección — MISMO componente de producción.
//
// Se apoya en el precedente de `/preview/cards`: una ruta de preview que
// renderiza los componentes reales sin auth, para poder revisar el diseño
// visualmente (Playwright, capturas) sin depender de una sesión de Clerk.
//
// Se reutiliza `LessonPage` directamente en vez de duplicar el pipeline de
// split de `<Section>` + compileMDX: la lección no usa Clerk, cookies ni
// Supabase, lee del filesystem, así que es seguro importarla tal cual.
import LessonPage from "@/app/learn/[module]/[slug]/page";

type Props = {
  params: Promise<{ module: string; slug: string }>;
};

export default async function PreviewLesson({ params }: Props) {
  const { module, slug } = await params;
  return <LessonPage params={params as unknown as Promise<{ module: string; slug: string }>} />;
}
