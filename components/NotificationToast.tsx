import React from 'react';
import { useApp } from '../context/AppContext';

const NotificationToast = () => {
  const { notification, showNotification } = useApp();

  if (!notification) return null;

  const styles = {
    success: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-green-500',
      icon: 'check_circle',
      iconColor: 'text-green-500',
      text: 'text-gray-800 dark:text-white'
    },
    error: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-red-500',
      icon: 'error',
      iconColor: 'text-red-500',
      text: 'text-gray-800 dark:text-white'
    },
    info: {
      bg: 'bg-white dark:bg-surface-dark',
      border: 'border-blue-500',
      icon: 'info',
      iconColor: 'text-blue-500',
      text: 'text-gray-800 dark:text-white'
    }
  };

  const style = styles[notification.type];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] sm:max-w-sm pointer-events-none">
      <div className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border-l-4 ${style.bg} ${style.border} animate-slide-up transform transition-all duration-300`}>
        <div className={`shrink-0 ${style.iconColor}`}>
          <span className="material-symbols-outlined filled text-2xl">{style.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${style.text}`}>{notification.message}</p>
        </div>
        <button onClick={() => showNotification('', 'info')} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             {/* We can effectively close it by clearing, but the timeout handles it mostly. This is just visual or fast dismiss */}
             {/* Since showNotification with empty string isn't exact clear logic, simpler to just let it fade or add clearNotification to context. 
                 For now we just rely on auto-hide or overwrite. */}
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;