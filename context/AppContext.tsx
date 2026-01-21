import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, User, Notification, NotificationType } from '../types';
import { INITIAL_TASKS, MOCK_USER } from '../constants';

// Keys for LocalStorage
const STORAGE_KEYS = {
  TASKS: 'TASKFLOW_TASKS_V1',
  USER: 'TASKFLOW_USER_V1',
  NOTIFIED_IDS: 'TASKFLOW_NOTIFIED_IDS_V1'
};

interface AppContextType {
  tasks: Task[];
  user: User;
  activeAlarmTask: Task | null;
  notification: Notification | null;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;
  updateUser: (updates: Partial<User>) => void; // Added updateUser
  resetData: () => void; // Added resetData
  dismissAlarm: () => void;
  showNotification: (message: string, type?: NotificationType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize State from LocalStorage or fall back to constants
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch (e) {
      console.error("Failed to load tasks from storage", e);
      return INITIAL_TASKS;
    }
  });

  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : MOCK_USER;
    } catch (e) {
      console.error("Failed to load user from storage", e);
      return MOCK_USER;
    }
  });

  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFIED_IDS);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  const [activeAlarmTask, setActiveAlarmTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Persistence Effects: Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFIED_IDS, JSON.stringify(Array.from(notifiedTaskIds)));
  }, [notifiedTaskIds]);

  // Alarm Check Loop
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      // Format current time as HH:MM
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const today = now.toISOString().split('T')[0];

      // Find a task that matches: date is today, time is now, not completed, not already notified
      const triggerTask = tasks.find(t => 
        !t.completed && 
        t.date === today && 
        t.time === currentTime && 
        !notifiedTaskIds.has(t.id)
      );

      if (triggerTask) {
        setActiveAlarmTask(triggerTask);
        setNotifiedTaskIds(prev => {
          const newSet = new Set(prev);
          newSet.add(triggerTask.id);
          return newSet;
        });
        // In a real app, we would trigger browser Audio() here
      }
    };

    // Check every 10 seconds to catch the minute change
    const intervalId = setInterval(checkAlarms, 10000);
    
    // Also run immediately on mount
    checkAlarms();

    return () => clearInterval(intervalId);
  }, [tasks, notifiedTaskIds]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  // Function to update full task details (Title, Desc, Priority, etc.)
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục dữ liệu gốc? Mọi thay đổi sẽ bị mất.")) {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.NOTIFIED_IDS);
      setTasks(INITIAL_TASKS);
      setUser(MOCK_USER);
      setNotifiedTaskIds(new Set());
      window.location.reload();
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    // If we complete a task via alarm, dismiss the alarm
    if (activeAlarmTask && activeAlarmTask.id === id) {
        setActiveAlarmTask(null);
    }
  };

  const updateTaskProgress = (id: string, progress: number) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
      setTasks(prev => prev.map(t => {
          if (t.id !== taskId || !t.subtasks) return t;
          const newSubtasks = t.subtasks.map(st => st.id === subtaskId ? {...st, completed: !st.completed} : st);
          
          // Auto calculate progress
          const completedCount = newSubtasks.filter(st => st.completed).length;
          const newProgress = Math.round((completedCount / newSubtasks.length) * 100);

          return { ...t, subtasks: newSubtasks, progress: newProgress };
      }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const dismissAlarm = () => {
    setActiveAlarmTask(null);
  };

  const showNotification = (message: string, type: NotificationType = 'success') => {
    const id = Date.now();
    setNotification({ id, message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => prev && prev.id === id ? null : prev);
    }, 3000);
  };

  return (
    <AppContext.Provider value={{ 
        tasks, 
        user, 
        activeAlarmTask,
        notification,
        addTask,
        updateTask,
        toggleTask, 
        updateTaskProgress, 
        toggleSubtask, 
        deleteTask,
        updateUser,
        resetData,
        dismissAlarm,
        showNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};