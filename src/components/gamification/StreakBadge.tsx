"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  userId: string;
}

export function StreakBadge({ userId }: StreakBadgeProps) {
  const [supabase] = useState(() => createClient());
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data, error } = await supabase
          .from("streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching streak:", error);
          return;
        }

        if (data) {
          setStreak(data);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };

    fetchStreak();

    const channel = supabase
      .channel("streak-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "streaks",
          filter: `user_id=eq.${userId}`, // Filter by user_id
        },
        (payload) => {
          setStreak({
            current_streak: payload.new.current_streak,
            longest_streak: payload.new.longest_streak,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (streak.current_streak === 0) {
    return (
      <div className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
        No hay racha
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1">
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-semibold text-orange-700">
        {streak.current_streak} día{streak.current_streak !== 1 ? "s" : ""}
      </span>
      {streak.current_streak >= 7 && (
        <span className="text-xs text-orange-600">🔥 Racha de oro</span>
      )}
    </div>
  );
}