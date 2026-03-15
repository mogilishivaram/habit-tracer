import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  ApiCompletion,
  ApiHabit,
  ApiStatsResponse,
  Completions,
  HabitStatsDaily,
  HabitStatsPerHabit,
} from '../types';
import { buildCalendar, DAY_LABELS } from '../data/habitData';
import { useAuthContext } from './AuthContext';
import { apiRequest, ApiError } from '../utils/api';

interface HabitsContextValue {
  habits: ApiHabit[];
  completions: Completions;
  stats: ApiStatsResponse | null;
  dailyStats: HabitStatsDaily[];
  habitStats: HabitStatsPerHabit[];
  calendar: ReturnType<typeof buildCalendar>;
  dayLabels: string[];
  loading: boolean;
  error: string | null;
  saving: Record<string, boolean>;
  setError: (message: string | null) => void;
  refresh: () => Promise<void>;
  addHabit: (name: string) => Promise<void>;
  editHabit: (id: string, name: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, day: number) => Promise<void>;
  prevMonth: () => void;
  nextMonth: () => void;
}

const HabitsContext = createContext<HabitsContextValue | null>(null);

function dateKey(year: number, monthIndex: number, day: number): string {
  const month = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${month}-${d}`;
}

function buildCompletionsMap(
  habits: ApiHabit[],
  daysInMonth: number,
  completions: ApiCompletion[]
): Completions {
  const map: Completions = {};
  habits.forEach((habit) => {
    map[habit._id] = {};
    for (let d = 1; d <= daysInMonth; d++) {
      map[habit._id][d] = false;
    }
  });
  completions.forEach((completion) => {
    if (!completion.completed) return;
    const day = new Date(completion.date).getDate();
    if (map[completion.habitId]) {
      map[completion.habitId][day] = true;
    }
  });
  return map;
}

function buildDailyStats(
  habits: ApiHabit[],
  daysInMonth: number,
  completions: Completions
): HabitStatsDaily[] {
  const totalHabits = habits.length;
  const stats: HabitStatsDaily[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    let completed = 0;
    habits.forEach((habit) => {
      if (completions[habit._id]?.[day]) completed++;
    });
    const remaining = totalHabits - completed;
    const percentage = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
    stats.push({ day, completed, remaining, percentage });
  }
  return stats;
}

function buildHabitStats(
  habits: ApiHabit[],
  daysInMonth: number,
  completions: Completions
): HabitStatsPerHabit[] {
  return habits.map((habit) => {
    let completedCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if (completions[habit._id]?.[day]) completedCount++;
    }
    const percentage = daysInMonth > 0 ? Math.round((completedCount / daysInMonth) * 100) : 0;
    return { habitId: habit._id, completedCount, percentage };
  });
}

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout } = useAuthContext();
  const now = new Date();
  const [currentDate, setCurrentDate] = useState({ year: now.getFullYear(), monthIndex: now.getMonth() });
  const [habits, setHabits] = useState<ApiHabit[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [stats, setStats] = useState<ApiStatsResponse | null>(null);
  const [dailyStats, setDailyStats] = useState<HabitStatsDaily[]>([]);
  const [habitStats, setHabitStats] = useState<HabitStatsPerHabit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const calendar = useMemo(
    () => buildCalendar(currentDate.year, currentDate.monthIndex),
    [currentDate.year, currentDate.monthIndex]
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [habitsData, statsData] = await Promise.all([
        apiRequest<ApiHabit[]>('/habits', { token }),
        apiRequest<ApiStatsResponse>(`/stats?startDate=${dateKey(calendar.year, calendar.monthIndex, 1)}&endDate=${dateKey(calendar.year, calendar.monthIndex, calendar.daysInMonth)}`, { token })
      ]);
      const map = buildCompletionsMap(habitsData, calendar.daysInMonth, statsData.completions || []);
      setHabits(habitsData);
      setStats(statsData);
      setCompletions(map);
      setDailyStats(buildDailyStats(habitsData, calendar.daysInMonth, map));
      setHabitStats(buildHabitStats(habitsData, calendar.daysInMonth, map));
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      const message = err instanceof ApiError ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, calendar]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(async (name: string) => {
    if (!token) return;
    try {
      const newHabit = await apiRequest<ApiHabit>('/habits', {
        method: 'POST',
        token,
        body: { name, color: '#60a5fa' },
      });
      const updatedHabits = [...habits, newHabit];
      const emptyDays: Record<number, boolean> = {};
      for (let d = 1; d <= calendar.daysInMonth; d++) {
        emptyDays[d] = false;
      }
      const updatedMap: Completions = { ...completions, [newHabit._id]: emptyDays };
      setHabits(updatedHabits);
      setCompletions(updatedMap);
      setDailyStats(buildDailyStats(updatedHabits, calendar.daysInMonth, updatedMap));
      setHabitStats(buildHabitStats(updatedHabits, calendar.daysInMonth, updatedMap));
      await refresh();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      setError(err.message || 'Failed to add habit');
      throw err;
    }
  }, [token, habits, completions, calendar.daysInMonth, refresh]);

  const editHabit = useCallback(async (id: string, name: string) => {
    if (!token) return;
    try {
      const updated = await apiRequest<ApiHabit>(`/habits/${id}`, {
        method: 'PUT',
        token,
        body: { name },
      });
      const updatedHabits = habits.map((habit) => (habit._id === id ? updated : habit));
      setHabits(updatedHabits);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      setError(err.message || 'Failed to edit habit');
      throw err;
    }
  }, [token, habits]);

  const deleteHabit = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await apiRequest(`/habits/${id}`, { method: 'DELETE', token });
      const updatedHabits = habits.filter((habit) => habit._id !== id);
      const { [id]: _removed, ...rest } = completions;
      setHabits(updatedHabits);
      setCompletions(rest);
      setDailyStats(buildDailyStats(updatedHabits, calendar.daysInMonth, rest));
      setHabitStats(buildHabitStats(updatedHabits, calendar.daysInMonth, rest));
      await refresh();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      setError(err.message || 'Failed to delete habit');
      throw err;
    }
  }, [token, habits, completions, calendar.daysInMonth, refresh]);

  const toggleCompletion = useCallback(async (habitId: string, day: number) => {
    if (!token) return;
    const key = `${habitId}-${day}`;
    const previous = completions[habitId]?.[day] || false;
    const nextValue = !previous;
    setSaving((prev) => ({ ...prev, [key]: true }));
    setCompletions((prev) => ({
      ...prev,
      [habitId]: { ...prev[habitId], [day]: nextValue },
    }));
    try {
      await apiRequest('/completions', {
        method: 'POST',
        token,
        body: {
          habitId,
          date: dateKey(calendar.year, calendar.monthIndex, day),
          completed: nextValue,
        },
      });
      await refresh();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
      setCompletions((prev) => ({
        ...prev,
        [habitId]: { ...prev[habitId], [day]: previous },
      }));
      if (err instanceof ApiError && err.status === 403) {
        setError('Can only edit completions for today.');
      } else {
        setError(err.message || 'Failed to update completion');
      }
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  }, [token, completions, calendar, refresh]);

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = prev.monthIndex - 1;
      if (nextMonth < 0) return { year: prev.year - 1, monthIndex: 11 };
      return { year: prev.year, monthIndex: nextMonth };
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = prev.monthIndex + 1;
      if (nextMonth > 11) return { year: prev.year + 1, monthIndex: 0 };
      return { year: prev.year, monthIndex: nextMonth };
    });
  };

  const value = useMemo<HabitsContextValue>(() => ({
    habits,
    completions,
    stats,
    dailyStats,
    habitStats,
    calendar,
    dayLabels: DAY_LABELS,
    loading,
    error,
    saving,
    setError,
    refresh,
    addHabit,
    editHabit,
    deleteHabit,
    toggleCompletion,
    prevMonth,
    nextMonth,
  }), [habits, completions, stats, dailyStats, habitStats, calendar, loading, error, saving, refresh, addHabit, editHabit, deleteHabit, toggleCompletion]);

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
};

export function useHabitsContext(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabitsContext must be used within HabitsProvider');
  return ctx;
}
