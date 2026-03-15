import React, { useState } from 'react';
import Header from '../components/Header';
import HabitGrid from '../components/HabitGrid';
import StatisticsPanel from '../components/StatisticsPanel';
import HabitTrendChart from '../components/HabitTrendChart';
import ManageHabitsModal from '../components/ManageHabitsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    habits,
    completions,
    stats,
    dailyStats,
    habitStats,
    calendar,
    dayLabels,
    loading,
    error,
    setError,
    refresh,
    saving,
    toggleCompletion,
    prevMonth,
    nextMonth,
  } = useHabits();

  const [showManage, setShowManage] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header
        monthLabel={calendar.monthLabel}
        onPrev={prevMonth}
        onNext={nextMonth}
        onManage={() => setShowManage((prev) => !prev)}
        onLogout={logout}
        showManage={showManage}
      />

      <main className="px-4 md:px-8 py-6 flex flex-col gap-6">
        {error && (
          <ErrorBanner message={error} onRetry={refresh} onDismiss={() => setError(null)} />
        )}

        {loading && (
          <div className="flex justify-end">
            <LoadingSpinner label="Loading habits" />
          </div>
        )}

        <ManageHabitsModal open={showManage} onClose={() => setShowManage(false)} />

        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <HabitGrid
              habits={habits}
              completions={completions}
              habitStats={habitStats}
              dailyStats={dailyStats}
              weeks={calendar.weeks}
              dayLabels={dayLabels}
              year={calendar.year}
              monthIndex={calendar.monthIndex}
              onToggle={toggleCompletion}
              saving={saving}
            />
          </div>

          <div className="hidden lg:block flex-shrink-0">
            <StatisticsPanel
              totalCompleted={stats?.totalCompleted || 0}
              completionRate={stats?.completionRate || 0}
              isDarkMode={isDark}
            />
          </div>
        </div>

        <div className="lg:hidden">
          <StatisticsPanel
            totalCompleted={stats?.totalCompleted || 0}
            completionRate={stats?.completionRate || 0}
            isDarkMode={isDark}
          />
        </div>

        <HabitTrendChart dailyStats={dailyStats} isDark={isDark} />
      </main>
    </div>
  );
};

export default Dashboard;
