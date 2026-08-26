'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      {/* Left side: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-200">
            PM
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-emerald-950 tracking-tight leading-none">
              QUẢN LÝ <span className="text-emerald-600">PHÒNG MÁY</span>
            </h1>
            <p className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase leading-none mt-1">
              Hệ thống phòng lab SQLite
            </p>
          </div>
        </Link>
      </div>

      {/* Right side: User Profile Badge & Logout */}
      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.full_name || 'User'}
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 flex-shrink-0"
            />
            <div className="text-left pr-1">
              <div className="font-bold text-xs text-slate-800 leading-tight">
                {user.full_name || 'Học viên'}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 leading-tight mt-0.5">
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200/60"
            title="Đăng xuất"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-green-outline text-xs px-3.5 py-1.5">
            Đăng nhập
          </Link>
          <Link href="/register" className="btn-green-primary text-xs px-3.5 py-1.5">
            Đăng ký
          </Link>
        </div>
      )}
    </header>
  );
}
