import React from 'react';
import { useApp } from '../context/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, tasks, toggleTask, showNotification } = useApp();
  const navigate = useNavigate();

  // Filter tasks for "Today" (simulated)
  const todayTasks = tasks.filter(t => t.date === '2023-10-24');
  const completedCount = todayTasks.filter(t => t.completed).length;
  const progressPercentage = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2 sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <NavLink to="/profile" className="relative group cursor-pointer">
                <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm dark:border-gray-700">
                    <img alt="User" className="w-full h-full object-cover" src={user.avatar} />
                </div>
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
            </NavLink>
        </div>
        <div className="flex items-center gap-2">
            <NavLink to="/sync" className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm relative">
                 <span className="material-symbols-outlined">sync</span>
                 <span className="absolute top-2 right-2 size-2 bg-green-500 rounded-full"></span>
            </NavLink>
            <button 
                onClick={() => showNotification('Đây là thông báo mẫu!', 'info')}
                className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm relative"
            >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
            </button>
        </div>
      </header>

      <section className="px-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <p className="text-primary dark:text-blue-400 font-bold uppercase tracking-wider text-xs">Thứ Năm, 24/10</p>
        </div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white leading-tight">Chào mừng trở lại,<br/>{user.name.split(' ').pop()}.</h1>
      </section>

      <main className="px-6 mt-6 flex flex-col gap-6">
        {/* Progress Card */}
        <div className="relative w-full bg-primary rounded-2xl p-5 text-white shadow-glow overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <h3 className="w-full text-left font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">donut_large</span>
                    Tiến độ ngày hôm nay
                </h3>
                <div className="flex items-center justify-between w-full">
                    <div className="relative size-24">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/20 transition-colors" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                            <path className="text-white drop-shadow-lg transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${progressPercentage}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-white tracking-tighter">{progressPercentage}%</span>
                        </div>
                    </div>
                    <div className="flex-1 pl-6 flex justify-around">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-white/70 font-semibold uppercase">Hoàn thành</span>
                            <span className="text-2xl font-bold text-white mt-1">{completedCount}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-white/70 font-semibold uppercase">Còn lại</span>
                            <span className="text-2xl font-bold text-white mt-1">{todayTasks.length - completedCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Priority Tasks */}
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-text-main dark:text-white">Công việc ưu tiên</h2>
                <NavLink to="/add" className="text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                </NavLink>
            </div>
            
            <div className="flex flex-col gap-3">
                {todayTasks.slice(0, 3).map(task => (
                     <div key={task.id} 
                        onClick={(e) => {
                            if(!(e.target as HTMLElement).closest('input')) {
                                navigate(`/task/${task.id}`)
                            }
                        }}
                        className="group flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition-all select-none">
                        <div className="relative flex items-center justify-center size-6 mr-4">
                            <input 
                                checked={task.completed} 
                                onChange={() => toggleTask(task.id)}
                                className="peer appearance-none size-6 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-primary checked:border-primary transition-colors focus:ring-0 focus:ring-offset-0 cursor-pointer" type="checkbox"
                            />
                            <span className="material-symbols-outlined text-white absolute text-base opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                        </div>
                        <div className={`flex-1 ${task.completed ? 'opacity-50' : ''}`}>
                            <h4 className={`text-sm font-bold text-text-main dark:text-white ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                            <p className="text-xs text-text-sub mt-0.5 flex items-center gap-1">
                                <span className={`size-1.5 rounded-full ${
                                    task.priority === 'High' ? 'bg-red-500' : 
                                    task.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-500'
                                }`}></span> 
                                {task.time} - {task.category}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Home;