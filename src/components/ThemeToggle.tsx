import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={`
        w-9 h-9 rounded-full flex items-center justify-center
        border transition-all duration-300
        ${isDark
          ? 'border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700'
          : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
      `}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
