"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Gem, FlaskConical, ClipboardCheck, MoreVertical } from "lucide-react";
import { LabRunner } from "../LabRunner";
import { QuizRunner } from "../QuizRunner";
import { NotebookActions } from "../NotebookActions";
import { RCopyButton } from "../RCopyButton";
import { OnboardingController } from "@/components/onboarding/OnboardingController";
import PyodideRunner from "@/components/editor/PyodideRunner";
import type { SerializableLabCardTheme } from "../LabCardTheme";
import { LabCompletionBanner } from "./LabCompletionBanner";
import type { CompletionStatus, LastPosition } from "@/lib/content/modules";

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
  theme: SerializableLabCardTheme;
  totalXpForLesson: number;
  showOnboarding?: boolean;
  // Labs lifecycle (PR3)
  initialStatus?: CompletionStatus;
  initialPosition?: LastPosition;
  hasNextLab?: boolean;
  nextLabHref?: string | null;
  moduleHref?: string;
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
  initialStatus,
  initialPosition,
  hasNextLab,
  nextLabHref,
  moduleHref,
}: LabWorkspaceProps) {
  const normalizedInitialTab: TabId =
    initialPosition?.activeTab === "quiz" || initialPosition?.activeTab === "lab"
      ? initialPosition.activeTab
      : "lab";

  const [activeTab, setActiveTab] = useState<TabId>(normalizedInitialTab);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [status, setStatus] = useState<CompletionStatus>(initialStatus ?? "not_started");
  const [showBanner, setShowBanner] = useState(initialStatus === "completed");
  const [completing, setCompleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPostedInProgressRef = useRef(false);

  // Persist helper: POST to /api/lab-progress
  const postProgress = useCallback(
    async (payload: Record<string, unknown>) => {
      try {
        await fetch("/api/lab-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module_slug: moduleSlug,
            lesson_slug: lessonSlug,
            ...payload,
          }),
        });
      } catch {
        /* network — ignore, retry on next interaction */
      }
    },
    [moduleSlug, lessonSlug],
  );

  // Debounced last_position persistence (800-1200ms, cancel on unmount)
  const scheduleLastPositionPost = useCallback(
    (tab: TabId) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void postProgress({ last_position: { activeTab: tab } });
      }, 900);
    },
    [postProgress],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Restore from localStorage if server did not provide activeTab
  useEffect(() => {
    if (initialPosition?.activeTab) return;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${moduleSlug}-${lessonSlug}`);
      if (stored === "lab" || stored === "quiz") {
        setActiveTab(stored as TabId);
      }
    } catch {
      /* ignore */
    }
  }, [moduleSlug, lessonSlug, initialPosition?.activeTab]);

  // Sync banner when initialStatus changes (e.g., after server fetch on reload)
  useEffect(() => {
    if (initialStatus === "completed") setShowBanner(true);
    setStatus(initialStatus ?? "not_started");
  }, [initialStatus]);

  // First interaction → in_progress (REQ-LC-01)
  useEffect(() => {
    if (status === "completed") return;
    if (hasPostedInProgressRef.current) return;
    if (initialStatus === "completed" || initialStatus === "in_progress") return;
    // Defer to avoid immediate double-post on hydration
    hasPostedInProgressRef.current = true;
    void postProgress({ completion_status: "in_progress", last_position: { activeTab } }).then(() => {
      setStatus("in_progress");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      try {
        localStorage.setItem(`${STORAGE_KEY}-${moduleSlug}-${lessonSlug}`, tab);
      } catch {
        /* ignore */
      }
      // If still not_started, transition to in_progress eagerly
      if (status !== "completed" && status !== "in_progress") {
        void postProgress({ completion_status: "in_progress", last_position: { activeTab: tab } }).then(
          () => setStatus("in_progress"),
        );
      } else {
        scheduleLastPositionPost(tab);
      }
    },
    [moduleSlug, lessonSlug, status, postProgress, scheduleLastPositionPost],
  );

  const hasQuiz = quizRaw !== null;

  useEffect(() => {
    if (activeTab === "quiz" && !hasQuiz) setActiveTab("lab");
  }, [activeTab, hasQuiz]);

  const handleComplete = useCallback(async () => {
    if (status === "completed") return;
    setCompleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/lab-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_slug: moduleSlug,
          lesson_slug: lessonSlug,
          completion_status: "completed",
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Error ${res.status}`);
      }
      setStatus("completed");
      setShowBanner(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al completar";
      setErrorMsg(msg);
    } finally {
      setCompleting(false);
    }
  }, [moduleSlug, lessonSlug, status]);

  const resolvedHasNextLab = hasNextLab ?? false;
  const resolvedNextHref = nextLabHref ?? null;
  const resolvedModuleHref = moduleHref ?? `/laboratorios/${moduleSlug}`;

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl px-6 py-6">
      {/* ── Top-right Recursos / Entrega — absolute top-4 right-6 ── */}
      <div className="absolute top-4 right-6 z-20 hidden items-center gap-2 sm:flex">
        <RCopyButton mod={moduleSlug} lesson={lessonSlug} hasRScript={hasRScript} />
        <NotebookActions mod={moduleSlug} lesson={lessonSlug} hasNotebook={hasNotebook} />
      </div>
      {/* Mobile: dropdown with MoreVertical trigger */}
      <div className="absolute top-4 right-6 z-20 sm:hidden">
        <button
          type="button"
          aria-label="Recursos y entrega"
          aria-expanded={isResourcesOpen}
          onClick={() => setIsResourcesOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-raised bg-surface-card text-storm shadow-sm transition-colors hover:bg-surface-raised"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {isResourcesOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-surface-raised bg-surface-card p-4 shadow-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-storm">Recursos y entrega</p>
            <div className="flex flex-col gap-3">
              {(hasNotebook || hasRScript) ? (
                <>
                  <RCopyButton mod={moduleSlug} lesson={lessonSlug} hasRScript={hasRScript} />
                  <NotebookActions mod={moduleSlug} lesson={lessonSlug} hasNotebook={hasNotebook} />
                </>
              ) : (
                <p className="text-sm text-storm">Ejecuta tu código y valida los resultados en el panel superior.</p>
              )}
            </div>
          </div>
        )}
      </div>
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
            <h3 className="truncate text-sm font-semibold text-ink md:text-base">{lessonTitle}</h3>
            <span className="hidden text-xs text-muted-foreground md:inline">· {moduleLabel}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
            <Gem className="h-3 w-3" />+{totalXpForLesson} XP
          </span>
        </div>
      </header>

      {/* Completion banner (REQ-LC-02) — persists on reload when initialStatus completed */}
      {showBanner && (
        <div className="mb-6">
          <LabCompletionBanner
            hasNextLab={resolvedHasNextLab}
            nextLabHref={resolvedNextHref}
            moduleHref={resolvedModuleHref}
          />
        </div>
      )}

      {/* Error + CTA completar (visible when not completed) */}
      {!showBanner && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleComplete}
            disabled={completing || status === "completed"}
            className="inline-flex items-center justify-center rounded-full bg-mint px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
          >
            {completing ? "Completando…" : "Completar laboratorio"}
          </button>
          {errorMsg && (
            <span role="alert" className="text-sm text-error">
              {errorMsg}{" "}
              <button
                type="button"
                onClick={handleComplete}
                className="font-semibold underline hover:no-underline"
              >
                Reintentar
              </button>
            </span>
          )}
        </div>
      )}

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
          <div
            data-onboarding="instructions"
            className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl border border-surface-raised bg-surface-card p-6"
          >
            <LabRunner content={labContent} rawFallback={labRawFallback} />
          </div>

          <div className="flex flex-col gap-4">
            <div data-onboarding="editor">
              <PyodideRunner defaultValue="# Experimenta aquí...&#10;print('Hola Mundo!')" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "quiz" && hasQuiz && <QuizRunner raw={quizRaw} />}

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
