import React from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onManage: () => void;
  onLogout: () => void;
  showManage: boolean;
}

const Header: React.FC<HeaderProps> = ({
  monthLabel,
  onPrev,
  onNext,
  onManage,
  onLogout,
  showManage,
}) => (
  <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center">
    <div className="flex items-center gap-2">
      <button
        aria-label="Previous month"
        onClick={onPrev}
        className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        aria-label="Next month"
        onClick={onNext}
        className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    <h1 className="flex-1 text-center text-lg font-semibold text-slate-800 dark:text-white tracking-wide">
      {monthLabel}
    </h1>

    <div className="flex items-center gap-2">
      <button
        aria-label="Manage habits"
        onClick={onManage}
        className={`
          px-3 h-9 rounded-full flex items-center justify-center text-xs font-semibold
          border transition-all duration-300
          ${showManage
            ? 'bg-blue-500 text-white border-blue-500'
            : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
          }
          dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700
        `}
      >
        Manage habits
      </button>

      <ThemeToggle />

      <button
        aria-label="Logout"
        onClick={onLogout}
        className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  </header>
);

export default Header;
