import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  LessonLayout,
  Badge,
  Section,
  CalloutInfo,
  CalloutCheck,
  InteractiveFrame,
  AnswerReveal,
} from "@/components/lesson";

const components = {
  Section,
  CalloutInfo,
  CalloutCheck,
  InteractiveFrame,
  AnswerReveal,
};

interface Props {
  params: Promise<{ module: string; slug: string }>;
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

  // Strip the H1 from content since we render it from frontmatter
  const bodyContent = content.replace(/^# .+\n?/, "");
  const objectives: string[] = data["Learning Objectives"] ?? [];

  return (
    <LessonLayout>
      {/* ── Lesson Header ────────────────────────────── */}
      <header className="mb-14">
        <p className="eyebrow flex items-center gap-2">
          <span>Módulo {data.Module}</span>
          <span className="h-px w-4 bg-gray-300" />
          <span>Lección {data["Lesson Number"]}</span>
        </p>

        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gray-900">
          {data["Lesson Title"]}
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
          {data.Difficulty && <Badge variant="info">{data.Difficulty}</Badge>}
          {data["Estimated Duration"] && (
            <Badge variant="success">{data["Estimated Duration"]}</Badge>
          )}
          {data.Prerequisites && data.Prerequisites !== "Ninguno" && (
            <Badge variant="warning">{data.Prerequisites}</Badge>
          )}
        </div>
      </header>

      {/* ── Lesson Body ──────────────────────────────── */}
      <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-0 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4 prose-h3:text-xl prose-p:text-gray-700 prose-lead:text-gray-500 prose-strong:text-gray-900 prose-code:font-mono prose-code:text-[13px] prose-pre:rounded-[12px] prose-pre:border prose-pre:border-gray-200 prose-pre:bg-gray-50 prose-pre:shadow-none prose-table:text-sm prose-th:font-mono prose-th:text-[11px] prose-th:uppercase prose-th:tracking-[0.08em] prose-th:text-gray-500 prose-td:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline">
        <MDXRemote
          source={bodyContent}
          components={components}
          options={{
            blockJS: false,
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </div>
    </LessonLayout>
  );
}
