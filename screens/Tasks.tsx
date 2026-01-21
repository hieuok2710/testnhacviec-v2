import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Tasks = () => {
    const { user, tasks, toggleTask, deleteTask, showNotification } = useApp();
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const navigate = useNavigate();

    const incompleteTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const percentage = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteTaskId(id);
    };

    const confirmDelete = () => {
        if (deleteTaskId) {
            deleteTask(deleteTaskId);
            showNotification('Đã xóa công việc thành công', 'success');
            setDeleteTaskId(null);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white h-[100dvh] flex flex-col overflow-hidden">
             {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 border-b border-transparent dark:border-gray-800 transition-all shrink-0">
                <NavLink to="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </NavLink>
                <h1 className="text-lg font-bold tracking-tight">Cá nhân</h1>
                <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pt-2 no-scrollbar pb-32">
                <div className="mt-4 mb-6">
                    <p className="text-sm font-medium text-text-sub dark:text-slate-400 uppercase tracking-wider">Hôm nay, 24 Tháng 10</p>
                    <h2 className="text-2xl font-extrabold text-text-main dark:text-white leading-tight mt-1">Xin chào, {user.name.split(' ').pop()} 👋</h2>
                    <p className="text-text-sub dark:text-slate-400 mt-1">Bạn có {incompleteTasks} công việc cần hoàn thành.</p>
                </div>

                {/* Donut Chart */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-soft mb-8 relative overflow-hidden border border-gray-100 dark:border-gray-800">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                     <div className="flex flex-col items-center relative z-10">
                        <h3 className="w-full text-left font-bold text-lg mb-6 flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">donut_large</span>
                             Tiến độ ngày hôm nay
                        </h3>
                        <div className="relative size-48">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100 dark:text-gray-700 transition-colors" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                                <path className="text-primary drop-shadow-lg transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" strokeWidth="2.5"></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-text-main dark:text-white tracking-tighter">{percentage}%</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Đã xong</span>
                            </div>
                        </div>
                         <div className="flex w-full justify-between mt-6 px-2">
                            <div className="flex flex-col items-center flex-1 border-r border-gray-100 dark:border-gray-700">
                                <span className="text-xs text-gray-400 font-semibold uppercase">Hoàn thành</span>
                                <span className="text-xl font-bold text-primary mt-1">{completedTasks}</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-xs text-gray-400 font-semibold uppercase">Còn lại</span>
                                <span className="text-xl font-bold text-text-main dark:text-gray-200 mt-1">{incompleteTasks}</span>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-text-main dark:text-white">Danh sách công việc</h3>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setViewMode(prev => prev === 'card' ? 'list' : 'card')}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-surface-dark transition-all rounded-full"
                        >
                            <span className="material-symbols-outlined">
                                {viewMode === 'card' ? 'view_list' : 'grid_view'}
                            </span>
                        </button>
                        <button className="p-2 -mr-2 text-gray-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'card' ? "space-y-3" : "space-y-2"}>
                    {tasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => navigate(`/task/${task.id}`)}
                            className={`group flex ${viewMode === 'card' ? 'items-start p-4 rounded-2xl' : 'items-center p-3 rounded-xl'} bg-surface-light dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer ${task.completed ? 'opacity-70 bg-gray-50 dark:bg-surface-dark/40' : ''}`}
                        >
                            <label onClick={e => e.stopPropagation()} className={`relative flex items-center justify-center cursor-pointer ${viewMode === 'card' ? 'pt-1' : ''}`}>
                                <input checked={task.completed} onChange={() => toggleTask(task.id)} className="peer sr-only" type="checkbox"/>
                                <div className="size-6 rounded-lg border-2 border-gray-300 dark:border-gray-500 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center bg-white dark:bg-gray-800">
                                    <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-all transform scale-50 peer-checked:scale-100">check</span>
                                </div>
                            </label>
                            <div className="flex-1 ml-3.5">
                                <div className={`flex ${viewMode === 'card' ? 'items-start' : 'items-center'} justify-between mb-1`}>
                                    <span className={`text-[15px] font-bold ${task.completed ? 'text-gray-500 line-through decoration-gray-400' : 'text-text-main dark:text-white group-hover:text-primary transition-colors'}`}>{task.title}</span>
                                    <div className="flex items-center gap-1">
                                        {!task.completed && (
                                            <span className={`flex size-2.5 rounded-full ring-2 ring-opacity-30 ${task.priority === 'High' ? 'bg-red-500 ring-red-500' : task.priority === 'Medium' ? 'bg-orange-400 ring-orange-400' : 'bg-green-500 ring-green-500'}`}></span>
                                        )}
                                        {/* Delete Button */}
                                        <button 
                                            onClick={(e) => handleDeleteClick(e, task.id)}
                                            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                                {viewMode === 'card' ? (
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                            task.category === 'Work' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                                            task.category === 'Health' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                                            task.category === 'Family' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
                                            'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                        }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {task.category === 'Work' ? 'work' : task.category === 'Health' ? 'fitness_center' : task.category === 'Family' ? 'family_restroom' : 'school'}
                                            </span>
                                            <span>{task.category === 'Work' ? 'Công việc' : task.category === 'Health' ? 'Sức khỏe' : task.category === 'Family' ? 'Gia đình' : 'Học tập'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {task.time}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-sub dark:text-gray-400">
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            <span>{task.time}</span>
                                        </div>
                                        
                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                                            task.category === 'Work' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 
                                            task.category === 'Health' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 
                                            task.category === 'Family' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : 
                                            'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                                        }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                 {task.category === 'Work' ? 'work' : task.category === 'Health' ? 'fitness_center' : task.category === 'Family' ? 'family_restroom' : 'school'}
                                            </span>
                                            <span>
                                                {task.category === 'Work' ? 'Công việc' : 
                                                task.category === 'Health' ? 'Sức khỏe' : 
                                                task.category === 'Family' ? 'Gia đình' : 'Học tập'}
                                            </span>
                                        </div>
                                        
                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                                            task.priority === 'High' ? 'border-red-200 text-red-600 dark:border-red-900/30 dark:text-red-400' : 
                                            task.priority === 'Medium' ? 'border-orange-200 text-orange-600 dark:border-orange-900/30 dark:text-orange-400' : 
                                            'border-green-200 text-green-600 dark:border-green-900/30 dark:text-green-400'
                                        }`}>
                                            <span className="text-[10px] font-bold uppercase">{task.priority === 'High' ? 'Cao' : task.priority === 'Medium' ? 'TB' : 'Thấp'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteTaskId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                        <div className="p-6 text-center">
                            <div className="size-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">delete</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Xóa công việc này?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Hành động này không thể hoàn tác. Dữ liệu công việc sẽ bị mất vĩnh viễn.
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-gray-700">
                            <button 
                                onClick={() => setDeleteTaskId(null)}
                                className="flex-1 py-3.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Hủy
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-gray-700"></div>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;