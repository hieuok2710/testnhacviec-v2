import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Task, Priority, Category, Recurrence } from '../types';

const AddTask = () => {
  const navigate = useNavigate();
  const { addTask, showNotification } = useApp();
  
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'Personal' as Category,
      priority: 'Medium' as Priority,
      recurrence: 'None' as Recurrence,
      date: new Date().toISOString().split('T')[0],
      time: '09:00'
  });

  const handleSubmit = () => {
      if(!formData.title) {
          showNotification('Vui lòng nhập tiêu đề công việc', 'error');
          return;
      }
      
      const newTask: Task = {
          id: Date.now().toString(),
          completed: false,
          ...formData
      };
      
      addTask(newTask);
      showNotification('Đã tạo công việc thành công!', 'success');
      navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-[400px] h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-surface-light dark:bg-surface-dark rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark z-10 sticky top-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Thêm công việc mới</h2>
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tiêu đề</label>
                    <input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-base font-medium" 
                        placeholder="Ví dụ: Hoàn thành báo cáo Q3" type="text"
                    />
                </div>
                
                {/* Category */}
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Danh mục</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            {id: 'Personal', icon: 'person', label: 'Cá nhân'},
                            {id: 'Work', icon: 'work', label: 'Công việc'},
                            {id: 'Health', icon: 'favorite', label: 'Sức khỏe'},
                            {id: 'Family', icon: 'family_restroom', label: 'Gia đình'}
                        ].map(cat => (
                             <label key={cat.id} className="cursor-pointer group">
                                <input 
                                    type="radio" name="category" className="peer sr-only" 
                                    checked={formData.category === cat.id}
                                    onChange={() => setFormData({...formData, category: cat.id as Category})}
                                />
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả chi tiết</label>
                    <textarea 
                         value={formData.description}
                         onChange={e => setFormData({...formData, description: e.target.value})}
                         className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none text-sm leading-relaxed" 
                         placeholder="Thêm ghi chú..." rows={3}>
                    </textarea>
                </div>

                 {/* Priority */}
                 <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mức độ ưu tiên</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            {id: 'Low', label: 'Thấp', color: 'green'},
                            {id: 'Medium', label: 'Trung bình', color: 'yellow'},
                            {id: 'High', label: 'Cao', color: 'red'}
                        ].map(p => (
                             <label key={p.id} className="cursor-pointer">
                                <input type="radio" name="priority" className="peer sr-only" 
                                    checked={formData.priority === p.id}
                                    onChange={() => setFormData({...formData, priority: p.id as Priority})}
                                />
                                <div className={`flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all peer-checked:bg-${p.color}-50 dark:peer-checked:bg-${p.color}-900/20 peer-checked:border-${p.color}-500 peer-checked:text-${p.color}-700 dark:peer-checked:text-${p.color}-400`}>
                                    <div className={`w-2 h-2 rounded-full bg-${p.color}-500 mb-2`}></div>
                                    <span className="text-xs font-semibold">{p.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Recurrence */}
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lặp lại</p>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                        {[
                            {id: 'None', label: 'Không'},
                            {id: 'Daily', label: 'Hàng ngày'},
                            {id: 'Weekly', label: 'Hàng tuần'},
                            {id: 'Monthly', label: 'Hàng tháng'}
                        ].map(r => (
                             <label key={r.id} className="cursor-pointer shrink-0">
                                <input 
                                    type="radio" name="recurrence" className="peer sr-only" 
                                    checked={formData.recurrence === r.id}
                                    onChange={() => setFormData({...formData, recurrence: r.id as Recurrence})}
                                />
                                <div className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary transition-all">
                                    <span className="text-sm font-medium">{r.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Ngày bắt đầu</label>
                        <input 
                            type="date" 
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Giờ</label>
                        <input 
                            type="time" 
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                            className="w-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" 
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark z-10">
                <div className="flex gap-4">
                    <button onClick={() => navigate(-1)} className="flex-1 py-3.5 px-4 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="flex-[2] py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-primary hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tạo công việc
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddTask;