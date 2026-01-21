import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-light dark:bg-background-dark flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[50%] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-purple-400/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 animate-slide-up">
        
        {/* Hero Image / Banner */}
        <div className="w-full max-w-[320px] aspect-square relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-[2.5rem] animate-pulse"></div>
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out border-4 border-white dark:border-surface-dark">
                 <img 
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop"
                    alt="Task Management"
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -right-2 top-8 bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-xl animate-bounce duration-[3000ms] flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                    <span className="material-symbols-outlined text-green-600 text-xl">check</span>
                </div>
                <div className="text-left">
                    <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-600 rounded-full mb-1"></div>
                    <div className="h-1.5 w-8 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
            <div className="absolute -left-4 bottom-12 bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-xl animate-bounce duration-[4000ms] flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                 <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                    <span className="material-symbols-outlined text-blue-600 text-xl">schedule</span>
                </div>
                 <div className="text-left">
                    <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-600 rounded-full mb-1"></div>
                    <div className="h-1.5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
        </div>

        <h1 className="text-[32px] font-extrabold text-text-main dark:text-white mb-4 leading-tight">
          Quản lý công việc <br/>
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Hiệu quả hơn</span>
        </h1>
        
        <p className="text-text-sub dark:text-gray-400 text-base mb-10 max-w-xs mx-auto leading-relaxed">
          Lập kế hoạch, theo dõi tiến độ và hoàn thành mục tiêu của bạn mỗi ngày với <span className="font-bold text-text-main dark:text-white">TaskFlow Pro</span>.
        </p>

        <button 
            onClick={() => navigate('/dashboard')}
            className="w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative">Bắt đầu ngay</span>
            <span className="material-symbols-outlined relative group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Đã có tài khoản?</span>
            <button onClick={() => navigate('/dashboard')} className="text-primary font-bold hover:underline">Đăng nhập</button>
        </div>

      </div>
      
      {/* Footer / Terms */}
      <div className="p-6 text-center z-10">
        <p className="text-[10px] text-gray-400">
            Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-primary">Điều khoản dịch vụ</a> & <a href="#" className="underline hover:text-primary">Chính sách bảo mật</a>.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
