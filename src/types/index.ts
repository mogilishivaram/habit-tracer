// ─── Core Data Structures ─────────────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  color: string; // accent color for this habit (unused in grid but kept for extensibility)
}

/** completions[habitId][dayNumber] = true/false */
export type Completions = Record<string, Record<number, boolean>>;

// ─── Calculated Statistics ────────────────────────────────────────────────────

export interface DailyStat {
  day: number;           // 1-31
  completed: number;     // how many habits were completed on this day
  remaining: number;     // how many were NOT completed
  percentage: number;    // completed / total * 100
}

export interface HabitStat {
  habitId: string;
  completedCount: number;  // total days completed
  percentage: number;      // completedCount / daysInMonth * 100
}

export interface MonthStats {
  totalCompleted: number;    // sum of all completions across month
  totalPossible: number;     // habits * daysInMonth
  overallPercentage: number; // totalCompleted / totalPossible * 100
  dailyStats: DailyStat[];
  habitStats: HabitStat[];
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

// ─── Week Structure ───────────────────────────────────────────────────────────

export interface WeekDef {
  label: string;       // "Week 1", "Week 2", etc.
  days: number[];      // day numbers belonging to this week
}

export interface CalendarData {
  year: number;
  monthIndex: number;   // 0-11
  monthLabel: string;   // "March 2026"
  daysInMonth: number;
  allDays: number[];
  weeks: WeekDef[];
}

// ─── API Models ──────────────────────────────────────────────────────────────

export interface ApiUser {
  _id: string;
  email: string;
  name: string;
}

export interface ApiAuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiHabit {
  _id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCompletion {
  _id: string;
  userId: string;
  habitId: string;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiStatsResponse {
  totalCompleted: number;
  totalPossible: number;
  completionRate: number;
  habits: number;
  completions: ApiCompletion[];
}

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface HabitStatsDaily {
  day: number;
  completed: number;
  remaining: number;
  percentage: number;
}

export interface HabitStatsPerHabit {
  habitId: string;
  completedCount: number;
  percentage: number;
}
