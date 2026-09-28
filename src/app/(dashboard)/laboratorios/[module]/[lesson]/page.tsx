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
import { LabCodeBlock } from "@/components/labs/LabCodeBlock";
import { LabHeader, LabCallout, ReflectionPrompt } from "@/components/labs";
import { getLabCardTheme, toSerializableTheme } from "@/components/labs/LabCardTheme";
import { MarkdownTable } from "@/components/lesson";
import rehypeLabSections from "@/lib/mdx/rehype-lab-sections";
import {
  getModuleDisplayName,
  getLessonFrontmatter,
  getLessonSlugs,
  type CompletionStatus,
  type LastPosition,
} from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { LabWorkspace } from "@/components/labs/workspace/LabWorkspace";
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
 * compileMDX for lab, InVitroShell wrap, LabWorkspace 2-col layout.
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
    .select("username, email, role, theme")
    .eq("id", userId)
    .maybeSingle();
  const userName = getDisplayName(profileRes.data ?? {});

  // ── Onboarding gate: completedCount === 0 → show onboarding ──
  let completedCount = 0;
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("module_slug,lesson_slug")
      .eq("user_id", userId)
      .eq("completed", true);
    if (!error && Array.isArray(data)) {
      completedCount = data.length;
    }
  } catch {
    completedCount = 0;
  }
  const showOnboarding = completedCount === 0;

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

  // lab.R — optional
  const rScriptPath = path.join(lessonDir, "lab.R");
  const hasRScript = fs.existsSync(rScriptPath);

  const moduleLabel = getModuleDisplayName(modSlug);
  const lessonFrontmatter = getLessonFrontmatter(modSlug, lessonSlug);
  const lessonTitle =
    lessonFrontmatter?.title ??
    lessonSlug.replace(/^lesson\d+_/, "").replace(/[-_]/g, " ");
  const theme = toSerializableTheme(getLabCardTheme(modSlug));
  const totalXpForLesson = calcXpForLesson(modSlug, lessonSlug);

  // ── Labs lifecycle wiring (REQ-LC-01/02/06, REQ-P-06) ──
  let initialStatus: CompletionStatus = "not_started";
  let initialPosition: LastPosition = {};
  let hasNextLab = false;
  let nextLabHref: string | null = null;
  const moduleHref = `/laboratorios/${modSlug}`;

  try {
    const lessonSlugs = getLessonSlugs(modSlug).sort();
    const idx = lessonSlugs.indexOf(lessonSlug);
    hasNextLab = idx >= 0 && idx < lessonSlugs.length - 1;
    nextLabHref = hasNextLab ? `/laboratorios/${modSlug}/${lessonSlugs[idx + 1]}` : null;

    const { data: row } = await supabase
      .from("lab_progress")
      .select("completion_status, last_position")
      .eq("user_id", userId)
      .eq("module_slug", modSlug)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();

    if (row) {
      const s = row.completion_status as CompletionStatus | undefined;
      if (s === "not_started" || s === "in_progress" || s === "completed") {
        initialStatus = s;
      }
      if (row.last_position && typeof row.last_position === "object" && !Array.isArray(row.last_position)) {
        initialPosition = row.last_position as LastPosition;
      }
    }
  } catch {
    // Fallback to defaults when lab_progress not yet migrated / query fails
  }

  return (
    <InVitroShell userName={userName} userRole={profileRes.data?.role} theme={profileRes.data?.theme}>
      <LabWorkspace
        moduleSlug={modSlug}
        lessonSlug={lessonSlug}
        lessonTitle={lessonTitle}
        moduleLabel={moduleLabel}
        labContent={labContent}
        labRawFallback={labRawFallback}
        quizRaw={quizRaw}
        hasNotebook={hasNotebook}
        hasRScript={hasRScript}
        theme={theme}
        totalXpForLesson={totalXpForLesson}
        showOnboarding={showOnboarding}
        initialStatus={initialStatus}
        initialPosition={initialPosition}
        hasNextLab={hasNextLab}
        nextLabHref={nextLabHref}
        moduleHref={moduleHref}
      />
    </InVitroShell>
  );
}
