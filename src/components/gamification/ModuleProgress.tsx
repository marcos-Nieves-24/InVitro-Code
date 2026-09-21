"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";

interface ModuleProgressProps {
  moduleSlug: string;
  moduleName: string;
  totalLessons: number;
  initialCompletedLessons: number;
}

export function ModuleProgress({
  moduleSlug,
  moduleName,
  totalLessons,
  initialCompletedLessons,
}: ModuleProgressProps) {
  const completedLessons = initialCompletedLessons;
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (totalLessons === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-storm">
        <Circle className="h-4 w-4" />
        No hay lecciones disponibles
      </div>
    );
  }

  const progressPercentage = (completedLessons / totalLessons) * 100;
  const isComplete = completedLessons === totalLessons && totalLessons > 0;

  return (
    <div className="group space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isComplete ? "bg-mint/20 text-mint" : "bg-surface-raised text-storm"
          }`}>
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </div>
          <span className="font-medium text-ink group-hover:text-mint transition-colors">
            {moduleName}
          </span>
        </div>
        <span className="text-sm font-medium text-storm">
          {completedLessons}/{totalLessons} lecciones
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-raised">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full transition-colors ${
            isComplete ? "bg-gradient-to-r from-mint to-success" : "bg-gradient-to-r from-fog to-mint"
          }`}
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={mounted ? { width: `${progressPercentage}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
        {/* Milestone markers */}
        {[25, 50, 75].map((milestone) => (
          <div
            key={milestone}
            className={`absolute top-0 h-full w-0.5 ${
              progressPercentage >= milestone ? "bg-white/30" : "bg-surface-raised"
            }`}
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>

      {isComplete && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs font-medium text-mint"
        >
          <CheckCircle2 className="h-3 w-3" />
          ¡Módulo completo!
        </motion.div>
      )}
    </div>
  );
}
