"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { FlaskConical, ClipboardCheck } from "lucide-react";
import { LabRunner } from "./LabRunner";
import { QuizRunner } from "./QuizRunner";
import { NotebookActions } from "./NotebookActions";

type TabId = "lab" | "quiz";

const STORAGE_KEY = "lab-active-tab";

interface LabTabsProps {
  module: string;
  lesson: string;
  labContent: ReactNode;
  labRawFallback: string | null;
  quizRaw: string | null;
  hasNotebook: boolean;
}

/**
 * REQ-LABPAGE-04/06: Tab container with two panels — Laboratorio,
 * Cuestionario — that switch without reloading.
 *
 * - Hides Cuestionario tab when quiz.md is missing (quizRaw === null).
 * - Notebook actions (Download + Colab) shown in the tab-bar header,
 *   gated on hasNotebook.
 * - Active tab persists in localStorage per-lesson.
 * - Spanish labels per REQ-LABPAGE-05.
 */
export function LabTabs({
  module: mod,
  lesson,
  labContent,
  labRawFallback,
  quizRaw,
  hasNotebook,
}: LabTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("lab");

  // Restore persisted tab on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${mod}-${lesson}`);
      if (stored === "lab" || stored === "quiz") {
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

  // If active tab is hidden, switch to lab
  useEffect(() => {
    if (activeTab === "quiz" && !hasQuiz) setActiveTab("lab");
  }, [activeTab, hasQuiz]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-6 py-8">
      {/* Tab bar */}
      <div className="mb-8 flex items-center border-b border-gray-200" role="tablist">
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

        {/* Notebook actions, right-aligned (self-gated on hasNotebook) */}
        <div className="ml-auto">
          <NotebookActions mod={mod} lesson={lesson} hasNotebook={hasNotebook} />
        </div>
      </div>

      {/* Tab panels */}
      {activeTab === "lab" && (
        <LabRunner content={labContent} rawFallback={labRawFallback} />
      )}
      {activeTab === "quiz" && hasQuiz && <QuizRunner raw={quizRaw} />}
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
          ? "border-mint text-mint"
          : "border-transparent text-storm hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
