import React from 'react';
import { Task } from '../types';

interface AlarmPopupProps {
  task: Task;
  onDismiss: () => void;
  onComplete: () => void;
}

const AlarmPopup: React.FC<AlarmPopupProps> = ({ task, onDismiss, onComplete }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in px-6">
      <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden animate-scale-in relative border border-white/20 dark:border-white/5">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
        
        <div className="relative z-10 p-8 flex flex-col items-center text-center">
            
            {/* Bell Animation */}
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                <div className="size-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 relative animate-wiggle">
                    <span className="material-symbols-outlined text-white text-[40px] filled">notifications_active</span>
                </div>
                {/* Sound waves */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-primary/50 rounded-full animate-ping opacity-75"></div>
            </div>

            <h2 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Đã đến giờ!</h2>
            <h1 className="text-xl font-extrabold text-text-main dark:text-white leading-tight mb-2 line-clamp-2">
                {task.title}
            </h1>
            <div className="flex items-center gap-2 text-text-sub dark:text-gray-400 font-medium mb-8 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span>{task.time}</span>
                <span className="mx-1">•</span>
                <span>{task.category}</span>
            </div>

            <div className="flex flex-col w-full gap-3">
                <button 
                    onClick={onComplete}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined filled">check_circle</span>
                    Hoàn thành ngay
                </button>
                <button 
                    onClick={onDismiss}
                    className="w-full bg-white dark:bg-white/10 text-text-main dark:text-white font-bold py-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/15 transition-colors"
                >
                    Báo lại sau
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AlarmPopup;