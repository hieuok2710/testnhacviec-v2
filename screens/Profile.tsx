import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { user, updateUser, resetData, showNotification } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  // State quản lý email và kiểm tra hợp lệ
  const [isEmailValid, setIsEmailValid] = useState(true);

  // Hàm kiểm tra định dạng email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = e.target.value;
    
    if (field === 'email') {
        const isValid = validateEmail(val);
        setIsEmailValid(isValid);
        updateUser({ email: val });
    } else {
        updateUser({ [field]: val });
    }
  };

  const handleSyncClick = () => {
      if (isEmailValid && user.email) {
          navigate('/sync');
      } else {
          showNotification('Vui lòng nhập email hợp lệ', 'error');
      }
  };

  // Helper component cho Toggle Switch
  const ToggleRow = ({ label, description, defaultChecked = false }: { label: string, description?: string, defaultChecked?: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
        </div>
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 flex flex-col">
       <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 border-b border-transparent dark:border-gray-800 transition-all">
            <NavLink to="/dashboard" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </NavLink>
            <h1 className="text-lg font-bold tracking-tight">Cài đặt & Hồ sơ</h1>
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </header>

        <main className="flex-1 overflow-y-auto">
            {/* Header Info - Always Visible */}
            <div className="relative flex flex-col items-center pt-6 pb-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="relative group cursor-pointer">
                    <div className="relative size-28 rounded-full border-4 border-white dark:border-background-dark shadow-soft overflow-hidden">
                        <img alt="User" className="h-full w-full object-cover" src={user.avatar} />
                    </div>
                    <div className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white dark:ring-background-dark shadow-md">
                        <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-text-main dark:text-white">{user.name}</h2>
                    <p className="text-sm font-medium text-primary mt-1">{user.role}</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 py-4 sticky top-[60px] z-40 bg-background-light dark:bg-background-dark">
                <div className="flex h-11 w-full items-center rounded-xl bg-gray-100 dark:bg-gray-800/50 p-1 ring-1 ring-gray-200 dark:ring-gray-700">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200 ${activeTab === 'profile' ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Hồ sơ
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200 ${activeTab === 'notifications' ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Thông báo
                    </button>
                    <button 
                         onClick={() => setActiveTab('security')}
                        className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200 ${activeTab === 'security' ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        Bảo mật
                    </button>
                </div>
            </div>

            {/* --- TAB CONTENT: PROFILE --- */}
            {activeTab === 'profile' && (
                <div className="flex flex-col gap-5 px-4 mt-2 animate-fade-in">
                    {[
                        { key: 'name', label: 'Họ và tên', icon: 'person', type: 'text' },
                        { key: 'email', label: 'Email công việc', icon: 'mail', type: 'email' },
                        { key: 'phone', label: 'Số điện thoại', icon: 'call', type: 'tel' }
                    ].map((field, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{field.label}</label>
                                {field.key === 'email' && !isEmailValid && (
                                    <span className="text-xs text-red-500 font-medium animate-pulse">Email không hợp lệ</span>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <span className={`absolute left-4 ${field.key === 'email' && !isEmailValid ? 'text-red-400' : 'text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-[20px]">{field.icon}</span>
                                </span>
                                <input 
                                    className={`w-full rounded-xl border bg-gray-50 dark:bg-gray-800/50 py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm
                                        ${field.key === 'email' && !isEmailValid 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200 dark:border-red-900' 
                                            : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-primary'
                                        }`} 
                                    type={field.type} 
                                    // @ts-ignore
                                    value={user[field.key] || ''}
                                    onChange={(e) => handleInputChange(e, field.key)}
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="flex gap-4">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Công ty</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">business</span>
                                </span>
                                <input 
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                                    type="text" 
                                    value={user.company}
                                    onChange={(e) => handleInputChange(e, 'company')}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Chức vụ</label>
                            <input 
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-3.5 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                                type="text" 
                                value={user.role}
                                onChange={(e) => handleInputChange(e, 'role')}
                            />
                        </div>
                    </div>

                    {/* Google Calendar Sync Button */}
                    <div className="mt-2">
                        <button 
                            onClick={handleSyncClick}
                            disabled={!isEmailValid || !user.email}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group relative overflow-hidden
                                ${isEmailValid && user.email 
                                    ? 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md cursor-pointer' 
                                    : 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-60 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center gap-4 z-10">
                                <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${isEmailValid && user.email ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <span className={`material-symbols-outlined text-[22px] ${isEmailValid && user.email ? 'text-primary' : 'text-gray-400'}`}>sync</span>
                                </div>
                                <div className="text-left">
                                    <h3 className={`font-bold text-sm ${isEmailValid && user.email ? 'text-text-main dark:text-white' : 'text-gray-500'}`}>Đồng bộ Google Calendar</h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {isEmailValid && user.email 
                                            ? 'Kết nối để cập nhật lịch trình' 
                                            : 'Vui lòng nhập đúng Email công việc'}
                                    </p>
                                </div>
                            </div>
                            {isEmailValid && user.email && (
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors z-10">chevron_right</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* --- TAB CONTENT: NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
                <div className="px-4 mt-4 animate-fade-in space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide opacity-70">Tổng quan</h3>
                        <ToggleRow label="Cho phép thông báo" description="Bật tất cả thông báo từ ứng dụng" defaultChecked={true} />
                        <ToggleRow label="Âm thanh" defaultChecked={true} />
                        <ToggleRow label="Rung" defaultChecked={false} />
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide opacity-70">Sự kiện & Công việc</h3>
                        <ToggleRow label="Nhắc nhở công việc" description="Thông báo khi đến hạn công việc" defaultChecked={true} />
                        <ToggleRow label="Cập nhật lịch trình" description="Khi có thay đổi từ Google Calendar" defaultChecked={true} />
                        <ToggleRow label="Tổng kết hàng ngày" description="Gửi báo cáo vào 8:00 sáng" defaultChecked={true} />
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide opacity-70">Khác</h3>
                        <ToggleRow label="Email Newsletter" description="Nhận tin tức cập nhật sản phẩm" defaultChecked={false} />
                        <ToggleRow label="Ưu đãi & Khuyến mãi" defaultChecked={false} />
                    </div>
                </div>
            )}

            {/* --- TAB CONTENT: SECURITY --- */}
            {activeTab === 'security' && (
                <div className="px-4 mt-4 animate-fade-in space-y-6">
                     <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">lock</span>
                            Đổi mật khẩu
                        </h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Mật khẩu hiện tại</label>
                                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Mật khẩu mới</label>
                                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                            </div>
                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500">Xác nhận mật khẩu mới</label>
                                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-sm dark:text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                            </div>
                        </div>
                        <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 rounded-lg text-sm transition-colors">
                            Cập nhật mật khẩu
                        </button>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide opacity-70">Đăng nhập & Xác thực</h3>
                        <ToggleRow label="FaceID / TouchID" description="Đăng nhập nhanh bằng sinh trắc học" defaultChecked={true} />
                        <ToggleRow label="Xác thực 2 lớp (2FA)" description="Tăng cường bảo mật qua SMS/Email" defaultChecked={false} />
                        <ToggleRow label="Ghi nhớ thiết bị" defaultChecked={true} />
                    </div>

                     <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                         <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                             <div>
                                 <p className="font-bold text-sm">Thiết bị đang đăng nhập</p>
                                 <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                     <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                     iPhone 14 Pro - TP.HCM
                                 </p>
                             </div>
                             <button className="text-xs font-bold border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                 Chi tiết
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {/* --- FOOTER ACTIONS (Visible on Profile & Security, or Always) --- */}
            {/* Keeping it simple: Always visible at bottom of content to allow logout easily */}
            <div className="px-4 mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 mb-8 space-y-3">
                <button 
                    onClick={resetData}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                    <span className="font-semibold text-sm">Khôi phục dữ liệu gốc</span>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">restore</span>
                </button>

                <button className="flex w-full items-center justify-between rounded-xl p-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
                    <span className="font-semibold text-sm">Đăng xuất khỏi tài khoản</span>
                    <span className="material-symbols-outlined text-red-400 group-hover:translate-x-1 transition-transform">logout</span>
                </button>
            </div>
        </main>
    </div>
  );
};

export default Profile;