import { Task, User } from './types';

export const MOCK_USER: User = {
  name: "Nguyễn Văn A",
  role: "Quản lý Dự án",
  email: "nguyenvana@congty.com",
  phone: "0912 345 678",
  company: "Tech Corp",
  avatar: "https://i.pravatar.cc/300?img=11"
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Chạy bộ buổi sáng',
    category: 'Health',
    priority: 'Low',
    time: '06:00',
    date: '2023-10-24',
    completed: true,
    description: 'Chạy 5km quanh công viên gần nhà để rèn luyện sức khỏe.',
  },
  {
    id: '2',
    title: 'Họp dự án Marketing',
    category: 'Work',
    priority: 'High',
    time: '09:30',
    date: '2023-10-24',
    completed: false,
    description: 'Họp với team marketing về chiến dịch Q4.',
  },
  {
    id: '3',
    title: 'Thiết kế giao diện Mobile App',
    category: 'Work',
    priority: 'High',
    time: '14:00',
    date: '2023-10-24',
    completed: false,
    progress: 65,
    description: 'Thiết kế giao diện người dùng cho ứng dụng quản lý công việc trên nền tảng iOS. Cần tập trung vào trải nghiệm người dùng tối giản và hiệu quả.',
    subtasks: [
      { id: 'st1', title: 'Nghiên cứu user flow và sitemap', completed: true },
      { id: 'st2', title: 'Phác thảo Wireframe', completed: true },
      { id: 'st3', title: 'Thiết kế UI High-fidelity', completed: false },
      { id: 'st4', title: 'Tạo prototype tương tác', completed: false },
    ],
    attachments: [
        { type: 'image', name: 'Wireframe', url: 'https://picsum.photos/200' },
        { type: 'pdf', name: 'Brief.pdf', url: '#' },
        { type: 'doc', name: 'Specs.doc', url: '#' }
    ]
  },
  {
    id: '4',
    title: 'Mua quà sinh nhật Mẹ',
    category: 'Family',
    priority: 'Medium',
    time: '17:00',
    date: '2023-10-24',
    completed: false,
  },
  {
    id: '5',
    title: 'Học 50 từ vựng IELTS',
    category: 'Education',
    priority: 'Low',
    time: '20:00',
    date: '2023-10-24',
    completed: false,
  },
  {
    id: '6',
    title: 'Đồng bộ chiến lược sản phẩm',
    category: 'Work',
    priority: 'Medium',
    time: '10:00',
    date: '2023-10-12',
    completed: false,
    description: 'Xem lại lộ trình Q4 với các trưởng nhóm kỹ thuật.'
  }
];
