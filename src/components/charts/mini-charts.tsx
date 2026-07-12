"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={d} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendArea({
  data,
  xKey,
  series,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  series: { key: string; label: string; color?: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color ?? CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            fill={`url(#g-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SimpleBar({
  data,
  xKey,
  barKey,
  height = 260,
  color = "var(--accent)",
  horizontal = true,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  barKey: string;
  height?: number;
  color?: string;
  horizontal?: boolean;
}) {
  const maxVal = Math.max(...data.map((item) => Number(item[barKey]) || 1));

  return (
    <div className="flex flex-col gap-4 py-2" style={{ minHeight: height }}>
      {data.map((item, idx) => {
        const value = Number(item[barKey]) || 0;
        const name = String(item[xKey]);
        const percentOfMax = (value / maxVal) * 100;

        return (
          <div key={name} className="flex items-center gap-4 text-xs">
            <span className="w-24 text-[var(--text-secondary)] font-medium truncate text-left">
              {name}
            </span>
            <div className="flex-1 bg-[var(--border)] h-6 rounded-[2px] overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[var(--accent)]/70 hover:bg-[var(--accent)] cursor-pointer transition-colors duration-150 rounded-[2px] shadow-[0_0_12px_rgba(57,255,138,0.1)]"
                initial={{ width: 0 }}
                animate={{ width: `${percentOfMax}%` }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.08, // stagger 80ms per bar
                }}
              />
            </div>
            <span className="w-12 text-right font-mono font-bold text-[var(--accent)] tabular-nums">
              {value}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Donut({
  data,
  height = 260,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export { CHART_COLORS };
