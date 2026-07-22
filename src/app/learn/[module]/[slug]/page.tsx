import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import {
  LessonCodeEditor,
  LessonCompleteButton,
} from "@/components/LessonComponents";

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
    "lessons",
    slug,
    "lesson.md",
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
        <LessonCompleteButton module={module} lesson={slug} />
      </div>
    </div>
  );
}
