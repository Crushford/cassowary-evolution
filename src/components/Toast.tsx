import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export function Toast({
  message,
  isVisible,
  onDismiss,
  type = 'info',
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        data-testid={
          message.includes('board')
            ? 'toast-board-growth'
            : message.includes('EP')
              ? 'toast-ep-gain'
              : 'toast'
        }
        className={`${getToastStyles()} px-6 py-4 rounded-lg shadow-lg flex items-center justify-between`}
      >
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onDismiss}
          className="ml-4 text-white hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
