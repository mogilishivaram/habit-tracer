import React from 'react';

const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
    <span className="inline-block w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
