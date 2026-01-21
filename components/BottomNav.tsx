import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  
  // Hide bottom nav on specific full-screen pages like Add Task, Document view, Welcome screen, and Focus Mode
  if (['/add', '/document', '/sync', '/focus'].some(path => location.pathname.startsWith(path)) || location.pathname === '/') {
      return null;
  }

  const navItems = [
    { path: '/dashboard', icon: 'grid_view', label: 'Tổng quan' },
    { path: '/calendar', icon: 'calendar_month', label: 'Lịch' },
    { path: '/tasks', icon: 'check_circle', label: 'Công việc' }, // Renamed path for clarity
    { path: '/profile', icon: 'person', label: 'Hồ sơ' }, // Using person icon for profile
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-6 pt-2 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 dark:bg-[#1f2325]/90 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-soft rounded-2xl flex justify-between items-center px-2 py-3 mx-auto max-w-md">
        {navItems.map((item, index) => {
            // Insert the Add button in the middle
            if (index === 2) {
                return (
                    <React.Fragment key="add-btn">
                         <div className="flex flex-1 flex-col items-center justify-end -mt-8">
                            <NavLink to="/add" className="bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg shadow-primary/30 transform transition-transform active:scale-95 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[28px]">add</span>
                            </NavLink>
                        </div>
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 group transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-gray-50 dark:group-hover:bg-white/5'}`}>
                                <span className={`material-symbols-outlined text-[24px] ${location.pathname === item.path ? 'filled' : ''}`}>{item.icon}</span>
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    </React.Fragment>
                )
            }
            return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 group transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                >
                    <div className={`p-2 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-gray-50 dark:group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined text-[24px] ${location.pathname === item.path ? 'filled' : ''}`}>{item.icon}</span>
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                </NavLink>
            );
        })}
      </div>
    </div>
  );
};

export default BottomNav;