"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LabXpToastProps {
  xp: number;
  visible: boolean;
  onDismiss: () => void;
}

/**
 * XP reward toast — animated scale-in + confetti fall, auto-dismisses after 3s.
 * Uses `xp-gradient` from globals.css for the background and
 * `animate-confetti-fall` for the confetti particles.
 */
export function LabXpToast({ xp, visible, onDismiss }: LabXpToastProps) {
  const dismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [visible, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="xp-toast"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          {/* Confetti layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="animate-confetti-fall absolute h-1.5 w-1.5 rounded-full"
                style={{
                  left: `${15 + i * 14}%`,
                  top: "-4px",
                  backgroundColor: i % 2 === 0 ? "var(--color-mint)" : "var(--color-fog)",
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${2 + i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Toast body */}
          <div className="xp-gradient flex items-center gap-2 rounded-full px-5 py-2.5 shadow-lg">
            <span className="text-sm font-bold text-[var(--color-ink)]">
              +{xp} XP
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
