"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DAILY_GOAL_MIN, DAILY_GOAL_MAX, DAILY_GOAL_STEP, clampDailyGoal } from "@/domain/dailyGoal";

interface DailyGoalSettingsProps {
  initialGoal: number;
  todayXp?: number;
}

export function DailyGoalSettings({ initialGoal, todayXp }: DailyGoalSettingsProps) {
  const [goal, setGoal] = useState(() => clampDailyGoal(initialGoal));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep in sync if initialGoal changes from server
  useEffect(() => {
    setGoal(clampDailyGoal(initialGoal));
  }, [initialGoal]);

  const persist = useCallback(async (value: number) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile/daily-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daily_goal_xp: value }),
      });
      if (res.ok) {
        const data = (await res.json()) as { daily_goal_xp: number };
        setGoal(clampDailyGoal(data.daily_goal_xp));
        setSaved(true);
        if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
        savedTimeoutRef.current = setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // best-effort, no toast spam
    } finally {
      setSaving(false);
    }
  }, []);

  const scheduleSave = useCallback(
    (value: number) => {
      const clamped = clampDailyGoal(value);
      setGoal(clamped);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        persist(clamped);
      }, 600);
    },
    [persist],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-storm">Meta diaria</h3>
        {todayXp !== undefined ? (
          <span className="text-sm text-storm">
            XP hoy: <span className="font-bold text-mint">{todayXp}</span> / {goal}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={DAILY_GOAL_MIN}
          max={DAILY_GOAL_MAX}
          step={DAILY_GOAL_STEP}
          value={goal}
          onChange={(e) => scheduleSave(Number(e.target.value))}
          className="h-2 w-full accent-mint"
          aria-label="Meta diaria en XP"
        />
        <input
          type="number"
          min={DAILY_GOAL_MIN}
          max={DAILY_GOAL_MAX}
          step={DAILY_GOAL_STEP}
          value={goal}
          onChange={(e) => scheduleSave(Number(e.target.value))}
          className="w-20 rounded-btn border border-surface-raised bg-surface-card px-2 py-1.5 text-sm text-ink"
          aria-label="Meta diaria valor"
        />
        <span className="shrink-0 text-sm font-medium text-storm">XP</span>
      </div>

      <p className="text-xs text-storm">
        Tu objetivo diario de experiencia. Ajustable entre {DAILY_GOAL_MIN} y {DAILY_GOAL_MAX} XP.
      </p>

      <div className="text-sm" aria-live="polite">
        {saving ? <span className="text-storm">Guardando…</span> : null}
        {!saving && saved ? <span className="font-medium text-mint">Meta guardada</span> : null}
      </div>
    </div>
  );
}
