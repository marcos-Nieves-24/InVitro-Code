"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScientistGuide } from "./ScientistGuide";
import { MangaSpeechBubble } from "./MangaSpeechBubble";
import { SpotlightOverlay } from "./SpotlightOverlay";
import { CoachMarks } from "./CoachMarks";

const STORAGE_KEY = "lab-onboarding-completed";

interface OnboardingStep {
  id: string;
  title: string;
  desc: string;
  selector: string;
  fallbackSelector?: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: "navigation",
    title: "Navegación",
    desc: "Usa la barra lateral para explorar laboratorios",
    selector: "[aria-label='Navegación principal']",
    fallbackSelector: "aside",
  },
  {
    id: "instructions",
    title: "Instrucciones",
    desc: "Lee los objetivos del laboratorio aquí",
    selector: "[data-onboarding='instructions']",
  },
  {
    id: "editor",
    title: "Editor",
    desc: "Escribe y edita tu código Python aquí",
    selector: "[data-onboarding='editor']",
  },
  {
    id: "run",
    title: "Botón Ejecutar",
    desc: "Ejecuta tu código y ve los resultados",
    selector: "[data-onboarding='run-button']",
  },
  {
    id: "ecosystem",
    title: "Ecosistema",
    desc: "Explora proyectos y valida tus resultados",
    selector: "[data-onboarding='results']",
  },
];

interface OnboardingControllerProps {
  moduleSlug: string;
  lessonSlug: string;
  enabled: boolean;
}

/**
 * Orchestrates the 5-step guided onboarding.
 * - Only shows if enabled (completedCount===0 && not seen) and localStorage not set.
 * - 500ms entrance delay, spotlight hole via getBoundingClientRect, resize/scroll updates.
 * - Skippable always, does not block Pyodide loading.
 * - Persists completion to localStorage (supabase optional — see comment).
 */
export function OnboardingController({
  moduleSlug: _moduleSlug,
  lessonSlug: _lessonSlug,
  enabled,
}: OnboardingControllerProps) {
  void _moduleSlug;
  void _lessonSlug;

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const visibleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Initial visibility: check localStorage + enabled
  useEffect(() => {
    if (!enabled) return;

    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (completed === "true") return;
    } catch {
      return;
    }

    visibleTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => {
      if (visibleTimerRef.current) clearTimeout(visibleTimerRef.current);
    };
  }, [enabled]);

  const currentStep = STEPS[stepIndex];

  const updateTargetRect = useCallback(() => {
    if (!isVisible || !currentStep) {
      setTargetRect(null);
      return;
    }

    let el: Element | null = null;
    try {
      el = document.querySelector(currentStep.selector);
      if (!el && currentStep.fallbackSelector) {
        el = document.querySelector(currentStep.fallbackSelector);
      }
    } catch {
      el = null;
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      // Guard against zero-size hidden elements
      if (rect.width === 0 && rect.height === 0) {
        setTargetRect(null);
      } else {
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [isVisible, currentStep]);

  // Update rect on step change, resize, scroll
  useEffect(() => {
    if (!isVisible) return;

    updateTargetRect();

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledUpdate = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        updateTargetRect();
      }, 100);
    };

    window.addEventListener("resize", throttledUpdate);
    window.addEventListener("scroll", throttledUpdate, true);

    return () => {
      window.removeEventListener("resize", throttledUpdate);
      window.removeEventListener("scroll", throttledUpdate, true);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isVisible, stepIndex, updateTargetRect]);

  const markCompleted = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* storage unavailable */
    }
    // Optional: persist to supabase.profiles.onboarding_seen via API
    // For now only localStorage; T7 workspace may add server sync.
    setIsVisible(false);
  }, []);

  const handleNext = useCallback(() => {
    if (stepIndex >= STEPS.length - 1) {
      markCompleted();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  }, [stepIndex, markCompleted]);

  const handlePrev = useCallback(() => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSkip = useCallback(() => {
    markCompleted();
  }, [markCompleted]);

  // ESC handled inside CoachMarks, but also ensure overlay click advances
  const handleOverlayClick = useCallback(() => {
    handleNext();
  }, [handleNext]);

  if (!isVisible || !currentStep) return null;

  return (
    <>
      <SpotlightOverlay
        targetRect={targetRect}
        padding={8}
        onClick={handleOverlayClick}
      />

      {/* Fixed container: scientist + bubble */}
      <div className="fixed bottom-6 left-6 z-50 flex max-w-[calc(100vw-3rem)] items-end gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
            }
            className="flex items-end gap-3"
          >
            <ScientistGuide variant="f" size={56} />
            <MangaSpeechBubble tail="left">
              <div className="flex flex-col gap-2">
                <p className="font-display text-sm font-semibold text-ink">
                  {currentStep.title}
                </p>
                <p className="text-sm leading-relaxed text-storm">
                  {currentStep.desc}
                </p>
                <CoachMarks
                  step={stepIndex + 1}
                  total={STEPS.length}
                  onNext={handleNext}
                  onSkip={handleSkip}
                  onPrev={handlePrev}
                  canPrev={stepIndex > 0}
                />
              </div>
            </MangaSpeechBubble>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
