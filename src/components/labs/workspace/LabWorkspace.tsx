"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { Gem, FlaskConical, ClipboardCheck } from "lucide-react";
import { LabRunner } from "../LabRunner";
import { QuizRunner } from "../QuizRunner";
import { NotebookActions } from "../NotebookActions";
import { RCopyButton } from "../RCopyButton";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import PyodideRunner from "@/components/editor/PyodideRunner";
import type { LabCardTheme } from "../LabCardTheme";

type TabId = "lab" | "quiz";

const STORAGE_KEY = "lab-active-tab";

interface LabWorkspaceProps {
  moduleSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  moduleLabel: string;
  labContent: ReactNode;
  labRawFallback: string | null;
  quizRaw: string | null;
  hasNotebook: boolean;
  hasRScript: boolean;
  theme: LabCardTheme;
  totalXpForLesson: number;
  showOnboarding?: boolean;
}

export function LabWorkspace({
  moduleSlug,
  lessonSlug,
  lessonTitle,
  moduleLabel,
  labContent,
  labRawFallback,
  quizRaw,
  hasNotebook,
  hasRScript,
  theme,
  totalXpForLesson,
  showOnboarding = false,
}: LabWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>("lab");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        `${STORAGE_KEY}-${moduleSlug}-${lessonSlug}`,
      );
      if (stored === "lab" || stored === "quiz") {
        setActiveTab(stored as TabId);
      }
    } catch {
      /* ignore */
    }
  }, [moduleSlug, lessonSlug]);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      try {
        localStorage.setItem(`${STORAGE_KEY}-${moduleSlug}-${lessonSlug}`, tab);
      } catch {
        /* ignore */
      }
    },
    [moduleSlug, lessonSlug],
  );

  const hasQuiz = quizRaw !== null;

  useEffect(() => {
    if (activeTab === "quiz" && !hasQuiz) setActiveTab("lab");
  }, [activeTab, hasQuiz]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-6 py-6">
      {/* ── Minimal lab header ── */}
      <header
        className="mb-6 flex items-center gap-4 rounded-xl border border-surface-raised bg-surface-card px-5 py-4"
        style={{ borderLeftWidth: 4, borderLeftColor: theme.accent }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href="/laboratorios"
            className="inline-flex w-fit items-center gap-1 text-xs font-medium text-storm transition-colors hover:text-ink"
          >
            ← Sala de laboratorios
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink md:text-base">
              {lessonTitle}
            </h3>
            <span className="hidden text-xs text-muted-foreground md:inline">
              · {moduleLabel}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Theme accent dot */}
          <span
            className="hidden h-2 w-2 rounded-full md:inline-block"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{
              backgroundColor: `${theme.accent}1A`,
              color: theme.accent,
            }}
          >
            <Gem className="h-3 w-3" />
            +{totalXpForLesson} XP
          </span>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="mb-6 flex items-center border-b border-surface-raised" role="tablist">
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
      </div>

      {/* ── Panels ── */}
      {activeTab === "lab" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: instructions — data-onboarding target */}
          <div
            data-onboarding="instructions"
            className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl border border-surface-raised bg-surface-card p-6"
          >
            <LabRunner content={labContent} rawFallback={labRawFallback} />
          </div>

          {/* Right: editor + results stack */}
          <div className="flex flex-col gap-4">
            <div data-onboarding="editor">
              <PyodideRunner defaultValue="# Experimenta aquí...&#10;print('Hola Mundo!')" />
            </div>

            <div
              data-onboarding="results"
              className="rounded-xl border border-surface-raised bg-surface-card p-4"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-storm">
                Recursos y entrega
              </p>
              <div className="flex flex-col gap-3">
                {(hasNotebook || hasRScript) ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <RCopyButton
                      mod={moduleSlug}
                      lesson={lessonSlug}
                      hasRScript={hasRScript}
                    />
                    <NotebookActions
                      mod={moduleSlug}
                      lesson={lessonSlug}
                      hasNotebook={hasNotebook}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-storm">
                    Ejecuta tu código y valida los resultados en el panel superior.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "quiz" && hasQuiz && (
        <QuizRunner raw={quizRaw} />
      )}

      <OnboardingController
        enabled={!!showOnboarding}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
      />
    </div>
  );
}

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
