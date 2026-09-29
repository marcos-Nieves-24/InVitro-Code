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
  LessonVideo,
} from "@/components/lesson";
import InteractivePrompt from "@/components/mdx/InteractivePrompt";
import { AnymotionPlayer, NeuralNetworkIntro, SpinnerDeCargaAnimadoPlayer } from "@/components/anymotion";
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
// Leading H1 only: no /m flag, so mid-document `# ` lines (Python comments
// inside fenced code blocks) are never stripped. \s* already absorbs blank
// lines; \uFEFF? tolerates a byte-order mark before the heading.
function stripLeadingH1(content: string): string {
  return content.replace(/^\uFEFF?\s*# .+\n?/, "").trimStart();
}
function resolveLessonTitle(data: Record<string, unknown>, slug: string): string {
  const raw = data["Lesson Title"];
  if (typeof raw === "string" && raw.trim().length > 0) return raw;
  console.warn(
    `[learn] Missing or non-string "Lesson Title" frontmatter in ${slug}; using slug fallback`,
  );
  return slug.replace(/^lesson\d+_/, "").replace(/[-_]/g, " ");
}
// A section is a carousel slide, so it must always carry a numeric `number`:
// Section renders String(number).padStart(2, "0") and would print "NaN".
function renumberSection(block: string, index: number): string {
  const prop = `number={${index + 1}}`;
  return /number\s*=\s*\{\d+\}/.test(block)
    ? block.replace(/number\s*=\s*\{\d+\}/, prop)
    : block.replace(/<Section\b/, `<Section ${prop}`);
}
// Drops only the exact "Resumen" summary section; "Resumen y glosario" and
// "Resumen y Conceptos Clave" are real content and must stay.
const RESUMEN_TITLE_RE = /title\s*=\s*["']Resumen["']/i;
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
function renderHeader(data: Record<string, unknown>, lessonTitle: string) {
  const objectives: string[] = (data["Learning Objectives"] as string[]) ?? [];
  return (
    <header>
      <p className="eyebrow flex items-center gap-2 text-xs">
        <span>Módulo {data.Module as string}</span>
        <span className="h-px w-3 bg-gray-300" />
        <span>Lección {data["Lesson Number"] as string}</span>
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
        {lessonTitle}
      </h1>
      {objectives.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-storm">
            Objetivos de aprendizaje
          </p>
          <ul className="space-y-0.5">
            {objectives.map((obj: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-xs text-storm">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
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
    LessonVideo,
    AnymotionPlayer,
    NeuralNetworkIntro,
    SpinnerDeCargaAnimadoPlayer,
    CodeEditor: (props: ComponentProps<typeof LessonCodeEditor>) => (
      <LessonCodeEditor {...props} certifyEnabled={certifyEnabled} />
    ),
    CompleteLessonButton: LessonCompleteButton,
    pre: CodeBlock,
    table: MarkdownTable,
  };
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const lessonTitle = resolveLessonTitle(data, slug);
  const bodyContent = stripLeadingH1(content);

  // `\b` instead of a literal space so `<Section\n` also opens a block.
  const sectionBlocks = bodyContent
    .split(/(?=<Section\b)/)
    .filter((b) => b.trim().startsWith("<Section"))
    .filter((b) => !RESUMEN_TITLE_RE.test(b));

  const renumbered = sectionBlocks.map(renumberSection);

  // Compile per slide with a local fallback: one broken block must not 500
  // the whole lesson page.
  const slides = await Promise.all(
    renumbered.map(async (block, i) => {
      try {
        const compiled = await compileMDX({
          source: block,
          components,
          options: mdxConfig,
        });
        return compiled.content;
      } catch (error) {
        console.warn(`[learn] MDX compile failed for slide ${i + 1} of ${slug}`, error);
        return (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">
              No se pudo renderizar esta sección de la lección.
            </p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
              {block.slice(0, 400)}
            </pre>
          </div>
        );
      }
    }),
  );

  const nextLessonHref = getNextLessonHref(module, slug);

  return (
    <LessonLayout>
      {/* ── Header: always visible, shrinks to fit ── */}
      <div className="shrink-0">{renderHeader(data, lessonTitle)}</div>

      {slides.length > 0 ? (
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${lessonProseClass}`}>
          <LessonCarousel
            slides={slides}
            nextLessonHref={nextLessonHref}
            lessonTitle={lessonTitle}
          />
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto ${lessonProseClass}`}>
          <MDXRemote source={bodyContent} components={components} options={mdxConfig} />
        </div>
      )}    </LessonLayout>
  );
}
