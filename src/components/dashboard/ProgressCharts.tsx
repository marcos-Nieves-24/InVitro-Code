"use client";

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

export function ProgressCharts({ timeline, modules, daily, overallProgress }: ProgressChartsProps) {
  const shouldReduce = useReducedMotion();
  const isAnimationActive = !shouldReduce;

  // Normaliza modules: acepta {name, value} o {name, completed,total}
  const pieData = modules
    .map((m) => ({
      name: m.name,
      value: m.value ?? m.completed ?? 0,
    }))
    .filter((d) => d.value > 0);

  // Si no hay progreso, muestra placeholders para no dejar donut vacío
  const hasPieData = pieData.length > 0;
  const displayPieData = hasPieData ? pieData : [{ name: "Sin progreso", value: 1 }];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* 1) Ritmo — Area 8 semanas */}
      <div className="glass-card flex min-h-[320px] flex-col rounded-2xl p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-storm">Ritmo</h3>
        <p className="mb-4 text-xs text-storm">XP por semana · últimas 8 semanas</p>
        <div className="h-[220px] w-full" aria-label="Gráfico de ritmo semanal">
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
      </div>

      {/* 2) Expediciones — Donut */}
      <div className="glass-card flex min-h-[320px] flex-col rounded-2xl p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-storm">Expediciones</h3>
        <p className="mb-4 text-xs text-storm">Distribución por módulo</p>
        <div className="relative h-[220px] w-full" aria-label="Gráfico de distribución por expediciones">
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
              <Legend
                wrapperStyle={{ fontSize: "10px", color: "var(--color-storm)" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-ink">{overallProgress}%</span>
            <span className="text-xs text-storm">completado</span>
          </div>
        </div>
      </div>

      {/* 3) Constancia — Bars 30 días */}
      <div className="glass-card flex min-h-[320px] flex-col rounded-2xl p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-storm">Constancia</h3>
        <p className="mb-4 text-xs text-storm">XP por día · últimos 30 días</p>
        <div className="h-[220px] w-full" aria-label="Gráfico de constancia diaria">
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
              <Bar
                dataKey="xp"
                fill="var(--color-mint)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={isAnimationActive}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ProgressCharts;
