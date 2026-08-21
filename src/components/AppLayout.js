'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { sidebarOpen, loading } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-emerald-50/50 flex flex-col justify-center items-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4fbf7]">
      {/* Part 1: Header cố định ở trên đầu */}
      <Header />

      <div className="flex flex-1">
        {/* Part 2: Thanh Menu bên trái (Sidebar) có thể mở/đóng */}
        <Sidebar />

        {/* Part 3: Nội dung Body bên phải dưới Header, thay đổi tùy danh mục */}
        <main className={`app-main-body flex-1 ${!sidebarOpen ? 'collapsed' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-emerald-800">Đang tải dữ liệu từ SQLite...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
