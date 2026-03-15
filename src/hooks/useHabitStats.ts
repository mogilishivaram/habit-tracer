import { useMemo } from 'react';
import type { Completions, MonthStats, DailyStat, HabitStat, Habit } from '../types';

/**
 * useHabitStats – derived statistics from the completions map.
 * Wrapped in useMemo so it only recalculates when completions change.
 */
export function useHabitStats(
  completions: Completions,
  habits: Habit[],
  allDays: number[],
  daysInMonth: number
): MonthStats {
  return useMemo(() => {
    const totalHabits = habits.length;

    // ── Per-day statistics ─────────────────────────────────────────────────
    const dailyStats: DailyStat[] = allDays.map((day) => {
      let completed = 0;
      habits.forEach((h) => {
        if (completions[h.id]?.[day]) completed++;
      });
      const remaining = totalHabits - completed;
      const percentage = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
      return { day, completed, remaining, percentage };
    });

    // ── Per-habit statistics ───────────────────────────────────────────────
    const habitStats: HabitStat[] = habits.map((h) => {
      let completedCount = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        if (completions[h.id]?.[d]) completedCount++;
      }
      const percentage = daysInMonth > 0
        ? Math.round((completedCount / daysInMonth) * 100)
        : 0;
      return { habitId: h.id, completedCount, percentage };
    });

    // ── Monthly totals ─────────────────────────────────────────────────────
    const totalCompleted = dailyStats.reduce((sum, d) => sum + d.completed, 0);
    const totalPossible  = totalHabits * daysInMonth;
    const overallPercentage = totalPossible > 0
      ? parseFloat(((totalCompleted / totalPossible) * 100).toFixed(2))
      : 0;

    return { totalCompleted, totalPossible, overallPercentage, dailyStats, habitStats };
  }, [completions, habits, allDays, daysInMonth]);
}
