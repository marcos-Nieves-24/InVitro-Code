"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcLevel } from "@/lib/gamification/utils";

interface LevelBadgeProps {
  userId: string;
  totalXp: number;
}

export function LevelBadge({ userId, totalXp }: LevelBadgeProps) {
  const [supabase] = useState(() => createClient());
  const [xp, setXp] = useState(totalXp);
  const levelInfo = calcLevel(xp);

  useEffect(() => {
    const channel = supabase
      .channel("xp-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.xp_earned > 0) {
            setXp((prev) => prev + payload.new.xp_earned);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reflection_completions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.xp_earned > 0) {
            setXp((prev) => prev + payload.new.xp_earned);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const getLevelColor = (level: number) => {
    if (level < 5) return "bg-gray-500";
    if (level < 10) return "bg-blue-500";
    if (level < 20) return "bg-purple-500";
    return "bg-yellow-500";
  };

  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white">
      <span className={`${getLevelColor(levelInfo.level)} rounded-full px-2 py-1`}>Nivel {levelInfo.level}</span>
      {levelInfo.level >= 10 && <span>Expert</span>}
      {levelInfo.level >= 20 && <span>Master</span>}
    </div>
  );
}
