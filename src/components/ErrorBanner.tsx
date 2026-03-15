import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => (
  <div className="w-full rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <span className="text-sm">{message}</span>
    <div className="flex gap-2">
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
        >
          Retry
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 rounded-md text-xs font-semibold border border-rose-300 text-rose-700 hover:bg-rose-100"
        >
          Dismiss
        </button>
      )}
    </div>
  </div>
);

export default ErrorBanner;
