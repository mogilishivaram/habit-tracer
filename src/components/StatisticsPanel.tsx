import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen } from 'lucide-react';
interface StatisticsPanelProps {
  totalCompleted: number;
  completionRate: number;
  isDarkMode: boolean;
}

// ─── Statistics Panel ─────────────────────────────────────────────────────────

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ totalCompleted, completionRate, isDarkMode }) => {
  const overallPercentage = completionRate;

  const donutData = [
    { name: 'Completed', value: overallPercentage },
    { name: 'Remaining', value: parseFloat((100 - overallPercentage).toFixed(2)) },
  ];

  const DONUT_COLORS_DARK  = ['#60a5fa', '#334155'];
  const DONUT_COLORS_LIGHT = ['#3b82f6', '#e2e8f0'];

  const COLORS = isDarkMode ? DONUT_COLORS_DARK : DONUT_COLORS_LIGHT;

  return (
    <aside
      aria-label="Statistics panel"
      className="flex flex-col gap-4 w-full min-w-[200px] max-w-[240px]"
    >
      {/* ── Total count card ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-col items-center gap-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Total Count
        </p>
        <p className="text-5xl font-bold text-blue-500 dark:text-blue-400 leading-none">
          {totalCompleted}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">habits this month</p>
      </div>

      {/* ── Monthly progress donut ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-col items-center gap-3">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide self-start">
          Monthly Progress
        </p>

        <div className="w-full h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                animationBegin={0}
                animationDuration={800}
              >
                {donutData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  typeof value === 'number' ? `${value.toFixed(2)}%` : `${value}%`,
                  '',
                ]}
                contentStyle={{
                  background: isDarkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#f1f5f9' : '#0f172a',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">
              {overallPercentage}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              completed
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-400 flex-shrink-0" />
            <span>Completed</span>
            <span className="ml-auto font-semibold">{overallPercentage}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
            <span>Remaining</span>
            <span className="ml-auto font-semibold">
              {(100 - overallPercentage).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Study/icon card ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        </div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center">
          study structures
        </p>
      </div>
    </aside>
  );
};

export default StatisticsPanel;
