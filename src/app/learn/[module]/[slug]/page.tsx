import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import InteractivePrompt from "@/components/mdx/InteractivePrompt";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

const LessonCodeEditor = dynamic(
  () => import("@/components/editor/PyodideRunner"),
  { ssr: false },
);

const CompleteLessonButton = dynamic(
  () => import("@/components/CompleteLessonButton"),
  { ssr: false },
);

const components = {
  CodeEditor: LessonCodeEditor,
  InteractivePrompt: InteractivePrompt,
};

interface Props {
  params: Promise<{ module: string; slug: string }>;
}

function renderHeader(data: Record<string, unknown>) {
  const objectives: string[] = (data["Learning Objectives"] as string[]) ?? [];
  return (
    <header>
      <p className="eyebrow flex items-center gap-2">
        <span>Módulo {data.Module as string}</span>
        <span className="h-px w-4 bg-gray-300" />
        <span>Lección {data["Lesson Number"] as string}</span>
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gray-900">
        {data["Lesson Title"] as string}
      </h1>
      {objectives.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            Objetivos de aprendizaje
          </p>
          <ul className="space-y-2">
            {objectives.map((obj: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {(data.Difficulty as string) && (
          <Badge variant="info">{data.Difficulty as string}</Badge>
        )}
        {(data["Estimated Duration"] as string) && (
          <Badge variant="success">{data["Estimated Duration"] as string}</Badge>
        )}
        {(data.Prerequisites as string) &&
          data.Prerequisites !== "Ninguno" && (
            <Badge variant="warning">{data.Prerequisites as string}</Badge>
          )}
      </div>
    </header>
  );
}

export default async function LessonPage({ params }: Props) {
  const { module, slug } = await params;
  const filePath = path.join(
    process.cwd(),
    "src/content/modules",
    module,
    "lessons",
    slug,
    "lesson.md",
  );

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  // Strip the H1 from content
  const bodyContent = content.replace(/^# .+\n?/, "");

  // Split by <Section, keep only blocks that start with <Section, filter out Resumen, renumber
  const sectionBlocks = bodyContent
    .split(/(?=<Section )/)
    .filter((b) => b.trim().startsWith("<Section"))
    .filter((b) => !b.includes('title="Resumen"'));

  const renumbered = sectionBlocks.map((b, i) =>
    b.replace(/number=\{\d+\}/, `number={${i + 1}}`),
  );

  // Compile each section individually
  const slides = await Promise.all(
    renumbered.map((block) =>
      compileMDX({
        source: block,
        components,
        options: mdxConfig,
      }),
    ),
  );

  const nextLessonHref = getNextLessonHref(module, slug);

  return (
    <LessonLayout>
      {/* ── Header: always visible, outside carousel ── */}
      <div className="mb-8">{renderHeader(data)}</div>

      {slides.length > 0 ? (
        <div className={proseClass}>
          <LessonCarousel
            slides={slides.map((s) => s.content)}
            nextLessonHref={nextLessonHref}
            lessonTitle={data["Lesson Title"] as string}
          />
        </div>
      ) : (
        <div className={proseClass}>
          <MDXRemote source={bodyContent} components={components} options={mdxConfig} />
        </div>
      )}
    </LessonLayout>
  );
}
