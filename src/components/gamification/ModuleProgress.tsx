"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ModuleProgressProps {
  moduleSlug: string;
  userId: string;
}

export function ModuleProgress({ moduleSlug, userId }: ModuleProgressProps) {
  const [supabase] = useState(() => createClient());
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleProgress = async () => {
      try {
        setLoading(true);
        
        // Fetch completed lessons for this user/module
        const { data: progressData, error: progressError } = await supabase
          .from("progress")
          .select("lesson_slug")
          .eq("user_id", userId)
          .eq("module_slug", moduleSlug)
          .eq("completed", true);

        if (progressError) {
          console.error("Error fetching progress:", progressError);
          return;
        }

        // Get module lessons from the filesystem via API route
        const response = await fetch(`/api/modules/${moduleSlug}/lessons`);
        let lessons = [];
        if (response.ok) {
          const data = await response.json();
          lessons = data.lessons || [];
        }

        const completedCount = progressData?.length || 0;
        
        setCompletedLessons(completedCount);
        setTotalLessons(lessons.length);
      } catch (error) {
        console.error("Error fetching module progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleProgress();

    const channel = supabase
      .channel("progress-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "progress",
          filter: `user_id=eq.${userId}`, // Filter by user_id
        },
        () => {
          fetchModuleProgress(); // Refetch on new progress
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, moduleSlug]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Cargando progreso...
      </div>
    );
  }

  if (totalLessons === 0) {
    return (
      <div className="text-sm text-gray-500">
        No hay lecciones disponibles
      </div>
    );
  }

  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progreso del módulo</span>
        <span className="text-sm text-gray-600">
          {completedLessons}/{totalLessons} lecciones completadas
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="text-sm text-green-600 font-medium">
          🎉 ¡Módulo completo!
        </div>
      )}
    </div>
  );
}
