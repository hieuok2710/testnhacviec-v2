export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Personal' | 'Work' | 'Health' | 'Family' | 'Education';
export type Recurrence = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  recurrence?: Recurrence;
  time: string;
  date: string;
  completed: boolean;
  subtasks?: SubTask[];
  progress?: number; // 0 to 100
  attachments?: { type: 'pdf' | 'doc' | 'image'; name: string; url: string }[];
}

export interface User {
  name: string;
  avatar: string;
  role: string;
  email: string;
  phone: string;
  company: string;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}