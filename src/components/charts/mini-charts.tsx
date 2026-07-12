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
  color = "var(--chart-1)",
  horizontal = false,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  barKey: string;
  height?: number;
  color?: string;
  horizontal?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, left: horizontal ? 20 : -10, bottom: 0 }}
      >
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey={xKey} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
          </>
        )}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
        <Bar dataKey={barKey} fill={color} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
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
