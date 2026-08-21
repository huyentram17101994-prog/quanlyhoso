'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, setActiveCategory, logout } = useAuth();

  useEffect(() => {
    setActiveCategory('dashboard');
  }, [setActiveCategory]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-200/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
              ⚡ Hệ Thống Cá Nhân SQLite
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Xin chào, {user ? user.full_name || 'Học viên' : 'Bạn chưa đăng nhập'}! 👋
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl font-medium">
              Chào mừng bạn đến với trang quản lý hồ sơ cá nhân. Giao diện được thiết kế với màu chủ đạo Green & White cùng cấu trúc 3 phần chuẩn hóa.
            </p>
          </div>

          {user && (
            <div className="flex-shrink-0 flex items-center gap-3 bg-white/15 p-3 rounded-2xl backdrop-blur-md border border-white/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.full_name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="text-left pr-2">
                <div className="font-extrabold text-sm text-white">{user.full_name}</div>
                <div className="text-xs text-emerald-200 font-semibold">{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Thông tin cá nhân */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Hồ sơ cá nhân</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Cập nhật avatar, họ tên, MSSV, lớp sinh hoạt, email và số điện thoại liên hệ của bạn.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-4">
            <Link href="/profile" className="btn-green-primary w-full text-xs font-bold py-2.5">
              Đến trang hồ sơ →
            </Link>
          </div>
        </div>

        {/* Card 2: Đổi mật khẩu */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Đổi mật khẩu</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Thay đổi mật khẩu đăng nhập với quy định từ 8 ký tự trở lên để đảm bảo an toàn.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-4">
            <Link href="/change-password" className="btn-green-outline w-full text-xs font-bold py-2.5">
              Thay đổi mật khẩu →
            </Link>
          </div>
        </div>

        {/* Card 3: Đăng xuất */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-slate-900">Đăng xuất tài khoản</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Thoát khỏi phiên làm việc hiện tại và quay trở lại màn hình đăng nhập.
            </p>
          </div>
          <div className="pt-5 border-t border-slate-100 mt-4">
            <button onClick={logout} className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors border border-red-200">
              Đăng xuất ngay
            </button>
          </div>
        </div>
      </div>

      {/* User Information Display Table */}
      {user && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Thông tin chi tiết tài khoản (Lưu trong SQLite)
            </h2>
            <span className="badge-green">Live Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Họ và tên</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.full_name || 'Chưa cập nhật'}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">MSSV</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.mssv || 'Chưa cập nhật'}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Lớp</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.class_name || 'Chưa cập nhật'}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Ngày sinh</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.dob || '17/10/1994'}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Email</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.email}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Số điện thoại</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{user.phone}</div>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Database Path</div>
              <div className="font-extrabold text-xs text-slate-800 mt-0.5 truncate">data/database.db</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
