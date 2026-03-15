import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HabitStatsDaily } from '../types';

interface HabitTrendChartProps {
  dailyStats: HabitStatsDaily[];
  isDark: boolean;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayload {
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
  isDark: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg border"
      style={{
        background: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        color: isDark ? '#f1f5f9' : '#0f172a',
      }}
    >
      <p className="font-semibold mb-0.5">Day {label}</p>
      <p>
        <span className="text-blue-400">Completion: </span>
        <span className="font-bold">{payload[0].value}%</span>
      </p>
    </div>
  );
};

// ─── Habit Trend Chart ────────────────────────────────────────────────────────

const HabitTrendChart: React.FC<HabitTrendChartProps> = ({ dailyStats, isDark }) => {
  const accentColor = isDark ? '#60a5fa' : '#3b82f6';
  const gridColor   = isDark ? '#334155' : '#e2e8f0';
  const axisColor   = isDark ? '#94a3b8' : '#64748b';

  const chartData = dailyStats.map((d) => ({
    day: d.day,
    percentage: d.percentage,
  }));

  return (
    <section
      aria-label="Habit trend chart"
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
    >
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Habit chart
      </h2>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            {/* Gradient fill definition */}
            <defs>
              <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={accentColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: axisColor, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval={1}
              label={{
                value: 'Day',
                position: 'insideBottom',
                offset: -2,
                fill: axisColor,
                fontSize: 10,
              }}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: axisColor, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickCount={6}
            />

            <Tooltip content={<CustomTooltip isDark={isDark} />} />

            <Area
              type="monotone"
              dataKey="percentage"
              stroke={accentColor}
              strokeWidth={2}
              fill="url(#habitGradient)"
              dot={false}
              activeDot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default HabitTrendChart;
