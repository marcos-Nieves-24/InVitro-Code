"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { calcLevel } from "@/lib/gamification/utils";
import { Gem, Star } from "lucide-react";

interface XPBarProps {
  totalXp: number;
}

export function XPBar({ totalXp }: XPBarProps) {
  const levelInfo = calcLevel(totalXp);
  const progressPercentage = (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100;
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-mint" fill="currentColor" />
          <span className="text-sm font-bold text-ink">Nivel {levelInfo.level}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-storm">
          <Gem className="h-3 w-3" />
          <span>{totalXp} / {levelInfo.nextLevelXp} XP</span>
        </div>
      </div>
      
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-raised">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fog to-mint"
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={mounted ? { width: `${progressPercentage}%` } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      <div className="flex justify-between text-xs text-storm">
        <span>Nivel {levelInfo.level}</span>
        <span>{Math.round(progressPercentage)}% para siguiente nivel</span>
      </div>
    </div>
  );
}
