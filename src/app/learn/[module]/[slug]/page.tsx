import { notFound } from "next/navigation";
import { compileMDX, MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ComponentProps } from "react";
import {
  LessonLayout,
  LessonCarousel,
  Badge,
  Section,
  CalloutInfo,
  CalloutCheck,
  InteractiveFrame,
  AnswerReveal,
  ReflectionCheck,
  ConceptCard,
  MascotMessage,
  ComparisonTable,
  CodeBlock,
  DiagnosticTrainer,
  ConidiaSortGame,
  ThresholdLab,
  InteractiveTable,
  KnnTrainer,
  MarkdownTable,
  PerceptronTrainer,
  RegressionTrainer,
  OverfittingTrainer,
} from "@/components/lesson";
import InteractivePrompt from "@/components/mdx/InteractivePrompt";
import {
  LessonCodeEditor,
  LessonCompleteButton,
} from "@/components/LessonComponents";
import { lessonProseClass } from "@/lib/ui/prose";

const mdxConfig = {
  blockJS: false,
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex],
  },
};
function getNextLessonHref(
  moduleSlug: string,
  currentSlug: string,
): string | undefined {
  const lessonsDir = path.join(
    process.cwd(),
    "src/content/modules",
    moduleSlug,
    "lessons",
  );
  try {
    const lessons = fs
      .readdirSync(lessonsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    const idx = lessons.indexOf(currentSlug);
    if (idx >= 0 && idx < lessons.length - 1) {
      return `/learn/${moduleSlug}/${lessons[idx + 1]}`;
    }
  } catch {
    /* no lessons dir */
  }
  return undefined;
}

interface Props {
  params: Promise<{ module: string; slug: string }>;
}

function renderHeader(data: Record<string, unknown>) {
  const objectives: string[] = (data["Learning Objectives"] as string[]) ?? [];
  return (
    <header>
      <p className="eyebrow flex items-center gap-2 text-xs">
        <span>Módulo {data.Module as string}</span>
        <span className="h-px w-3 bg-gray-300" />
        <span>Lección {data["Lesson Number"] as string}</span>
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-gray-900">
        {data["Lesson Title"] as string}
      </h1>
      {objectives.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            Objetivos de aprendizaje
          </p>
          <ul className="space-y-0.5">
            {objectives.map((obj: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(data.Difficulty as string) && (
          <Badge variant="info">{data.Difficulty as string}</Badge>
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

  // Server-side feature flag (REQ-CER-01): certification is off unless
  // FEATURE_FLAG_CERTIFY === "true". Drilled through the components map so
  // the client never reads process.env (REQ-CER-04).
  const certifyEnabled = process.env.FEATURE_FLAG_CERTIFY === "true";

  const components = {
    Section,
    CalloutInfo,
    CalloutCheck,
    InteractiveFrame,
    AnswerReveal,
    ReflectionCheck,
    ConceptCard,
    MascotMessage,
    ComparisonTable,
    InteractivePrompt,
    DiagnosticTrainer,
    ConidiaSortGame,
    ThresholdLab,
    InteractiveTable,
    KnnTrainer,
    PerceptronTrainer,
    RegressionTrainer,
    OverfittingTrainer,
    CodeEditor: (props: ComponentProps<typeof LessonCodeEditor>) => (
      <LessonCodeEditor {...props} certifyEnabled={certifyEnabled} />
    ),
    CompleteLessonButton: LessonCompleteButton,
    pre: CodeBlock,
    table: MarkdownTable,
  };

  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  // Strip the H1 from content
  const bodyContent = content.replace(/^\s*# .+\n?/, "");

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
      {/* ── Header: always visible, shrinks to fit ── */}
      <div className="shrink-0">{renderHeader(data)}</div>

      {slides.length > 0 ? (
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${lessonProseClass}`}>
          <LessonCarousel
            slides={slides.map((s) => s.content)}
            nextLessonHref={nextLessonHref}
            lessonTitle={data["Lesson Title"] as string}
          />
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto ${lessonProseClass}`}>
          <MDXRemote source={bodyContent} components={components} options={mdxConfig} />
        </div>
      )}    </LessonLayout>
  );
}
