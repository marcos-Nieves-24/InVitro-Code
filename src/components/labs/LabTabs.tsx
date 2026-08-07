"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { FlaskConical, FileText, ClipboardCheck } from "lucide-react";
import { LabRunner } from "./LabRunner";
import { QuizRunner } from "./QuizRunner";
import { AssignmentViewer } from "./AssignmentViewer";

type TabId = "lab" | "quiz" | "proyecto";

const STORAGE_KEY = "lab-active-tab";

interface LabTabsProps {
  module: string;
  lesson: string;
  labContent: ReactNode;
  labRawFallback: string | null;
  quizRaw: string | null;
  assignmentContent: ReactNode;
  assignmentRawFallback: string | null;
  hasNotebook: boolean;
}

/**
 * REQ-LABPAGE-04: Tab container with three panels — Laboratorio,
 * Cuestionario, Proyecto — that switch without reloading.
 *
 * - Hides Cuestionario tab when quiz.md is missing (quizRaw === null).
 * - Hides Proyecto tab when assignment.md is missing (assignmentContent
 *   is null and no rawFallback).
 * - Active tab persists in localStorage per-lesson.
 * - Spanish labels per REQ-LABPAGE-05.
 */
export function LabTabs({
  module: mod,
  lesson,
  labContent,
  labRawFallback,
  quizRaw,
  assignmentContent,
  assignmentRawFallback,
  hasNotebook,
}: LabTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("lab");

  // Restore persisted tab on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${mod}-${lesson}`);
      if (stored === "lab" || stored === "quiz" || stored === "proyecto") {
        setActiveTab(stored as TabId);
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, [mod, lesson]);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      try {
        localStorage.setItem(`${STORAGE_KEY}-${mod}-${lesson}`, tab);
      } catch {
        /* ignore */
      }
    },
    [mod, lesson],
  );

  const hasQuiz = quizRaw !== null;
  const hasAssignment = assignmentContent !== null || assignmentRawFallback !== null;

  // If active tab is hidden, switch to lab
  useEffect(() => {
    if (activeTab === "quiz" && !hasQuiz) setActiveTab("lab");
    if (activeTab === "proyecto" && !hasAssignment) setActiveTab("lab");
  }, [activeTab, hasQuiz, hasAssignment]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Tab bar */}
      <div className="mb-8 flex border-b border-gray-200" role="tablist">
        <TabButton
          active={activeTab === "lab"}
          onClick={() => handleTabChange("lab")}
          icon={<FlaskConical className="h-4 w-4" />}
          label="Laboratorio"
          id="lab"
        />
        {hasQuiz && (
          <TabButton
            active={activeTab === "quiz"}
            onClick={() => handleTabChange("quiz")}
            icon={<ClipboardCheck className="h-4 w-4" />}
            label="Cuestionario"
            id="quiz"
          />
        )}
        {hasAssignment && (
          <TabButton
            active={activeTab === "proyecto"}
            onClick={() => handleTabChange("proyecto")}
            icon={<FileText className="h-4 w-4" />}
            label="Proyecto"
            id="proyecto"
          />
        )}
      </div>

      {/* Tab panels */}
      {activeTab === "lab" && (
        <LabRunner content={labContent} rawFallback={labRawFallback} />
      )}
      {activeTab === "quiz" && hasQuiz && <QuizRunner raw={quizRaw} />}
      {activeTab === "proyecto" && hasAssignment && (
        <AssignmentViewer
          content={assignmentContent}
          rawFallback={assignmentRawFallback}
          module={mod}
          lesson={lesson}
          hasNotebook={hasNotebook}
        />
      )}
    </div>
  );
}

// ── Internal tab button ──

function TabButton({
  active,
  onClick,
  icon,
  label,
  id,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  id: TabId;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      type="button"
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-brand text-brand"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
