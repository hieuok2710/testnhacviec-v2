import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Calendar = () => {
  const { tasks } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number>(12); // Simulating Oct 12 as per mockup

  // Generate calendar grid for Oct 2023 (Starts Sunday Oct 1st)
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Dummy logic to show dots on calendar
  const getTasksForDate = (day: number) => {
      // Just visually showing some tasks on random days for the demo
      if ([3, 5, 8, 11, 12, 14, 18, 24].includes(day)) {
          return day % 2 === 0 ? ['primary'] : ['secondary']; 
      }
      return [];
  };

  const tasksForSelectedDate = tasks.filter(t => 
    (selectedDate === 12 && t.date === '2023-10-12') || // Show mock data for Oct 12
    (selectedDate === 24 && t.date === '2023-10-24')   // Show today's tasks
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28 flex flex-col">
       <div className="h-10 w-full bg-background-light dark:bg-background-dark shrink-0"></div>
       <div className="flex flex-col gap-4 px-6 pb-2 pt-2 bg-background-light dark:bg-background-dark z-10">
            <div className="flex items-center justify-between">
                <NavLink to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-text-main dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
                </NavLink>
                <div className="flex items-center gap-2">
                    <button className="text-text-main dark:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
                    </button>
                    <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Tháng 10 2023</h2>
                    <button className="text-text-main dark:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                    </button>
                </div>
                <button onClick={() => setSelectedDate(24)} className="text-primary text-sm font-bold leading-normal tracking-[0.015em] shrink-0 hover:opacity-80">
                    Hôm nay
                </button>
            </div>
            
            {/* View Toggle */}
            <div className="flex h-10 w-full items-center justify-center rounded-xl bg-[#ebefef] dark:bg-surface-dark p-1">
                <button className="flex h-full flex-1 items-center justify-center rounded-lg bg-surface-light dark:bg-[#3A3D3F] shadow-sm text-primary dark:text-white text-sm font-semibold transition-all">Tháng</button>
                <button className="flex h-full flex-1 items-center justify-center rounded-lg text-text-sub dark:text-gray-400 text-sm font-semibold transition-all">Tuần</button>
                <button className="flex h-full flex-1 items-center justify-center rounded-lg text-text-sub dark:text-gray-400 text-sm font-semibold transition-all">Năm</button>
            </div>
       </div>

       {/* Calendar Grid */}
       <div className="px-4 py-2">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft p-4">
                <div className="grid grid-cols-7 mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                        <p key={d} className="text-gray-400 text-[11px] font-bold uppercase text-center">{d}</p>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {/* Empty slots for start of month (Oct 1 is Sunday, so 0 padding needed technically if grid starts Sun) */}
                    {days.map(day => {
                        const isSelected = day === selectedDate;
                        const dots = getTasksForDate(day);
                        
                        return (
                            <button 
                                key={day} 
                                onClick={() => setSelectedDate(day)}
                                className={`relative h-12 w-full flex flex-col items-center justify-center gap-1 transition-all rounded-lg ${isSelected ? '' : 'text-slate-600 dark:text-gray-300'}`}
                            >
                                {isSelected ? (
                                    <div className="flex size-9 flex-col items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform active:scale-95">
                                        <span className="text-sm font-bold">{day}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium">{day}</span>
                                )}
                                
                                <div className={`flex gap-0.5 ${isSelected ? 'absolute bottom-1' : ''}`}>
                                    {dots.map((dot, i) => (
                                        <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white opacity-80' : (dot === 'primary' ? 'bg-primary' : 'bg-[#C4A68C]')}`}></div>
                                    ))}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
       </div>

       {/* Agenda */}
       <div className="px-6 pt-6 flex-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-main dark:text-white text-[19px] font-bold leading-tight tracking-[-0.015em]">Chi tiết ngày {selectedDate}/10</h3>
                <button className="text-xs font-semibold text-primary uppercase tracking-wide">Xem tất cả</button>
            </div>
            
            <div className="flex flex-col gap-4">
                {tasksForSelectedDate.length > 0 ? tasksForSelectedDate.map(task => (
                     <div key={task.id} onClick={() => navigate(`/task/${task.id}`)} className="flex gap-4 relative cursor-pointer">
                        <div className="w-full">
                            <div className="group flex w-full flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft border-l-[6px] border-primary p-4 transition-transform hover:scale-[1.01]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">{task.time}</span>
                                    <span className="material-symbols-outlined text-gray-400" style={{fontSize: '18px'}}>more_horiz</span>
                                </div>
                                <h4 className="text-text-main dark:text-white text-base font-bold mb-1">{task.title}</h4>
                                {task.description && <p className="text-text-sub dark:text-gray-400 text-sm mb-3 line-clamp-1">{task.description}</p>}
                                
                                <div className="flex items-center -space-x-2 overflow-hidden">
                                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover" src="https://i.pravatar.cc/150?u=1" alt="Avatar" />
                                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover" src="https://i.pravatar.cc/150?u=2" alt="Avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-gray-400">Không có công việc nào trong ngày này.</div>
                )}
            </div>
       </div>
    </div>
  );
};

export default Calendar;
