"use client";

import { motion } from "motion/react";
import { Zap, FlaskConical } from "lucide-react";
import type { LabCardTheme, SerializableLabCardTheme } from "@/components/labs/LabCardTheme";
import { LabCardArt } from "@/components/labs/LabCardArt";
import { BiotechGrowthTube } from "@/components/dashboard/BiotechGrowthTube";
import type { ReactNode } from "react";

// ── CardShell ──
// motion hover + --card-accent var, border, shadow (inspired by ModuleExplorerCard)
export function CardShell({
  accent,
  tint,
  children,
  className,
}: {
  accent: string;
  tint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative flex min-h-[220px] flex-col rounded-2xl border border-surface-raised bg-surface-card p-6 transition-colors duration-[250ms] ease-out hover:shadow-lg md:p-7 ${className ?? ""}`}
      style={
        {
          "--card-accent": accent,
          backgroundColor: tint ? `${tint}99` : undefined,
        } as React.CSSProperties
      }
      whileHover={{
        y: -4,
        borderColor: `${accent}4D`,
        boxShadow: "var(--shadow-lg, 0 8px 30px rgba(0,0,0,0.08)), 0 0 20px color-mix(in srgb, var(--card-accent) 14%, transparent)",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── CardChip ──
export function CardChip({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide"
      style={{
        backgroundColor: `${accent}14`,
        borderColor: `${accent}30`,
        color: accent,
      }}
    >
      {label}
    </span>
  );
}

// ── CardArt ── wrapper de LabCardArt
export function CardArt({
  theme,
  size = 88,
}: {
  theme: LabCardTheme | SerializableLabCardTheme;
  size?: number;
}) {
  return (
    <span className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110">
      <LabCardArt theme={theme} size={size} />
    </span>
  );
}

// ── XpBadge ──
export function XpBadge({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#DCEAE8] bg-[#F0F9F7] px-2 py-0.5 font-mono text-xs">
      <Zap className="h-3.5 w-3.5 shrink-0 text-[#0AAE9A]" aria-hidden="true" />
      {xp} XP
    </span>
  );
}

// ── LabBadge ──
export function LabBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#DCEAE8] bg-[#F0F9F7] px-2 py-0.5 font-mono text-xs">
      <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[#0AAE9A]" aria-hidden="true" />
      {count} labs
    </span>
  );
}

// ── ProgressFooter ──
export function ProgressFooter({
  completed,
  total,
  progressPct,
}: {
  completed: number;
  total: number;
  progressPct: number;
}) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <BiotechGrowthTube exp={completed} maxExp={total} size={96} label={`${completed}/${total}`} className="shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-sm font-semibold text-ink">
          {completed}/{total} completados
        </span>
        <span className="text-xs text-storm">{progressPct}% crecimiento</span>
      </div>
    </div>
  );
}
