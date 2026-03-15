import React, { useCallback } from 'react';
import type { ApiHabit, Completions, HabitStatsDaily, HabitStatsPerHabit, WeekDef } from '../types';

interface HabitGridProps {
  habits: ApiHabit[];
  completions: Completions;
  habitStats: HabitStatsPerHabit[];
  dailyStats: HabitStatsDaily[];
  weeks: WeekDef[];
  dayLabels: string[];
  year: number;
  monthIndex: number;
  onToggle: (habitId: string, day: number) => void;
  saving: Record<string, boolean>;
}

// ─── Checkbox Cell ────────────────────────────────────────────────────────────

interface CheckboxCellProps {
  checked: boolean;
  onClick: () => void;
  label: string;
  disabled: boolean;
  title?: string;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({ checked, onClick, label, disabled, title }) => (
  <td className="p-0">
    <button
      aria-label={label}
      aria-pressed={checked}
      aria-disabled={disabled}
      data-disabled={disabled ? 'true' : 'false'}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        w-7 h-7 flex items-center justify-center rounded
        border transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${checked
          ? 'bg-blue-500 dark:bg-blue-400 border-blue-500 dark:border-blue-400 text-white scale-100'
          : 'bg-transparent border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700'
        }
        ${disabled ? 'hover:border-slate-300 hover:bg-transparent dark:hover:border-slate-600 dark:hover:bg-transparent' : ''}
      `}
    >
      {checked && (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  </td>
);

// ─── Progress Bar (Goal Column) ───────────────────────────────────────────────

const GoalBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <td className="px-2 py-1 min-w-[80px]">
    <div className="flex items-center gap-1">
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-400 dark:bg-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">
        {percentage}%
      </span>
    </div>
  </td>
);

// ─── Main HabitGrid ───────────────────────────────────────────────────────────

const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  completions,
  habitStats,
  dailyStats,
  weeks,
  dayLabels,
  year,
  monthIndex,
  onToggle,
  saving,
}) => {
  const handleToggle = useCallback(
    (habitId: string, day: number, editable: boolean) => () => {
      if (!editable) return;
      onToggle(habitId, day);
    },
    [onToggle]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full border-collapse text-sm" role="grid" aria-label="Habit tracker grid">
        <thead>
          {/* ── Week labels row ── */}
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 min-w-[140px]">
              HABIT
            </th>
            {weeks.map((week) => (
              <th
                key={week.label}
                colSpan={week.days.length}
                className="px-2 py-2 text-center font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide border-l border-slate-200 dark:border-slate-700"
              >
                {week.label}
              </th>
            ))}
            <th className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide border-l border-slate-200 dark:border-slate-700">
              TRUE
            </th>
            <th className="px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wide border-l border-slate-200 dark:border-slate-700 min-w-[100px]">
              Goal
            </th>
          </tr>

          {/* ── Day-of-week label row ── */}
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-3 py-1" />
            {weeks.flatMap((week) =>
              week.days.map((day) => {
                const dayOfWeek = new Date(year, monthIndex, day).getDay();
                const cellDate = new Date(year, monthIndex, day);
                cellDate.setHours(0, 0, 0, 0);
                const isToday = cellDate.getTime() === today.getTime();
                return (
                  <th
                    key={day}
                    className="px-0.5 py-1 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 min-w-[28px]"
                  >
                    <div className={isToday ? 'text-blue-500 dark:text-blue-400 font-semibold' : ''}>
                      {dayLabels[dayOfWeek]}
                    </div>
                    <div className={`font-semibold text-xs ${isToday ? 'text-blue-500 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {day}
                    </div>
                  </th>
                );
              })
            )}
            <th className="px-3 py-1 border-l border-slate-200 dark:border-slate-700" />
            <th className="px-3 py-1 border-l border-slate-200 dark:border-slate-700" />
          </tr>
        </thead>

        <tbody>
          {/* ── Habit rows ── */}
          {habits.map((habit, hi) => {
            const habitStat = habitStats.find((s) => s.habitId === habit._id);
            return (
              <tr
                key={habit._id}
                className={`
                  border-b border-slate-100 dark:border-slate-800
                  transition-colors duration-150
                  hover:bg-blue-50/40 dark:hover:bg-slate-800/60
                  ${hi % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-900/50'}
                `}
              >
                {/* Habit name */}
                <td className="sticky left-0 z-10 px-3 py-2 font-medium text-slate-700 dark:text-slate-200 bg-inherit min-w-[140px] border-r border-slate-100 dark:border-slate-800">
                  {habit.name}
                </td>

                {/* Checkbox cells */}
                {weeks.flatMap((week) =>
                  week.days.map((day) => (
                    (() => {
                      const cellDate = new Date(year, monthIndex, day);
                      cellDate.setHours(0, 0, 0, 0);
                      const isToday = cellDate.getTime() === today.getTime();
                      const disabled = !isToday || !!saving[`${habit._id}-${day}`];
                      const title = isToday
                        ? 'Today'
                        : cellDate < today
                          ? 'Past days are locked'
                          : "This day hasn't arrived yet";
                      return (
                    <CheckboxCell
                      key={day}
                      checked={!!completions[habit._id]?.[day]}
                      onClick={handleToggle(habit._id, day, isToday)}
                      label={`${habit.name} – day ${day}`}
                      disabled={disabled}
                      title={title}
                    />
                      );
                    })()
                  ))
                )}

                {/* TRUE count */}
                <td className="px-3 py-2 text-center font-semibold text-blue-500 dark:text-blue-400 border-l border-slate-200 dark:border-slate-700">
                  {habitStat?.completedCount ?? 0}
                </td>

                {/* Goal progress */}
                <GoalBar percentage={habitStat?.percentage ?? 0} />
              </tr>
            );
          })}

          {/* ── Summary rows ── */}
          <SummaryRow
            label="Habit completed"
            cells={dailyStats.map((d) => String(d.completed))}
            cellClass="text-blue-500 dark:text-blue-400 font-semibold"
          />
          <SummaryRow
            label="Habit remaining"
            cells={dailyStats.map((d) => String(d.remaining))}
            cellClass="text-slate-500 dark:text-slate-400"
          />
          <SummaryRow
            label="percentage"
            cells={dailyStats.map((d) => `${d.percentage}%`)}
            cellClass="text-emerald-500 dark:text-emerald-400 font-medium"
          />
        </tbody>
      </table>
    </div>
  );
};

// ─── Summary Row Component ────────────────────────────────────────────────────

interface SummaryRowProps {
  label: string;
  cells: string[];
  cellClass?: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, cells, cellClass = '' }) => (
  <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
    <td className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 capitalize">
      {label}
    </td>
    {cells.map((val, i) => (
      <td key={i} className={`px-0.5 py-2 text-center text-xs ${cellClass}`}>
        {val}
      </td>
    ))}
    {/* Span TRUE + Goal columns */}
    <td colSpan={2} className="border-l border-slate-200 dark:border-slate-700" />
  </tr>
);

export default HabitGrid;
