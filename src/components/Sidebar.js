'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Sidebar() {
  const { user, sidebarOpen, toggleSidebar, activeCategory, setActiveCategory } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      href: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'change-password',
      label: 'Đổi mật khẩu',
      href: '/change-password',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: 'computers',
      label: 'Quản lý máy tính',
      href: '/computers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={`app-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
      {/* Sidebar Header: "MENU" text on left, Toggle Button on right */}
      <div className="px-3.5 py-3 border-b border-emerald-100/80 flex items-center justify-between min-h-[52px]">
        {sidebarOpen ? (
          <>
            <span className="text font-extrabold uppercase tracking-wider text-emerald-800">
              MENU
            </span>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors focus:outline-none flex items-center justify-center"
              title="Thu gọn menu"
              aria-label="Thu gọn menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors focus:outline-none"
              title="Mở rộng menu"
              aria-label="Mở rộng menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Menu List */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveCategory(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all text-decoration-none ${isActive
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className={`flex items-center justify-center ${isActive ? 'text-white' : 'text-emerald-600'}`}>
                {item.icon}
              </span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer: Role Text Badge at bottom-left of menu (Guaranteed Pastel Fill) */}
      {user && (
        <div className="p-3 border-t border-emerald-100/80">
          {sidebarOpen ? (
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border shadow-xs transition-all"
              style={
                user.role === 'admin'
                  ? { backgroundColor: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }
                  : { backgroundColor: '#d1fae5', borderColor: '#6ee7b7', color: '#065f46' }
              }
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: user.role === 'admin' ? '#f59e0b' : '#10b981' }}
              ></span>
              <span className="whitespace-nowrap">
                Vai trò: <span style={{ color: user.role === 'admin' ? '#78350f' : '#047857' }} className="font-extrabold">
                  {user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Học viên (User)'}
                </span>
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center justify-center p-2 rounded-xl border shadow-xs"
              style={
                user.role === 'admin'
                  ? { backgroundColor: '#fef3c7', borderColor: '#fcd34d' }
                  : { backgroundColor: '#d1fae5', borderColor: '#6ee7b7' }
              }
              title={`Vai trò: ${user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Học viên (User)'}`}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: user.role === 'admin' ? '#f59e0b' : '#10b981' }}
              ></span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
