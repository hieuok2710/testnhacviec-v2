import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds

const FocusMode = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, toggleTask, showNotification } = useApp();
  const task = tasks.find(t => t.id === taskId);

  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(DEFAULT_TIME);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      showNotification("Đã hết thời gian tập trung!", "info");
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, showNotification]);

  if (!task) return <div className="p-10 text-center">Công việc không tồn tại</div>;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const handleComplete = () => {
    toggleTask(task.id);
    showNotification("Tuyệt vời! Bạn đã hoàn thành công việc.", "success");
    navigate(-1);
  };

  const handleExit = () => {
     if (isActive) {
         if (window.confirm("Bạn đang tập trung. Bạn có chắc muốn thoát không?")) {
             navigate(-1);
         }
     } else {
         navigate(-1);
     }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / initialTime) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-[#0B0F13] flex flex-col items-center relative overflow-hidden transition-colors duration-500">
        
        {/* Background Ambient Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[80%] bg-primary/10 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${isActive ? 'opacity-100 scale-105' : 'opacity-50 scale-100'}`}></div>

        {/* Top Header */}
        <div className="w-full flex items-center justify-between p-6 z-20">
            <button onClick={handleExit} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
                <span className="text-sm font-bold">Thoát</span>
            </button>
            <div className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
                 <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    Focus Mode
                 </span>
            </div>
            <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-8 pb-12">
            
            {/* Timer Visual */}
            <div className="relative size-[300px] flex items-center justify-center mb-12">
                 {/* Background Circle */}
                <svg className="absolute inset-0 size-full -rotate-90">
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-white/5"
                    />
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`text-primary transition-all duration-1000 ease-linear ${isActive ? 'drop-shadow-[0_0_10px_rgba(0,83,178,0.5)]' : ''}`}
                    />
                </svg>
                
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-display font-bold text-text-main dark:text-white tabular-nums tracking-tighter">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-gray-400 font-medium mt-2 uppercase tracking-widest">
                        {isActive ? 'Đang tập trung' : 'Sẵn sàng'}
                    </span>
                </div>
            </div>

            {/* Task Info */}
            <div className="text-center mb-12 animate-slide-up">
                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border mb-4 ${
                     task.priority === 'High' ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400' : 
                     task.priority === 'Medium' ? 'border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-900/30 dark:bg-orange-900/20 dark:text-orange-400' : 
                     'border-green-200 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400'
                 }`}>
                     <span className="material-symbols-outlined text-[16px]">flag</span>
                     <span className="text-xs font-bold uppercase">{task.priority === 'High' ? 'Ưu tiên cao' : task.priority === 'Medium' ? 'Ưu tiên TB' : 'Ưu tiên thấp'}</span>
                 </div>
                 <h2 className="text-2xl font-bold text-text-main dark:text-white leading-tight max-w-xs mx-auto">
                    {task.title}
                 </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                 <button 
                    onClick={toggleTimer}
                    className={`size-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isActive ? 'bg-surface-light dark:bg-surface-dark text-text-main dark:text-white' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/30'}`}
                 >
                    <span className="material-symbols-outlined text-[32px] filled">
                        {isActive ? 'pause' : 'play_arrow'}
                    </span>
                 </button>

                 {!isActive && timeLeft !== initialTime && (
                     <button 
                        onClick={resetTimer}
                        className="size-12 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                     >
                        <span className="material-symbols-outlined">refresh</span>
                     </button>
                 )}
            </div>

        </div>

        {/* Footer Action */}
        <div className="w-full p-6 z-20">
            <button 
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined filled">check_circle</span>
                Hoàn thành công việc
            </button>
        </div>
    </div>
  );
};

export default FocusMode;