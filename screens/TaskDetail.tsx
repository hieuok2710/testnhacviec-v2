import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Task, Category, Priority, Recurrence } from '../types';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, toggleSubtask, updateTaskProgress, deleteTask, updateTask, showNotification } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Find the original task from global state
  const originalTask = tasks.find(t => t.id === id);

  // Local state for editing fields
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  // Initialize editedTask when originalTask loads
  useEffect(() => {
    if (originalTask) {
        setEditedTask(JSON.parse(JSON.stringify(originalTask)));
    }
  }, [originalTask?.id]); // Only reset if ID changes (navigation), NOT when global state updates to avoid overwriting user typing

  if (!originalTask || !editedTask) return <div className="p-10 text-center">Công việc không tồn tại</div>;

  // Check if there are changes
  const hasChanges = JSON.stringify({
      title: originalTask.title,
      description: originalTask.description,
      date: originalTask.date,
      time: originalTask.time,
      priority: originalTask.priority,
      category: originalTask.category,
      recurrence: originalTask.recurrence,
      attachments: originalTask.attachments
  }) !== JSON.stringify({
      title: editedTask.title,
      description: editedTask.description,
      date: editedTask.date,
      time: editedTask.time,
      priority: editedTask.priority,
      category: editedTask.category,
      recurrence: editedTask.recurrence,
      attachments: editedTask.attachments
  });

  const handleSave = () => {
      if (!editedTask.title.trim()) {
          showNotification('Tiêu đề không được để trống', 'error');
          return;
      }
      updateTask(editedTask);
      showNotification('Đã lưu thay đổi', 'success');
  };

  const confirmDelete = () => {
    deleteTask(originalTask.id);
    showNotification('Đã xóa công việc thành công', 'success');
    setShowDeleteModal(false);
    navigate(-1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      let type: 'image' | 'pdf' | 'doc' = 'doc';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'pdf';

      const newAttachment = {
          type,
          name: file.name,
          url: URL.createObjectURL(file)
      };

      setEditedTask(prev => {
          if (!prev) return null;
          return {
              ...prev,
              attachments: [...(prev.attachments || []), newAttachment]
          };
      });
      
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const recurrenceLabel: Record<string, string> = {
      'None': 'Không lặp lại',
      'Daily': 'Hàng ngày',
      'Weekly': 'Hàng tuần',
      'Monthly': 'Hàng tháng'
  };
  
  const priorityLabel: Record<string, string> = {
      'High': 'Cao',
      'Medium': 'Trung bình',
      'Low': 'Thấp'
  };

  const categoryLabel: Record<string, string> = {
      'Personal': 'Cá nhân',
      'Work': 'Công việc',
      'Health': 'Sức khỏe',
      'Family': 'Gia đình',
      'Education': 'Học tập'
  };

  // Helper to update local state
  const updateField = (field: keyof Task, value: any) => {
      setEditedTask(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col pb-24 relative">
        {/* Nav */}
        <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
            <button onClick={() => navigate(-1)} className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
            </button>
            <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate px-2">
                Chi tiết công việc
            </h2>
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                    <span className="material-symbols-outlined text-2xl">more_horiz</span>
                </button>
            </div>
            
            {/* Menu Dropdown */}
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute top-12 right-0 z-20 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in origin-top-right mr-4 mt-2">
                        <button 
                            onClick={() => {
                                setShowMenu(false);
                                setShowDeleteModal(true);
                            }}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600 dark:text-red-400"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                            <span className="text-sm font-medium">Xóa công việc</span>
                        </button>
                    </div>
                </>
            )}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-4">
             {/* Progress */}
            <div className="py-6 bg-background-light dark:bg-background-dark">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between items-end">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Tiến độ hoàn thành</p>
                        <p className="text-primary text-2xl font-bold leading-none">{originalTask.progress || 0}%</p>
                    </div>
                    {/* Slider */}
                    <div className="relative h-6 group cursor-pointer">
                        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${originalTask.progress || 0}%` }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 size-6 bg-white dark:bg-gray-200 border-4 border-primary rounded-full shadow-md hover:scale-110 transition-transform" style={{ left: `${originalTask.progress || 0}%`, transform: 'translate(-50%, -50%)' }}></div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={originalTask.progress || 0}
                            onChange={(e) => updateTaskProgress(originalTask.id, parseInt(e.target.value))}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Editable Title */}
            <div className="mb-4">
                <input 
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-text-main dark:text-white tracking-tight text-[26px] font-bold leading-tight focus:ring-0 placeholder-gray-400"
                    placeholder="Tiêu đề công việc"
                />
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Date */}
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Ngày & Giờ</label>
                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            value={editedTask.date}
                            onChange={(e) => updateField('date', e.target.value)}
                            className="bg-transparent border-none p-0 text-xs font-semibold text-text-main dark:text-white focus:ring-0 w-full"
                        />
                         <input 
                            type="time" 
                            value={editedTask.time}
                            onChange={(e) => updateField('time', e.target.value)}
                            className="bg-transparent border-none p-0 text-xs font-semibold text-text-main dark:text-white focus:ring-0 w-16"
                        />
                    </div>
                </div>

                {/* Recurrence */}
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1 relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Lặp lại</label>
                    <select 
                        value={editedTask.recurrence || 'None'}
                        onChange={(e) => updateField('recurrence', e.target.value)}
                        className="bg-transparent border-none p-0 text-xs font-semibold text-text-main dark:text-white focus:ring-0 w-full appearance-none relative z-10"
                    >
                        {Object.keys(recurrenceLabel).map(key => (
                            <option key={key} value={key} className="text-black">{recurrenceLabel[key]}</option>
                        ))}
                    </select>
                    <span className="absolute right-3 bottom-3 material-symbols-outlined text-gray-400 text-sm pointer-events-none">unfold_more</span>
                </div>

                {/* Priority */}
                <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1 relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Ưu tiên</label>
                    <div className="flex items-center gap-2">
                         <div className={`size-2 rounded-full ${editedTask.priority === 'High' ? 'bg-red-500' : editedTask.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-500'}`}></div>
                         <select 
                            value={editedTask.priority}
                            onChange={(e) => updateField('priority', e.target.value)}
                            className="bg-transparent border-none p-0 text-xs font-semibold text-text-main dark:text-white focus:ring-0 w-full appearance-none relative z-10"
                        >
                            {Object.keys(priorityLabel).map(key => (
                                <option key={key} value={key} className="text-black">{priorityLabel[key]}</option>
                            ))}
                        </select>
                    </div>
                     <span className="absolute right-3 bottom-3 material-symbols-outlined text-gray-400 text-sm pointer-events-none">unfold_more</span>
                </div>

                 {/* Category */}
                 <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1 relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Danh mục</label>
                     <select 
                        value={editedTask.category}
                        onChange={(e) => updateField('category', e.target.value)}
                        className="bg-transparent border-none p-0 text-xs font-semibold text-text-main dark:text-white focus:ring-0 w-full appearance-none relative z-10"
                    >
                        {Object.keys(categoryLabel).map(key => (
                            <option key={key} value={key} className="text-black">{categoryLabel[key]}</option>
                        ))}
                    </select>
                     <span className="absolute right-3 bottom-3 material-symbols-outlined text-gray-400 text-sm pointer-events-none">unfold_more</span>
                </div>
            </div>

            {/* Editable Description */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-soft mb-4 border border-transparent focus-within:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <h3 className="font-bold text-base text-text-main dark:text-white">Mô tả</h3>
                </div>
                <textarea 
                    value={editedTask.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Thêm mô tả chi tiết cho công việc..."
                    rows={4}
                    className="w-full bg-transparent border-none p-0 text-gray-600 dark:text-gray-300 text-base leading-relaxed focus:ring-0 resize-none"
                />
            </div>

            {/* Checklist (Subtasks - handled by global actions immediately, not part of save) */}
            {originalTask.subtasks && (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-soft mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <h3 className="font-bold text-base text-text-main dark:text-white">Danh sách kiểm tra</h3>
                        </div>
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {originalTask.subtasks.filter(s => s.completed).length}/{originalTask.subtasks.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {originalTask.subtasks.map(st => (
                            <div key={st.id} onClick={() => toggleSubtask(originalTask.id, st.id)} className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer select-none">
                                <span className={`material-symbols-outlined shrink-0 ${st.completed ? 'text-primary filled' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {st.completed ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                <span className={`text-base ${st.completed ? 'text-gray-400 dark:text-gray-500 line-through decoration-gray-400' : 'text-text-main dark:text-white'}`}>
                                    {st.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80 transition-opacity w-full p-2 rounded-lg border border-dashed border-primary/30 justify-center">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Thêm công việc phụ
                    </button>
                </div>
            )}

            {/* Attachments */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-soft mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">attach_file</span>
                        <h3 className="font-bold text-base text-text-main dark:text-white">Tài liệu đính kèm</h3>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Tải lên
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf,.doc,.docx"
                    />
                </div>
                
                {(!editedTask.attachments || editedTask.attachments.length === 0) ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                        <p className="text-sm text-gray-400">Chưa có tài liệu đính kèm</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {editedTask.attachments.map((file, idx) => (
                             <NavLink to={file.type === 'pdf' ? `/document/${idx}` : '#'} key={idx} className={`relative aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border cursor-pointer overflow-hidden
                                ${file.type === 'image' ? '' : file.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'}`}>
                                {file.type === 'image' ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                                ) : (
                                    <>
                                        <span className={`material-symbols-outlined text-3xl ${file.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}`}>
                                            {file.type === 'pdf' ? 'picture_as_pdf' : 'article'}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase truncate w-full text-center px-1 ${file.type === 'pdf' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                                            {file.name}
                                        </span>
                                    </>
                                )}
                             </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Floating Save Button */}
        <div className={`fixed bottom-24 right-4 z-40 transition-all duration-300 transform ${hasChanges ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
             <button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full shadow-lg shadow-primary/40 font-bold flex items-center gap-2 animate-bounce"
            >
                <span className="material-symbols-outlined">save</span>
                Lưu thay đổi
            </button>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-30">
            <div className="max-w-md mx-auto flex gap-3">
                <button 
                    onClick={() => navigate(`/focus/${originalTask.id}`)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-text-main dark:text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    <span className="material-symbols-outlined filled">play_circle</span>
                    Tập trung
                </button>
                <button 
                    onClick={() => {
                        updateTask({ ...originalTask, completed: true });
                        navigate(-1);
                    }}
                    className="flex-[2] bg-primary text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-blue-700 transition-colors"
                >
                    <span className="material-symbols-outlined">check</span>
                    Hoàn thành
                </button>
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
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
                            onClick={() => setShowDeleteModal(false)}
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

export default TaskDetail;