import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// --- CẤU HÌNH API GOOGLE ---
// Để tính năng này hoạt động, bạn cần tạo project trên Google Cloud Console (https://console.cloud.google.com/)
// và điền Client ID và API Key vào bên dưới.
// Bạn cũng cần thêm "http://localhost:..." hoặc domain của bạn vào "Authorized JavaScript origins".
const CLIENT_ID = ''; // <--- ĐIỀN CLIENT ID CỦA BẠN VÀO ĐÂY
const API_KEY = '';   // <--- ĐIỀN API KEY CỦA BẠN VÀO ĐÂY

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email';

// Interface cho Google API Types
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface CalendarItem {
    id: string;
    summary: string;
    description?: string;
    backgroundColor?: string;
    primary?: boolean;
}

const Sync = () => {
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [userEmail, setUserEmail] = useState<string>('');
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load Google Scripts Logic
  useEffect(() => {
    const initializeGapiClient = async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        setGapiInited(true);
      } catch (err: any) {
        console.error("Lỗi khởi tạo GAPI:", err);
        setError("Không thể khởi tạo Google API. Vui lòng kiểm tra API Key.");
      }
    };

    const gapiLoaded = () => {
      window.gapi.load('client', initializeGapiClient);
    };

    const gisLoaded = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp: any) => {
          if (resp.error) {
            console.error(resp);
            setError("Lỗi xác thực.");
            setIsLoading(false);
            return;
          }
          setIsConnected(true);
          await fetchCalendars();
          setIsLoading(false);
        },
      });
      setTokenClient(client);
      setGisInited(true);
    };

    // Kiểm tra và load script nếu chưa có
    const checkGoogleScripts = () => {
        if (window.gapi) gapiLoaded();
        else {
             const script = document.createElement('script');
             script.src = "https://apis.google.com/js/api.js";
             script.onload = () => { if(window.gapi) gapiLoaded(); };
             document.body.appendChild(script);
        }

        if (window.google) gisLoaded();
        else {
             const script = document.createElement('script');
             script.src = "https://accounts.google.com/gsi/client";
             script.onload = () => { if(window.google) gisLoaded(); };
             document.body.appendChild(script);
        }
    };

    if (CLIENT_ID && API_KEY) {
        checkGoogleScripts();
    }
  }, []);

  const handleAuthClick = () => {
    setError(null);
    if (!tokenClient) return;
    setIsLoading(true);
    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      tokenClient.requestAccessToken({prompt: ''});
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setIsConnected(false);
      setCalendars([]);
      setUserEmail('');
    }
  };

  const fetchCalendars = async () => {
    try {
        // Lấy thông tin user (dùng Calendar list primary làm đại diện)
        const calendarListRequest = await window.gapi.client.calendar.calendarList.list();
        const items = calendarListRequest.result.items;
        
        // Tìm lịch chính để lấy email
        const primaryCal = items.find((c: any) => c.primary);
        if (primaryCal) {
            setUserEmail(primaryCal.id);
        } else {
            setUserEmail('Người dùng Google');
        }

        setCalendars(items);
    } catch (err: any) {
        console.error("Lỗi tải lịch:", err);
        setError("Không thể tải danh sách lịch.");
    }
  };

  const isConfigMissing = !CLIENT_ID || !API_KEY;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-text-main dark:text-white min-h-screen flex flex-col pb-24">
        <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50">
            <NavLink to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </NavLink>
            <h1 className="text-lg font-bold flex-1 text-center pr-8">Đồng bộ Google Calendar</h1>
        </nav>

        <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-6">
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined filled">error</span>
                    {error}
                </div>
            )}

            {/* Config Missing Warning */}
            {isConfigMissing && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl">
                    <h3 className="text-yellow-800 dark:text-yellow-400 font-bold flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined filled">warning</span>
                        Chưa cấu hình API
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-500 text-sm mb-3">
                        Để sử dụng tính năng đồng bộ, bạn cần điền <strong>CLIENT_ID</strong> và <strong>API_KEY</strong> vào file <code>screens/Sync.tsx</code>.
                    </p>
                    <div className="text-xs text-yellow-600 dark:text-yellow-500/80 bg-white/50 dark:bg-black/20 p-2 rounded">
                        const CLIENT_ID = '...';<br/>
                        const API_KEY = '...';
                    </div>
                </div>
            )}

            {!isConnected ? (
                // --- TRẠNG THÁI CHƯA KẾT NỐI ---
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-white dark:bg-surface-dark rounded-[2rem] shadow-glow flex items-center justify-center mb-6 relative group">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
                        <span className="material-symbols-outlined text-primary text-[48px] relative z-10 filled">calendar_add_on</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 text-text-main dark:text-white">Kết nối Lịch của bạn</h2>
                    <p className="text-text-sub dark:text-gray-400 max-w-xs mb-8">
                        Đồng bộ hóa các sự kiện từ Google Calendar để quản lý mọi thứ ở một nơi duy nhất.
                    </p>

                    <button 
                        onClick={handleAuthClick}
                        disabled={isLoading || isConfigMissing || !gapiInited || !gisInited}
                        className={`w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-text-main dark:text-white font-bold py-3.5 rounded-xl shadow-soft transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="size-5 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
                                <span>Đăng nhập bằng Google</span>
                            </>
                        )}
                    </button>
                    
                    {(!gapiInited || !gisInited) && !isConfigMissing && (
                        <p className="text-xs text-gray-400 mt-4">Đang tải thư viện Google...</p>
                    )}
                </div>
            ) : (
                // --- TRẠNG THÁI ĐÃ KẾT NỐI ---
                <div className="space-y-6 animate-slide-up">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-soft flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500"></div>
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <span className="material-symbols-outlined text-[#1A73E8] dark:text-[#8AB4F8] text-[40px] filled">calendar_month</span>
                        </div>
                        <h2 className="text-xl font-bold mb-1">Đã kết nối</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            Tài khoản: <span className="font-semibold text-text-main dark:text-white">{userEmail}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Sẵn sàng đồng bộ
                        </div>
                        <button 
                            onClick={handleSignoutClick}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                            title="Ngắt kết nối"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </div>

                    <div className="animate-fade-in delay-100">
                        <div className="flex items-center justify-between px-2 mb-3">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chọn lịch đồng bộ</h3>
                            <span className="text-xs text-primary dark:text-blue-400 font-medium cursor-pointer hover:underline">Chọn tất cả</span>
                        </div>
                        
                        {isLoading && calendars.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <div className="size-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                                {calendars.length > 0 ? calendars.map((cal) => (
                                    <label key={cal.id} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <input type="checkbox" defaultChecked={cal.primary} className="rounded border-gray-400 text-primary focus:ring-primary size-5" />
                                        <div className="flex-1 flex flex-col overflow-hidden">
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    className="w-3 h-3 rounded-full shadow-sm shrink-0" 
                                                    style={{backgroundColor: cal.backgroundColor || '#4285F4'}}
                                                ></span>
                                                <span className="font-semibold text-base truncate">{cal.summary}</span>
                                            </div>
                                            {cal.primary && <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Lịch chính</span>}
                                        </div>
                                    </label>
                                )) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">Không tìm thấy lịch nào.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default Sync;