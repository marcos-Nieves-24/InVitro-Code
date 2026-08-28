import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
import { AssignmentViewer } from "@/components/labs/AssignmentViewer";
import { LabCodeBlock } from "@/components/labs/LabCodeBlock";
import { LabHeader } from "@/components/labs/LabHeader";
import { LabCallout } from "@/components/labs/LabCallout";
import { ReflectionPrompt } from "@/components/labs/ReflectionPrompt";
import { MarkdownTable } from "@/components/lesson";
import { getLessonTitle } from "@/lib/content/modules";
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
 * REQ-PROJ-01/04/05: Project detail route. Server component — auth gate,
 * existence check, compile of assignment.md through the same MDX pipeline
 * as labs (pre: LabCodeBlock → PyodideRunner consoles), NotebookActions
 * gated on hasNotebook.
 */
export default async function ProjectDetailPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { module: modSlug, lesson: lessonSlug } = await params;

  // REQ-PROJ-04: notFound if lesson dir missing
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

  // ── Content reads ──

  // assignment.md — required
  const assignmentPath = path.join(lessonDir, "assignment.md");
  if (!fs.existsSync(assignmentPath)) {
    notFound();
  }
  const assignmentRaw = fs.readFileSync(assignmentPath, "utf8");

  // Compile assignment MDX (REQ-ASGN-01: same pipeline as lessons)
  let mdxContent: ReactNode = null;
  let mdxRawFallback: string | null = null;
  try {
    const result = await compileMDX({
      source: assignmentRaw,
      components: mdxComponents,
      options: mdxConfig,
    });
    mdxContent = result.content;
  } catch {
    // REQ-ASGN-04: Compile failure fallback
    mdxRawFallback = assignmentRaw;
  }

  // notebook.ipynb — optional
  const notebookPath = path.join(lessonDir, "notebook.ipynb");
  const hasNotebook = fs.existsSync(notebookPath);

  const title =
    getLessonTitle(modSlug, lessonSlug) ??
    lessonSlug.replace(/^lesson\d+_/, "").split(/[-_]/).join(" ");

  return (
    <InVitroShell userName={userName}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8">
        <Link
          href="/proyectos"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-outline transition-colors hover:text-mint"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>

        <h1 className="mb-8 font-display text-3xl font-extrabold text-ink">
          {title}
        </h1>

        <AssignmentViewer
          content={mdxContent}
          rawFallback={mdxRawFallback}
          module={modSlug}
          lesson={lessonSlug}
          hasNotebook={hasNotebook}
        />
      </div>
    </InVitroShell>
  );
}