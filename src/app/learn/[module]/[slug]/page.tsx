import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
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
    `${slug}.mdx`,
  );

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <article className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
        <MDXRemote source={source} components={components} />
      </article>

      <div className="mt-6 max-w-4xl mx-auto px-4">
        <CompleteLessonButton module={module} lesson={slug} />
      </div>
    </div>
  );
}
