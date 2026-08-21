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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-200">
            H
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-emerald-950 tracking-tight leading-none">
              STUDENT<span className="text-emerald-600">PROFILE</span>
            </h1>
            <p className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase leading-none mt-0.5">
              Hệ thống cá nhân SQLite
            </p>
          </div>
        </Link>
      </div>

      {/* Right side: User Profile Badge & Logout */}
      {user ? (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.full_name || 'User'}
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div className="text-left pr-1">
              <div className="font-bold text-xs text-slate-800 leading-tight">
                {user.full_name || 'Học viên'}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700">
                {user.email}
              </div>
            </div>
          </div>


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
