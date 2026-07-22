"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcLevel } from "@/lib/gamification/utils";

interface XPBarProps {
  userId: string;
  totalXp: number;
}

export function XPBar({ userId, totalXp }: XPBarProps) {
  const [supabase] = useState(() => createClient());
  const [userXp, setUserXp] = useState(totalXp);
  const [levelInfo, setLevelInfo] = useState(calcLevel(userXp));
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("xp-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "progress",
          filter: `user_id=eq.${userId}`, // Filter by user_id
        },
        (payload) => {
          if (payload.new.xp_earned > 0) {
            const newXp = userXp + payload.new.xp_earned;
            setUserXp(newXp);
            const newLevelInfo = calcLevel(newXp);
            setLevelInfo(newLevelInfo);
            
            // Check if level up
            if (Math.floor(newXp / 100) > Math.floor(totalXp / 100)) {
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 3000);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, userXp, totalXp]);

  const progressPercentage = (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Nivel {levelInfo.level}</span>
        <span className="text-sm text-gray-600">
          {userXp} XP / {levelInfo.nextLevelXp} XP para siguiente nivel
        </span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {showCelebration && (
        <div className="mt-2 animate-bounce rounded-full bg-yellow-100 px-3 py-1 text-center text-sm font-semibold text-yellow-800">
          Subiste de nivel!
        </div>
      )}
    </div>
  );
}
