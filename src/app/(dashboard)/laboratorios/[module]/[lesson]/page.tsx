import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import fs from "fs";
import path from "path";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { LabTabs } from "@/components/labs/LabTabs";
import { LabCodeBlock } from "@/components/labs/LabCodeBlock";
import { LabHeader } from "@/components/labs/LabHeader";
import { LabCallout } from "@/components/labs/LabCallout";
import { ReflectionPrompt } from "@/components/labs/ReflectionPrompt";
import { MarkdownTable } from "@/components/lesson";
import rehypeLabSections from "@/lib/mdx/rehype-lab-sections";
import type { ReactNode } from "react";

const mdxConfig = {
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeLabSections],
  },
};

const mdxComponents = {
  pre: LabCodeBlock,
  table: MarkdownTable,
  LabHeader,
  LabCallout,
  ReflectionPrompt,
};

interface Props {
  params: Promise<{ module: string; lesson: string }>;
}

/**
 * REQ-LABPAGE-01/02/03/05: Server component — auth gate, existence check,
 * convention-based content reads (lab.md, quiz.md, notebook.ipynb),
 * compileMDX for lab, InVitroShell wrap, Spanish chrome via LabTabs.
 */
export default async function LabLessonPage({ params }: Props) {
  // REQ-LABPAGE-01: Clerk auth gate
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { module: modSlug, lesson: lessonSlug } = await params;

  // REQ-LABPAGE-02: notFound if lesson dir missing
  const lessonDir = path.join(
    process.cwd(),
    "src/content/modules",
    modSlug,
    "lessons",
    lessonSlug,
  );
  if (!fs.existsSync(lessonDir)) {
    notFound();
  }

  // ── User profile for InVitroShell ──
  const supabase = createAdminClient();
  const profileRes = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", userId)
    .maybeSingle();
  const userName = getDisplayName(profileRes.data ?? {});

  // ── Content reads (REQ-LABPAGE-03: convention-based, no frontmatter) ──

  // lab.md — required
  const labPath = path.join(lessonDir, "lab.md");
  if (!fs.existsSync(labPath)) {
    notFound();
  }
  const labRaw = fs.readFileSync(labPath, "utf8");

  // Compile lab MDX (REQ-LABRUN-01)
  let labContent: ReactNode = null;
  let labRawFallback: string | null = null;
  try {
    const result = await compileMDX({
      source: labRaw,
      components: mdxComponents,
      options: mdxConfig,
    });
    labContent = result.content;
  } catch {
    // REQ-LABRUN-05: Compile failure fallback
    labRawFallback = labRaw;
  }

  // quiz.md — optional; null hides the Cuestionario tab
  const quizPath = path.join(lessonDir, "quiz.md");
  let quizRaw: string | null = null;
  if (fs.existsSync(quizPath)) {
    quizRaw = fs.readFileSync(quizPath, "utf8");
  }

  // notebook.ipynb — optional
  const notebookPath = path.join(lessonDir, "notebook.ipynb");
  const hasNotebook = fs.existsSync(notebookPath);

  return (
    <InVitroShell userName={userName}>
      <LabTabs
        module={modSlug}
        lesson={lessonSlug}
        labContent={labContent}
        labRawFallback={labRawFallback}
        quizRaw={quizRaw}
        hasNotebook={hasNotebook}
      />
    </InVitroShell>
  );
}
