import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_WIDTH = 380;
const PAGE_HEIGHT = 380 * 1.414; // Approximate A4 aspect ratio height

interface ScaledPageWrapperProps {
  children?: React.ReactNode;
  pageId: number;
  scale: number;
}

// Helper component to scale content while preserving layout space
const ScaledPageWrapper = ({ children, pageId, scale }: ScaledPageWrapperProps) => (
    <div 
      id={`doc-page-${pageId}`}
      style={{ 
          width: PAGE_WIDTH * scale, 
          height: PAGE_HEIGHT * scale,
          transition: 'width 0.2s, height 0.2s'
      }}
      className="relative shadow-xl rounded-sm transition-all duration-200 ease-out bg-white shrink-0"
    >
        <div 
          style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left',
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
          }}
          className="absolute top-0 left-0 overflow-hidden"
        >
            {children}
        </div>
    </div>
);

const DocumentViewer = () => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1.0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // Mock total pages

  // Handler for Zoom
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0)); // Max 2x
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5)); // Min 0.5x
  const handleResetZoom = () => setScale(1.0);

  // Handler for Navigation
  const scrollToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const element = document.getElementById(`doc-page-${page}`);
    if (element && scrollContainerRef.current) {
       // Simple scrollIntoView or manual calculation
       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#f0f2f5] dark:bg-[#0e151b] overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center bg-white dark:bg-[#1a1d23] px-4 py-3 justify-between border-b border-gray-200 dark:border-gray-800 z-20 shadow-sm shrink-0 h-16">
            <button onClick={() => navigate(-1)} className="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            <div className="flex flex-col items-center flex-1 px-4 overflow-hidden">
                <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight text-center truncate w-full">Brief.pdf</h2>
                <span className="text-xs text-gray-500 font-medium">Trang {currentPage} / {totalPages} • {Math.round(scale * 100)}%</span>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-2xl">info</span>
            </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 w-full overflow-hidden bg-[#e6e9ef] dark:bg-black flex flex-col">
            <div 
                ref={scrollContainerRef}
                className="w-full h-full overflow-auto no-scrollbar py-8 px-4 pb-40 flex flex-col items-center gap-8"
            >
                 {/* Simulated Page 1 */}
                 <ScaledPageWrapper pageId={1} scale={scale}>
                     <div className="w-full h-full p-8 text-[10px] leading-relaxed text-gray-800 flex flex-col bg-white">
                        <div className="flex justify-center mb-6">
                            <div className="text-center font-bold uppercase text-xs border-b border-gray-300 pb-2 mb-2 w-full">
                                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>
                                <span className="font-normal normal-case">Độc lập - Tự do - Hạnh phúc</span>
                            </div>
                        </div>
                        <h1 className="text-center font-bold text-sm mb-4 text-[#16649c] uppercase">Dự án Mobile App Q4</h1>
                        <div className="space-y-3 text-justify opacity-80 text-xs">
                            <p><strong>Ngày lập:</strong> 20 tháng 10 năm 2023</p>
                            <div className="h-px w-full bg-gray-200 my-2"></div>
                            <p className="font-bold">I. Mục tiêu:</p>
                            <p>Xây dựng ứng dụng quản lý công việc tối giản, tập trung vào trải nghiệm người dùng cá nhân.</p>
                            <p className="font-bold">II. Yêu cầu chính:</p>
                            <ul className="list-disc pl-4">
                                <li>Giao diện Dark Mode/Light Mode</li>
                                <li>Đồng bộ Google Calendar</li>
                                <li>Hệ thống thông báo đẩy</li>
                                <li>Tích hợp xem tài liệu PDF/Image</li>
                            </ul>
                             <div className="w-full h-32 bg-gradient-to-b from-gray-50 to-transparent mt-8 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                <span className="italic text-[9px]">[Sơ đồ Site Map]</span>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <div className="text-center">
                                    <p className="font-bold">Người lập</p>
                                    <p className="italic text-[9px] text-gray-400 mt-4">(Ký tên)</p>
                                    <p className="font-bold mt-1">Nguyễn Văn A</p>
                                </div>
                            </div>
                        </div>
                     </div>
                 </ScaledPageWrapper>

                  {/* Page 2 Peek */}
                 <ScaledPageWrapper pageId={2} scale={scale}>
                    <div className="w-full h-full p-8 bg-white flex flex-col items-center justify-center">
                         <div className="w-48 h-48 border-4 border-dashed border-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-gray-200 text-6xl">image</span>
                         </div>
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Phụ lục hình ảnh</span>
                    </div>
                </ScaledPageWrapper>
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-max max-w-[90%]">
                <div className="flex items-center bg-[#1a1d23]/80 backdrop-blur-xl rounded-2xl shadow-2xl px-3 py-2 gap-2 border border-white/10 ring-1 ring-black/20">
                    <div className="flex items-center gap-1">
                        <button onClick={handleZoomOut} className="size-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95" title="Thu nhỏ">
                            <span className="material-symbols-outlined text-[20px]">remove</span>
                        </button>
                         <span className="text-[10px] font-bold text-white/50 w-8 text-center hidden sm:block">{Math.round(scale * 100)}%</span>
                        <button onClick={handleZoomIn} className="size-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95" title="Phóng to">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                         <button onClick={handleResetZoom} className="size-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95" title="Mặc định">
                            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                        </button>
                    </div>

                    <div className="w-px h-5 bg-white/10 mx-1"></div>

                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => scrollToPage(currentPage - 1)} 
                            disabled={currentPage <= 1}
                            className={`size-9 flex items-center justify-center rounded-xl transition-all active:scale-95 ${currentPage <= 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                            title="Trang trước"
                        >
                            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
                        </button>
                        <button 
                             onClick={() => scrollToPage(currentPage + 1)} 
                             disabled={currentPage >= totalPages}
                             className={`size-9 flex items-center justify-center rounded-xl transition-all active:scale-95 ${currentPage >= totalPages ? 'text-white/20 cursor-not-allowed' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                             title="Trang sau"
                        >
                            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                        </button>
                    </div>

                    <div className="w-px h-5 bg-white/10 mx-1"></div>

                     <button className="size-9 flex items-center justify-center text-primary hover:text-blue-300 hover:bg-primary/20 rounded-xl transition-all active:scale-95" title="Tải xuống">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DocumentViewer;