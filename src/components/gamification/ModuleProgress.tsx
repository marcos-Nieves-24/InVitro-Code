"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ModuleProgressProps {
  moduleSlug: string;
  moduleName: string;
  userId: string;
  totalLessons: number;
}

export function ModuleProgress({
  moduleSlug,
  moduleName,
  userId,
  totalLessons,
}: ModuleProgressProps) {
  const [supabase] = useState(() => createClient());
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleProgress = async () => {
      try {
        setLoading(true);

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

        setCompletedLessons(progressData?.length || 0);
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
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchModuleProgress();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, moduleSlug]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">Cargando progreso...</div>
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
        <span className="text-sm font-medium">{moduleName}</span>
        <span className="text-sm text-gray-600">
          {completedLessons}/{totalLessons} lecciones
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="text-sm font-medium text-green-600">
          Módulo completo
        </div>
      )}
    </div>
  );
}
