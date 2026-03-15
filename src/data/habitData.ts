import type { Habit, Completions, WeekDef, CalendarData } from '../types';

// ─── Habits List ──────────────────────────────────────────────────────────────

export const HABITS: Habit[] = [
  { id: 'read',        name: 'Read',               color: '#60a5fa' },
  { id: 'walk',        name: 'go on a walk',        color: '#34d399' },
  { id: 'eat',         name: 'eat healthy',         color: '#f9a8d4' },
  { id: 'study',       name: 'study for class',     color: '#a78bfa' },
  { id: 'nospend',     name: 'No spending',         color: '#fbbf24' },
  { id: 'wakeup',      name: 'wake up at 5:00 AM',  color: '#fb923c' },
  { id: 'makebed',     name: 'make bed',            color: '#4ade80' },
  { id: 'goodday',     name: 'have a good day',     color: '#f472b6' },
];

// ─── Calendar Helpers ─────────────────────────────────────────────────────────

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Build week groupings for a given month.
 * Weeks run Sun–Sat in the table header.
 */
export function buildWeeks(daysInMonth: number): WeekDef[] {
  const weeks: WeekDef[] = [];
  let week: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if ((d - 1) % 7 === 6 || d === daysInMonth) {
      weeks.push({ label: `Week ${weeks.length + 1}`, days: week });
      week = [];
    }
  }
  return weeks;
}

export function buildCalendar(year: number, monthIndex: number): CalendarData {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = buildWeeks(daysInMonth);
  const monthLabel = new Date(year, monthIndex, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return { year, monthIndex, monthLabel, daysInMonth, allDays, weeks };
}

/** Day headers for each week (Sun Mon Tue Wed Thu Fri Sat, truncated at month end) */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Sample Completion Data (≈46.95% overall rate) ───────────────────────────

/**
 * Deterministic pseudo-random seed function – avoids Math.random() so the
 * data is stable across re-renders without needing external state.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Completion rates per habit to reach ~46.95% overall for defaults */
const HABIT_RATES: Record<string, number> = {
  read:    0.90,  // high
  walk:    0.84,
  eat:     0.77,
  study:   0.65,
  nospend: 0.42,
  wakeup:  0.32,
  makebed: 0.20,
  goodday: 0.18,
};

export function generateInitialCompletions(
  daysInMonth: number,
  seedSalt: string,
  habits: Habit[] = HABITS
): Completions {
  const completions: Completions = {};
  const salt = hashString(seedSalt);
  habits.forEach((habit, hi) => {
    completions[habit.id] = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const seed = salt + hi * 100 + d;
      const rate = HABIT_RATES[habit.id];
      completions[habit.id][d] = rate ? seededRandom(seed) < rate : false;
    }
  });
  return completions;
}
