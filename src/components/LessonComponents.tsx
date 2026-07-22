"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const PyodideRunner = dynamic(
  () => import("@/components/editor/PyodideRunner"),
  { ssr: false },
);

const CompleteLessonButton = dynamic(
  () => import("@/components/CompleteLessonButton"),
  { ssr: false },
);

export function LessonCodeEditor(props: ComponentProps<typeof PyodideRunner>) {
  return <PyodideRunner {...props} />;
}

export function LessonCompleteButton({
  module,
  lesson,
}: {
  module: string;
  lesson: string;
}) {
  return <CompleteLessonButton module={module} lesson={lesson} />;
}
