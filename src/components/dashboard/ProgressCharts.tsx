"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export interface TimelinePoint {
  week: string;
  xp: number;
}

export interface DailyPoint {
  day: string;
  xp: number;
}

export interface ModulePoint {
  name: string;
  completed?: number;
  total?: number;
  value?: number;
}

interface ProgressChartsProps {
  timeline: TimelinePoint[];
  modules: ModulePoint[];
  daily: DailyPoint[];
  overallProgress: number;
}

const PIE_COLORS = [
  "var(--color-mint)",
  "var(--color-fog)",
  "var(--color-brand-300)",
  "var(--color-slate)",
  "var(--color-graphite)",
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: Record<string, unknown> }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-surface-raised bg-surface-card p-2 text-xs shadow-md">
      <p className="font-medium text-ink">{label}</p>
      <p className="text-storm">{value} XP</p>
    </div>
  );
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: ModulePoint }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  return (
    <div className="rounded-xl border border-surface-raised bg-surface-card p-2 text-xs shadow-md">
      <p className="font-medium text-ink">{entry.name}</p>
      <p className="text-storm">{entry.value} lecciones</p>
    </div>
  );
}

type ActiveTab = "ritmo" | "expediciones" | "constancia";

export function ProgressCharts({ timeline, modules, daily, overallProgress }: ProgressChartsProps) {
  const shouldReduce = useReducedMotion();
  const isAnimationActive = !shouldReduce;
  const [active, setActive] = useState<ActiveTab>("ritmo");

  const pieData = modules
    .map((m) => ({
      name: m.name,
      value: m.value ?? m.completed ?? 0,
    }))
    .filter((d) => d.value > 0);

  const hasPieData = pieData.length > 0;
  const displayPieData = hasPieData ? pieData : [{ name: "Sin progreso", value: 1 }];

  const tabBase = "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors";
  const tabActive = "bg-mint text-ink";
  const tabInactive = "bg-surface-raised text-storm hover:bg-surface-raised/80";

  return (
    <div className="glass-card flex min-h-[380px] flex-col rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-storm">Tu Evolución</h3>
          <p className="mt-1 text-xs text-storm">Explora tu ritmo, distribución y constancia</p>
        </div>
        <div role="tablist" aria-label="Selector de gráfica" className="flex gap-2">
          <button
            role="tab"
            aria-selected={active === "ritmo"}
            aria-controls="panel-ritmo"
            id="tab-ritmo"
            onClick={() => setActive("ritmo")}
            className={`${tabBase} ${active === "ritmo" ? tabActive : tabInactive}`}
            type="button"
          >
            Ritmo
          </button>
          <button
            role="tab"
            aria-selected={active === "expediciones"}
            aria-controls="panel-expediciones"
            id="tab-expediciones"
            onClick={() => setActive("expediciones")}
            className={`${tabBase} ${active === "expediciones" ? tabActive : tabInactive}`}
            type="button"
          >
            Expediciones
          </button>
          <button
            role="tab"
            aria-selected={active === "constancia"}
            aria-controls="panel-constancia"
            id="tab-constancia"
            onClick={() => setActive("constancia")}
            className={`${tabBase} ${active === "constancia" ? tabActive : tabInactive}`}
            type="button"
          >
            Constancia
          </button>
        </div>
      </div>

      <div className="h-[260px] w-full">
        {active === "ritmo" && (
          <div id="panel-ritmo" role="tabpanel" aria-labelledby="tab-ritmo" className="h-full w-full" aria-label="Gráfico de ritmo semanal">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-mint)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-mint)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: "var(--color-storm)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--color-mint)"
                  fill="url(#gradMint)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={isAnimationActive}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {active === "expediciones" && (
          <div
            id="panel-expediciones"
            role="tabpanel"
            aria-labelledby="tab-expediciones"
            className="relative h-full w-full"
            aria-label="Gráfico de distribución por expediciones"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  cornerRadius={8}
                  isAnimationActive={isAnimationActive}
                >
                  {displayPieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hasPieData ? PIE_COLORS[index % PIE_COLORS.length] : "var(--color-surface-raised)"}
                      stroke="var(--color-surface-card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px", color: "var(--color-storm)" }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold text-ink">{overallProgress}%</span>
              <span className="text-xs text-storm">completado</span>
            </div>
          </div>
        )}

        {active === "constancia" && (
          <div id="panel-constancia" role="tabpanel" aria-labelledby="tab-constancia" className="h-full w-full" aria-label="Gráfico de constancia diaria">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "var(--color-storm)" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-surface-raised)", opacity: 0.3 }} />
                <Bar dataKey="xp" fill="var(--color-mint)" radius={[4, 4, 0, 0]} isAnimationActive={isAnimationActive} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressCharts;
